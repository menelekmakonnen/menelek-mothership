/**
 * Photography Data
 * To add new galleries, simply add objects to the arrays below
 */

export const PHOTOGRAPHY_GALLERIES = [
  // Beauty Galleries
  {
    id: 'beauty-gallery-1',
    name: 'Fashion Editorial',
    description: 'Beauty - Fashion Editorial',
    category: 'Beauty',
    date: '2024-03-15',
    coverUrl: 'https://via.placeholder.com/600x800/6B46C1/ffffff?text=Fashion+Editorial',
    items: [
      {
        id: 'img-1',
        name: 'Fashion Editorial 1',
        url: 'https://via.placeholder.com/1200x1600/6B46C1/ffffff?text=Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/6B46C1/ffffff?text=Image+1',
        type: 'image',
        index: 0,
      },
      // Add more images here
    ],
  },
  {
    id: 'beauty-gallery-2',
    name: 'Portrait Session',
    description: 'Beauty - Portrait Session',
    category: 'Beauty',
    date: '2024-02-20',
    coverUrl: 'https://via.placeholder.com/600x800/9333EA/ffffff?text=Portrait+Session',
    items: [
      {
        id: 'img-1',
        name: 'Portrait Session 1',
        url: 'https://via.placeholder.com/1200x1600/9333EA/ffffff?text=Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/9333EA/ffffff?text=Image+1',
        type: 'image',
        index: 0,
      },
      // Add more images here
    ],
  },

  // Professional Galleries
  {
    id: 'professional-gallery-1',
    name: 'Corporate Event',
    description: 'Professional - Corporate Event',
    category: 'Professional',
    date: '2024-01-10',
    coverUrl: 'https://via.placeholder.com/600x800/EC4899/ffffff?text=Corporate+Event',
    items: [
      {
        id: 'img-1',
        name: 'Corporate Event 1',
        url: 'https://via.placeholder.com/1200x1600/EC4899/ffffff?text=Image+1',
        thumbnailUrl: 'https://via.placeholder.com/600x800/EC4899/ffffff?text=Image+1',
        type: 'image',
        index: 0,
      },
      // Add more images here
    ],
  },
];

// Helper to get photography data in the expected format
export function getPhotographyData() {
  return {
    galleries: PHOTOGRAPHY_GALLERIES,
  };
}
