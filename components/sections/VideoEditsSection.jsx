import { motion } from 'framer-motion';
import { Play, Film, Clapperboard, Video, Sparkles } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

// Placeholder - will be populated from Google Drive
const videos = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  title: `Epic Edit ${i + 1}`,
  thumbnail: ['🎬', '🎥', '🎞️', '📹'][i % 4],
  duration: `${Math.floor(Math.random() * 5) + 2}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
  views: `${Math.floor(Math.random() * 100)}K`,
}));

const cardThemes = [
  {
    panel: 'from-indigo-800/85 via-purple-600/75 to-slate-950/85',
    halo: 'from-purple-300/40 via-indigo-200/10 to-transparent',
    icon: 'from-purple-400 to-fuchsia-400',
  },
  {
    panel: 'from-sky-800/85 via-cyan-600/75 to-slate-950/85',
    halo: 'from-cyan-200/45 via-sky-200/15 to-transparent',
    icon: 'from-blue-400 to-cyan-400',
  },
  {
    panel: 'from-emerald-800/85 via-teal-600/75 to-slate-950/85',
    halo: 'from-emerald-200/45 via-teal-200/15 to-transparent',
    icon: 'from-emerald-400 to-teal-400',
  },
  {
    panel: 'from-rose-800/85 via-amber-600/75 to-slate-950/85',
    halo: 'from-amber-200/45 via-rose-200/15 to-transparent',
    icon: 'from-amber-400 to-rose-400',
  },
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
            const theme = cardThemes[index % cardThemes.length];
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
                <div className="relative aspect-video overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <IconBox icon={Icon} gradient={theme.icon} size="md" className="shadow-xl" />
                      <div className="px-3 py-1 rounded-full bg-black/35 backdrop-blur text-[11px] mono uppercase tracking-[0.3em] text-white">
                        {video.views} views
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-black/35 flex items-center justify-center backdrop-blur">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm text-white/80 mono uppercase tracking-[0.35em]">Play</div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[rgba(10,12,18,0.85)] text-white font-semibold text-xs mono">
                        {video.duration}
                      </div>
                    </div>
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
