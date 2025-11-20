import { useEffect, useState } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import {
  FILMS_DATA,
  EPIC_EDITS_DATA,
  getInstagramEmbedUrl,
} from './realMediaData';
import { getPhotographyData } from './photographyData';
import { getAIAlbumsData } from './aiAlbumsData';
import { getLoremakerData } from './loremakerData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    const loadMediaData = async () => {
      setIsLoadingAPI(true);

      console.log('\n========================================');
      console.log('📦 LOADING MEDIA DATA');
      console.log('========================================\n');

      // Cover images for Epic Edits categories
      const epicEditsCoverImages = {
        'epic-edits': 'https://i.imgur.com/placeholder-epic.jpg',
        'beauty-travel': 'https://i.imgur.com/placeholder-beauty.jpg',
        'bts': 'https://i.imgur.com/placeholder-bts.jpg',
        'ai-learning': 'https://i.imgur.com/placeholder-ai.jpg',
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

      // Load data from static files
      const photographyData = getPhotographyData();
      const aiAlbumsData = getAIAlbumsData();
      const loremakerData = getLoremakerData();

      console.log('✅ Films:', FILMS_DATA.length, 'videos loaded');
      console.log('✅ Epic Edits:', Object.keys(processedEpicEdits).length, 'categories loaded');
      console.log('✅ Photography:', photographyData.galleries?.length || 0, 'galleries loaded');
      console.log('✅ AI Albums:', aiAlbumsData.galleries?.length || 0, 'galleries loaded');
      console.log('✅ Loremaker:', loremakerData.items?.length || 0, 'characters loaded');
      console.log('\n📝 To update media:');
      console.log('- Photography: Edit lib/photographyData.js');
      console.log('- AI Albums: Edit lib/aiAlbumsData.js');
      console.log('- Loremaker: Edit lib/loremakerData.js');
      console.log('========================================\n');

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
            coverUrl: epicEditsCoverImages[key] || null,
          })),
        },

        // Photography - From Google Drive or static fallback
        photography: photographyData,

        // AI Albums - From Google Drive or static fallback
        'ai-albums': aiAlbumsData,

        // Loremaker Universe - From Google Sheets or static fallback
        loremaker: loremakerData,
      };

      setMediaData(mediaData);
      setIsLoadingAPI(false);
    };

    loadMediaData();
  }, [setMediaData]);

  return { isLoadingAPI };
};
