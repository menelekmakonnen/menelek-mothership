import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Wand2, Cpu, Zap, X } from 'lucide-react';
import BlurLayer from '@/components/ui/BlurLayer';

// Placeholder AI-generated content albums
const aiAlbums = [
  {
    id: 1,
    name: 'AI Portraits',
    count: 24,
    icon: Sparkles,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 2,
    name: 'Concept Art',
    count: 36,
    icon: Wand2,
    gradient: 'from-blue-600 to-cyan-600',
  },
  {
    id: 3,
    name: 'Digital Dreams',
    count: 28,
    icon: Cpu,
    gradient: 'from-green-600 to-emerald-600',
  },
  {
    id: 4,
    name: 'Future Visions',
    count: 42,
    icon: Zap,
    gradient: 'from-orange-600 to-red-600',
  },
];

export default function AIAlbumsSection() {
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          AI Albums
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[color:var(--text-secondary)] mb-12"
        >
          AI-generated visual art and experiments
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiAlbums.map((album, index) => {
            const Icon = album.icon;
            return (
              <motion.div
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedAlbum(album)}
                className="group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <div className={`aspect-square bg-gradient-to-br ${album.gradient} rounded-2xl p-8 mb-4 flex flex-col items-center justify-center group-hover:scale-105 transition-transform`}>
                  <Icon className="w-20 h-20 text-white mb-4" />
                  <div className="text-white/80 text-sm mono">AI GENERATED</div>
                </div>

                <h3 className="font-bold text-xl mb-2">{album.name}</h3>
                <p className="text-sm text-[color:var(--text-secondary)]">{album.count} images</p>

                <div className="mt-3 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Album →
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <BlurLayer
            key={selectedAlbum.id}
            layerId={`ai-album-${selectedAlbum.id}`}
            depth={1500}
            type="interactive"
            focusOnMount
            lockGestures
            onClose={() => setSelectedAlbum(null)}
            className="fixed left-0 right-0 bottom-0 top-[calc(var(--camera-top-rail-height,112px)+var(--camera-nav-safe-zone,96px))] z-[1850] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full max-w-6xl mx-auto px-6 py-10 max-h-[calc(100%-2rem)]"
            >
              <div className="absolute inset-0 rounded-3xl bg-[rgba(8,10,18,0.94)] border border-white/10 shadow-2xl" />
              <div className="relative z-10 h-full overflow-hidden flex flex-col gap-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <button
                      onClick={() => setSelectedAlbum(null)}
                      className="text-green-300 hover:text-green-100 transition-colors text-sm mono"
                    >
                      ← Back to AI Albums
                    </button>
                    <h2 className="text-4xl font-bold mt-2">{selectedAlbum.name}</h2>
                    <p className="text-[color:var(--text-secondary)]">{selectedAlbum.count} AI-generated images</p>
                  </div>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="camera-hud rounded-full w-11 h-11 flex items-center justify-center text-sm"
                    aria-label="Close album"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2">
                  {Array.from({ length: selectedAlbum.count }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * i }}
                      className={`aspect-square bg-gradient-to-br ${selectedAlbum.gradient} rounded-xl overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-4xl opacity-80`}
                    >
                      🤖
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </BlurLayer>
        )}
      </AnimatePresence>
    </div>
  );
}
