import { useCallback, useRef, useState } from 'react';

export default function useDriveFolderCache() {
  const cacheRef = useRef({});
  const loadingRef = useRef({});
  const errorRef = useRef({});
  const [, setTick] = useState(0);

  const forceRender = useCallback(() => setTick((value) => value + 1), []);

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
        const fallback = { id: folderId, items: [], error: error.message || 'Unable to load folder' };
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
