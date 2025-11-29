// Media data for Menelek Makonnen portfolio
// Photography and AI Albums will be loaded from Google Drive
// Loremaker will be loaded from Google Sheets

import { FILMS_DATA, EPIC_EDITS_DATA } from './realMediaData';

export const SAMPLE_MEDIA_DATA = {
  photography: {
    galleries: [
      {
        id: 'beauty',
        name: 'Beauty',
        coverUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=700&fit=crop',
        itemCount: 12,
        items: [
          {
            id: 'beauty-1',
            name: 'Portrait 1',
            url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=600&fit=crop',
            type: 'image',
          },
          {
            id: 'beauty-2',
            name: 'Portrait 2',
            url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop',
            type: 'image',
          },
          {
            id: 'beauty-3',
            name: 'Portrait 3',
            url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=600&fit=crop',
            type: 'image',
          },
        ],
      },
      {
        id: 'portraits',
        name: 'Portraits',
        coverUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=700&fit=crop',
        itemCount: 8,
        items: [
          {
            id: 'portrait-1',
            name: 'Portrait 1',
            url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop',
            type: 'image',
          },
          {
            id: 'portrait-2',
            name: 'Portrait 2',
            url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop',
            type: 'image',
          },
        ],
      },
      {
        id: 'landscapes',
        name: 'Landscapes',
        coverUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=700&fit=crop',
        itemCount: 15,
        items: [
          {
            id: 'landscape-1',
            name: 'Mountain Vista',
            url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=800&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop',
            type: 'image',
          },
        ],
      },
    ],
  },
  'ai-albums': {
    galleries: [
      {
        id: 'ai-portraits',
        name: 'AI Portraits',
        coverUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=700&fit=crop',
        itemCount: 20,
        items: [
          {
            id: 'ai-1',
            title: 'Digital Dream',
            url: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?w=400&h=600&fit=crop',
            type: 'image',
          },
        ],
      },
      {
        id: 'concept-art',
        name: 'Concept Art',
        coverUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=700&fit=crop',
        itemCount: 15,
        items: [
          {
            id: 'concept-1',
            title: 'Future City',
            url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=1200&fit=crop',
            thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&h=600&fit=crop',
            type: 'image',
          },
        ],
      },
    ],
  },
  films: {
    items: FILMS_DATA.map(film => ({
      ...film,
      thumbnailUrl: film.coverUrl,
    })),
  },
  'video-edits': {
    categories: Object.keys(EPIC_EDITS_DATA).map(key => ({
      id: key,
      name: EPIC_EDITS_DATA[key].name,
      description: EPIC_EDITS_DATA[key].description,
      coverUrl: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=700&fit=crop`, // Placeholder
      itemCount: EPIC_EDITS_DATA[key].items.length,
      items: EPIC_EDITS_DATA[key].items.map(item => ({
        ...item,
        thumbnailUrl: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&h=600&fit=crop`, // Placeholder
        coverUrl: `https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=1200&fit=crop`, // Placeholder
        type: 'video',
      })),
    })),
  },
  loremaker: {
    characters: [
      {
        id: 'char-1',
        name: 'Aria Nightshade',
        coverUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=700&fit=crop',
        role: 'Shadow Mage',
        url: 'https://loremaker.cloud/characters/aria-nightshade',
      },
      {
        id: 'char-2',
        name: 'Kael Stormborn',
        coverUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=700&fit=crop',
        role: 'Storm Warden',
        url: 'https://loremaker.cloud/characters/kael-stormborn',
      },
    ],
  },
};

// Utility to get random cover image from a folder
export const getRandomCover = (items) => {
  if (!items || items.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * items.length);
  return items[randomIndex].coverUrl || items[randomIndex].url || items[randomIndex].thumbnailUrl;
};
