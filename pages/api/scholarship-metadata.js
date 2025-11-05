import { JSDOM } from 'jsdom';
import { Readability } from '@mozilla/readability';

function resolveUrl(base, candidate) {
  if (!candidate) return null;
  try {
    const resolved = new URL(candidate, base);
    return resolved.toString();
  } catch (error) {
    return null;
  }
}

function stripTags(value) {
  if (!value) return '';
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function clipText(value, length) {
  if (!value) return '';
  const clean = value.replace(/\s+/g, ' ').trim();
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).replace(/[\s,.;:-]+$/g, '')}…`;
}

function decodeEntities(value) {
  if (!value) return '';
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function extractSrcset(value) {
  if (!value) return [];
  return value
    .split(',')
    .map((entry) => entry.trim().split(' ')[0])
    .filter(Boolean);
}

function fallbackScreenshot(url) {
  try {
    const parsed = new URL(url);
    if (!['http:', 'https:'].includes(parsed.protocol)) return null;
    return `https://image.thum.io/get/width/1200/crop/800/${encodeURIComponent(parsed.toString())}`;
  } catch (error) {
    return null;
  }
}

async function fetchHtmlWithFallback(targetUrl) {
  const attempts = [
    targetUrl,
    `https://r.jina.ai/${targetUrl}`,
  ];

  let lastError = null;
  for (const attempt of attempts) {
    try {
      const response = await fetch(attempt, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; MenelekScholarshipsBot/1.0)',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      });
      if (!response.ok) {
        lastError = new Error(`Unable to load ${attempt} (${response.status})`);
        continue;
      }
      const html = await response.text();
      if (html && html.trim()) {
        return html;
      }
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError || new Error('Unable to fetch remote content');
}

function collectImages(document, baseUrl) {
  const sources = new Set();
  const add = (src) => {
    const resolved = resolveUrl(baseUrl, decodeEntities(src));
    if (!resolved) return;
    if (/^data:/i.test(resolved)) return;
    sources.add(resolved);
  };

  const metaSelectors = [
    'meta[property="og:image"]',
    'meta[property="og:image:secure_url"]',
    'meta[name="twitter:image"]',
    'meta[name="twitter:image:src"]',
    'meta[name="image"]',
  ];

  metaSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((node) => {
      const content = node.getAttribute('content');
      if (content) add(content);
    });
  });

  document.querySelectorAll('link[rel*="image"]').forEach((node) => {
    const href = node.getAttribute('href');
    if (href) add(href);
  });

  document.querySelectorAll('img').forEach((img) => {
    if (sources.size >= 16) return;
    const src = img.getAttribute('data-src') || img.getAttribute('src');
    if (src) add(src);
    const srcset = img.getAttribute('srcset');
    extractSrcset(srcset).forEach(add);
  });

  return Array.from(sources);
}

function extractTextualSummary(html, baseUrl) {
  const dom = new JSDOM(html, { url: baseUrl });
  const { document } = dom.window;

  try {
    const reader = new Readability(document);
    const article = reader.parse();
    if (article?.textContent) {
      const longDescription = clipText(article.textContent, 1400);
      const shortDescription = clipText(article.excerpt || article.textContent, 320);
      return { shortDescription, longDescription };
    }
  } catch (error) {
    // fall back to manual extraction below
  }

  const paragraphs = Array.from(document.querySelectorAll('main p, article p, .content p, .entry-content p, body p'))
    .map((p) => stripTags(p.textContent || ''))
    .map((text) => clipText(text, 400))
    .filter((text) => text.length > 40);

  const combined = clipText(paragraphs.join(' '), 1400);
  const shortDescription = clipText(paragraphs[0] || combined, 320);
  return { shortDescription, longDescription: combined };
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  let validatedUrl;
  try {
    validatedUrl = new URL(url);
  } catch (error) {
    res.status(400).json({ error: 'Invalid URL' });
    return;
  }

  try {
    const target = validatedUrl.toString();
    const html = await fetchHtmlWithFallback(target);

    const dom = new JSDOM(html, { url: target });
    const document = dom.window.document;

    const gallery = collectImages(document, target).slice(0, 16);
    const screenshot = fallbackScreenshot(target);

    if (!gallery.length && screenshot) {
      gallery.push(screenshot);
    }

    const coverImage = gallery[0] || screenshot || null;

    const { shortDescription, longDescription } = extractTextualSummary(html, target);

    res.status(200).json({
      coverImage,
      gallery,
      shortDescription,
      longDescription,
    });
  } catch (error) {
    console.error('Metadata API error', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metadata' });
  }
}
