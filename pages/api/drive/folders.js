import { getDriveClient, validateCredentials } from '@/lib/googleAuth';

/**
 * API endpoint to fetch folders from Google Drive
 * GET /api/drive/folders?parentId=FOLDER_ID
 * Returns list of subfolders with metadata
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

  const { parentId } = req.query;

  if (!parentId) {
    return res.status(400).json({ error: 'parentId query parameter is required' });
  }

  try {
    const drive = await getDriveClient();

    // Fetch folders only (mimeType = application/vnd.google-apps.folder)
    const response = await drive.files.list({
      q: `'${parentId}' in parents and mimeType = 'application/vnd.google-apps.folder' and trashed = false`,
      fields: 'files(id, name, mimeType, modifiedTime, createdTime)',
      orderBy: 'name',
    });

    const folders = response.data.files || [];

    // For each folder, get file count
    const foldersWithCounts = await Promise.all(
      folders.map(async (folder) => {
        try {
          const filesResponse = await drive.files.list({
            q: `'${folder.id}' in parents and mimeType contains 'image/' and trashed = false`,
            fields: 'files(id)',
            pageSize: 1000,
          });

          const fileCount = filesResponse.data.files?.length || 0;

          return {
            id: folder.id,
            name: folder.name,
            itemCount: fileCount,
            createdTime: folder.createdTime,
            modifiedTime: folder.modifiedTime,
          };
        } catch (error) {
          console.error(`Error getting file count for folder ${folder.name}:`, error);
          return {
            id: folder.id,
            name: folder.name,
            itemCount: 0,
            createdTime: folder.createdTime,
            modifiedTime: folder.modifiedTime,
          };
        }
      })
    );

    // Filter out empty folders
    const nonEmptyFolders = foldersWithCounts.filter(folder => folder.itemCount > 0);

    return res.status(200).json({ folders: nonEmptyFolders });
  } catch (error) {
    console.error('Error fetching folders from Google Drive:', error);
    return res.status(500).json({
      error: 'Failed to fetch folders',
      message: error.message
    });
  }
}
