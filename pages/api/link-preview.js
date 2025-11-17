import { parseMediaLink } from '@/lib/mediaLinks';

function extractMeta(content, property) {
  const propertyRegex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const nameRegex = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const propertyMatch = propertyRegex.exec(content);
  if (propertyMatch) return propertyMatch[1];
  const nameMatch = nameRegex.exec(content);
  if (nameMatch) return nameMatch[1];
  return null;
}

function extractTitleTag(content) {
  const titleMatch = content.match(/<title>([^<]*)<\/title>/i);
  if (titleMatch) {
    return titleMatch[1].trim();
  }
  return null;
}

function buildFallbackPreview(url) {
  const media = parseMediaLink(url);
  if (!media) {
    return {};
  }

  const fallback = {};
  if (media.thumbnailUrl) {
    fallback.image = media.thumbnailUrl;
  }

  if (media.provider === 'youtube') {
    fallback.description = 'YouTube video preview';
  } else if (media.provider === 'instagram') {
    fallback.description = 'Instagram clip preview';
  }

  return fallback;
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || Array.isArray(url)) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

  const fallback = buildFallbackPreview(url);
  const preview = {
    url,
    title: null,
    description: fallback.description || null,
    image: fallback.image || null,
  };

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      throw new Error(`Remote request failed with status ${response.status}`);
    }

    const html = await response.text();
    preview.image =
      extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image') || extractMeta(html, 'og:image:secure_url') || preview.image;
    preview.title =
      extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || extractMeta(html, 'title') || extractTitleTag(html);
    preview.description =
      extractMeta(html, 'og:description') ||
      extractMeta(html, 'twitter:description') ||
      extractMeta(html, 'description') ||
      preview.description;

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json(preview);
  } catch (error) {
    console.error('Failed to fetch preview for', url, error);
    res.status(200).json(preview);
  }
}
