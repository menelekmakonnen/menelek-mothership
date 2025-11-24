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
  if (!id) return null;

  const safeId = id.trim();
  const googleThumb = `${DRIVE_IMAGE_BASE}${safeId}=w700-h700-no`;
  const googlePreview = `${DRIVE_IMAGE_BASE}${safeId}=w1600-h1600-no`;
  const googleFull = `${DRIVE_IMAGE_BASE}${safeId}=w2400-h2400-no`;
  const fallbackThumb = `${DRIVE_THUMB_BASE}${safeId}&sz=w720`;
  const fallbackPreview = `${DRIVE_THUMB_BASE}${safeId}&sz=w1600`;
  const fallbackFull = `${DRIVE_THUMB_BASE}${safeId}&sz=w2400`;

  return {
    id: safeId,
    thumb: fallbackThumb || googleThumb,
    preview: googlePreview || fallbackPreview,
    full: googleFull || fallbackFull,
    altThumb: googleThumb,
    altPreview: fallbackPreview,
    altFull: fallbackFull,
    view: `${DRIVE_VIEW_BASE}${safeId}`,
    download: `${DRIVE_DOWNLOAD_BASE}${safeId}`,
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
    return { id: null, items: [], error: 'Google Drive folder id is required' };
  }

  try {
    const response = await fetch(`${DRIVE_EMBED_BASE}${folderId}#grid`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) {
      return { id: folderId, items: [], error: `Failed to load Google Drive folder (${response.status})` };
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
        thumbnail = imageVariants?.thumb || imageVariants?.preview || buildThumbnailUrl(id);
      }

      let viewUrl = href;
      let downloadUrl = null;

      if (type === 'file') {
        viewUrl = imageVariants?.preview || imageVariants?.altPreview || imageVariants?.view || `${DRIVE_VIEW_BASE}${id}`;
        downloadUrl = imageVariants?.download || `${DRIVE_DOWNLOAD_BASE}${id}`;
      }

      items.push({
        id,
        title,
        type,
        href,
        viewUrl,
        downloadUrl,
        thumbnail,
        previewUrl: type === 'file' ? imageVariants?.preview || thumbnail : null,
        imageVariants,
        updated,
      });
    }

    return { id: folderId, items };
  } catch (error) {
    console.error('fetchDriveFolder error', folderId, error);
    return { id: folderId, items: [], error: error.message };
  }
}

export async function fetchDriveFolderTree(folderId) {
  const root = await fetchDriveFolder(folderId);
  const folders = root.items.filter((item) => item.type === 'folder');
  return { ...root, folders };
}
