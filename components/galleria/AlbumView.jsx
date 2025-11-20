import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Instagram, Zap, Heart, Camera as CameraIcon, Sparkles as SparklesIcon } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

// Gradients for Epic Edits categories
const CATEGORY_GRADIENTS = {
  'epic-edits': { gradient: 'from-red-600 via-orange-600 to-yellow-600', icon: Zap },
  'beauty-travel': { gradient: 'from-pink-500 via-rose-500 to-purple-500', icon: Heart },
  'bts': { gradient: 'from-blue-600 via-indigo-600 to-purple-600', icon: CameraIcon },
  'ai-learning': { gradient: 'from-green-500 via-teal-500 to-cyan-500', icon: SparklesIcon },
};

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

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8">
            <div>
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black text-white mb-4 tracking-tight">
                {currentAlbum?.name}
              </h1>
              <p className="text-gray-400 text-xl">{items.length} {items.length === 1 ? 'item' : 'items'}</p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <button
                onClick={toggleSlideshow}
                className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all shadow-lg shadow-purple-500/40 flex items-center gap-2"
              >
                <Play size={16} />
                <span>Slideshow</span>
              </button>

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
          </div>
        </motion.div>

        {/* Items Grid - Responsive: 2 cols mobile, 4+ cols desktop */}
        {items.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 md:gap-6 lg:gap-8">
            {items.map((item, index) => {
              // Get gradient and icon for Instagram items based on category
              const categoryStyle = item.category ? CATEGORY_GRADIENTS[item.category] : null;
              const isInstagram = item.type === 'instagram' || item.url?.includes('instagram.com');

              return (
                <motion.div
                  key={item.id || index}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.03 }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  onClick={() => enterSingle(item, index)}
                  className="group cursor-pointer"
                >
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                    {/* Instagram Items - Gradient Background with Icon */}
                    {isInstagram ? (
                      <>
                        {/* Gradient Background */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${categoryStyle?.gradient || 'from-purple-600 via-pink-600 to-red-600'} opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>

                        {/* Centered Instagram Icon */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div
                            whileHover={{ scale: 1.15, rotate: 10 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center"
                          >
                            <Instagram size={40} className="text-white" strokeWidth={1.5} />
                          </motion.div>
                        </div>
                      </>
                    ) : (
                      /* Regular Media */
                      item.type === 'video' ? (
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
                      )
                    )}

                    {/* Item Number Badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1.5 bg-black/60 backdrop-blur-sm rounded-lg text-xs font-mono text-white border border-white/10">
                      {index + 1}
                    </div>

                    {/* Hover Play Icon for All Items */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-purple-600/80 backdrop-blur-xl border-2 border-white/30 flex items-center justify-center">
                        <Play size={28} className="text-white ml-1" fill="white" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-xl">No items in this album</p>
          </div>
        )}
      </div>
    </div>
  );
}
