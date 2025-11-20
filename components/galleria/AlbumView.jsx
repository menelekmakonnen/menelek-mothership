import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play } from 'lucide-react';
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
            <span>Back</span>
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3">
                {currentAlbum?.name}
              </h1>
              <p className="text-gray-400 text-lg">{items.length} items</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={toggleSlideshow}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all shadow-lg shadow-purple-500/30 flex items-center gap-2"
              >
                <Play size={16} />
                <span>Slideshow</span>
              </button>

              {['default', 'a-z', 'z-a', 'random'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSortMode(mode)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortMode === mode
                      ? 'bg-gray-700 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  {mode === 'default' ? 'Latest' : mode === 'a-z' ? 'A-Z' : mode === 'z-a' ? 'Z-A' : 'Random'}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Items Grid */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.03 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => enterSingle(item, index)}
                className="group cursor-pointer"
              >
                <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-gray-900 border border-gray-800 shadow-xl group-hover:shadow-purple-500/20 transition-all duration-500">
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
                      src={item.url || item.thumbnailUrl || item.coverUrl}
                      alt={item.name || item.title || `Item ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      loading="lazy"
                    />
                  )}

                  {/* Item Number Badge */}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-mono text-white">
                    {index + 1}
                  </div>

                  {/* Hover Play Icon for Videos */}
                  {item.type === 'video' && (
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 flex items-center justify-center">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">No items in this album</p>
          </div>
        )}
      </div>
    </div>
  );
}
