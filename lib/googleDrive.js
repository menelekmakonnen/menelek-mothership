const DRIVE_EMBED_BASE = 'https://drive.google.com/embeddedfolderview?id=';
const DRIVE_IMAGE_BASE = 'https://lh3.googleusercontent.com/d/';

function buildThumbnailUrl(id, size = 'w1600-h1600') {
  if (!id) return null;
  return `${DRIVE_IMAGE_BASE}${id}=${size}`;
}

export function buildDriveImageVariants(id) {
  if (!id) return null;

  const safeId = id.trim();
  return {
    id: safeId,
    thumb: `${DRIVE_IMAGE_BASE}${safeId}=w600-h600`,
    preview: `${DRIVE_IMAGE_BASE}${safeId}=w1600-h1600`,
    full: `${DRIVE_IMAGE_BASE}${safeId}=w2400-h2400`,
    view: `https://drive.google.com/uc?export=view&id=${safeId}`,
    download: `https://drive.google.com/uc?export=download&id=${safeId}`,
  };
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
      thumbnail = thumbnail.replace(/=s\d+$/, '=s1600');
    }

    if (!thumbnail && type === 'file') {
      thumbnail = imageVariants?.preview || buildThumbnailUrl(id);
    }

    let viewUrl = href;
    let downloadUrl = null;

    if (type === 'file') {
      viewUrl = imageVariants?.preview || imageVariants?.view || `https://drive.google.com/uc?export=view&id=${id}`;
      downloadUrl = imageVariants?.download || `https://drive.google.com/uc?export=download&id=${id}`;
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
}

export async function fetchDriveFolderTree(folderId) {
  const root = await fetchDriveFolder(folderId);
  const folders = root.items.filter((item) => item.type === 'folder');
  return { ...root, folders };
}
