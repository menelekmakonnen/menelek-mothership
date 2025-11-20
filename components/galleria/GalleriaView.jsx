import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { Camera, Sparkles, Film, Video, Palette, Sparkle } from 'lucide-react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

const CATEGORY_GRADIENTS = {
  photography: 'from-purple-600/30 via-pink-600/30 to-red-600/30',
  'ai-albums': 'from-cyan-600/30 via-blue-600/30 to-purple-600/30',
  films: 'from-amber-600/30 via-orange-600/30 to-red-600/30',
  'video-edits': 'from-green-600/30 via-emerald-600/30 to-teal-600/30',
  loremaker: 'from-rose-600/30 via-fuchsia-600/30 to-violet-600/30',
};

export default function GalleriaView({ isHomePage }) {
  const { enterGallery, currentCategory, mediaData } = useGalleriaContext();

  const selectRandom = (items = []) => {
    if (!items.length) return null;
    return items[Math.floor(Math.random() * items.length)];
  };

  const categoryCovers = useMemo(() => {
    const covers = {};

    MEDIA_CATEGORIES.forEach((category) => {
      if (category.id === 'photography' || category.id === 'ai-albums') {
        const galleries = mediaData?.[category.id]?.galleries || [];
        const chosenGallery = selectRandom(galleries);
        const chosenItem = selectRandom(chosenGallery?.items || []);
        covers[category.id] = chosenItem?.thumbnailUrl || chosenItem?.url || chosenGallery?.coverUrl;
      } else if (category.id === 'films') {
        const chosenFilm = selectRandom(mediaData?.films?.items || []);
        covers[category.id] = chosenFilm?.coverUrl;
      } else if (category.id === 'video-edits') {
        const categories = mediaData?.['video-edits']?.categories || [];
        const chosenCategory = selectRandom(categories);
        const chosenItem = selectRandom(chosenCategory?.items || []);
        covers[category.id] = chosenItem?.coverUrl || chosenCategory?.coverUrl;
      } else if (category.id === 'loremaker') {
        const chosenCharacter = selectRandom(mediaData?.loremaker?.characters || []);
        covers[category.id] = chosenCharacter?.coverUrl;
      }
    });

    return covers;
  }, [mediaData]);

  const activeCategoryId = currentCategory?.id || MEDIA_CATEGORIES[0].id;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
            <span
              style={{
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Menelek Makonnen
            </span>
          </h1>
          <p className="text-secondary text-sm md:text-base">
            Filmmaker • Creative Director • AI Educator • Photographer • Worldbuilder
          </p>
        </motion.div>

        {/* Category Grid - Centered and fits on screen */}
        <div className="flex-1 flex items-center justify-center pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 max-w-6xl">
            {MEDIA_CATEGORIES.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.id];
              const gradient = CATEGORY_GRADIENTS[category.id];
              const cover = categoryCovers[category.id];
              const isActive = category.id === activeCategoryId;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => enterGallery(category)}
                  className="group cursor-pointer"
                >
                  {/* Portrait Cover */}
                  <div
                    className={`relative aspect-[9/16] rounded-xl lg:rounded-2xl overflow-hidden glass border border-glass-border transition-all duration-500 ${
                      isActive ? 'ring-2 ring-accent shadow-[0_20px_60px_-25px_var(--accent-glow)]' : 'hover:ring-2 hover:ring-accent/80'
                    }`}
                  >
                    <div className="absolute inset-0">
                      {cover ? (
                        <img
                          src={cover}
                          alt={`${category.name} cover`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                    </div>

                    {/* Icon + label */}
                    <div className="absolute inset-0 flex flex-col justify-between p-3 lg:p-4">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-white/80">
                        <span className="flex items-center gap-2">
                          <Sparkle size={14} /> Vision Mode
                        </span>
                        <span>{category.type === 'gallery' ? 'Multi-level' : 'Direct'}</span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <motion.div
                            whileHover={{ scale: 1.08 }}
                            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20"
                          >
                            <Icon size={28} className="text-white" />
                          </motion.div>
                          <div>
                            <h3 className="text-base lg:text-lg font-bold text-white drop-shadow-md">{category.name}</h3>
                            <p className="text-xs text-white/70">Premium {category.type === 'gallery' ? 'albums' : 'reels'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-white/70">
                          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
                            {isActive ? 'Active Category' : 'Ready to Explore'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/50">9:16</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow */}
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        background: 'radial-gradient(circle at center, var(--accent-glow), transparent 70%)',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
