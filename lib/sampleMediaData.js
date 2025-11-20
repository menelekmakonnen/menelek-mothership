// Media data for Menelek Makonnen portfolio
// Uses curated vertical artwork so covers stay premium and never leak raw storage links

import { FILMS_DATA, EPIC_EDITS_DATA } from './realMediaData';

const portrait = (seed) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1200&q=85&h=1600`;

const BEAUTY_FRAMES = [
  'photo-1524504388940-b1c1722653e1',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517245386807-bb43f82c33c4',
  'photo-1529626455594-4ff0802cfb7e',
  'photo-1524504388940-b1c1722653e1',
  'photo-1517841905240-472988babdf9',
  'photo-1524504388940-b1c1722653e1',
  'photo-1494790108377-be9c29b29330',
].map((id, idx) => ({
  id: `beauty-${idx + 1}`,
  name: `Beauty Frame ${idx + 1}`,
  url: portrait(id),
  thumbnailUrl: portrait(id),
  type: 'image',
}));

const PROFESSIONAL_FRAMES = [
  'photo-1521737604893-d14cc237f11d',
  'photo-1545239351-1141bd82e8a6',
  'photo-1478720568477-152d9b164e26',
  'photo-1511578314322-379afb476865',
  'photo-1517244933000-3f714985bba3',
  'photo-1515165562835-c7d28bab669e',
  'photo-1517245386807-bb43f82c33c4',
  'photo-1478720568477-152d9b164e26',
].map((id, idx) => ({
  id: `pro-${idx + 1}`,
  name: `Event Frame ${idx + 1}`,
  url: portrait(id),
  thumbnailUrl: portrait(id),
  type: 'image',
}));

const AI_FRAMES = [
  'photo-1509475826633-fed577a2c71b',
  'photo-1469474968028-56623f02e42e',
  'photo-1469474968028-56623f02e42e',
  'photo-1494790108377-be9c29b29330',
  'photo-1521572267360-ee0c2909d518',
  'photo-1529665253569-6d01c0eaf7b6',
  'photo-1521572163474-6864f9cf17ab',
].map((id, idx) => ({
  id: `ai-${idx + 1}`,
  title: `AI Creation ${idx + 1}`,
  url: portrait(id),
  thumbnailUrl: portrait(id),
  type: 'image',
}));

const CONCEPT_FRAMES = [
  'photo-1444065381814-865dc9da92c0',
  'photo-1444047427283-88a67f631b3a',
  'photo-1469474968028-56623f02e42e',
  'photo-1521572267360-ee0c2909d518',
  'photo-1521572163474-6864f9cf17ab',
].map((id, idx) => ({
  id: `concept-${idx + 1}`,
  title: `Concept Frame ${idx + 1}`,
  url: portrait(id),
  thumbnailUrl: portrait(id),
  type: 'image',
}));

const EDIT_COVERS = [
  portrait('photo-1500530855697-b586d89ba3ee'),
  portrait('photo-1500530855697-b586d89ba3ee'),
  portrait('photo-1500530855697-b586d89ba3ee'),
  portrait('photo-1469474968028-56623f02e42e'),
];

export const SAMPLE_MEDIA_DATA = {
  photography: {
    galleries: [
      {
        id: 'beauty',
        name: 'Beauty Shoots',
        coverUrl: BEAUTY_FRAMES[0].url,
        itemCount: BEAUTY_FRAMES.length,
        items: BEAUTY_FRAMES,
      },
      {
        id: 'professional',
        name: 'Professional Events',
        coverUrl: PROFESSIONAL_FRAMES[0].url,
        itemCount: PROFESSIONAL_FRAMES.length,
        items: PROFESSIONAL_FRAMES,
      },
    ],
  },
  'ai-albums': {
    galleries: [
      {
        id: 'ai-portraits',
        name: 'AI Portraits',
        coverUrl: AI_FRAMES[0].url,
        itemCount: AI_FRAMES.length,
        items: AI_FRAMES,
      },
      {
        id: 'concept-art',
        name: 'Concept Art',
        coverUrl: CONCEPT_FRAMES[0].url,
        itemCount: CONCEPT_FRAMES.length,
        items: CONCEPT_FRAMES,
      },
    ],
  },
  films: {
    items: FILMS_DATA.map((film) => ({
      ...film,
      thumbnailUrl: film.coverUrl,
      type: 'video',
    })),
  },
  'video-edits': {
    categories: Object.keys(EPIC_EDITS_DATA).map((key, idx) => {
      const category = EPIC_EDITS_DATA[key];
      const coverUrl = EDIT_COVERS[idx % EDIT_COVERS.length];

      return {
        id: key,
        name: category.name,
        description: category.description,
        coverUrl,
        itemCount: category.items.length,
        items: category.items.map((item, itemIdx) => ({
          id: `${key}-${itemIdx}`,
          name: `${category.name} Cut ${itemIdx + 1}`,
          url: coverUrl,
          thumbnailUrl: coverUrl,
          coverUrl,
          type: 'image',
        })),
      };
    }),
  },
  loremaker: {
    characters: [
      {
        id: 'char-1',
        name: 'Aria Nightshade',
        coverUrl: portrait('photo-1544005313-94ddf0286df2'),
        role: 'Shadow Mage',
        url: 'https://loremaker.cloud/characters/aria-nightshade',
      },
      {
        id: 'char-2',
        name: 'Kael Stormborn',
        coverUrl: portrait('photo-1506794778202-cad84cf45f1d'),
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
