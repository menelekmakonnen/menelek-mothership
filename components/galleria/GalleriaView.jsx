import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { Camera, Sparkles, Film, Video, Palette, Sparkle, ExternalLink } from 'lucide-react';
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

export default function GalleriaView() {
  const { enterGallery, currentCategory, mediaData } = useGalleriaContext();
  const [titleIndex, setTitleIndex] = useState(0);

  const personaTitles = [
    'Filmmaker',
    'Creative Director',
    'AI Educator',
    'Photographer',
    'Worldbuilder',
    'Lore Architect',
  ];

  useEffect(() => {
    const id = setInterval(() => {
      setTitleIndex(prev => (prev + 1) % personaTitles.length);
    }, 2400);

    return () => clearInterval(id);
  }, [personaTitles.length]);

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

  const launchCategory = (id) => {
    const category = MEDIA_CATEGORIES.find(cat => cat.id === id);
    if (category) enterGallery(category);
  };

  const heroBackdrop = categoryCovers[activeCategoryId];

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col gap-8 pb-20">
        {/* Cinematic hero */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl border border-glass-border/60 glass-strong mt-12"
        >
          {heroBackdrop ? (
            <div className="absolute inset-0">
              <img src={heroBackdrop} alt="Hero backdrop" className="w-full h-full object-cover opacity-40" />
              <div className="absolute inset-0 bg-gradient-to-br from-black via-black/70 to-black/40" />
            </div>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/80 via-black to-purple-900/60" />
          )}

          <div className="relative grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur text-xs uppercase tracking-[0.3em] text-white/80">
                <Sparkle size={14} /> Premium Creative Portfolio
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                  Menelek Makonnen
                </h1>
                <div className="h-8 flex items-center gap-2 text-accent font-semibold">
                  <span className="text-sm uppercase tracking-[0.3em] text-white/70">Signature Roles</span>
                  <div className="w-px h-6 bg-white/20" />
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={titleIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                      className="text-lg md:text-xl"
                    >
                      {personaTitles[titleIndex]}
                    </motion.span>
                  </AnimatePresence>
                </div>
                <p className="text-secondary max-w-2xl">
                  A luxury, high-performance camera-inspired experience that lets you glide through films, galleries, AI creations,
                  and the LoreMaker universe without losing cinematic immersion.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => launchCategory('films')}
                  className="px-5 py-3 rounded-full bg-accent text-black font-semibold shadow-[0_15px_45px_-20px_var(--accent-glow)]"
                >
                  Launch Galleria
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => launchCategory('photography')}
                  className="px-5 py-3 rounded-full glass border border-white/20 text-white"
                >
                  Enter Photography
                </motion.button>
                <div className="flex items-center gap-3 text-xs text-white/70">
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">9:16 native</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">HUD always on</span>
                  <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10">Smooth transitions</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
              {MEDIA_CATEGORIES.map((category, idx) => {
                const Icon = CATEGORY_ICONS[category.id];
                const cover = categoryCovers[category.id];
                return (
                  <motion.button
                    key={category.id}
                    whileHover={{ y: -6, scale: 1.01 }}
                    onClick={() => launchCategory(category.id)}
                    className="relative overflow-hidden rounded-2xl border border-white/10 glass text-left"
                    style={{ transitionDelay: `${idx * 40}ms` }}
                  >
                    {cover ? (
                      <img src={cover} alt={`${category.name} preview`} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                    ) : (
                      <div className={`absolute inset-0 bg-gradient-to-br ${CATEGORY_GRADIENTS[category.id]}`} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/40 to-black/60" />
                    <div className="relative p-4 flex items-start gap-3">
                      <div className="w-11 h-11 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                        <Icon size={22} className="text-white" />
                      </div>
                      <div>
                        <p className="text-[11px] uppercase tracking-[0.2em] text-white/60">{category.type === 'gallery' ? 'Multi-level gallery' : 'Direct reels'}</p>
                        <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Quick launch pads */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-tertiary">Launch Pads</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">Jump into any gallery with one tap</h2>
            </div>
            <p className="text-secondary max-w-xl text-sm">
              Vertical 9:16 covers pull directly from your media to keep the home page alive and give every category a cinematic entry
              point.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MEDIA_CATEGORIES.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.id];
              const gradient = CATEGORY_GRADIENTS[category.id];
              const cover = categoryCovers[category.id];
              const isActive = category.id === activeCategoryId;

              return (
                <motion.div
                  key={`launch-${category.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                  whileHover={{ y: -6 }}
                  onClick={() => launchCategory(category.id)}
                  className="group cursor-pointer h-full"
                >
                  <div
                    className={`relative aspect-[3/4] rounded-2xl overflow-hidden glass border border-glass-border transition-all duration-500 ${
                      isActive ? 'ring-2 ring-accent shadow-[0_20px_60px_-25px_var(--accent-glow)]' : 'hover:ring-2 hover:ring-accent/70'
                    }`}
                  >
                    <div className="absolute inset-0">
                      {cover ? (
                        <img src={cover} alt={`${category.name} cover`} className="w-full h-full object-cover" />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${gradient}`} />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                    </div>

                    <div className="absolute inset-0 flex flex-col justify-between p-4">
                      <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-white/80">
                        <span className="flex items-center gap-2">
                          <Sparkle size={14} /> {category.type === 'gallery' ? 'Multi' : 'Direct'}
                        </span>
                        <span>{category.type === 'gallery' ? 'Albums' : 'Reels'}</span>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl flex items-center justify-center border border-white/20">
                            <Icon size={26} className="text-white" />
                          </div>
                          <div>
                            <h3 className="text-lg font-bold text-white drop-shadow-md">{category.name}</h3>
                            <p className="text-xs text-white/70">Immersive {category.type === 'gallery' ? 'albums' : 'cinema'}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-white/70">
                          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 backdrop-blur">
                            {isActive ? 'Currently Highlighted' : 'Ready to Explore'}
                          </span>
                          <span className="px-3 py-1 rounded-full bg-accent/20 text-accent border border-accent/50">HUD safe</span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: 'radial-gradient(circle at center, var(--accent-glow), transparent 70%)' }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Category Grid */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-tertiary">Camera HUD Galleria</p>
              <h2 className="text-2xl md:text-3xl font-semibold text-white">All premium collections in one cinematic grid</h2>
            </div>
            <p className="text-secondary max-w-xl text-sm">
              Hover reveals parallax, every tile respects the 9:16 rule, and arrows keep you gliding between categories without dark
              transitions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
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

        {/* External anchors */}
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-tertiary">Beyond the site</p>
              <h2 className="text-2xl font-semibold text-white">Stay linked to the wider universe</h2>
            </div>
            <p className="text-secondary text-sm max-w-xl">Quick jump to Loremaker Cloud and professional socials without leaving the cinematic shell.</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[{
              label: 'Loremaker Universe',
              href: 'https://loremaker.cloud',
            }, {
              label: 'Director YouTube',
              href: 'https://www.youtube.com/@director_menelek',
            }, {
              label: 'Creative LinkedIn',
              href: 'https://www.linkedin.com/in/menelekmakonnen',
            }].map(link => (
              <motion.a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                whileHover={{ y: -4 }}
                className="flex items-center justify-between px-4 py-3 rounded-2xl glass border border-glass-border text-white"
              >
                <div>
                  <p className="text-[11px] uppercase tracking-[0.25em] text-white/60">External</p>
                  <p className="text-base font-semibold">{link.label}</p>
                </div>
                <ExternalLink size={18} className="text-white/70" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
