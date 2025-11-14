const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'www.youtu.be',
]);

const INSTAGRAM_HOSTS = new Set([
  'instagram.com',
  'www.instagram.com',
  'm.instagram.com',
  'ddinstagram.com',
  'www.ddinstagram.com',
]);

function normaliseHost(host) {
  return host?.toLowerCase() || '';
}

function extractYouTubeId(url) {
  try {
    const parsed = new URL(url);
    const host = normaliseHost(parsed.hostname);
    if (!YOUTUBE_HOSTS.has(host)) return null;

    if (host.includes('youtu.be')) {
      return parsed.pathname.replace(/^\//, '').split('/')[0] || null;
    }

    if (parsed.pathname.startsWith('/shorts/')) {
      return parsed.pathname.split('/')[2] || null;
    }

    if (parsed.pathname.startsWith('/live/')) {
      return parsed.pathname.split('/')[2] || null;
    }

    const searchId = parsed.searchParams.get('v');
    if (searchId) return searchId;

    const embedMatch = parsed.pathname.match(/\/embed\/([^/]+)/);
    if (embedMatch) return embedMatch[1];
  } catch (error) {
    // noop
  }
  return null;
}

function extractInstagramCode(url) {
  try {
    const parsed = new URL(url);
    const host = normaliseHost(parsed.hostname);
    if (![...INSTAGRAM_HOSTS].some((candidate) => host.endsWith(candidate.replace(/^www\./, '')))) {
      return null;
    }

    const segments = parsed.pathname.split('/').filter(Boolean);
    if (!segments.length) return null;

    const type = segments[0];
    if (!['reel', 'p', 'tv'].includes(type)) return null;

    const code = segments[1];
    if (!code) return null;

    return { type, code };
  } catch (error) {
    // noop
  }
  return null;
}

export function parseMediaLink(url) {
  if (!url) return null;

  const youTubeId = extractYouTubeId(url);
  if (youTubeId) {
    return {
      provider: 'youtube',
      id: youTubeId,
      embedUrl: `https://www.youtube.com/embed/${youTubeId}`,
      thumbnailUrl: `https://img.youtube.com/vi/${youTubeId}/maxresdefault.jpg`,
    };
  }

  const instagramInfo = extractInstagramCode(url);
  if (instagramInfo) {
    const { type, code } = instagramInfo;
    const baseUrl = `https://www.instagram.com/${type}/${code}/`;
    return {
      provider: 'instagram',
      id: code,
      embedUrl: `${baseUrl}embed/`,
      thumbnailUrl: `https://image.thum.io/get/width/1200/crop/720/${baseUrl}`,
    };
  }

  return {
    provider: 'unknown',
    id: null,
    embedUrl: null,
    thumbnailUrl: null,
  };
}

export function getMediaThumbnail(url) {
  const parsed = parseMediaLink(url);
  return parsed?.thumbnailUrl || null;
}

export function getMediaEmbedUrl(url) {
  const parsed = parseMediaLink(url);
  return parsed?.embedUrl || null;
}

export function getMediaProvider(url) {
  const parsed = parseMediaLink(url);
  return parsed?.provider || 'unknown';
}

