import { motion } from 'framer-motion';
import { Sparkle, Camera, Sparkles, Film, Video, Palette, ArrowRight } from 'lucide-react';
import { useMemo } from 'react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

const CATEGORY_GRADIENTS = {
  photography: 'from-purple-700/60 via-fuchsia-700/40 to-rose-700/50',
  'ai-albums': 'from-cyan-600/60 via-blue-700/50 to-indigo-700/50',
  films: 'from-amber-600/60 via-orange-700/60 to-red-700/40',
  'video-edits': 'from-emerald-600/50 via-green-700/50 to-teal-700/40',
  loremaker: 'from-pink-600/50 via-rose-700/60 to-purple-700/50',
};

const selectRandom = (items = []) => {
  if (!items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
};

export default function GalleriaView() {
  const { currentCategory, enterGallery, mediaData } = useGalleriaContext();

  const cards = useMemo(() => {
    return MEDIA_CATEGORIES.map((category) => {
      let cover = null;
      let countLabel = '';

      if (category.id === 'photography' || category.id === 'ai-albums') {
        const galleries = mediaData?.[category.id]?.galleries || [];
        const chosenGallery = selectRandom(galleries);
        const chosenItem = selectRandom(chosenGallery?.items || []);
        cover = chosenItem?.thumbnailUrl || chosenItem?.url || chosenGallery?.coverUrl;
        countLabel = `${galleries.length || 0} folders`;
      } else if (category.id === 'films') {
        const films = mediaData?.films?.items || [];
        const chosenFilm = selectRandom(films);
        cover = chosenFilm?.coverUrl;
        countLabel = `${films.length || 0} titles`;
      } else if (category.id === 'video-edits') {
        const editCats = mediaData?.['video-edits']?.categories || [];
        const chosenCategory = selectRandom(editCats);
        const chosenItem = selectRandom(chosenCategory?.items || []);
        cover = chosenItem?.coverUrl || chosenCategory?.coverUrl;
        countLabel = `${editCats.length || 0} reels`; 
      } else if (category.id === 'loremaker') {
        const characters = mediaData?.loremaker?.characters || [];
        const chosenCharacter = selectRandom(characters);
        cover = chosenCharacter?.coverUrl;
        countLabel = `${characters.length || 0} characters`;
      }

      return {
        ...category,
        cover,
        countLabel,
      };
    });
  }, [mediaData]);

  const activeCategoryId = currentCategory?.id || MEDIA_CATEGORIES[0].id;

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur">
            <Sparkle size={14} className="text-accent" />
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">Menelek Makonnen</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Enter the work. Every discipline, instantly.</h1>
          <p className="text-secondary max-w-3xl">Pick a cover to move directly into photography, AI albums, films, edits, or the Loremaker universe. Live Google Drive covers and sheet-fed characters keep each tile anchored in real projects.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
          {cards.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            const isActive = category.id === activeCategoryId;
            const gradient = CATEGORY_GRADIENTS[category.id];

            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.01 }}
                onClick={() => enterGallery(category)}
                className={`relative group aspect-[9/16] rounded-3xl overflow-hidden border glass-strong text-left transition-all duration-300 ${
                  isActive ? 'ring-2 ring-accent shadow-[0_20px_50px_-22px_var(--accent-glow)]' : 'hover:ring-2 hover:ring-accent/60'
                }`}
              >
                <div className="absolute inset-0">
                  {category.cover ? (
                    <img src={category.cover} alt={`${category.name} cover`} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/65 to-transparent" />
                </div>

                <div className="absolute inset-0 p-4 flex flex-col justify-between">
                  <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/70">
                    <span className="flex items-center gap-2">
                      <Sparkle size={14} /> {category.type === 'gallery' ? 'Gallery' : 'Reel Deck'}
                    </span>
                    <span>{category.countLabel}</span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 backdrop-blur flex items-center justify-center">
                        <Icon size={26} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/70">{category.type === 'gallery' ? 'Gallery' : 'Reels'}</p>
                        <h2 className="text-xl font-bold text-white leading-tight">{category.name}</h2>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">Immersive view</span>
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/50">
                        Enter
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
