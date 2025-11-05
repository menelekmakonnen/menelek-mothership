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

function decodeEntities(value) {
  if (!value) return '';
  return value
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function collectMatches(html, regex, handler) {
  let match = regex.exec(html);
  while (match) {
    handler(match);
    match = regex.exec(html);
  }
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

  const proxied = `https://r.jina.ai/${validatedUrl.toString()}`;

  try {
    const response = await fetch(proxied, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; MenelekScholarshipsBot/1.0)',
      },
    });

    if (!response.ok) {
      throw new Error(`Unable to load ${validatedUrl.toString()}`);
    }

    const html = await response.text();

    const images = new Set();
    const addImage = (src) => {
      const resolved = resolveUrl(validatedUrl, src);
      if (resolved) images.add(resolved);
    };

    let description = '';
    let title = '';

    collectMatches(
      html,
      /<meta[^>]+(?:property|name)=["']([^"']+)["'][^>]*content=["']([^"']+)["'][^>]*>/gi,
      ([, name, content]) => {
        const lower = name.toLowerCase();
        const decoded = decodeEntities(content);
        if (['og:image', 'og:image:secure_url', 'twitter:image', 'twitter:image:src'].includes(lower)) {
          addImage(decoded);
        }
        if (lower === 'og:description' || lower === 'description' || lower === 'twitter:description') {
          if (!description) description = decoded;
        }
        if (lower === 'og:title' || lower === 'twitter:title') {
          if (!title) title = decoded;
        }
      },
    );

    collectMatches(
      html,
      /<link[^>]+rel=["'][^"']*(?:image_src|apple-touch-icon(?:-precomposed)?)["'][^>]*href=["']([^"']+)["'][^>]*>/gi,
      ([, href]) => addImage(decodeEntities(href)),
    );

    collectMatches(
      html,
      /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      ([, src]) => {
        if (images.size < 12) {
          addImage(decodeEntities(src));
        }
      },
    );

    const gallery = Array.from(images).slice(0, 12);

    if (!description) {
      const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        description = stripTags(bodyMatch[1]).slice(0, 600);
      }
    }

    if (!description) {
      description = title;
    }

    const coverImage = gallery[0] || null;

    res.status(200).json({
      coverImage,
      gallery,
      description: stripTags(description).slice(0, 800),
    });
  } catch (error) {
    console.error('Metadata API error', error);
    res.status(500).json({ error: error.message || 'Failed to fetch metadata' });
  }
}
