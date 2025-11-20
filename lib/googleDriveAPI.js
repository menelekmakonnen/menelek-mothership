/**
 * Google Drive API Integration
 * Fetches photos and albums from publicly shared Google Drive folders
 */

import { getDriveImageVariants } from './googleSheetsGViz';

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

    const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,imageMediaMetadata)&orderBy=createdTime desc`;

    console.log(`Fetching folder: ${folderId}`);

    const response = await fetch(apiUrl);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Drive API Error (${response.status}):`, errorText);
      console.error(`Folder ID: ${folderId}`);

      if (response.status === 403) {
        console.error('💡 Fix: Make sure the folder is set to "Anyone with the link can view"');
      } else if (response.status === 401) {
        console.error('💡 Fix: Check your API key in .env.local');
      } else if (response.status === 404) {
        console.error('💡 Fix: Verify the folder ID is correct');
      }

      return [];
    }

    const data = await response.json();
    console.log(`✅ Found ${data.files?.length || 0} items in folder ${folderId}`);
    return data.files || [];
  } catch (error) {
    console.error('❌ Network error fetching Google Drive folder:', error);
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
 * - Mmm Media Albums (root: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4)
 *   - Beauty (category subfolder)
 *     - YYYY-MM-DD NameOfShoot (gallery subfolder)
 *       - image1.jpg, image2.jpg, etc.
 *   - Professional (category subfolder)
 *     - YYYY-MM-DD NameOfShoot (gallery subfolder)
 *       - image1.jpg, image2.jpg, etc.
 *
 * @returns {Promise<Object>} Structured photography data
 */
export async function fetchPhotographyData() {
  try {
    console.log('Fetching Photography data from Google Drive...');

    // Fetch root folder to get category subfolders (Beauty, Professional)
    const rootFolders = await fetchGoogleDriveFolder(PHOTOGRAPHY_FOLDER_ID);

    // Filter for "Beauty" and "Professional" folders only
    const categoryFolders = rootFolders.filter(file =>
      file.mimeType === 'application/vnd.google-apps.folder' &&
      (file.name === 'Beauty' || file.name === 'Professional')
    );

    console.log('Found category folders:', categoryFolders.map(f => f.name));

    // Fetch all galleries from both categories
    const allGalleries = [];

    for (const categoryFolder of categoryFolders) {
      // Fetch dated gallery folders within this category
      const galleryFolders = await fetchGoogleDriveFolder(categoryFolder.id);

      const datedFolders = galleryFolders.filter(file =>
        file.mimeType === 'application/vnd.google-apps.folder'
      );

      console.log(`Found ${datedFolders.length} galleries in ${categoryFolder.name}`);

      // Fetch images from each gallery
      for (const galleryFolder of datedFolders) {
        const images = await fetchGoogleDriveFolder(galleryFolder.id);

        // Filter for image files only
        const imageFiles = images.filter(file =>
          file.mimeType?.startsWith('image/')
        );

        if (imageFiles.length > 0) {
          // Extract date and shoot name from folder name (format: YYYY-MM-DD NameOfShoot)
          const dateMatch = galleryFolder.name.match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
          const date = dateMatch ? dateMatch[1] : null;
          const shootName = dateMatch ? dateMatch[2] : galleryFolder.name;

          const coverImageUrl = imageFiles[0] ? getGoogleDriveImageUrl(imageFiles[0].id) : null;

          allGalleries.push({
            id: galleryFolder.id,
            name: shootName || galleryFolder.name,
            description: `${categoryFolder.name} - ${shootName || galleryFolder.name}`,
            category: categoryFolder.name,
            date: date, // Store date for sorting
            coverUrl: coverImageUrl,
            items: imageFiles.map((file, index) => {
              const imageUrl = getGoogleDriveImageUrl(file.id);
              return {
                id: file.id,
                name: file.name,
                url: imageUrl,
                thumbnailUrl: getGoogleDriveThumbnailUrl(file.id),
                imageVariants: getDriveImageVariants(imageUrl),
                type: 'image',
                index: index,
              };
            }),
          });
        }
      }
    }

    console.log(`Successfully fetched ${allGalleries.length} photography galleries`);

    // Sort galleries by date (newest first), then by name
    allGalleries.sort((a, b) => {
      if (a.date && b.date) {
        return b.date.localeCompare(a.date); // Newer dates first
      }
      if (a.date) return -1; // Dated items come first
      if (b.date) return 1;
      return a.name.localeCompare(b.name); // Alphabetical for non-dated
    });

    return {
      galleries: allGalleries,
    };
  } catch (error) {
    console.error('Error fetching photography data:', error);
    return { galleries: [] };
  }
}

/**
 * Fetch and structure AI Albums data from Google Drive
 * Expected folder structure:
 * - Mmm Media Albums (root: 1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4)
 *   - AI Album 1 (folder with images)
 *   - AI Album 2 (folder with images)
 *   - etc. (excluding Beauty and Professional folders)
 *
 * @returns {Promise<Object>} Structured AI albums data
 */
export async function fetchAIAlbumsData() {
  try {
    console.log('Fetching AI Albums data from Google Drive...');

    // Fetch root folder
    const rootFolders = await fetchGoogleDriveFolder(PHOTOGRAPHY_FOLDER_ID);

    // Filter for folders, but EXCLUDE "Beauty" and "Professional" (those are for Photography)
    const aiFolders = rootFolders.filter(file =>
      file.mimeType === 'application/vnd.google-apps.folder' &&
      file.name !== 'Beauty' &&
      file.name !== 'Professional'
    );

    console.log('Found AI Album folders:', aiFolders.map(f => f.name));

    // Fetch images from each AI album folder
    const galleries = await Promise.all(
      aiFolders.map(async (folder) => {
        const images = await fetchGoogleDriveFolder(folder.id);

        // Filter for image files only
        const imageFiles = images.filter(file =>
          file.mimeType?.startsWith('image/')
        );

        if (imageFiles.length === 0) {
          return null;
        }

        const coverImageUrl = imageFiles[0] ? getGoogleDriveImageUrl(imageFiles[0].id) : null;

        return {
          id: folder.id,
          name: folder.name,
          description: `AI-generated album: ${folder.name}`,
          coverUrl: coverImageUrl,
          items: imageFiles.map((file, index) => {
            const imageUrl = getGoogleDriveImageUrl(file.id);
            return {
              id: file.id,
              name: file.name,
              url: imageUrl,
              thumbnailUrl: getGoogleDriveThumbnailUrl(file.id),
              imageVariants: getDriveImageVariants(imageUrl),
              type: 'image',
              index: index,
            };
          }),
        };
      })
    );

    const validGalleries = galleries.filter(g => g !== null);
    console.log(`Successfully fetched ${validGalleries.length} AI album galleries`);

    return {
      galleries: validGalleries,
    };
  } catch (error) {
    console.error('Error fetching AI Albums data:', error);
    return { galleries: [] };
  }
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
