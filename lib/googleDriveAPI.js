/**
 * Google Drive API Integration
 * Fetches photos and albums from publicly shared Google Drive folders
 */

// Google Drive folder IDs
const PHOTOGRAPHY_FOLDER_ID = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';

// Build a consistent thumbnail URL so the UI always has something to try
const buildThumbnail = (id, size = 512) => `https://drive.google.com/thumbnail?id=${id}&sz=w${size}`;

// Build a consistent view URL for Google Drive files
const buildViewUrl = (id) => `https://drive.google.com/file/d/${id}/view?usp=sharing`;

// Parse entries from the public embedded folder HTML (works without an API key)
async function fetchGoogleDriveFolderViaEmbed(folderId) {
  try {
    const embedUrl = `https://drive.google.com/embeddedfolderview?id=${folderId}#list`;
    console.log(`Fetching embedded folder view: ${embedUrl}`);

    const response = await fetch(embedUrl);
    if (!response.ok) {
      console.error(`❌ Embedded folder fetch failed (${response.status})`);
      return [];
    }

    const html = await response.text();

    // Each entry looks like: <div class="flip-entry" data-id="..." data-title="..." data-type="mime/type" ...>
    const entryRegex = /flip-entry[^>]+data-id="([^"]+)"[^>]+data-title="([^"]+)"[^>]+data-type="([^"]+)"/g;
    const results = [];
    let match;

    while ((match = entryRegex.exec(html)) !== null) {
      const [, id, title, type] = match;
      results.push({
        id,
        name: title,
        mimeType: type,
        thumbnailLink: buildThumbnail(id),
        webViewLink: buildViewUrl(id),
      });
    }

    console.log(`✅ Parsed ${results.length} items from embedded view`);
    return results;
  } catch (error) {
    console.error('❌ Error parsing embedded folder view:', error);
    return [];
  }
}

/**
 * Fetch all files from a Google Drive folder
 * Note: The folder must be publicly shared for this to work
 *
 * @param {string} folderId - Google Drive folder ID
 * @returns {Promise<Array>} Array of file objects
 */
export async function fetchGoogleDriveFolder(folderId) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const hasKey = apiKey && apiKey.length > 0;

  // Prefer the Drive API if a key is available
  if (hasKey) {
    try {
      const apiUrl = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink,webContentLink,webViewLink,imageMediaMetadata)&orderBy=createdTime desc`;

      console.log(`Fetching folder via Drive API: ${folderId}`);

      const response = await fetch(apiUrl);

      if (response.ok) {
        const data = await response.json();
        console.log(`✅ Found ${data.files?.length || 0} items in folder ${folderId}`);
        return data.files || [];
      }

      const errorText = await response.text();
      console.error(`❌ Drive API Error (${response.status}):`, errorText);
      console.error('Falling back to embedded folder view...');
    } catch (error) {
      console.error('❌ Network error fetching Google Drive folder via API:', error);
      console.error('Falling back to embedded folder view...');
    }
  } else {
    console.warn('⚠️  No Google API key detected; using embedded folder view to fetch items');
  }

  // Fallback: parse the embedded folder HTML (works without API key)
  return await fetchGoogleDriveFolderViaEmbed(folderId);
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
        file.mimeType === DRIVE_FOLDER_MIME
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

          allGalleries.push({
            id: galleryFolder.id,
            name: shootName || galleryFolder.name,
            description: `${categoryFolder.name} - ${shootName || galleryFolder.name}`,
            category: categoryFolder.name,
            date: date, // Store date for sorting
            coverUrl: imageFiles[0] ? getGoogleDriveImageUrl(imageFiles[0].id) : buildThumbnail(galleryFolder.id, 720),
            items: imageFiles.map((file, index) => ({
              id: file.id,
              name: file.name,
              url: getGoogleDriveImageUrl(file.id),
              thumbnailUrl: getGoogleDriveThumbnailUrl(file.id),
              type: 'image',
              index: index,
            })),
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
      file.mimeType === DRIVE_FOLDER_MIME &&
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

        return {
          id: folder.id,
          name: folder.name,
          description: `AI-generated album: ${folder.name}`,
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
