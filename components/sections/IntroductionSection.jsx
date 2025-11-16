import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import {
  Camera,
  Film,
  Brain,
  Code,
  Sparkles,
  Heart,
  Video,
  Pen,
  ArrowUpRight,
  Linkedin,
  Instagram,
  Youtube,
  Music,
  Mail,
  BookOpen,
  Globe,
  GalleryHorizontalEnd,
} from 'lucide-react';
import IconBox from '@/components/ui/IconBox';
import { useCameraContext } from '@/context/CameraContext';

const personaThemes = {
  kin: {
    gradient: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-200',
  },
  lens: {
    gradient: 'from-sky-500 to-blue-600',
    accent: 'text-sky-200',
  },
  cinema: {
    gradient: 'from-rose-500 to-amber-500',
    accent: 'text-rose-200',
  },
  narrative: {
    gradient: 'from-indigo-500 to-purple-600',
    accent: 'text-indigo-200',
  },
  tech: {
    gradient: 'from-cyan-500 to-emerald-500',
    accent: 'text-cyan-200',
  },
};

const rotatingContent = [
  { word: 'Friend', icon: Heart, theme: 'kin' },
  { word: 'Brother', icon: Heart, theme: 'kin' },
  { word: 'Photographer', icon: Camera, theme: 'lens' },
  { word: 'Filmmaker', icon: Film, theme: 'cinema' },
  { word: 'Director', icon: Film, theme: 'cinema' },
  { word: 'Producer', icon: Video, theme: 'cinema' },
  { word: 'Video Editor', icon: Video, theme: 'cinema' },
  { word: 'Author', icon: Pen, theme: 'narrative' },
  { word: 'Screenwriter', icon: Pen, theme: 'narrative' },
  { word: 'Vibe Coder', icon: Code, theme: 'tech' },
  { word: 'Prompt Engineer', icon: Brain, theme: 'tech' },
  { word: 'Instructor', icon: Sparkles, theme: 'tech' },
];

const spotlightStyles = {
  emerald: {
    panelGradient: 'from-emerald-700/80 via-emerald-500/70 to-slate-950/90',
    sheenGradient: 'from-emerald-300/40 via-teal-300/10 to-transparent',
    iconGradient: 'from-emerald-400 to-teal-400',
  },
  ember: {
    panelGradient: 'from-rose-700/80 via-amber-500/70 to-slate-950/90',
    sheenGradient: 'from-amber-200/40 via-rose-300/10 to-transparent',
    iconGradient: 'from-rose-400 to-amber-400',
  },
  indigo: {
    panelGradient: 'from-indigo-700/80 via-purple-500/70 to-slate-950/90',
    sheenGradient: 'from-indigo-300/45 via-sky-200/15 to-transparent',
    iconGradient: 'from-indigo-400 to-purple-400',
  },
  azure: {
    panelGradient: 'from-sky-700/80 via-cyan-500/70 to-slate-950/90',
    sheenGradient: 'from-sky-200/45 via-cyan-200/15 to-transparent',
    iconGradient: 'from-sky-400 to-cyan-400',
  },
};

const featuredProjects = [
  {
    id: 'ochiyamie',
    title: 'The Last Ochiyamie',
    description:
      'Epic fantasy saga now available in print and Kindle editions. Journey into the universe that seeded my cinematic worlds.',
    action: 'View on Amazon',
    href: 'https://www.amazon.com/s?k=The+Last+Ochiyamie',
    stats: ['Novel', 'Worldbuilding', 'Amazon Release'],
    panelGradient: spotlightStyles.emerald.panelGradient,
    sheenGradient: spotlightStyles.emerald.sheenGradient,
    icon: BookOpen,
    iconGradient: spotlightStyles.emerald.iconGradient,
  },
  {
    id: 'im-alright',
    title: "I’m Alright — Short Film",
    description:
      'Award-winning short film exploring resilience and Afro-futurist identity. Shot on location with hybrid DSLR and mirrorless rigs.',
    action: 'Watch on YouTube',
    href: 'https://www.youtube.com/results?search_query=I%27m+Alright+short+film',
    stats: ['Narrative Film', 'Director', 'YouTube Premiere'],
    panelGradient: spotlightStyles.ember.panelGradient,
    sheenGradient: spotlightStyles.ember.sheenGradient,
    icon: Film,
    iconGradient: spotlightStyles.ember.iconGradient,
  },
  {
    id: 'loremaker',
    title: 'The Loremaker Universe',
    description:
      'Interactive storyworld that powers my films, games, and novels. Dive into timelines, characters, and the ever-expanding lore.',
    action: 'Explore the Universe',
    href: 'https://loremakeruniverse.com',
    stats: ['Worldbuilding', 'Interactive Hub', 'Transmedia'],
    panelGradient: spotlightStyles.indigo.panelGradient,
    sheenGradient: spotlightStyles.indigo.sheenGradient,
    icon: Globe,
    iconGradient: spotlightStyles.indigo.iconGradient,
  },
  {
    id: 'starterclass',
    title: 'AI Starterclass by ICUNI',
    description:
      'Comprehensive AI curriculum guiding professionals from fundamentals to deployment with real-world creative applications.',
    action: 'Join the Program',
    href: 'https://starterclass.icuni.org',
    stats: ['Education', 'AI Strategy', 'Mentorship'],
    panelGradient: spotlightStyles.azure.panelGradient,
    sheenGradient: spotlightStyles.azure.sheenGradient,
    icon: Sparkles,
    iconGradient: spotlightStyles.azure.iconGradient,
  },
];

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/menelekmakonnen',
    gradient: 'from-blue-500 to-sky-500',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/menelek.makonnen',
    gradient: 'from-pink-500 to-purple-500',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@menelekmakonnen',
    gradient: 'from-rose-500 to-red-500',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:admin@menelekmakonnen.com',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    name: 'Director YouTube',
    icon: Youtube,
    url: 'https://www.youtube.com/@director_menelek',
    gradient: 'from-red-500 to-rose-500',
  },
  {
    name: 'Director Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/menelek.makonnen/',
    gradient: 'from-fuchsia-500 to-rose-500',
  },
  {
    name: 'Loremaker Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/lore.maker',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    name: 'ICUNI Instagram',
    icon: Instagram,
    url: 'https://www.instagram.com/icuni_',
    gradient: 'from-cyan-500 to-blue-500',
  },
];

export default function IntroductionSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const [projectPreviews, setProjectPreviews] = useState({});
  const previewInitiatedRef = useRef(new Set());
  const { openGalleriaHome } = useCameraContext();

  useEffect(() => {
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % rotatingContent.length);
      setCycleCount((prev) => prev + 1);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (cycleCount === 0) return;
    if (cycleCount % 4 === 0) {
      setProjectIndex((prev) => (prev + 1) % featuredProjects.length);
    }
  }, [cycleCount]);

  useEffect(() => {
    featuredProjects.forEach((project) => {
      if (previewInitiatedRef.current.has(project.href)) return;
      previewInitiatedRef.current.add(project.href);
      setProjectPreviews((prev) => ({ ...prev, [project.href]: { status: 'loading' } }));
      (async () => {
        try {
          const response = await fetch(`/api/link-preview?url=${encodeURIComponent(project.href)}`);
          if (!response.ok) {
            throw new Error('Failed to load preview');
          }
          const data = await response.json();
          setProjectPreviews((prev) => ({ ...prev, [project.href]: { status: 'ready', data } }));
        } catch (error) {
          console.error('Project preview failed', project.href, error);
          setProjectPreviews((prev) => ({ ...prev, [project.href]: { status: 'error' } }));
        }
      })();
    });
  }, []);

  const activeRole = rotatingContent[roleIndex];
  const activeProject = featuredProjects[projectIndex];
  const activeProjectPreview = projectPreviews[activeProject.href];
  const activeProjectImage = activeProjectPreview?.data?.image;
  const personaTheme = personaThemes[activeRole.theme];

  return (
    <div className="w-full min-h-screen flex items-center justify-center px-6 sm:px-8 lg:px-10 pt-32 pb-32">
      <div className="max-w-6xl w-full space-y-10">
        <div className="grid lg:grid-cols-[1.1fr_1fr] gap-12 items-stretch">
        {/* Left - Spotlight slider */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="relative flex flex-col overflow-hidden rounded-3xl border border-white/10 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
            <div className="absolute inset-0 overflow-hidden">
              <AnimatePresence initial={false} mode="popLayout">
                {activeProjectImage && (
                  <motion.div
                    key={`image-${activeProject.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.35 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    className="absolute inset-0"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url(${activeProjectImage})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                      }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.45),rgba(0,0,0,0.75))]" />
                  </motion.div>
                )}
              </AnimatePresence>
              <AnimatePresence initial={false} mode="popLayout">
                <motion.div
                  key={`gradient-${activeProject.id}`}
                  initial={{ opacity: 0.6 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  className={`absolute inset-0 bg-gradient-to-br ${activeProject.panelGradient}`}
                />
              </AnimatePresence>
              <div
                className={`absolute inset-0 bg-gradient-to-br ${activeProject.sheenGradient}`}
                aria-hidden="true"
              />
            </div>

            <div className="relative z-10 flex h-full flex-col gap-8 p-6 md:p-8 lg:p-10">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="inline-flex items-center gap-2 rounded-full bg-black/30 px-4 py-1.5 text-[11px] mono uppercase tracking-[0.45em] text-white/75">
                  <span>Spotlight</span>
                  <span className="text-white/60">Project</span>
                </div>
                <div className="flex items-center gap-2">
                  {featuredProjects.map((project, index) => (
                    <button
                      key={project.id}
                      onClick={() => {
                        setProjectIndex(index);
                        setCycleCount(0);
                      }}
                      className={`h-2.5 w-6 rounded-full border border-white/30 transition-all ${
                        index === projectIndex ? 'bg-white/90 shadow-[0_6px_14px_rgba(0,0,0,0.25)]' : 'bg-white/25 hover:bg-white/45'
                      }`}
                      aria-label={`Show ${project.title}`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
                <div className="flex items-center justify-center">
                  <IconBox icon={activeProject.icon} gradient={activeProject.iconGradient} size="xl" className="shadow-[0_25px_60px_rgba(0,0,0,0.35)]" />
                </div>
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -18 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="flex-1 space-y-6"
                >
                  <div className="space-y-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black/35 px-3 py-1 text-[11px] mono uppercase tracking-[0.4em] text-white/80">
                      <span>Feature</span>
                      <span className="text-white/60">Story</span>
                    </span>
                    <h4 className="text-3xl font-bold leading-tight md:text-4xl">{activeProject.title}</h4>
                    <p className="text-[color:var(--text-secondary)] text-base leading-relaxed md:text-lg">
                      {activeProject.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {activeProject.stats.map((stat) => (
                      <span
                        key={stat}
                        className="px-3 py-1 rounded-full bg-[rgba(10,12,18,0.55)] border border-white/25 text-[11px] mono uppercase text-white/85"
                      >
                        {stat}
                      </span>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <motion.a
                      href={activeProject.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-3 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/90 shadow-[0_20px_44px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all hover:bg-white/15"
                      whileHover={{ scale: 1.04, translateY: -2 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      <span>{activeProject.action}</span>
                      <ArrowUpRight className="w-4 h-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" />
                    </motion.a>
                    <motion.button
                      type="button"
                      onClick={openGalleriaHome}
                      className="group relative overflow-hidden rounded-full border-2 border-white/40 px-8 py-4 text-left text-white shadow-[0_15px_50px_rgba(0,0,0,0.4)]"
                      whileHover={{ scale: 1.05, translateY: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-emerald-400/40 via-cyan-400/35 to-blue-500/45 opacity-90 blur-[1px] transition group-hover:opacity-100" />
                      <span className="relative z-10 flex items-center gap-4">
                        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/30">
                          <GalleryHorizontalEnd className="h-5 w-5" />
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs mono uppercase tracking-[0.55em] text-white/70">Immersive</span>
                          <span className="text-lg font-semibold uppercase tracking-[0.35em]">Launch Galleria</span>
                        </span>
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          <div className="camera-hud rounded-3xl border border-white/10 px-6 py-5">
            <div className="text-sm text-[color:var(--text-secondary)] leading-relaxed">
              Every featured project connects to the persona cycling to your right. Watch the HUD swap focus every fourth title change.
            </div>
          </div>
        </motion.div>

        {/* Right - Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="space-y-6"
        >
          <h1 className="text-5xl font-bold leading-tight">
            <div className="mb-2">Worldbuilder, AI Supernerd and</div>
            <div className="relative h-[1.2em]">
              <AnimatePresence mode="popLayout">
                {(() => {
                  const RoleIcon = activeRole.icon;
                  return (
                    <motion.div
                      key={activeRole.word}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
                      className={`absolute inset-0 flex items-center gap-3 bg-clip-text text-transparent bg-gradient-to-r ${personaTheme.gradient}`}
                    >
                      <RoleIcon className={`w-8 h-8 ${personaTheme.accent}`} />
                      <span>{activeRole.word}</span>
                    </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </h1>

          <div className="space-y-4 text-lg text-[color:var(--text-secondary)]">
            <p>
              Welcome to my digital portfolio. I’m Menelek Makonnen, a multidisciplinary creative professional specialising in visual storytelling,
              AI innovation, and world-building.
            </p>
            <p>
              From capturing moments through photography to crafting epic narratives in the Loremaker Universe, I blend technical expertise with
              artistic vision to create experiences that inspire and engage.
            </p>
            <p>
              Explore my work to discover how I push the boundaries of creativity through film, AI, and immersive storytelling.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 pt-6">
            {[
              { label: 'Projects', value: '100+' },
              { label: 'Partners', value: '50+' },
              { label: 'Experience', value: '10+ yrs' },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08 }}
                className="camera-hud rounded-2xl border border-white/10 px-4 py-5 text-center"
              >
                <div className="text-3xl font-semibold text-[color:var(--accent)] mb-1">{stat.value}</div>
                <div className="text-xs uppercase mono tracking-[0.35em] text-[color:var(--text-secondary)]">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-flow-col auto-cols-fr gap-3 rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.75)] p-4 overflow-x-auto scrollbar-hide"
      >
        {socialLinks.slice(0, 8).map((link) => {
          const Icon = link.icon;
          return (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex h-14 min-w-[3.5rem] items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br ${link.gradient} transition-all hover:-translate-y-1 hover:border-white/25`}
            >
              <span className="sr-only">{link.name}</span>
              <IconBox icon={Icon} gradient={link.gradient} size="sm" />
            </a>
          );
        })}
      </motion.div>
    </div>
  </div>
  );
}
