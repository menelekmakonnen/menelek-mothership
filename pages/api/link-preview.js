function extractMeta(content, property) {
  const propertyRegex = new RegExp(`<meta[^>]+property=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const nameRegex = new RegExp(`<meta[^>]+name=["']${property}["'][^>]+content=["']([^"']+)["']`, 'i');
  const propertyMatch = propertyRegex.exec(content);
  if (propertyMatch) return propertyMatch[1];
  const nameMatch = nameRegex.exec(content);
  if (nameMatch) return nameMatch[1];
  return null;
}

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url || Array.isArray(url)) {
    res.status(400).json({ error: 'Missing url parameter' });
    return;
  }

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
    const image =
      extractMeta(html, 'og:image') || extractMeta(html, 'twitter:image') || extractMeta(html, 'og:image:secure_url');
    const title = extractMeta(html, 'og:title') || extractMeta(html, 'twitter:title') || extractMeta(html, 'title');
    const description =
      extractMeta(html, 'og:description') || extractMeta(html, 'twitter:description') || extractMeta(html, 'description');

    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');
    res.status(200).json({ url, title, description, image });
  } catch (error) {
    console.error('Failed to fetch preview for', url, error);
    res.status(502).json({ error: 'Failed to load preview metadata' });
  }
}
