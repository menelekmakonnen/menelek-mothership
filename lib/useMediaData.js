import { useEffect } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import {
  FILMS_DATA,
  EPIC_EDITS_DATA,
  PHOTOGRAPHY_DATA,
  AI_ALBUMS_DATA,
  LOREMAKER_DATA,
  getInstagramEmbedUrl,
} from './realMediaData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();

  useEffect(() => {
    // Process Epic Edits to add embed URLs and cover images
    const processedEpicEdits = Object.entries(EPIC_EDITS_DATA).reduce((acc, [key, category]) => {
      acc[key] = {
        ...category,
        items: category.items.map(item => ({
          ...item,
          embedUrl: getInstagramEmbedUrl(item.url),
          // Instagram thumbnails - use placeholder or fetch via API
          coverUrl: `https://via.placeholder.com/400x600/1a1a1a/ffffff?text=${encodeURIComponent(category.name)}`,
          thumbnailUrl: `https://via.placeholder.com/200x300/1a1a1a/ffffff?text=${encodeURIComponent(category.name)}`,
          title: `${category.name} - ${item.id}`,
          category: key,
        })),
      };
      return acc;
    }, {});

    // Structure all media data for Galleria
    const mediaData = {
      // Films & Music Videos - Direct grid display
      films: {
        items: FILMS_DATA,
      },

      // Epic Video Edits - Each category is an album
      'video-edits': {
        categories: Object.entries(processedEpicEdits).map(([key, category]) => ({
          id: key,
          name: category.name,
          description: category.description,
          items: category.items,
          coverUrl: category.items[0]?.coverUrl, // Use first item as cover
        })),
      },

      // Photography - Gallery with albums
      photography: PHOTOGRAPHY_DATA,

      // AI Albums - Gallery with albums
      'ai-albums': AI_ALBUMS_DATA,

      // Loremaker Universe - Special character display
      loremaker: LOREMAKER_DATA,
    };

    setMediaData(mediaData);
  }, [setMediaData]);
};
