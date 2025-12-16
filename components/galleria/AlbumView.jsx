import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowUpDown, Shuffle, Play } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function AlbumView() {
  const {
    currentAlbum,
    goBack,
    enterSingle,
    sortMode,
    setSortMode,
    applySorting,
    toggleSlideshow,
  } = useGalleriaContext();

  const [items, setItems] = useState([]);

  useEffect(() => {
    if (currentAlbum && currentAlbum.items) {
      setItems(applySorting(currentAlbum.items, sortMode));
    }
  }, [currentAlbum, sortMode, applySorting]);

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
    <div className="h-full overflow-y-auto pb-32 no-scrollbar">
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
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-bold text-break">{currentAlbum?.name}</h2>
              <p className="text-sm text-secondary mt-1">{items.length} items</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSlideshow}
              className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
            >
              <Play size={16} />
              <span className="text-sm font-medium">Slideshow</span>
            </button>

            <button
              onClick={cycleSortMode}
              className="flex items-center gap-2 px-4 py-2 glass hover:border-accent transition-colors rounded-full"
            >
              {sortMode === 'random' ? <Shuffle size={16} /> : <ArrowUpDown size={16} />}
              <span className="text-sm font-medium">{getSortLabel()}</span>
            </button>
          </div>
        </div>

        {/* Items Grid */}
        {items.length > 0 ? (
          <div className="gallery-grid">
            {items.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                onClick={() => enterSingle(item, index)}
                className="gallery-item"
              >
                {/* Media */}
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    onMouseEnter={(e) => e.target.play()}
                    onMouseLeave={(e) => e.target.pause()}
                  />
                ) : (
                  <img
                    src={item.url || item.thumbnailUrl}
                    alt={item.name || item.title || `Item ${index + 1}`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                )}

                {/* Item Number Overlay */}
                <div className="absolute top-3 right-3 px-2 py-1 glass-strong rounded text-xs font-mono">
                  {index + 1}/{items.length}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <p className="text-2xl text-tertiary mb-2">No items in this album</p>
              <p className="text-sm text-secondary">Add media to get started</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
