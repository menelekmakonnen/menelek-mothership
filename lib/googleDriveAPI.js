/**
 * Google Drive API Integration
 * Fetches photos and albums from publicly shared Google Drive folders
 */

const MMM_MEDIA_ROOT = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';
const AI_ALBUM_ROOT = '1LflEx48azcfu_EBnLv12SOYWhUMXYoBj';

const PHOTOGRAPHY_FOLDER_ID = MMM_MEDIA_ROOT;

const DRIVE_FOLDER_MIME = 'application/vnd.google-apps.folder';

const DRIVE_EMBED_BASE = 'https://drive.google.com/embeddedfolderview?id=';
const DRIVE_IMAGE_BASE = 'https://lh3.googleusercontent.com/d/';
const DRIVE_THUMB_BASE = 'https://drive.google.com/thumbnail?id=';
const DRIVE_VIEW_BASE = 'https://drive.google.com/uc?export=view&id=';
const DRIVE_DOWNLOAD_BASE = 'https://drive.google.com/uc?export=download&id=';

function appendResourceKey(url, resourceKey) {
  if (!resourceKey) return url;
  const delimiter = url.includes('?') ? '&' : '?';
  return `${url}${delimiter}resourcekey=${resourceKey}`;
}

function buildThumbnailUrl(id, size = 'w1600-h1600-no', resourceKey) {
  if (!id) return null;
  return appendResourceKey(`${DRIVE_IMAGE_BASE}${id}=${size}`, resourceKey);
}

export function buildDriveImageVariants(id, resourceKey) {
  if (!id) return null;

  const safeId = id.trim();
  const googleThumb = appendResourceKey(`${DRIVE_IMAGE_BASE}${safeId}=w700-h700-no`, resourceKey);
  const googlePreview = appendResourceKey(`${DRIVE_IMAGE_BASE}${safeId}=w1600-h1600-no`, resourceKey);
  const googleFull = appendResourceKey(`${DRIVE_IMAGE_BASE}${safeId}=w2400-h2400-no`, resourceKey);
  const fallbackThumb = appendResourceKey(`${DRIVE_THUMB_BASE}${safeId}&sz=w720`, resourceKey);
  const fallbackPreview = appendResourceKey(`${DRIVE_THUMB_BASE}${safeId}&sz=w1600`, resourceKey);
  const fallbackFull = appendResourceKey(`${DRIVE_THUMB_BASE}${safeId}&sz=w2400`, resourceKey);

  return {
    id: safeId,
    thumb: fallbackThumb || googleThumb,
    preview: googlePreview || fallbackPreview,
    full: googleFull || fallbackFull,
    altThumb: googleThumb,
    altPreview: fallbackPreview,
    altFull: fallbackFull,
    view: appendResourceKey(`${DRIVE_VIEW_BASE}${safeId}`, resourceKey),
    download: appendResourceKey(`${DRIVE_DOWNLOAD_BASE}${safeId}`, resourceKey),
  };
}

export function resolveDriveImage(variants, intent = 'preview') {
  if (!variants) return null;

  const preference = {
    thumb: ['thumb', 'altThumb', 'preview', 'altPreview', 'view', 'download', 'full', 'altFull'],
    preview: ['preview', 'altPreview', 'full', 'altFull', 'thumb', 'altThumb', 'view', 'download'],
    full: ['full', 'altFull', 'preview', 'altPreview', 'thumb', 'altThumb', 'view', 'download'],
  };

  const order = preference[intent] || preference.preview;
  for (const key of order) {
    const candidate = variants[key];
    if (candidate) return candidate;
  }
  return null;
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

function extractResourceKey(href) {
  if (!href) return null;

  try {
    const url = new URL(href, 'https://drive.google.com');
    const resourceKey = url.searchParams.get('resourcekey');
    if (resourceKey) {
      return resourceKey;
    }
  } catch (error) {
    // ignore URL parsing failures
  }

  const match = href.match(/resourcekey=([^&]+)/);
  return match ? match[1] : null;
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

async function fetchDriveFolder(folderId) {
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
    const resourceKey = extractResourceKey(href);

    if (!id) {
      continue;
    }

    const imageVariants = type === 'file' ? buildDriveImageVariants(id, resourceKey) : null;

    let thumbnail = rawThumb || null;
    if (thumbnail) {
      thumbnail = thumbnail.replace(/=s\d+$/, '=s1600-no');
    }

    if (!thumbnail && type === 'file') {
      thumbnail = imageVariants?.thumb || imageVariants?.preview || buildThumbnailUrl(id, 'w1600-h1600-no', resourceKey);
    }

    let viewUrl = href;
    let downloadUrl = null;

    if (type === 'file') {
      const viewBase = appendResourceKey(`${DRIVE_VIEW_BASE}${id}`, resourceKey);
      const downloadBase = appendResourceKey(`${DRIVE_DOWNLOAD_BASE}${id}`, resourceKey);

      viewUrl = imageVariants?.preview || imageVariants?.altPreview || imageVariants?.view || viewBase;
      downloadUrl = imageVariants?.download || downloadBase;
    }

    items.push({
      id,
      title,
      type,
      href,
      viewUrl,
      downloadUrl,
      thumbnail,
      resourceKey,
      previewUrl: type === 'file' ? imageVariants?.preview || thumbnail : null,
      imageVariants,
      updated,
    });
  }

  return { id: folderId, items };
}

async function fetchDriveFolderTree(folderId) {
  const root = await fetchDriveFolder(folderId);
  const folders = root.items.filter((item) => item.type === 'folder');
  return { ...root, folders };
}

// Exported wrapper retains previous signature for compatibility
export async function fetchGoogleDriveFolder(folderId) {
  const folder = await fetchDriveFolder(folderId);
  return folder.items.map((item) => ({
    id: item.id,
    name: item.title,
    mimeType: item.type === 'folder' ? DRIVE_FOLDER_MIME : 'image/*',
    thumbnailLink: item.thumbnail,
    webViewLink: item.viewUrl,
    webContentLink: item.downloadUrl,
    imageVariants: item.imageVariants,
    resourceKey: item.resourceKey,
    updated: item.updated,
  }));
}

export function getGoogleDriveImageUrl(fileId, resourceKey) {
  return resolveDriveImage(buildDriveImageVariants(fileId, resourceKey), 'preview');
}

export function getGoogleDriveThumbnailUrl(fileId, size = 512, resourceKey) {
  return appendResourceKey(`${DRIVE_THUMB_BASE}${fileId}&sz=w${size}`, resourceKey);
}

function buildGalleryFromFolder(categoryName, galleryFolder, imageFiles) {
  if (!imageFiles || imageFiles.length === 0) {
    return null;
  }

  const dateMatch = galleryFolder.name.match(/^(\d{4}-\d{2}-\d{2})\s*(.*)$/);
  const date = dateMatch ? dateMatch[1] : null;
  const shootName = dateMatch ? dateMatch[2] : galleryFolder.name;

  const coverVariants = buildDriveImageVariants(imageFiles[0].id, imageFiles[0].resourceKey);

  return {
    id: galleryFolder.id,
    name: shootName || galleryFolder.name,
    description: `${categoryName} - ${shootName || galleryFolder.name}`,
    category: categoryName,
    date,
    coverUrl: resolveDriveImage(coverVariants, 'preview') || buildThumbnailUrl(galleryFolder.id),
    items: imageFiles.map((file, index) => {
      const variants = file.imageVariants || buildDriveImageVariants(file.id, file.resourceKey);
      return {
        id: file.id,
        name: file.name,
        url: resolveDriveImage(variants, 'full'),
        thumbnailUrl: resolveDriveImage(variants, 'thumb'),
        type: 'image',
        index,
      };
    }),
  };
}

export async function fetchPhotographyData() {
  try {
    const rootFolders = await fetchGoogleDriveFolder(PHOTOGRAPHY_FOLDER_ID);

    const categoryFolders = rootFolders.filter(
      (file) => file.mimeType === DRIVE_FOLDER_MIME && (file.name === 'Beauty' || file.name === 'Professional'),
    );

    const allGalleries = [];

    for (const categoryFolder of categoryFolders) {
      const galleryFolders = await fetchGoogleDriveFolder(categoryFolder.id);
      const datedFolders = galleryFolders.filter((file) => file.mimeType === DRIVE_FOLDER_MIME);

      for (const galleryFolder of datedFolders) {
        const images = await fetchGoogleDriveFolder(galleryFolder.id);
        const imageFiles = images.filter((file) => file.mimeType !== DRIVE_FOLDER_MIME);
        const gallery = buildGalleryFromFolder(categoryFolder.name, galleryFolder, imageFiles);
        if (gallery) {
          allGalleries.push(gallery);
        }
      }
    }

    allGalleries.sort((a, b) => {
      if (a.date && b.date) return b.date.localeCompare(a.date);
      if (a.date) return -1;
      if (b.date) return 1;
      return a.name.localeCompare(b.name);
    });

    return { galleries: allGalleries };
  } catch (error) {
    console.error('Error fetching photography data:', error);
    return { galleries: [] };
  }
}

export async function fetchAIAlbumsData() {
  try {
    const rootFolders = await fetchGoogleDriveFolder(AI_ALBUM_ROOT);

    const aiFolders = rootFolders.filter(
      (file) => file.mimeType === DRIVE_FOLDER_MIME && file.name !== 'Beauty' && file.name !== 'Professional',
    );

    const galleries = await Promise.all(
      aiFolders.map(async (folder) => {
        const images = await fetchGoogleDriveFolder(folder.id);
        const imageFiles = images.filter((file) => file.mimeType !== DRIVE_FOLDER_MIME);

        if (imageFiles.length === 0) return null;

        const coverVariants = buildDriveImageVariants(imageFiles[0].id, imageFiles[0].resourceKey);

        return {
          id: folder.id,
          name: folder.name,
          description: `AI-generated album: ${folder.name}`,
          coverUrl: resolveDriveImage(coverVariants, 'preview'),
          items: imageFiles.map((file, index) => {
            const variants = file.imageVariants || buildDriveImageVariants(file.id, file.resourceKey);
            return {
              id: file.id,
              name: file.name,
              url: resolveDriveImage(variants, 'full'),
              thumbnailUrl: resolveDriveImage(variants, 'thumb'),
              type: 'image',
              index,
            };
          }),
        };
      }),
    );

    const validGalleries = galleries.filter(Boolean);

    return { galleries: validGalleries };
  } catch (error) {
    console.error('Error fetching AI Albums data:', error);
    return { galleries: [] };
  }
}

export function getPhotographyFallbackData() {
  return { galleries: [] };
}
