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
            <span className="text-xs uppercase tracking-[0.3em] text-white/70">Menelek Makonnen — The Galleria</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white">Full-frame access to every world you build.</h1>
          <p className="text-secondary max-w-3xl">The home page <span className="text-white font-semibold">is</span> the galleria. Every vertical cover is a live portal that pulls fresh imagery on load, keeping the shell cinematic while respecting the 9:16 framing.</p>
          <div className="flex flex-wrap gap-3 text-xs text-white/70 uppercase tracking-[0.2em]">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Left/Right arrows cycle categories</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Tap any cover to enter its gallery</span>
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">HUD always floats above media</span>
          </div>
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
                      <Sparkle size={14} /> {category.type === 'gallery' ? 'Multi-Level' : 'Direct'}
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
                      <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">9:16 ready</span>
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

        <div className="glass border border-glass-border/80 rounded-2xl p-6 flex flex-wrap gap-4 items-center justify-between text-sm text-secondary">
          <div className="flex items-center gap-3 text-white">
            <div className="w-10 h-10 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center">
              <Sparkle size={18} className="text-accent" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/60">Always Live</p>
              <p className="text-base text-white">Fresh cover pulls keep the home grid evolving with your latest uploads.</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {MEDIA_CATEGORIES.map((category) => (
              <span
                key={`chip-${category.id}`}
                className={`px-3 py-2 rounded-full border text-xs uppercase tracking-[0.18em] ${
                  category.id === activeCategoryId ? 'border-accent text-accent bg-accent/15' : 'border-white/10 text-white/70 bg-white/5'
                }`}
              >
                {category.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
