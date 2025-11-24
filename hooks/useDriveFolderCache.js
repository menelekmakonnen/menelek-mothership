import { useCallback, useRef, useState } from 'react';

const PLACEHOLDER_PALETTES = [
  ['#0ea5e9', '#22c55e'],
  ['#a855f7', '#f97316'],
  ['#6366f1', '#06b6d4'],
  ['#f59e0b', '#ef4444'],
  ['#14b8a6', '#3b82f6'],
  ['#ec4899', '#8b5cf6'],
];

const buildPlaceholderItems = (folderId) => {
  const seed = Math.abs(
    Array.from(folderId || '')
      .map((char) => char.charCodeAt(0))
      .reduce((acc, code) => acc + code, 0)
  );
  const palette = PLACEHOLDER_PALETTES[seed % PLACEHOLDER_PALETTES.length];
  const items = new Array(6).fill(null).map((_, index) => {
    const hueA = palette[index % palette.length];
    const hueB = palette[(index + 1) % palette.length];
    return {
      id: `placeholder-${folderId || 'gallery'}-${index + 1}`,
      name: `Preview ${index + 1}`,
      description: 'Loaded from offline cache while remote media is unavailable.',
      previewUrl: `https://dummyimage.com/900x1400/${hueA.replace('#', '')}/${hueB.replace('#', '')}&text=${encodeURIComponent(
        `Gallery ${index + 1}`
      )}`,
      thumbnail: `https://dummyimage.com/600x900/${hueA.replace('#', '')}/${hueB.replace('#', '')}&text=${encodeURIComponent(
        `Preview ${index + 1}`
      )}`,
      type: 'image',
      variants: null,
      isPlaceholder: true,
    };
  });
  return items;
};

export default function useDriveFolderCache() {
  const cacheRef = useRef({});
  const loadingRef = useRef({});
  const errorRef = useRef({});
  const [, setTick] = useState(0);

  const forceRender = useCallback(() => setTick((value) => value + 1), []);

  const fallbackFolder = useCallback((folderId) => {
    return {
      id: folderId,
      name: 'Offline gallery',
      items: buildPlaceholderItems(folderId),
      error: 'Remote media unavailable — showing cached previews.',
      isFallback: true,
    };
  }, []);

  const loadFolder = useCallback(
    async (folderId) => {
      if (!folderId) return null;
      if (cacheRef.current[folderId]) {
        return cacheRef.current[folderId];
      }
      if (loadingRef.current[folderId]) {
        return null;
      }

      loadingRef.current[folderId] = true;
      forceRender();

      try {
        const response = await fetch(`/api/drive-folder?id=${encodeURIComponent(folderId)}`);
        if (!response.ok) {
          throw new Error(`Failed to load folder ${folderId}`);
        }
        const data = await response.json();
        cacheRef.current[folderId] = data;
        delete errorRef.current[folderId];
        forceRender();
        return data;
      } catch (error) {
        console.error('Unable to load Google Drive folder', folderId, error);
        const fallback = fallbackFolder(folderId);
        cacheRef.current[folderId] = fallback;
        errorRef.current[folderId] = fallback.error;
        forceRender();
        return fallback;
      } finally {
        delete loadingRef.current[folderId];
        forceRender();
      }
    },
    [forceRender]
  );

  const getFolder = useCallback((folderId) => cacheRef.current[folderId] || null, []);
  const isLoading = useCallback((folderId) => Boolean(loadingRef.current[folderId]), []);
  const getError = useCallback((folderId) => errorRef.current[folderId] || null, []);

  return { loadFolder, getFolder, isLoading, getError };
}
