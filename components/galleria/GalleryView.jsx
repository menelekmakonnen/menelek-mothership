import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpDown, Shuffle } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function GalleryView() {
  const {
    currentCategory,
    goBack,
    enterAlbum,
    enterSingle,
    sortMode,
    setSortMode,
    applySorting,
    mediaData,
  } = useGalleriaContext();

  const [albums, setAlbums] = useState([]);

  useEffect(() => {
    console.log('📦 GalleryView - currentCategory:', currentCategory);
    console.log('📦 GalleryView - mediaData:', mediaData);

    if (currentCategory) {
      // Get albums/items for current category
      let items = [];

      if (currentCategory.id === 'photography') {
        items = mediaData.photography?.galleries || [];
        console.log('📷 Photography galleries:', items);
      } else if (currentCategory.id === 'ai-albums') {
        items = mediaData['ai-albums']?.galleries || [];
        console.log('🤖 AI Albums galleries:', items);
      } else if (currentCategory.id === 'films') {
        items = mediaData.films?.items || [];
        console.log('🎬 Films items:', items);
      } else if (currentCategory.id === 'video-edits') {
        items = mediaData['video-edits']?.categories || [];
        console.log('✂️ Video edits categories:', items);
      } else if (currentCategory.id === 'loremaker') {
        items = mediaData.loremaker?.characters || [];
        console.log('📚 Loremaker characters:', items);
      }

      console.log('✅ Total items found:', items.length);
      setAlbums(applySorting(items, sortMode));
    }
  }, [currentCategory, mediaData, sortMode, applySorting]);

  const handleItemClick = (item) => {
    if (currentCategory.type === 'gallery') {
      // Has albums - enter album view
      enterAlbum(item);
    } else {
      // Direct to single view
      enterSingle(item, 0);
    }
  };

  const cycleSortMode = () => {
    const modes = ['default', 'a-z', 'z-a', 'random'];
    const currentIndex = modes.indexOf(sortMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setSortMode(modes[nextIndex]);
  };

  const getSortLabel = () => {
    switch (sortMode) {
      case 'a-z': return 'A-Z';
      case 'z-a': return 'Z-A';
      case 'random': return 'Random';
      default: return 'Default';
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-32">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={goBack}
              className="p-2 rounded-full glass hover:border-accent transition-colors"
            >
              <ArrowLeft size={20} className="text-hud-text" />
            </button>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold">{currentCategory?.name}</h2>
              <p className="text-sm text-secondary mt-1">
                {albums.length} {currentCategory?.type === 'gallery' ? 'albums' : 'items'}
              </p>
            </div>
          </div>

          {/* Sort Controls */}
          <button
            onClick={cycleSortMode}
            className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
          >
            {sortMode === 'random' ? <Shuffle size={16} /> : <ArrowUpDown size={16} />}
            <span className="text-sm font-medium">{getSortLabel()}</span>
          </button>
        </div>

        {/* Gallery Grid */}
        {albums.length > 0 ? (
          <div className="gallery-grid">
            {albums.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => handleItemClick(item)}
                className="gallery-item"
              >
                {/* Cover Image/Video */}
                <div className="w-full h-full bg-bg-tertiary">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.name || item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl text-tertiary">📁</div>
                    </div>
                  )}
                </div>

                {/* Overlay Text */}
                <div className="gallery-overlay-text">
                  <h3 className="font-bold text-lg mb-1">{item.name || item.title}</h3>
                  {item.itemCount && (
                    <p className="text-sm opacity-75">{item.itemCount} items</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-2xl text-tertiary mb-2">No items yet</p>
              <p className="text-sm text-secondary">Content will appear here soon</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
