import { motion } from 'framer-motion';
import { Play, Film } from 'lucide-react';

// Placeholder - will be populated from Google Drive
const videos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Epic Edit ${i + 1}`,
  thumbnail: ['🎬', '🎥', '🎞️', '📹'][i % 4],
  duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  views: `${Math.floor(Math.random() * 100)}K`,
}));

export default function VideoEditsSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Epic Video Edits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-12"
        >
          Professional video editing and motion graphics
        </motion.p>

        <div className="grid md:grid-cols-4 gap-6">
          {videos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="luxury-card group cursor-pointer"
              whileHover={{ y: -8 }}
            >
              {/* Video thumbnail */}
              <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 flex items-center justify-center text-5xl relative overflow-hidden group-hover:scale-105 transition-transform">
                {video.thumbnail}

                {/* Play overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                    <Play className="w-6 h-6 text-white ml-1" />
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs mono">
                  {video.duration}
                </div>
              </div>

              {/* Video info */}
              <h3 className="font-bold mb-1">{video.title}</h3>
              <p className="text-xs text-gray-400">{video.views} views</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
