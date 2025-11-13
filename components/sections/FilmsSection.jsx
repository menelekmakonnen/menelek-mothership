import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Film, Music } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

const videos = [
  {
    id: 1,
    title: 'Epic Short Film',
    type: 'film',
    thumbnail: '🎬',
    duration: '12:45',
    year: '2024',
  },
  {
    id: 2,
    title: 'Music Video - Artist Name',
    type: 'music',
    thumbnail: '🎵',
    duration: '3:30',
    year: '2024',
  },
  {
    id: 3,
    title: 'Documentary Feature',
    type: 'film',
    thumbnail: '🎥',
    duration: '25:00',
    year: '2023',
  },
  {
    id: 4,
    title: 'Music Video - Collaboration',
    type: 'music',
    thumbnail: '🎶',
    duration: '4:15',
    year: '2023',
  },
  {
    id: 5,
    title: 'Narrative Short',
    type: 'film',
    thumbnail: '🎞️',
    duration: '8:20',
    year: '2023',
  },
  {
    id: 6,
    title: 'Concept Music Video',
    type: 'music',
    thumbnail: '🎤',
    duration: '5:00',
    year: '2024',
  },
];

export default function FilmsSection() {
  const [filter, setFilter] = useState('all');
  const { currentLens } = useCameraContext();

  const filteredVideos = filter === 'all'
    ? videos
    : videos.filter(v => v.type === filter);

  // Calculate grid columns based on lens zoom
  // zoom: 0.7 (widest) -> 4 cols, 0.85 -> 3 cols, 0.9-1.0 -> 3 cols, 1.2+ -> 2 cols
  const getGridCols = () => {
    const zoom = currentLens.zoom;
    if (zoom <= 0.7) return 'grid-cols-2 md:grid-cols-4'; // Wide angle: 2 mobile, 4 desktop
    if (zoom <= 0.9) return 'grid-cols-2 md:grid-cols-3'; // Normal-wide: 2 mobile, 3 desktop
    if (zoom <= 1.0) return 'grid-cols-2 md:grid-cols-3'; // Normal: 2 mobile, 3 desktop
    return 'grid-cols-2 md:grid-cols-2'; // Telephoto: 2 mobile, 2 desktop
  };

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Films & Music Videos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-8"
        >
          Cinematic storytelling and visual artistry
        </motion.p>

        {/* Filter buttons - Mobile responsive */}
        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          {[
            { id: 'all', label: 'All', icon: Play },
            { id: 'film', label: 'Films', icon: Film },
            { id: 'music', label: 'Music Videos', shortLabel: 'Music', icon: Music },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-lg flex items-center gap-2 mono font-bold transition-all text-xs md:text-base ${
                  filter === btn.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">{btn.label}</span>
                <span className="md:hidden">{btn.shortLabel || btn.label}</span>
              </button>
            );
          })}
        </div>

        {/* Video grid - Responsive to lens zoom */}
        <div className={`grid ${getGridCols()} gap-4 md:gap-6 transition-all duration-700`}>
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="luxury-card group cursor-pointer"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center text-6xl relative overflow-hidden group-hover:scale-105 transition-transform">
                {video.thumbnail}

                {/* Play button overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs mono">
                  {video.duration}
                </div>
              </div>

              {/* Info */}
              <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">{video.title}</h3>
              <div className="flex items-center justify-between text-xs md:text-sm text-gray-400">
                <span className="capitalize">{video.type}</span>
                <span>{video.year}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
