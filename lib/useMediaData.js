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
} from './googleSheetsGViz';

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

      // Check if API key is available
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      const hasAPIKey = apiKey && apiKey.length > 20;

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

      let photographyData = { galleries: [] };
      let aiAlbumsData = { galleries: [] };
      let loremakerData = { items: [] };

      // Fetch Loremaker data (GViz - no API key needed!)
      console.log('🔍 Loremaker: Using GViz (no API key required)');
      try {
        loremakerData = await fetchLoremakerData();
        console.log('✅ Loremaker:', loremakerData.items?.length || 0, 'characters with images\n');
      } catch (error) {
        console.error('❌ Loremaker error:', error.message);
      }

      // Fetch Photography and AI Albums (requires API key)
      if (!hasAPIKey) {
        console.error('\n❌ GOOGLE API KEY MISSING!');
        console.error('========================================');
        console.error('Photography and AI Albums need an API key');
        console.error('');
        console.error('Quick Setup (2 minutes):');
        console.error('1. Go to: https://console.cloud.google.com/apis/credentials');
        console.error('2. Create API Key');
        console.error('3. Create file: .env.local');
        console.error('4. Add line: NEXT_PUBLIC_GOOGLE_API_KEY=your_key_here');
        console.error('5. Restart server (Ctrl+C then npm run dev)');
        console.error('========================================\n');
      } else {
        console.log('🔍 Photography & AI Albums: Using Drive API\n');

        // Fetch Photography data
        try {
          photographyData = await fetchPhotographyData();
          console.log('✅ Photography:', photographyData.galleries?.length || 0, 'galleries');
        } catch (error) {
          console.error('❌ Photography error:', error.message);
        }

        // Fetch AI Albums data
        try {
          aiAlbumsData = await fetchAIAlbumsData();
          console.log('✅ AI Albums:', aiAlbumsData.galleries?.length || 0, 'galleries');
        } catch (error) {
          console.error('❌ AI Albums error:', error.message);
        }
      }

      console.log('\n✅ Films:', FILMS_DATA.length, 'videos');
      console.log('✅ Epic Edits:', Object.keys(processedEpicEdits).length, 'categories');
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
