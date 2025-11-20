// Media data for Menelek Makonnen portfolio
// Photography and AI Albums will be loaded from Google Drive
// Loremaker will be loaded from Google Sheets

import { FILMS_DATA, EPIC_EDITS_DATA, GOOGLE_DRIVE_FOLDERS } from './realMediaData';

const driveThumb = (id, size = 'w1200') => `https://lh3.googleusercontent.com/d/${id}=${size}`;

export const SAMPLE_MEDIA_DATA = {
  photography: {
    galleries: [
      {
        id: 'beauty',
        name: 'Beauty Shoots',
        coverUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w1200'),
        itemCount: 12,
        externalUrl: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
        items: Array.from({ length: 8 }).map((_, idx) => ({
          id: `beauty-${idx + 1}`,
          name: `Beauty Frame ${idx + 1}`,
          url: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w1600'),
          thumbnailUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w700'),
          type: 'image',
        })),
      },
      {
        id: 'professional',
        name: 'Professional Events',
        coverUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w1200'),
        itemCount: 14,
        externalUrl: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
        items: Array.from({ length: 8 }).map((_, idx) => ({
          id: `pro-${idx + 1}`,
          name: `Pro Frame ${idx + 1}`,
          url: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w1600'),
          thumbnailUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.photography.main, 'w700'),
          type: 'image',
        })),
      },
    ],
  },
  'ai-albums': {
    galleries: [
      {
        id: 'ai-portraits',
        name: 'AI Portraits',
        coverUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w1200'),
        itemCount: 20,
        externalUrl: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
        items: Array.from({ length: 9 }).map((_, idx) => ({
          id: `ai-${idx + 1}`,
          title: `AI Creation ${idx + 1}`,
          url: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w1600'),
          thumbnailUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w700'),
          type: 'image',
        })),
      },
      {
        id: 'concept-art',
        name: 'Concept Art',
        coverUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w1200'),
        itemCount: 15,
        externalUrl: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
        items: Array.from({ length: 7 }).map((_, idx) => ({
          id: `concept-${idx + 1}`,
          title: `Concept Frame ${idx + 1}`,
          url: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w1600'),
          thumbnailUrl: driveThumb(GOOGLE_DRIVE_FOLDERS.aiAlbums.main, 'w700'),
          type: 'image',
        })),
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
    categories: Object.keys(EPIC_EDITS_DATA).map(key => {
      const category = EPIC_EDITS_DATA[key];
      const coverSeed = category.items[0]?.url;
      const coverUrl = coverSeed
        ? `https://v1.screenshot.11ty.dev/${encodeURIComponent(coverSeed)}/opengraph/`
        : undefined;

      return {
        id: key,
        name: category.name,
        description: category.description,
        coverUrl,
        itemCount: category.items.length,
        items: category.items.map(item => ({
          ...item,
          thumbnailUrl: `https://v1.screenshot.11ty.dev/${encodeURIComponent(item.url)}/opengraph/`,
          coverUrl: `https://v1.screenshot.11ty.dev/${encodeURIComponent(item.url)}/opengraph/`,
          type: 'video',
        })),
      };
    }),
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
