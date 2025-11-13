import { motion } from 'framer-motion';
import { useState } from 'react';
import { Sparkles, Wand2, Cpu, Zap } from 'lucide-react';

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

  if (selectedAlbum) {
    return (
      <div className="w-full min-h-screen p-8 pt-32 pb-32 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => setSelectedAlbum(null)}
            className="text-green-400 hover:underline mb-6"
          >
            ← Back to AI Albums
          </button>

          <h2 className="text-4xl font-bold mb-2">{selectedAlbum.name}</h2>
          <p className="text-gray-400 mb-8">{selectedAlbum.count} AI-generated images</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: selectedAlbum.count }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02 * i }}
                className={`aspect-square bg-gradient-to-br ${selectedAlbum.gradient} rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-4xl opacity-80`}
              >
                🤖
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32 overflow-auto">
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
          className="text-xl text-gray-400 mb-12"
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
                <p className="text-sm text-gray-400">{album.count} images</p>

                <div className="mt-3 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Album →
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
