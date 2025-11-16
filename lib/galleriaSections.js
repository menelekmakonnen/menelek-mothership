import {
  Camera,
  Film,
  BookOpen,
  Brain,
  Video,
  Image as ImageIcon,
  GalleryHorizontalEnd,
} from 'lucide-react';

export const GALLERIA_SECTIONS = {
  photography: {
    title: 'Photography',
    description: 'MMM Media beauty, travel, and professional shoots streamed from Drive.',
    icon: Camera,
    accent: 'from-emerald-500/70 via-teal-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80',
  },
  'ai-albums': {
    title: 'AI Albums',
    description: 'Custom diffusion explorations, prompts, and conceptual artboards.',
    icon: ImageIcon,
    accent: 'from-fuchsia-500/70 via-rose-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=80',
  },
  films: {
    title: 'Films & Music Videos',
    description: 'Narrative features, shorts, and commissioned music films.',
    icon: Film,
    accent: 'from-amber-500/70 via-orange-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1400&q=80',
  },
  'video-edits': {
    title: 'Epic Video Edits',
    description: 'High-energy reels parsed directly from Instagram and YouTube.',
    icon: Video,
    accent: 'from-indigo-500/70 via-purple-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=80',
  },
  loremaker: {
    title: 'Loremaker Universe',
    description: 'Living character bible pulled from the online spreadsheet.',
    icon: BookOpen,
    accent: 'from-cyan-500/70 via-blue-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=80',
  },
  'ai-projects': {
    title: 'AI Projects',
    description: 'Interactive demos and prompts across workshops and starterclasses.',
    icon: Brain,
    accent: 'from-sky-500/70 via-cyan-500/70 to-slate-900/90',
    previewImage:
      'https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1400&q=80',
  },
};

export const getGalleriaSectionDetail = (id) => {
  if (!id) {
    return {
      title: 'Galleria',
      description: 'Viewport-wide gallery experiences.',
      icon: GalleryHorizontalEnd,
      accent: 'from-slate-600/80 via-slate-700/80 to-slate-900/90',
    };
  }
  return GALLERIA_SECTIONS[id] || {
    title: id,
    description: 'Viewport-wide gallery experiences.',
    icon: GalleryHorizontalEnd,
    accent: 'from-slate-600/80 via-slate-700/80 to-slate-900/90',
  };
};
