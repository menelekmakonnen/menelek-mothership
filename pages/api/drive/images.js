import { getDriveClient, validateCredentials } from '@/lib/googleAuth';

/**
 * API endpoint to fetch images from a Google Drive folder
 * GET /api/drive/images?folderId=FOLDER_ID
 * Returns list of images with URLs and metadata
 */
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate credentials
  if (!validateCredentials()) {
    return res.status(500).json({
      error: 'Google API credentials not configured',
      message: 'Please set up .env.local with your service account credentials'
    });
  }

  const { folderId } = req.query;

  if (!folderId) {
    return res.status(400).json({ error: 'folderId query parameter is required' });
  }

  try {
    const drive = await getDriveClient();

    // Fetch image files
    const response = await drive.files.list({
      q: `'${folderId}' in parents and (mimeType contains 'image/' or mimeType contains 'video/') and trashed = false`,
      fields: 'files(id, name, mimeType, size, createdTime, modifiedTime, thumbnailLink, webContentLink, webViewLink)',
      orderBy: 'name',
      pageSize: 1000,
    });

    const files = response.data.files || [];

    // Transform files to match our data structure
    const images = files.map((file) => {
      const isVideo = file.mimeType.includes('video');

      // Construct URLs
      // Thumbnail: Use Drive's built-in thumbnail (400x400)
      const thumbnailUrl = file.thumbnailLink?.replace('=s220', '=s400') ||
                          `https://drive.google.com/thumbnail?id=${file.id}&sz=w400`;

      // Full size: Use direct link or view link
      const url = `https://drive.google.com/uc?export=view&id=${file.id}`;

      return {
        id: file.id,
        name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
        type: isVideo ? 'video' : 'image',
        url: url,
        thumbnailUrl: thumbnailUrl,
        mimeType: file.mimeType,
        size: file.size,
        createdTime: file.createdTime,
        modifiedTime: file.modifiedTime,
      };
    });

    return res.status(200).json({
      images,
      count: images.length
    });
  } catch (error) {
    console.error('Error fetching images from Google Drive:', error);
    return res.status(500).json({
      error: 'Failed to fetch images',
      message: error.message
    });
  }
}
