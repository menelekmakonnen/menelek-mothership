import { useEffect, useState } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    const loadMediaData = async () => {
      setIsLoadingAPI(true);

      try {
        const response = await fetch('/api/media');
        if (!response.ok) {
          throw new Error(`Media API responded with ${response.status}`);
        }

        const mediaData = await response.json();
        setMediaData(mediaData);
      } catch (error) {
        console.error('❌ Failed to load media data:', error);
        setMediaData({
          films: { items: [] },
          'video-edits': { categories: [] },
          photography: { galleries: [] },
          'ai-albums': { galleries: [] },
          loremaker: { items: [] },
        });
      } finally {
        setIsLoadingAPI(false);
      }
    };

    loadMediaData();
  }, [setMediaData]);

  return { isLoadingAPI };
};
