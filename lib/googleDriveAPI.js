/**
 * Google Drive API Integration
 * Fetches photos and albums from publicly shared Google Drive folders
 */

// Google Drive folder IDs
const PHOTOGRAPHY_FOLDER_ID = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

/**
 * Fetch all files from a Google Drive folder
 * Note: The folder must be publicly shared for this to work
 *
 * @param {string} folderId - Google Drive folder ID
 * @returns {Promise<Array>} Array of file objects
 */
export async function fetchGoogleDriveFolder(folderId) {
  try {
    // For publicly shared folders, we can use the Drive API's public endpoint
    // This requires the folder to be set to "Anyone with the link can view"

    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,imageMediaMetadata)&orderBy=createdTime desc`
    );

    if (!response.ok) {
      console.error('Failed to fetch Google Drive folder:', response.statusText);
      return [];
    }

    const data = await response.json();
    return data.files || [];
  } catch (error) {
    console.error('Error fetching Google Drive folder:', error);
    return [];
  }
}

/**
 * Get direct image URL from Google Drive file ID
 * @param {string} fileId - Google Drive file ID
 * @returns {string} Direct image URL
 */
export function getGoogleDriveImageUrl(fileId) {
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

/**
 * Get thumbnail URL from Google Drive file ID
 * @param {string} fileId - Google Drive file ID
 * @param {number} size - Thumbnail size (default: 512)
 * @returns {string} Thumbnail URL
 */
export function getGoogleDriveThumbnailUrl(fileId, size = 512) {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w${size}`;
}

/**
 * Fetch and structure Photography data from Google Drive
 * Expected folder structure:
 * - Photography (root)
 *   - Beauty (subfolder)
 *   - Professional (subfolder)
 *
 * @returns {Promise<Object>} Structured photography data
 */
export async function fetchPhotographyData() {
  try {
    // Fetch root folder to get subfolders
    const folders = await fetchGoogleDriveFolder(PHOTOGRAPHY_FOLDER_ID);

    // Filter for folders only
    const subfolders = folders.filter(file => file.mimeType === 'application/vnd.google-apps.folder');

    // Fetch images from each subfolder
    const galleries = await Promise.all(
      subfolders.map(async (folder) => {
        const images = await fetchGoogleDriveFolder(folder.id);

        // Filter for image files only
        const imageFiles = images.filter(file =>
          file.mimeType?.startsWith('image/')
        );

        return {
          id: folder.id,
          name: folder.name,
          description: `${folder.name} photography collection`,
          coverUrl: imageFiles[0] ? getGoogleDriveImageUrl(imageFiles[0].id) : null,
          items: imageFiles.map((file, index) => ({
            id: file.id,
            name: file.name,
            url: getGoogleDriveImageUrl(file.id),
            thumbnailUrl: getGoogleDriveThumbnailUrl(file.id),
            type: 'image',
            index: index,
          })),
        };
      })
    );

    return {
      galleries: galleries.filter(g => g.items.length > 0),
    };
  } catch (error) {
    console.error('Error fetching photography data:', error);
    return { galleries: [] };
  }
}

/**
 * Fetch and structure AI Albums data from Google Drive
 * Similar structure to Photography
 *
 * @returns {Promise<Object>} Structured AI albums data
 */
export async function fetchAIAlbumsData() {
  // Using same folder as photography for now
  // User can update with separate folder ID if needed
  return fetchPhotographyData();
}

/**
 * Create a fallback/placeholder structure when API is not available
 * This ensures the app continues to work even without API access
 */
export function getPhotographyFallbackData() {
  return {
    galleries: [
      {
        id: 'beauty-placeholder',
        name: 'Beauty',
        description: 'Beauty photography collection',
        coverUrl: 'https://via.placeholder.com/800x1200/6B46C1/ffffff?text=Beauty',
        items: [],
      },
      {
        id: 'professional-placeholder',
        name: 'Professional',
        description: 'Professional photography collection',
        coverUrl: 'https://via.placeholder.com/800x1200/6B46C1/ffffff?text=Professional',
        items: [],
      },
    ],
  };
}
