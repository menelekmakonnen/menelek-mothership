import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { Play, Film, Music, Clapperboard, Orbit } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';
import { useCameraContext } from '@/context/CameraContext';

const projects = [
  {
    id: 'im-alright',
    title: "I'm Alright (2024)",
    category: 'film',
    runtime: '8 min',
    role: 'Writer–Director',
    description: 'A raw psychological short about addiction and depression during the lockdown.',
    link: 'https://www.youtube.com/watch?v=A8cGpNe2JAE&pp=ygUTbWVuZWxlayBJJ20gYWxyaWdodA%3D%3D',
  },
  {
    id: 'blinded-by-magic',
    title: 'Blinded by Magic (2022)',
    category: 'film',
    runtime: '12 min',
    role: 'Writer–Director',
    description: 'A cursed camera grants visions and powers — at the cost of the user’s sight.',
    link: 'https://www.youtube.com/watch?v=ivsCBuD1JYQ&pp=ygUYbWVuZWxlayBibGluZGVkIGJ5IG1hZ2lj',
  },
  {
    id: 'heroes-and-gods',
    title: 'Heroes & Gods (2024)',
    category: 'film',
    runtime: '120 min',
    role: 'Writer–Director, Editor',
    description: 'Ten-part anthology fused into a feature film — gods, vengeance, superheroes, lore foundations.',
    link: 'https://www.youtube.com/watch?v=jtiOv0OvD-0&pp=ygUXbWVuZWxlayBoZXJvZXMgYW5kIGdvZHM%3D',
  },
  {
    id: 'spar-doc',
    title: 'SPAR (Doc, 2024)',
    category: 'doc',
    runtime: '14 min',
    role: 'Director, Cinematographer, Editor',
    description: 'BTS-style boxing pilot documentary shot in London’s Left Hook Gym.',
    link: 'https://www.youtube.com/watch?v=4q6X6prhVOE',
  },
  {
    id: 'soldier',
    title: 'Soldier (Music Video)',
    category: 'music',
    runtime: '3 min',
    role: 'Director, Editor',
    description: 'Full-cycle creative direction — concept, video, cover art.',
    link: 'https://www.youtube.com/watch?v=BHPaJieCAXY&pp=ygUMd29udSBzb2xkaWVy0gcJCfsJAYcqIYzv',
  },
  {
    id: 'abranteers',
    title: 'Abranteers (Proof, 2023)',
    category: 'film',
    runtime: '9 min',
    role: 'Writer–Director',
    description: 'Anti-magic vet + rookie take on a dangerous magic user.',
    link: 'https://www.youtube.com/shorts/CPPkq5zsXgE',
  },
];

const filmThemes = {
  film: {
    panel: 'from-[#1f1632]/85 via-[#271d3e]/75 to-[#06040c]/90',
    halo: 'from-purple-300/35 via-indigo-200/15 to-transparent',
    icon: 'from-purple-400 to-fuchsia-400',
    iconComponent: Clapperboard,
    badge: 'Feature & Narrative',
  },
  music: {
    panel: 'from-[#2c1224]/85 via-[#4a1f3e]/75 to-[#09030f]/90',
    halo: 'from-amber-200/40 via-rose-200/15 to-transparent',
    icon: 'from-amber-400 to-rose-400',
    iconComponent: Music,
    badge: 'Music Video',
  },
  doc: {
    panel: 'from-[#0f1f1f]/85 via-[#14363c]/75 to-[#04090c]/90',
    halo: 'from-cyan-200/40 via-emerald-200/15 to-transparent',
    icon: 'from-cyan-300 to-emerald-400',
    iconComponent: Orbit,
    badge: 'Documentary',
  },
};

const filters = [
  { id: 'all', label: 'All', icon: Play },
  { id: 'film', label: 'Films', icon: Film },
  { id: 'doc', label: 'Documentary', icon: Orbit },
  { id: 'music', label: 'Music Videos', icon: Music },
];

export default function FilmsSection() {
  const [filter, setFilter] = useState('all');
  const { currentLens } = useCameraContext();

  const filteredVideos = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter]);

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
          Cinematic storytelling, sonic visuals, and immersive documentary craft
        </motion.p>

        <div className="flex flex-wrap gap-2 md:gap-4 mb-8">
          {filters.map((btn) => {
            const Icon = btn.icon;
            const isActive = filter === btn.id;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-3 md:px-6 py-2 md:py-3 rounded-full flex items-center gap-2 mono font-semibold transition-all text-xs md:text-sm uppercase tracking-[0.2em] ${
                  isActive
                    ? 'bg-[color:var(--accent-500)]/20 text-[color:var(--accent-300)] border border-[color:var(--accent-400)]/60 shadow-[0_10px_30px_rgba(0,0,0,0.35)]'
                    : 'bg-white/5 border border-white/10 hover:border-white/25'
                }`}
              >
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
                <span>{btn.label}</span>
              </button>
            );
          })}
        </div>

        <div className={`grid ${getGridCols()} gap-5 md:gap-6 transition-all duration-700`}>
          {filteredVideos.map((project, index) => {
            const theme = filmThemes[project.category] || filmThemes.film;
            const Icon = theme.iconComponent;
            return (
              <motion.a
                key={project.id}
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="group block rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              >
                <div className="relative aspect-video">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="relative z-10 h-full w-full p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <IconBox icon={Icon} gradient={theme.icon} size="md" className="shadow-xl" />
                      <div className="rounded-full px-3 py-1 bg-black/35 backdrop-blur-sm text-[11px] mono uppercase tracking-[0.35em] text-white">
                        {theme.badge || project.category}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-white/80">
                        <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur">
                          <Play className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="mono text-[11px] uppercase tracking-[0.35em] text-white/70">Runtime</p>
                          <p className="text-sm font-semibold text-white">{project.runtime}</p>
                        </div>
                      </div>
                      <div className="rounded-full px-4 py-2 bg-[rgba(6,10,18,0.8)] text-white text-xs mono uppercase tracking-[0.3em]">
                        View Project
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-[color:var(--surface-raised)] text-[color:var(--text-primary)]">
                  <h3 className="text-xl font-semibold mb-2 leading-tight">{project.title}</h3>
                  <p className="text-sm text-[color:var(--text-secondary)] mb-4 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs mono uppercase tracking-[0.3em] text-[color:var(--text-tertiary)]">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[color:var(--text-primary)]/80">
                      {project.role}
                    </span>
                    <span>{project.runtime}</span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
