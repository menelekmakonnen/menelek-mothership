import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Film, Video, Palette, ArrowRight, Play } from 'lucide-react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';
import SocialLinks from '@/components/common/SocialLinks';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

// Use actual working cover images
const getCoverImage = (categoryId, mediaData) => {
  switch(categoryId) {
    case 'films':
      // Use the first film's YouTube thumbnail
      return 'https://img.youtube.com/vi/A8cGpNe2JAE/maxresdefault.jpg';
    case 'video-edits':
      // Use placeholder with gradient
      return null; // We'll use gradient instead
    case 'photography':
      // Use placeholder with gradient
      return null;
    case 'ai-albums':
      // Use placeholder with gradient
      return null;
    case 'loremaker':
      // Use placeholder with gradient
      return null;
    default:
      return null;
  }
};

const CATEGORY_GRADIENTS = {
  photography: 'from-purple-600 via-pink-600 to-rose-600',
  'ai-albums': 'from-cyan-500 via-blue-600 to-purple-600',
  films: 'from-orange-500 via-red-600 to-pink-600',
  'video-edits': 'from-green-500 via-emerald-600 to-teal-600',
  loremaker: 'from-violet-500 via-fuchsia-600 to-pink-600',
};

const CATEGORY_DESCRIPTIONS = {
  photography: 'Beauty shoots, events, and professional photography',
  'ai-albums': 'AI-generated art and creative experiments',
  films: 'Films, documentaries, and music videos',
  'video-edits': 'Epic edits, BTS, beauty reels, and AI tutorials',
  loremaker: 'Characters and worldbuilding from the Loremaker Universe',
};

// Cycling words for subtitle
const CYCLING_WORDS = [
  'Filmmaker',
  'Producer',
  'Director',
  'Writer',
  'Photographer',
  'Friend',
  'Brother',
  'Son',
  'Creative Director',
  'Video Editor',
  'Videographer',
  'Cinematographer',
  'Web Developer',
  'Vibe Coder',
];

export default function GalleriaView({ isHomePage }) {
  const { enterGallery, mediaData } = useGalleriaContext();

  // State for cycling word
  const [currentWord, setCurrentWord] = useState(() => {
    const randomIndex = Math.floor(Math.random() * CYCLING_WORDS.length);
    return CYCLING_WORDS[randomIndex];
  });

  // Cycle through words every 3 seconds
  useEffect(() => {
    const getNextWord = (previousWord) => {
      if (CYCLING_WORDS.length === 1) return previousWord;

      let nextWord = previousWord;
      while (nextWord === previousWord) {
        const randomIndex = Math.floor(Math.random() * CYCLING_WORDS.length);
        nextWord = CYCLING_WORDS[randomIndex];
      }
      return nextWord;
    };

    const interval = setInterval(() => {
      setCurrentWord((prev) => getNextWord(prev));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 pb-40">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 pt-20"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tighter">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
              Menelek Makonnen
            </span>
          </h1>
          <div className="text-gray-300 text-xl sm:text-2xl md:text-3xl max-w-4xl mx-auto font-light tracking-wide flex items-center justify-center gap-3 flex-wrap">
            <span>World Builder</span>
            <span className="text-purple-500">•</span>
            <span>AI Super Nerd</span>
            <span className="text-purple-500">•</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 font-semibold"
              >
                {currentWord}
              </motion.span>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-center">
            <SocialLinks compact className="max-w-2xl" />
          </div>
        </motion.div>

        {/* Category Grid - Responsive to fit all items without scrolling */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 lg:gap-8 max-w-[1800px] mx-auto">
          {MEDIA_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            const coverImage = getCoverImage(category.id, mediaData);
            const gradient = CATEGORY_GRADIENTS[category.id];
            const description = CATEGORY_DESCRIPTIONS[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + index * 0.15,
                  ease: [0.19, 1, 0.22, 1]
                }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => enterGallery(category)}
                className="group cursor-pointer"
              >
                {/* Card */}
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                  {/* Background Layer */}
                  {coverImage ? (
                    <div className="absolute inset-0">
                      <img
                        src={coverImage}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  )}

                  {/* Icon - Large and Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
                    >
                      <Icon size={40} className="text-white md:w-12 md:h-12" strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 z-10">
                    <div className="mb-2 md:mb-3 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hidden md:block">
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed line-clamp-2">
                        {description}
                      </p>
                    </div>

                    <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-400 transition-all duration-300 line-clamp-2">
                      {category.name}
                    </h3>

                    {/* CTA */}
                    <div className="flex items-center text-purple-400 font-medium opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-xs md:text-sm">Explore</span>
                      <ArrowRight size={16} className="ml-1 md:ml-2" />
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-20 blur-3xl`}></div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-500/50 transition-all duration-500"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
