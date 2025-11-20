/**
 * Google Drive Folder Scraper (No API Key Required!)
 * Scrapes publicly shared Drive folders using the embed view
 */

const DRIVE_EMBED_BASE = 'https://drive.google.com/embeddedfolderview?id=';
const DRIVE_IMAGE_BASE = 'https://lh3.googleusercontent.com/d/';
const DRIVE_THUMB_BASE = 'https://drive.google.com/thumbnail?id=';
const DRIVE_VIEW_BASE = 'https://drive.google.com/uc?export=view&id=';
const DRIVE_DOWNLOAD_BASE = 'https://drive.google.com/uc?export=download&id=';

function buildThumbnailUrl(id, size = 'w1600-h1600-no') {
  if (!id) return null;
  return `${DRIVE_IMAGE_BASE}${id}=${size}`;
}

export function buildDriveImageVariants(id) {
  if (!id) return [];

  const safeId = id.trim();
  return [
    `${DRIVE_IMAGE_BASE}${safeId}=w2400-h2400-no`,
    `${DRIVE_IMAGE_BASE}${safeId}=w1600-h1600-no`,
    `${DRIVE_IMAGE_BASE}${safeId}=w700-h700-no`,
    `${DRIVE_THUMB_BASE}${safeId}&sz=w2400`,
    `${DRIVE_THUMB_BASE}${safeId}&sz=w1600`,
    `${DRIVE_THUMB_BASE}${safeId}&sz=w720`,
    `${DRIVE_VIEW_BASE}${safeId}`,
    `${DRIVE_DOWNLOAD_BASE}${safeId}`,
  ];
}

function decodeHtmlEntities(value) {
  if (!value) return value;
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function extractDriveId(href) {
  if (!href) return null;

  try {
    const url = new URL(href, 'https://drive.google.com');

    if (url.pathname.includes('/folders/')) {
      const segment = url.pathname.split('/folders/')[1];
      if (segment) {
        return segment.split('/')[0];
      }
    }

    if (url.pathname.includes('/file/d/')) {
      const segment = url.pathname.split('/file/d/')[1];
      if (segment) {
        return segment.split('/')[0];
      }
    }

    if (url.pathname.includes('/folderview')) {
      const fromQuery = url.searchParams.get('id');
      if (fromQuery) {
        return fromQuery;
      }
    }

    const queryId = url.searchParams.get('id');
    if (queryId) {
      return queryId;
    }
  } catch (error) {
    // ignore URL parsing failures and fall through to regex detection below
  }

  const match = href.match(/[-\w]{25,}/);
  return match ? match[0] : null;
}

function determineEntryType(href) {
  if (!href) return 'file';

  try {
    const url = new URL(href, 'https://drive.google.com');
    if (url.pathname.includes('/folders/') || url.pathname.includes('/folderview')) {
      return 'folder';
    }
    if (url.searchParams.get('type') === 'folders') {
      return 'folder';
    }
  } catch (error) {
    // fall back to string heuristics below
  }

  if (href.includes('/folders/') || href.includes('folderview?id=')) {
    return 'folder';
  }

  return 'file';
}

export async function fetchDriveFolder(folderId) {
  if (!folderId) {
    throw new Error('Google Drive folder id is required');
  }

  const response = await fetch(`${DRIVE_EMBED_BASE}${folderId}#grid`, {
    headers: {
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to load Google Drive folder ${folderId}`);
  }

  const html = await response.text();
  const items = [];

  const entryRegex = /<div class="flip-entry" id="entry-[^"]+"[\s\S]*?<a href="([^"]+)"[\s\S]*?(?:<div class="flip-entry-thumb"><img src="([^"]+)"[^>]*>)?[\s\S]*?<div class="flip-entry-title">([^<]+)<\/div>[\s\S]*?<div class="flip-entry-last-modified"><div>([^<]*)<\/div>/g;

  let match;
  while ((match = entryRegex.exec(html))) {
    const href = decodeHtmlEntities(match[1]);
    const rawThumb = decodeHtmlEntities(match[2] || '');
    const title = decodeHtmlEntities(match[3].trim());
    const updated = decodeHtmlEntities(match[4].trim());

    const type = determineEntryType(href);
    const id = extractDriveId(href);

    if (!id) {
      continue;
    }

    const imageVariants = type === 'file' ? buildDriveImageVariants(id) : null;

    let thumbnail = rawThumb || null;
    if (thumbnail) {
      thumbnail = thumbnail.replace(/=s\d+$/, '=s1600-no');
    }

    if (!thumbnail && type === 'file') {
      thumbnail = buildThumbnailUrl(id);
    }

    let viewUrl = href;
    let downloadUrl = null;

    if (type === 'file') {
      viewUrl = imageVariants?.[0] || `${DRIVE_VIEW_BASE}${id}`;
      downloadUrl = `${DRIVE_DOWNLOAD_BASE}${id}`;
    }

    items.push({
      id,
      title,
      type,
      href,
      viewUrl,
      downloadUrl,
      thumbnail,
      previewUrl: type === 'file' ? (imageVariants?.[1] || thumbnail) : null,
      imageVariants: imageVariants || [],
      updated,
    });
  }

  return { id: folderId, items };
}

/**
 * Fetch Photography data (no API key needed!)
 * Scans Beauty and Professional subfolders
 */
export async function fetchPhotographyData() {
  console.log('📊 Fetching Photography from Google Drive (no API key)...');

  const ROOT_FOLDER_ID = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

  try {
    // Fetch root folder
    const rootFolder = await fetchDriveFolder(ROOT_FOLDER_ID);
    const allGalleries = [];

    // Find Beauty and Professional folders
    const beautyFolder = rootFolder.items.find(item => item.type === 'folder' && item.title === 'Beauty');
    const professionalFolder = rootFolder.items.find(item => item.type === 'folder' && item.title === 'Professional');

    const categories = [];
    if (beautyFolder) categories.push({ folder: beautyFolder, category: 'Beauty' });
    if (professionalFolder) categories.push({ folder: professionalFolder, category: 'Professional' });

    console.log(`Found ${categories.length} category folders`);

    // Process each category
    for (const { folder, category } of categories) {
      const categoryData = await fetchDriveFolder(folder.id);
      const galleryFolders = categoryData.items.filter(item => item.type === 'folder');

      console.log(`Found ${galleryFolders.length} galleries in ${category}`);

      // Process each gallery folder
      for (const galleryFolder of galleryFolders) {
        const galleryData = await fetchDriveFolder(galleryFolder.id);
        const images = galleryData.items.filter(item => item.type === 'file');

        if (images.length === 0) continue;

        // Extract date from folder name (YYYY-MM-DD NameOfShoot)
        const dateMatch = galleryFolder.title.match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
        const date = dateMatch ? dateMatch[1] : null;
        const shootName = dateMatch ? dateMatch[2] : galleryFolder.title;

        allGalleries.push({
          id: galleryFolder.id,
          name: shootName || galleryFolder.title,
          description: `${category} - ${shootName || galleryFolder.title}`,
          category: category,
          date: date,
          coverUrl: images[0]?.viewUrl || null,
          items: images.map((img, index) => ({
            id: img.id,
            name: img.title,
            url: img.viewUrl,
            thumbnailUrl: img.thumbnail,
            imageVariants: img.imageVariants,
            type: 'image',
            index: index,
          })),
        });
      }
    }

    // Sort by date (newest first)
    allGalleries.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.name.localeCompare(b.name);
    });

    console.log(`✅ Fetched ${allGalleries.length} photography galleries`);

    return { galleries: allGalleries };
  } catch (error) {
    console.error('❌ Photography error:', error.message);
    return { galleries: [] };
  }
}

/**
 * Fetch AI Albums data (no API key needed!)
 * All folders except Beauty and Professional are AI albums
 */
export async function fetchAIAlbumsData() {
  console.log('📊 Fetching AI Albums from Google Drive (no API key)...');

  const ROOT_FOLDER_ID = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

  try {
    // Fetch root folder
    const rootFolder = await fetchDriveFolder(ROOT_FOLDER_ID);

    // Get all folders except Beauty and Professional
    const aiFolders = rootFolder.items.filter(
      item => item.type === 'folder' &&
      item.title !== 'Beauty' &&
      item.title !== 'Professional'
    );

    console.log(`Found ${aiFolders.length} AI album folders`);

    const galleries = [];

    // Process each AI album folder
    for (const aiFolder of aiFolders) {
      const albumData = await fetchDriveFolder(aiFolder.id);
      const images = albumData.items.filter(item => item.type === 'file');

      if (images.length === 0) continue;

      galleries.push({
        id: aiFolder.id,
        name: aiFolder.title,
        description: `AI-generated album: ${aiFolder.title}`,
        coverUrl: images[0]?.viewUrl || null,
        items: images.map((img, index) => ({
          id: img.id,
          name: img.title,
          url: img.viewUrl,
          thumbnailUrl: img.thumbnail,
          imageVariants: img.imageVariants,
          type: 'image',
          index: index,
        })),
      });
    }

    console.log(`✅ Fetched ${galleries.length} AI album galleries`);

    return { galleries };
  } catch (error) {
    console.error('❌ AI Albums error:', error.message);
    return { galleries: [] };
  }
}
