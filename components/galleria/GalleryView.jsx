import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Grid } from 'lucide-react';
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
  } = useGalleriaContext();

  if (!currentCategory) return null;

  const categoryId = currentCategory.id;
  const categoryData = mediaData[categoryId];

  // Handle Films & Music Videos (Direct display - no albums)
  if (categoryId === 'films') {
    const items = applySorting(categoryData?.items || [], sortMode);

    return (
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-glass-border">
          <h2 className="text-3xl font-bold text-primary mb-2">Films & Music Videos</h2>
          <p className="text-sm text-secondary">
            {items.length} {items.length === 1 ? 'video' : 'videos'}
          </p>

          {/* Sorting Controls */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setSortMode('default')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'default'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortMode('a-z')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'a-z'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              A–Z
            </button>
            <button
              onClick={() => setSortMode('z-a')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'z-a'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Z–A
            </button>
            <button
              onClick={() => setSortMode('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'random'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Random
            </button>
          </div>
        </div>

        {/* Video Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => enterSingle(item, index)}
                className="group cursor-pointer"
              >
                {/* Portrait Cover */}
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden glass border border-glass-border">
                  <img
                    src={item.coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Play size={48} className="text-white" fill="white" />
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <h3 className="text-sm font-bold text-white truncate">{item.title}</h3>
                    <p className="text-xs text-gray-300">{item.runtime} • {item.year}</p>
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-glass-border">
          <h2 className="text-3xl font-bold text-primary mb-2">Epic Video Edits</h2>
          <p className="text-sm text-secondary">
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </p>

          {/* Sorting Controls */}
          <div className="flex items-center gap-2 mt-4">
            <button
              onClick={() => setSortMode('default')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'default'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Default
            </button>
            <button
              onClick={() => setSortMode('a-z')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'a-z'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              A–Z
            </button>
            <button
              onClick={() => setSortMode('z-a')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'z-a'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Z–A
            </button>
            <button
              onClick={() => setSortMode('random')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                sortMode === 'random'
                  ? 'bg-accent text-white'
                  : 'glass border border-glass-border text-secondary hover:text-primary'
              }`}
            >
              Random
            </button>
          </div>
        </div>

        {/* Category Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => enterAlbum(category)}
                className="group cursor-pointer"
              >
                {/* Portrait Cover */}
                <div className="relative aspect-[9/16] rounded-lg overflow-hidden glass border border-glass-border">
                  <img
                    src={category.coverUrl}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                    <h3 className="text-sm font-bold text-white">{category.name}</h3>
                    <p className="text-xs text-gray-300">{category.items?.length || 0} videos</p>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-glass-border">
          <h2 className="text-3xl font-bold text-primary mb-2">{title}</h2>
          <p className="text-sm text-secondary">
            {galleries.length} {galleries.length === 1 ? 'gallery' : 'galleries'}
          </p>
        </div>

        {/* Gallery List */}
        <div className="flex-1 overflow-y-auto p-6">
          {galleries.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary">Loading albums...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleries.map((gallery, index) => (
                <motion.div
                  key={gallery.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => enterAlbum(gallery)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden glass border border-glass-border">
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-600/30 to-red-600/30" />

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-sm font-bold text-white">{gallery.name}</h3>
                      <p className="text-xs text-gray-300">{gallery.description}</p>
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
      <div className="h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 border-b border-glass-border">
          <h2 className="text-3xl font-bold text-primary mb-2">Loremaker Universe</h2>
          <p className="text-sm text-secondary">
            {characters.length} {characters.length === 1 ? 'character' : 'characters'}
          </p>
        </div>

        {/* Character Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          {characters.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-secondary">Loading characters...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {characters.map((character, index) => (
                <motion.div
                  key={character.id || index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => enterSingle(character, index)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[9/16] rounded-lg overflow-hidden glass border border-glass-border">
                    <img
                      src={character.coverImage}
                      alt={character.name}
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent">
                      <h3 className="text-sm font-bold text-white">{character.name}</h3>
                      {character.alias && (
                        <p className="text-xs text-gray-300">{character.alias}</p>
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
    <div className="h-full flex items-center justify-center">
      <p className="text-secondary">No content available</p>
    </div>
  );
}
