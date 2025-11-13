import { motion } from 'framer-motion';
import { useState } from 'react';
import { Grid, Grid2x2, Grid3x3, Maximize } from 'lucide-react';

// Placeholder gallery - will be replaced with Google Drive integration
const albums = [
  {
    id: 1,
    name: 'Portraits',
    count: 45,
    thumbnail: '👤',
    cover: 'Portrait Collection',
  },
  {
    id: 2,
    name: 'Landscapes',
    count: 32,
    thumbnail: '🏞️',
    cover: 'Nature & Scenery',
  },
  {
    id: 3,
    name: 'Urban',
    count: 58,
    thumbnail: '🏙️',
    cover: 'City Life',
  },
  {
    id: 4,
    name: 'Events',
    count: 67,
    thumbnail: '🎉',
    cover: 'Special Moments',
  },
];

export default function PhotographySection() {
  const [viewMode, setViewMode] = useState('grid'); // 'single', 'grid-4', 'grid-8', 'grid-16'
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const viewModes = [
    { id: 'single', label: 'Single', icon: Maximize },
    { id: 'grid-4', label: '4-up', icon: Grid2x2 },
    { id: 'grid-8', label: '8-up', icon: Grid3x3 },
    { id: 'grid-16', label: '16-up', icon: Grid },
  ];

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Photography
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-8"
        >
          Capturing moments through the lens
        </motion.p>

        {!selectedAlbum ? (
          <>
            {/* Album gallery */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedAlbum(album)}
                  className="luxury-card group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  {/* Album cover */}
                  <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform">
                    {album.thumbnail}
                  </div>

                  {/* Album info */}
                  <h3 className="font-bold text-xl mb-2">{album.name}</h3>
                  <p className="text-sm text-gray-400">{album.count} photos</p>

                  <div className="mt-4 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    View Album →
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Album view with camera controls */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="text-green-400 hover:underline mb-2"
                >
                  ← Back to Albums
                </button>
                <h2 className="text-3xl font-bold">{selectedAlbum.name}</h2>
                <p className="text-gray-400">{selectedAlbum.count} photos</p>
              </div>

              {/* View mode selector */}
              <div className="flex gap-2">
                {viewModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 mono text-xs transition-all ${
                        viewMode === mode.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-white/5 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo grid */}
            <div className={`grid gap-4 ${
              viewMode === 'single' ? 'grid-cols-1' :
              viewMode === 'grid-4' ? 'grid-cols-2' :
              viewMode === 'grid-8' ? 'grid-cols-4' :
              'grid-cols-4 md:grid-cols-6'
            }`}>
              {Array.from({ length: selectedAlbum.count }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.02 * i }}
                  className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform flex items-center justify-center text-4xl"
                >
                  📷
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
