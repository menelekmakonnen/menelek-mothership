/**
 * AI Albums Data
 * To add new albums, simply add objects to the array below
 */

export const AI_ALBUMS_GALLERIES = [
  {
    id: 'ai-album-1',
    name: 'Cyberpunk Dreams',
    description: 'AI-generated album: Cyberpunk Dreams',
    coverUrl: 'https://via.placeholder.com/600x800/8B5CF6/ffffff?text=Cyberpunk+Dreams',
    items: [
      {
        id: 'ai-img-1',
        name: 'Cyberpunk Dreams 1',
        url: 'https://via.placeholder.com/1200x1600/8B5CF6/ffffff?text=AI+Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/8B5CF6/ffffff?text=AI+Image+1',
        type: 'image',
        index: 0,
      },
      {
        id: 'ai-img-2',
        name: 'Cyberpunk Dreams 2',
        url: 'https://via.placeholder.com/1200x1600/8B5CF6/ffffff?text=AI+Image+2',
        thumbnailUrl: 'https://via.placeholder.com/600x800/8B5CF6/ffffff?text=AI+Image+2',
        type: 'image',
        index: 1,
      },
      // Add more images here
    ],
  },
  {
    id: 'ai-album-2',
    name: 'Fantasy Realms',
    description: 'AI-generated album: Fantasy Realms',
    coverUrl: 'https://via.placeholder.com/600x800/A855F7/ffffff?text=Fantasy+Realms',
    items: [
      {
        id: 'ai-img-1',
        name: 'Fantasy Realms 1',
        url: 'https://via.placeholder.com/1200x1600/A855F7/ffffff?text=AI+Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/A855F7/ffffff?text=AI+Image+1',
        type: 'image',
        index: 0,
      },
      {
        id: 'ai-img-2',
        name: 'Fantasy Realms 2',
        url: 'https://via.placeholder.com/1200x1600/A855F7/ffffff?text=AI+Image+2',
        thumbnailUrl: 'https://via.placeholder.com/600x800/A855F7/ffffff?text=AI+Image+2',
        type: 'image',
        index: 1,
      },
      // Add more images here
    ],
  },
  {
    id: 'ai-album-3',
    name: 'Sci-Fi Visions',
    description: 'AI-generated album: Sci-Fi Visions',
    coverUrl: 'https://via.placeholder.com/600x800/C084FC/ffffff?text=Sci-Fi+Visions',
    items: [
      {
        id: 'ai-img-1',
        name: 'Sci-Fi Visions 1',
        url: 'https://via.placeholder.com/1200x1600/C084FC/ffffff?text=AI+Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/C084FC/ffffff?text=AI+Image+1',
        type: 'image',
        index: 0,
      },
      // Add more images here
    ],
  },
];

// Helper to get AI albums data in the expected format
export function getAIAlbumsData() {
  return {
    galleries: AI_ALBUMS_GALLERIES,
  };
}
