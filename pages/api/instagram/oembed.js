/**
 * API endpoint for Instagram oEmbed
 * GET /api/instagram/oembed?url=INSTAGRAM_URL
 * Returns Instagram post metadata and embed HTML
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'url query parameter is required' });
  }

  try {
    // Instagram oEmbed endpoint
    const oembedUrl = `https://graph.facebook.com/v18.0/instagram_oembed?url=${encodeURIComponent(url)}&access_token=EAAGm0PX4ZCpsBO4BfHDNZB2WgdKN7rUj0ZApZBYGo2ZC0DaU8vIbOVZBRAZCa5hPdMVZBuZClcJBwbPPDYl6qLoCYsv5qM3WqC3tIy48ZCEwXFNyK2kfRZBWkOHZCdGPSwH5tUzVFZBwdXlpkBSfB0swKFRNt34pPSZB94WD5hMEVazLTSQa7rrNdvDy8vv5m4Wd8h9SZCbpbzFQj4QVEpcGZAZA6bZArLBEZC3T9q2MZD`;

    const response = await fetch(oembedUrl);

    if (!response.ok) {
      // Fallback: Return basic structure without actual embed
      return res.status(200).json({
        type: 'rich',
        version: '1.0',
        provider_name: 'Instagram',
        provider_url: 'https://www.instagram.com',
        url: url,
        html: null,
        thumbnail_url: null,
        error: 'Could not fetch embed data',
      });
    }

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching Instagram oEmbed:', error);

    // Return fallback data
    return res.status(200).json({
      type: 'rich',
      version: '1.0',
      provider_name: 'Instagram',
      provider_url: 'https://www.instagram.com',
      url: url,
      html: null,
      thumbnail_url: null,
      error: error.message,
    });
  }
}
