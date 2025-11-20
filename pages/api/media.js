import { FILMS_DATA, EPIC_EDITS_DATA, getInstagramEmbedUrl } from '@/lib/realMediaData';
import {
  fetchPhotographyData,
  fetchAIAlbumsData,
} from '@/lib/googleDriveAPI';
import { fetchLoremakerData } from '@/lib/googleSheetsAPI';

// Build consistent payload matching the shape the client expects
async function buildMediaPayload() {
  // Cover images for Epic Edits categories
  const epicEditsCoverImages = {
    'epic-edits': 'https://i.imgur.com/placeholder-epic.jpg',
    'beauty-travel': 'https://i.imgur.com/placeholder-beauty.jpg',
    bts: 'https://i.imgur.com/placeholder-bts.jpg',
    'ai-learning': 'https://i.imgur.com/placeholder-ai.jpg',
  };

  // Process Epic Edits to add embed URLs and cover images
  const processedEpicEdits = Object.entries(EPIC_EDITS_DATA).reduce(
    (acc, [key, category]) => {
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
    },
    {}
  );

  // Fetch Photography data from Google Drive
  let photographyData = { galleries: [] };
  try {
    photographyData = await fetchPhotographyData();
  } catch (error) {
    console.error('❌ Photography error:', error.message);
  }

  // Fetch AI Albums data from Google Drive
  let aiAlbumsData = { galleries: [] };
  try {
    aiAlbumsData = await fetchAIAlbumsData();
  } catch (error) {
    console.error('❌ AI Albums error:', error.message);
  }

  // Fetch Loremaker data from Google Sheets
  let loremakerData = { items: [] };
  try {
    loremakerData = await fetchLoremakerData();
  } catch (error) {
    console.error('❌ Loremaker error:', error.message);
  }

  return {
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

    // Photography - From Google Drive
    photography: photographyData,

    // AI Albums - From Google Drive
    'ai-albums': aiAlbumsData,

    // Loremaker Universe - From Google Sheets
    loremaker: loremakerData,
  };
}

export default async function handler(req, res) {
  try {
    const mediaData = await buildMediaPayload();

    // Cache lightly to avoid hammering Drive/Sheets
    res.setHeader('Cache-Control', 's-maxage=900, stale-while-revalidate');
    res.status(200).json(mediaData);
  } catch (error) {
    console.error('❌ Media API error:', error);
    res.status(500).json({ error: 'Failed to load media data' });
  }
}
