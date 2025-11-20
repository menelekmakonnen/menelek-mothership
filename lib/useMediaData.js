import { useEffect, useState } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import {
  FILMS_DATA,
  EPIC_EDITS_DATA,
  PHOTOGRAPHY_DATA,
  AI_ALBUMS_DATA,
  LOREMAKER_DATA,
  getInstagramEmbedUrl,
} from './realMediaData';
import {
  fetchPhotographyData,
  fetchAIAlbumsData,
  getPhotographyFallbackData,
} from './googleDriveAPI';
import {
  fetchLoremakerData,
  getLoremakerFallbackData,
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

      // Fetch data from Google APIs with fallbacks
      let photographyData = PHOTOGRAPHY_DATA;
      let aiAlbumsData = AI_ALBUMS_DATA;
      let loremakerData = LOREMAKER_DATA;

      // Check if API key is available
      const hasAPIKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY &&
                        process.env.NEXT_PUBLIC_GOOGLE_API_KEY !== 'your_google_api_key_here';

      if (hasAPIKey) {
        try {
          // Fetch Photography data from Google Drive
          const fetchedPhotography = await fetchPhotographyData();
          if (fetchedPhotography.galleries && fetchedPhotography.galleries.length > 0) {
            photographyData = fetchedPhotography;
          }
        } catch (error) {
          console.warn('Failed to fetch Photography data, using fallback:', error);
        }

        try {
          // Fetch AI Albums data from Google Drive
          const fetchedAIAlbums = await fetchAIAlbumsData();
          if (fetchedAIAlbums.galleries && fetchedAIAlbums.galleries.length > 0) {
            aiAlbumsData = fetchedAIAlbums;
          }
        } catch (error) {
          console.warn('Failed to fetch AI Albums data, using fallback:', error);
        }

        try {
          // Fetch Loremaker data from Google Sheets
          const fetchedLoremaker = await fetchLoremakerData();
          if (fetchedLoremaker.items && fetchedLoremaker.items.length > 0) {
            loremakerData = fetchedLoremaker;
          }
        } catch (error) {
          console.warn('Failed to fetch Loremaker data, using fallback:', error);
        }
      } else {
        console.warn('Google API key not configured. Using static data. Please add NEXT_PUBLIC_GOOGLE_API_KEY to .env.local');
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
