import { motion } from 'framer-motion';
import { useState } from 'react';
import { Play, Film, Music } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';
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

const filmThemes = {
  film: {
    panel: 'from-indigo-800/85 via-purple-600/75 to-slate-950/85',
    halo: 'from-purple-300/40 via-indigo-200/10 to-transparent',
    icon: 'from-purple-400 to-fuchsia-400',
    iconComponent: Film,
  },
  music: {
    panel: 'from-rose-800/85 via-amber-600/75 to-slate-950/85',
    halo: 'from-amber-200/45 via-rose-200/15 to-transparent',
    icon: 'from-amber-400 to-rose-400',
    iconComponent: Music,
  },
};

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
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
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
          className="text-xl text-[color:var(--text-secondary)] mb-8"
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
          {filteredVideos.map((video, index) => {
            const theme = filmThemes[video.type];
            const Icon = theme.iconComponent;
            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="luxury-card group cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-2xl mb-4">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <IconBox icon={Icon} gradient={theme.icon} size="md" className="shadow-xl" />
                      <div className="px-3 py-1 rounded-full bg-black/35 backdrop-blur text-[11px] mono uppercase tracking-[0.35em] text-white">
                        {video.year}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-black/35 flex items-center justify-center backdrop-blur">
                          <Play className="w-6 h-6 text-white" />
                        </div>
                        <div className="text-sm text-white/80 mono uppercase tracking-[0.35em]">
                          {video.type}
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-full bg-[rgba(10,12,18,0.85)] text-white font-semibold text-xs mono">
                        {video.duration}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <h3 className="font-bold text-base md:text-lg mb-2 line-clamp-2">{video.title}</h3>
                <div className="flex items-center justify-between text-xs md:text-sm text-[color:var(--text-secondary)]">
                  <span className="capitalize">{video.type}</span>
                  <span>{video.year}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
