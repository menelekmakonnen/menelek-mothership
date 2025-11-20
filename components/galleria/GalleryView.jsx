import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, ArrowLeft, Grid, List } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Films & Music Videos
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              {items.length} {items.length === 1 ? 'video' : 'videos'}
            </p>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3">
              {['default', 'a-z', 'z-a', 'random'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortMode === mode
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {mode === 'default' ? 'Latest' : mode === 'a-z' ? 'A-Z' : mode === 'z-a' ? 'Z-A' : 'Random'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => enterSingle(item, index)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                      <Play size={28} className="text-white ml-1" fill="white" />
                    </div>
                  </div>

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-base font-bold text-white mb-1 line-clamp-1">{item.title}</h3>
                    <p className="text-sm text-gray-300">{item.runtime} • {item.year}</p>
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

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Epic Video Edits
            </h1>
            <p className="text-gray-400 text-lg mb-6">
              {categories.length} {categories.length === 1 ? 'category' : 'categories'}
            </p>

            {/* Sorting Controls */}
            <div className="flex items-center gap-3">
              {['default', 'a-z', 'z-a', 'random'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortMode === mode
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {mode === 'default' ? 'Default' : mode === 'a-z' ? 'A-Z' : mode === 'z-a' ? 'Z-A' : 'Random'}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => enterAlbum(category)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500">
                  <img
                    src={category.coverUrl}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <h3 className="text-lg font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-300">{category.items?.length || 0} videos</p>
                  </div>
                </div>
              </motion.div>
            ))}
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
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              {title}
            </h1>
            <p className="text-gray-400 text-lg">
              {galleries.length === 0 ? 'Loading albums...' : `${galleries.length} ${galleries.length === 1 ? 'gallery' : 'galleries'}`}
            </p>
          </motion.div>

          {/* Gallery List */}
          {galleries.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-lg">Albums coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {galleries.map((gallery, index) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => enterAlbum(gallery)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-red-600/30 group-hover:opacity-80 transition-opacity"></div>

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <h3 className="text-lg font-bold text-white mb-1">{gallery.name}</h3>
                      <p className="text-sm text-gray-300">{gallery.description}</p>
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
    const characters = categoryData?.characters || [];

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
          >
            <button
              onClick={goBack}
              className="mb-6 flex items-center text-gray-400 hover:text-white transition-colors group"
            >
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4">
              Loremaker Universe
            </h1>
            <p className="text-gray-400 text-lg">
              {characters.length === 0 ? 'Loading characters...' : `${characters.length} ${characters.length === 1 ? 'character' : 'characters'}`}
            </p>
          </motion.div>

          {/* Character Grid */}
          {characters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-gray-500 text-lg">Characters coming soon...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.5 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => enterSingle(character, index)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500">
                    <img
                      src={character.coverImage}
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                      <h3 className="text-base font-bold text-white mb-1">{character.name}</h3>
                      {character.alias && (
                        <p className="text-sm text-gray-300">{character.alias}</p>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900 flex items-center justify-center">
      <p className="text-gray-500 text-lg">No content available</p>
    </div>
  );
}
