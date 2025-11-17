import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Play, Film, Music, Clapperboard, Orbit, Loader2, ArrowLeft, ExternalLink, X } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';
import { useCameraContext } from '@/context/CameraContext';
import { parseMediaLink } from '@/lib/mediaLinks';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';

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
  {
    id: 'invertebrate',
    title: 'Invertebrate — Beenie G',
    category: 'music',
    runtime: '4 min',
    role: 'Director, Editor',
    description: 'Moody performance-driven visuals captured for Beenie G’s “Invertebrate.”',
    link: 'https://youtu.be/y4a6naAuf3U?si=38WQZw9Pqx55PXhn',
  },
  {
    id: 'cameo-chick',
    title: 'Cameo Chick — CHXY',
    category: 'music',
    runtime: '3 min',
    role: 'Director, Editor',
    description: 'High-fashion flair and choreographed energy for CHXY’s “Cameo Chick.”',
    link: 'https://youtu.be/-hx6g3KLexE?si=TewLcc2agh6fvlVy',
  },
  {
    id: 'imperfect',
    title: 'Imperfect — Wonu',
    category: 'music',
    runtime: '4 min',
    role: 'Director, Editor',
    description: 'Intimate storytelling and cinematic lighting for Wonu’s “Imperfect.”',
    link: 'https://youtu.be/pb9l2ZI6A3E?si=Sk4cd5YpyQ3fyJHr',
  },
];

const filmThemes = {
  film: {
    panel: 'from-[#1f1632]/35 via-[#271d3e]/28 to-[#06040c]/38',
    halo: 'from-purple-300/25 via-indigo-200/12 to-transparent',
    icon: 'from-purple-400 to-fuchsia-400',
    iconComponent: Clapperboard,
    badge: 'Feature & Narrative',
  },
  music: {
    panel: 'from-[#2c1224]/35 via-[#4a1f3e]/28 to-[#09030f]/38',
    halo: 'from-amber-200/28 via-rose-200/12 to-transparent',
    icon: 'from-amber-400 to-rose-400',
    iconComponent: Music,
    badge: 'Music Video',
  },
  doc: {
    panel: 'from-[#0f1f1f]/35 via-[#14363c]/28 to-[#04090c]/38',
    halo: 'from-cyan-200/28 via-emerald-200/12 to-transparent',
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
  const {
    currentLens,
    registerGalleriaSection,
    engageGalleriaSection,
    releaseGalleriaSection,
  } = useCameraContext();
  const [previews, setPreviews] = useState({});
  const initiatedRef = useRef(new Set());
  const [activeProjectId, setActiveProjectId] = useState(null);

  const scrollToActiveLayer = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }, []);

  useEffect(() => {
    projects.forEach((project) => {
      if (!project.link || initiatedRef.current.has(project.link)) return;
      initiatedRef.current.add(project.link);
      setPreviews((prev) => ({ ...prev, [project.link]: { status: 'loading' } }));
      (async () => {
        try {
          const response = await fetch(`/api/link-preview?url=${encodeURIComponent(project.link)}`);
          if (!response.ok) {
            throw new Error('Failed to load preview');
          }
          const data = await response.json();
          setPreviews((prev) => ({ ...prev, [project.link]: { status: 'ready', data } }));
        } catch (error) {
          console.error('Preview fetch failed for film', project.link, error);
          setPreviews((prev) => ({ ...prev, [project.link]: { status: 'error' } }));
        }
      })();
    });
  }, []);

  useEffect(() => {
    if (activeProjectId) {
      scrollToActiveLayer();
    }
  }, [activeProjectId, scrollToActiveLayer]);

  const filteredVideos = useMemo(() => {
    if (filter === 'all') return projects;
    return projects.filter((project) => project.category === filter);
  }, [filter]);

  const activeProject = useMemo(
    () => projects.find((project) => project.id === activeProjectId) || null,
    [activeProjectId]
  );

  const resolvePreview = useCallback(
    (project) => {
      const preview = previews[project.link];
      const mediaMeta = parseMediaLink(project.link);
      const fallbackImage = mediaMeta?.thumbnailUrl || null;

      return {
        status: preview?.status || (fallbackImage ? 'fallback' : 'idle'),
        image: preview?.data?.image || fallbackImage,
        description: preview?.data?.description || project.description,
      };
    },
    [previews]
  );

  const openProject = useCallback(
    (projectId) => {
      setActiveProjectId(projectId);
      scrollToActiveLayer();
    },
    [scrollToActiveLayer]
  );

  const closeProject = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  const openDefaultProject = useCallback(() => {
    const target = filteredVideos[0] || projects[0];
    if (target) {
      openProject(target.id);
    }
  }, [filteredVideos, openProject]);

  useEffect(() => {
    const unregister = registerGalleriaSection('films', {
      label: 'Films & Music Videos',
      openDefault: openDefaultProject,
    });
    return unregister;
  }, [openDefaultProject, registerGalleriaSection]);

  useEffect(() => {
    if (activeProjectId) {
      engageGalleriaSection('films', closeProject);
      return () => releaseGalleriaSection('films');
    }
    return undefined;
  }, [activeProjectId, closeProject, engageGalleriaSection, releaseGalleriaSection]);

  // Calculate grid columns based on lens zoom
  // zoom: 0.7 (widest) -> 4 cols, 0.85 -> 3 cols, 0.9-1.0 -> 3 cols, 1.2+ -> 2 cols
  const getGridCols = () => {
    const zoom = currentLens.zoom;
    if (zoom <= 0.7) return 'grid-cols-2 md:grid-cols-4'; // Wide angle: 2 mobile, 4 desktop
    if (zoom <= 0.9) return 'grid-cols-2 md:grid-cols-3'; // Normal-wide: 2 mobile, 3 desktop
    if (zoom <= 1.0) return 'grid-cols-2 md:grid-cols-3'; // Normal: 2 mobile, 3 desktop
    return 'grid-cols-2 md:grid-cols-2'; // Telephoto: 2 mobile, 2 desktop
  };

  const renderProjectLightbox = () => {
    if (!activeProject) return null;
    const preview = resolvePreview(activeProject);
    const mediaMeta = parseMediaLink(activeProject.link);
    const embedUrl = mediaMeta?.embedUrl;
    const provider = mediaMeta?.provider || 'unknown';
    const isVertical = provider === 'instagram' || /shorts/i.test(activeProject.link || '');
    const aspectClass = isVertical ? 'aspect-[9/16]' : 'aspect-video';
    const playerShellClass = isVertical
      ? 'mx-auto w-full max-w-sm sm:max-w-md lg:max-w-[520px]'
      : 'w-full max-w-5xl';
    const siblingProjects = filteredVideos.filter((project) => project.id !== activeProject.id);
    const handleWheelNavigate = (direction) => {
      if (!filteredVideos.length) return;
      const currentIndex = filteredVideos.findIndex((project) => project.id === activeProject.id);
      if (currentIndex === -1) return;
      const nextIndex = direction === 'next'
        ? (currentIndex + 1) % filteredVideos.length
        : (currentIndex - 1 + filteredVideos.length) % filteredVideos.length;
      const nextProject = filteredVideos[nextIndex];
      if (nextProject) {
        setActiveProjectId(nextProject.id);
      }
    };

    return (
      <FullscreenLightbox
        key={`film-${activeProject.id}`}
        layerId={`film-${activeProject.id}`}
        depth={5200}
        onClose={closeProject}
        innerClassName="p-0 overflow-hidden"
        galleriaSectionId="films"
        showGalleriaChrome
        onWheelNavigate={handleWheelNavigate}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.92, scale: 0.97 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(6,8,16,0.96)] shadow-[0_55px_150px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="space-y-1">
              <button
                type="button"
                onClick={closeProject}
                className="flex items-center gap-2 text-xs mono uppercase tracking-[0.35em] text-green-300 hover:text-green-100"
              >
                <ArrowLeft className="h-4 w-4" /> Back to films
              </button>
              <h2 className="text-3xl font-semibold text-white">{activeProject.title}</h2>
              <p className="text-sm text-white/65">{activeProject.description}</p>
            </div>
            <button
              type="button"
              onClick={closeProject}
              className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
              aria-label="Close project"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

              <div className="flex-1 overflow-hidden">
                <div className="flex h-full flex-col overflow-y-auto px-6 pb-6 pt-4 lg:flex-row lg:gap-6">
                  <div className="flex flex-1 items-center justify-center">
                    <div className={`relative ${playerShellClass}`}>
                      <div
                        className={`relative w-full ${aspectClass} ${isVertical ? 'max-h-[72vh]' : 'max-h-[80vh]'} overflow-hidden rounded-[28px] border border-white/10 bg-black/80 shadow-[0_45px_120px_rgba(0,0,0,0.6)]`}
                      >
                        {embedUrl ? (
                          <iframe
                            key={embedUrl}
                            src={`${embedUrl}${provider === 'youtube' ? '?autoplay=1&rel=0' : ''}`}
                            className="absolute inset-0 h-full w-full"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            title={activeProject.title}
                          />
                        ) : (
                          <div
                            className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white/70"
                            style={{
                              backgroundImage: preview.image ? `url(${preview.image})` : undefined,
                              backgroundSize: 'cover',
                              backgroundPosition: 'center',
                            }}
                          >
                            {!preview.image && <Play className="h-14 w-14" />}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
              <aside className="flex w-full flex-col gap-6 border-t border-white/10 bg-[rgba(10,12,20,0.88)] p-6 lg:w-[320px] lg:border-t-0 lg:border-l xl:w-[360px]">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] mono uppercase tracking-[0.4em] text-white/70">
                    {provider === 'youtube' ? 'YouTube' : provider === 'instagram' ? 'Instagram' : 'Media'}
                    <span className="rounded-full bg-white/10 px-2 py-[2px] text-[9px] mono">{activeProject.runtime}</span>
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed">{preview.description}</p>
                  <div className="flex flex-wrap gap-2 text-xs mono uppercase tracking-[0.35em] text-white/60">
                    <span className="rounded-full bg-white/10 px-3 py-1">{activeProject.role}</span>
                    <span className="rounded-full bg-white/10 px-3 py-1">{activeProject.category}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">More Films</h3>
                  <div className="flex max-h-[50vh] flex-col gap-3 overflow-y-auto pr-1">
                    {siblingProjects.length ? (
                      siblingProjects.map((project) => {
                        const siblingPreview = resolvePreview(project);
                        return (
                          <button
                            key={project.id}
                            type="button"
                            onClick={() => setActiveProjectId(project.id)}
                            className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-left transition-all hover:border-white/35"
                          >
                            <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-black/35">
                              {siblingPreview.image ? (
                                <img src={siblingPreview.image} alt={project.title} className="h-full w-full object-cover" loading="lazy" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-white/60">
                                  <Play className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="mono text-[10px] uppercase tracking-[0.35em] text-white/60">{project.category}</p>
                              <p className="text-sm font-semibold text-white/85 truncate">{project.title}</p>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <p className="text-xs text-white/60">No other films in this view yet.</p>
                    )}
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={closeProject}
                    className="camera-hud flex items-center gap-2 rounded-full px-4 py-2 text-xs mono uppercase tracking-[0.35em]"
                  >
                    Close
                  </button>
                  {activeProject.link && (
                    <a
                      href={activeProject.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs mono uppercase tracking-[0.35em] text-white/80 hover:text-white"
                    >
                      Watch Source
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </FullscreenLightbox>
    );
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 pt-32 pb-32">
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
            const { image, status, description: summary } = resolvePreview(project);

            return (
              <motion.button
                key={project.id}
                type="button"
                onClick={() => openProject(project.id)}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="group block rounded-3xl overflow-hidden border border-white/10 hover:border-white/30 transition-all shadow-[0_25px_60px_rgba(0,0,0,0.55)] focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/40 focus-visible:ring-[color:var(--accent-400)]"
              >
                <div className="relative aspect-video overflow-hidden">
                  {image && (
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                  )}
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="absolute inset-0 bg-black/6" />
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
                  {status === 'loading' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 animate-spin text-white/80" />
                    </div>
                  )}
                  {status === 'fallback' && (
                    <div className="absolute inset-x-0 bottom-3 flex justify-center">
                      <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] mono uppercase tracking-[0.35em] text-white/70">
                        Live preview
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-6 bg-[color:var(--surface-raised)] text-[color:var(--text-primary)]">
                  <h3 className="text-xl font-semibold mb-2 leading-tight">{project.title}</h3>
                  <p className="text-sm text-[color:var(--text-secondary)] mb-4 leading-relaxed">{summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs mono uppercase tracking-[0.3em] text-[color:var(--text-tertiary)]">
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[color:var(--text-primary)]/80">
                      {project.role}
                    </span>
                    <span>{project.runtime}</span>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>{renderProjectLightbox()}</AnimatePresence>
    </div>
  );
}
