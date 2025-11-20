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
    // Cover images for Epic Edits categories
    const epicEditsCoverImages = {
      'epic-edits': 'https://i.imgur.com/placeholder-epic.jpg', // High-energy VFX aesthetic
      'beauty-travel': 'https://i.imgur.com/placeholder-beauty.jpg', // Soft aesthetic
      'bts': 'https://i.imgur.com/placeholder-bts.jpg', // Documentary style
      'ai-learning': 'https://i.imgur.com/placeholder-ai.jpg', // Professional educator
    };

    // Process Epic Edits to add embed URLs and cover images
    const processedEpicEdits = Object.entries(EPIC_EDITS_DATA).reduce((acc, [key, category]) => {
      acc[key] = {
        ...category,
        items: category.items.map((item, index) => ({
          ...item,
          embedUrl: getInstagramEmbedUrl(item.url),
          title: `${category.name} ${index + 1}`,
          category: key,
          name: `${category.name} ${index + 1}`,
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
          coverUrl: epicEditsCoverImages[key] || null, // Use category-specific cover
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
