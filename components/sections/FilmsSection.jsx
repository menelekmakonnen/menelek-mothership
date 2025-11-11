import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Film, Music } from 'lucide-react';

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

  const filteredVideos = filter === 'all'
    ? videos
    : videos.filter(v => v.type === filter);

  return (
    <div className="w-full h-full p-8 overflow-auto">
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

        {/* Filter buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'all', label: 'All', icon: Play },
            { id: 'film', label: 'Films', icon: Film },
            { id: 'music', label: 'Music Videos', icon: Music },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 mono font-bold transition-all ${
                  filter === btn.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Video grid */}
        <div className="grid md:grid-cols-3 gap-6">
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
              <h3 className="font-bold text-lg mb-2">{video.title}</h3>
              <div className="flex items-center justify-between text-sm text-gray-400">
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
