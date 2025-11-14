import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
  Camera,
  Film,
  Brain,
  Code,
  Sparkles,
  Heart,
  Video,
  Pen,
  Linkedin,
  Instagram,
  Youtube,
  Music,
  Mail,
  BookOpen,
  Globe,
} from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

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
    gradient: 'linear-gradient(135deg, rgba(18, 42, 36, 0.95) 0%, rgba(12, 32, 42, 0.94) 52%, rgba(6, 14, 24, 0.96) 100%)',
    iconGradient: 'from-emerald-400 to-teal-400',
  },
  ember: {
    gradient: 'linear-gradient(135deg, rgba(48, 20, 28, 0.95) 0%, rgba(54, 24, 18, 0.92) 50%, rgba(20, 12, 16, 0.96) 100%)',
    iconGradient: 'from-rose-400 to-amber-400',
  },
  indigo: {
    gradient: 'linear-gradient(135deg, rgba(28, 22, 60, 0.94) 0%, rgba(18, 30, 64, 0.93) 54%, rgba(10, 14, 28, 0.96) 100%)',
    iconGradient: 'from-indigo-400 to-purple-400',
  },
  azure: {
    gradient: 'linear-gradient(135deg, rgba(12, 36, 58, 0.94) 0%, rgba(14, 48, 66, 0.92) 52%, rgba(8, 14, 24, 0.95) 100%)',
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
    gradient: spotlightStyles.emerald.gradient,
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
    gradient: spotlightStyles.ember.gradient,
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
    gradient: spotlightStyles.indigo.gradient,
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
    gradient: spotlightStyles.azure.gradient,
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
    tagline: 'Professional network',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/menelekmakonnen',
    gradient: 'from-pink-500 to-purple-500',
    tagline: 'Visual narratives',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@menelekmakonnen',
    gradient: 'from-rose-500 to-red-500',
    tagline: 'Films & edits',
  },
  {
    name: 'TikTok',
    icon: Music,
    url: 'https://tiktok.com/@menelekmakonnen',
    gradient: 'from-cyan-500 to-fuchsia-500',
    tagline: 'Short form stories',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:contact@menelekmakonnen.com',
    gradient: 'from-amber-500 to-orange-500',
    tagline: 'Direct connect',
  },
];

export default function IntroductionSection() {
  const [roleIndex, setRoleIndex] = useState(0);
  const [projectIndex, setProjectIndex] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);

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

  const activeRole = rotatingContent[roleIndex];
  const activeProject = featuredProjects[projectIndex];
  const personaTheme = personaThemes[activeRole.theme];

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 pt-32 pb-32">
      <div className="max-w-6xl w-full grid lg:grid-cols-[1.1fr_1fr] gap-12 items-stretch">
        {/* Left - Spotlight slider */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col gap-6"
        >
          <div className="camera-hud rounded-3xl border border-white/10 overflow-hidden flex-1 flex flex-col relative">
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.45em] text-green-400/70">Spotlight</p>
                <h3 className="text-3xl font-semibold mt-2">Featured Project</h3>
              </div>
              <div className="flex items-center gap-2">
                {featuredProjects.map((project, index) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      setProjectIndex(index);
                      setCycleCount(0);
                    }}
                    className={`h-2.5 rounded-full transition-all ${
                      index === projectIndex ? 'bg-green-400 w-6' : 'bg-white/25 hover:bg-white/40 w-2.5'
                    }`}
                    aria-label={`Show ${project.title}`}
                  />
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden flex-1">
              <AnimatePresence initial={false} mode="sync">
                <motion.div
                  key={`gradient-${activeProject.id}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ backgroundImage: activeProject.gradient }}
                  className="absolute inset-0"
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/10" aria-hidden="true" />
              <AnimatePresence mode="sync">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="relative z-10 p-6 md:p-8 h-full flex flex-col"
                >
                  <IconBox icon={activeProject.icon} gradient={activeProject.iconGradient} size="lg" className="mb-6" />
                  <div className="space-y-4 flex-1">
                    <h4 className="text-3xl font-bold leading-tight">{activeProject.title}</h4>
                    <p className="text-[color:var(--text-secondary)] leading-relaxed">
                      {activeProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.stats.map((stat) => (
                        <span
                          key={stat}
                          className="px-3 py-1 rounded-full bg-white/10 border border-white/15 text-[11px] mono uppercase"
                        >
                          {stat}
                        </span>
                      ))}
                    </div>
                  </div>

                  <motion.a
                    href={activeProject.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="self-start mt-auto px-6 py-3 rounded-full border border-green-400/50 text-green-300 font-semibold hover:bg-green-500/10 transition-all"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    {activeProject.action}
                  </motion.a>
                </motion.div>
              </AnimatePresence>
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
                <div className="text-3xl font-semibold text-green-300 mb-1">{stat.value}</div>
                <div className="text-xs uppercase mono tracking-[0.35em] text-white/60">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4">
            {socialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                  whileHover={{ y: -6 }}
                  className="camera-hud rounded-2xl border border-white/10 px-4 py-4 flex items-center gap-4 group"
                >
                  <IconBox icon={Icon} gradient={link.gradient} size="md" />
                  <div>
                    <div className="font-semibold">{link.name}</div>
                    <div className="text-[12px] text-[color:var(--text-secondary)]">{link.tagline}</div>
                  </div>
                </motion.a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
