import { motion } from 'framer-motion';
import { Play, Film, Clapperboard, Video, Sparkles } from 'lucide-react';

// Placeholder - will be populated from Google Drive
const videos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Epic Edit ${i + 1}`,
  thumbnail: ['🎬', '🎥', '🎞️', '📹'][i % 4],
  duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  views: `${Math.floor(Math.random() * 100)}K`,
}));

const gradientPalette = [
  'from-purple-600 to-pink-600',
  'from-blue-600 to-cyan-600',
  'from-emerald-600 to-teal-600',
  'from-orange-600 to-red-600',
];

const iconPalette = [Film, Clapperboard, Video, Sparkles];

export default function VideoEditsSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
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
          className="text-xl text-[color:var(--text-secondary)] mb-12"
        >
          Professional video editing and motion graphics
        </motion.p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {videos.map((video, index) => {
            const gradient = gradientPalette[index % gradientPalette.length];
            const Icon = iconPalette[index % iconPalette.length];
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * index }}
                className="camera-hud rounded-3xl border border-white/10 overflow-hidden group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                <div className={`relative aspect-video bg-gradient-to-br ${gradient} flex flex-col justify-between p-6`}
                >
                  <div className="flex items-center justify-between text-white/80">
                    <Icon className="w-8 h-8" />
                    <div className="px-3 py-1 rounded-full bg-black/30 text-[11px] mono uppercase tracking-[0.3em]">
                      {video.views} views
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-black/40 flex items-center justify-center">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                    <div className="text-sm text-white/80 mono uppercase tracking-[0.4em]">Play</div>
                  </div>
                  <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-[rgba(10,12,18,0.85)] text-white font-semibold text-xs mono">
                    {video.duration}
                  </div>
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-semibold">{video.title}</h3>
                  <p className="text-sm text-[color:var(--text-secondary)]">
                    Hybrid cinematic edit crafted for emotion-forward storytelling.
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
