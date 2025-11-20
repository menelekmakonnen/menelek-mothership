import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, Grid, List, Zap, Heart, Camera as CameraIcon, Sparkles as SparklesIcon } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import ImageSafe from '@/components/common/ImageSafe';

// Icons for Epic Edits categories
const EPIC_EDITS_ICONS = {
  'epic-edits': Zap, // High-energy VFX
  'beauty-travel': Heart, // Beauty & aesthetic
  'bts': CameraIcon, // Behind the scenes
  'ai-learning': SparklesIcon, // AI education
};

export default function GalleryView() {
  const {
    currentCategory,
    mediaData,
    enterAlbum,
    enterSingle,
    sortMode,
    setSortMode,
    applySorting,
    goBack,
  } = useGalleriaContext();

  if (!currentCategory) return null;

  const categoryId = currentCategory.id;
  const categoryData = mediaData[categoryId];

  // Handle Films & Music Videos (Direct display - no albums)
  if (categoryId === 'films') {
    const items = applySorting(categoryData?.items || [], sortMode);

    return (
      <div className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <button
              onClick={goBack}
              className="mb-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center text-gray-300 hover:text-white group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              Films & Music Videos
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              {items.length} {items.length === 1 ? 'video' : 'videos'}
            </p>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              {['default', 'a-z', 'z-a', 'random'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${
                    sortMode === mode
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {mode === 'default' ? 'Latest' : mode === 'a-z' ? 'A-Z' : mode === 'z-a' ? 'Z-A' : 'Random'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Video Grid - Responsive: 2 cols mobile, 4+ cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.6 }}
                whileHover={{ y: -12, scale: 1.02 }}
                onClick={() => enterSingle(item, index)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/9] rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20 rounded-full bg-purple-600/80 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                      <Play size={20} className="text-white ml-1 md:w-6 md:h-6 lg:w-8 lg:h-8" fill="white" />
                    </div>
                  </div>

                  {/* Info Overlay - Smaller text on mobile */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                    <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 md:mb-2 line-clamp-2 leading-tight">{item.title}</h3>
                    <p className="text-xs md:text-sm text-gray-300">{item.runtime} • {item.year}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Handle Epic Video Edits (Categories as albums)
  if (categoryId === 'video-edits') {
    const categories = applySorting(categoryData?.categories || [], sortMode);

    // Gradients for each Epic Edits category
    const categoryGradients = {
      'epic-edits': 'from-red-600 via-orange-600 to-yellow-600', // High-energy colors
      'beauty-travel': 'from-pink-500 via-rose-500 to-purple-500', // Soft, aesthetic
      'bts': 'from-blue-600 via-indigo-600 to-purple-600', // Documentary professional
      'ai-learning': 'from-green-500 via-teal-500 to-cyan-500', // Tech/learning
    };

    return (
      <div className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <button
              onClick={goBack}
              className="mb-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center text-gray-300 hover:text-white group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight">
              Epic Video Edits
            </h1>
            <p className="text-gray-400 text-base md:text-lg lg:text-xl mb-8">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </p>

            {/* Sorting Controls */}
            <div className="flex items-center gap-2 md:gap-3 flex-wrap">
              {['default', 'a-z', 'z-a', 'random'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-3 md:px-5 py-2 md:py-2.5 rounded-full text-xs md:text-sm font-semibold transition-all ${
                    sortMode === mode
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/40'
                      : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  {mode === 'default' ? 'Latest' : mode === 'a-z' ? 'A-Z' : mode === 'z-a' ? 'Z-A' : 'Random'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Category Grid - Responsive: 2 cols mobile, 4+ cols desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => {
              const gradient = categoryGradients[category.id] || 'from-gray-700 via-gray-800 to-gray-900';
              const CategoryIcon = EPIC_EDITS_ICONS[category.id] || Play;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => enterAlbum(category)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-40 group-hover:opacity-60 transition-opacity duration-500`}></div>

                    {/* Centered Icon */}
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
                      >
                        <CategoryIcon size={48} className="text-white md:w-16 md:h-16" strokeWidth={1.5} />
                      </motion.div>
                    </div>

                    {/* Info Overlay - Smaller text on mobile */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-gradient-to-t from-black via-black/90 to-transparent z-10">
                      <h3 className="text-sm md:text-base lg:text-xl font-bold text-white mb-1 md:mb-2 leading-tight line-clamp-2">{category.name}</h3>
                      <p className="text-xs md:text-sm text-gray-300">{category.items?.length || 0} videos</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Handle Photography & AI Albums (Gallery with albums)
  if (categoryId === 'photography' || categoryId === 'ai-albums') {
    const galleries = categoryData?.galleries || [];
    const title = categoryId === 'photography' ? 'Photography' : 'AI Albums';

    return (
      <div className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <button
              onClick={goBack}
              className="mb-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center text-gray-300 hover:text-white group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
              {title}
            </h1>
            <p className="text-gray-400 text-xl mb-8">
              {galleries.length === 0 ? 'Loading albums...' : `${galleries.length} ${galleries.length === 1 ? 'gallery' : 'galleries'}`}
            </p>
          </motion.div>

          {/* Gallery List */}
          {galleries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-xl">Albums coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
              {galleries.map((gallery, index) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => enterAlbum(gallery)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-red-600/30 group-hover:opacity-80 transition-opacity"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-6 bg-gradient-to-t from-black via-black/90 to-transparent">
                      <h3 className="text-sm md:text-base lg:text-xl font-bold text-white mb-1 md:mb-2 leading-tight line-clamp-2">{gallery.name}</h3>
                      <p className="text-xs md:text-sm text-gray-300 line-clamp-2">{gallery.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle Loremaker Universe (Character display)
  if (categoryId === 'loremaker') {
    const characters = categoryData?.items || [];

    return (
      <div className="fixed inset-0 bg-black overflow-y-auto overflow-x-hidden">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-24 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-16"
          >
            <button
              onClick={goBack}
              className="mb-8 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center text-gray-300 hover:text-white group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white mb-4 tracking-tight">
              Loremaker Universe
            </h1>
            <p className="text-gray-400 text-lg md:text-xl mb-8">
              {characters.length === 0 ? 'Loading characters...' : `${characters.length} ${characters.length === 1 ? 'character' : 'characters'}`}
            </p>
          </motion.div>

          {/* Character Grid - 2 cols mobile, 4-5 cols desktop */}
          {characters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-xl">Characters coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.6 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => enterSingle(character, index)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl md:rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                    <ImageSafe
                      variants={character.imageVariants || [character.coverUrl]}
                      alt={character.character}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      fallbackText={character.character}
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-3 md:p-4 lg:p-5 bg-gradient-to-t from-black via-black/90 to-transparent">
                      <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 leading-tight line-clamp-2">{character.character}</h3>
                      {character.alias && (
                        <p className="text-xs md:text-sm text-gray-300 line-clamp-1">{character.alias}</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <p className="text-gray-500 text-xl">No content available</p>
    </div>
  );
}
