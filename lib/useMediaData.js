import { useEffect, useState } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import {
  FILMS_DATA,
  EPIC_EDITS_DATA,
  getInstagramEmbedUrl,
} from './realMediaData';
import {
  fetchPhotographyData,
  fetchAIAlbumsData,
} from './googleDriveAPI';
import {
  fetchLoremakerData,
} from './googleSheetsAPI';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();
  const [isLoadingAPI, setIsLoadingAPI] = useState(false);

  useEffect(() => {
    const loadMediaData = async () => {
      setIsLoadingAPI(true);

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

      // Check if API key is available
      const hasAPIKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY &&
                        process.env.NEXT_PUBLIC_GOOGLE_API_KEY !== 'your_google_api_key_here';

      console.log('API Key configured:', hasAPIKey ? 'YES' : 'NO');

      // Fetch data from Google APIs - NO FALLBACKS
      let photographyData = { galleries: [] };
      let aiAlbumsData = { galleries: [] };
      let loremakerData = { items: [] };

      if (!hasAPIKey) {
        console.error('❌ GOOGLE API KEY NOT CONFIGURED!');
        console.error('Create .env.local file and add: NEXT_PUBLIC_GOOGLE_API_KEY=your_key_here');
      } else {
        console.log('✅ Fetching data from Google APIs...');

        // Fetch Photography data from Google Drive
        try {
          photographyData = await fetchPhotographyData();
          console.log('✅ Photography:', photographyData.galleries?.length || 0, 'galleries loaded');
        } catch (error) {
          console.error('❌ Failed to fetch Photography:', error);
        }

        // Fetch AI Albums data from Google Drive
        try {
          aiAlbumsData = await fetchAIAlbumsData();
          console.log('✅ AI Albums:', aiAlbumsData.galleries?.length || 0, 'galleries loaded');
        } catch (error) {
          console.error('❌ Failed to fetch AI Albums:', error);
        }

        // Fetch Loremaker data from Google Sheets
        try {
          loremakerData = await fetchLoremakerData();
          console.log('✅ Loremaker:', loremakerData.items?.length || 0, 'characters loaded');
        } catch (error) {
          console.error('❌ Failed to fetch Loremaker:', error);
        }
      }

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
