import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Camera, Film, Brain, Code, Sparkles, Heart, Video, Pen, Linkedin, Instagram, Youtube, Music, Mail } from 'lucide-react';

// Matched word-icon pairs for consistent theming
const rotatingContent = [
  { word: 'Friend', icon: Heart, gradient: 'from-pink-600 to-rose-600' },
  { word: 'Brother', icon: Heart, gradient: 'from-pink-600 to-rose-600' },
  { word: 'Photographer', icon: Camera, gradient: 'from-blue-600 to-cyan-600' },
  { word: 'Filmmaker', icon: Film, gradient: 'from-red-600 to-orange-600' },
  { word: 'Director', icon: Film, gradient: 'from-red-600 to-orange-600' },
  { word: 'Producer', icon: Video, gradient: 'from-indigo-600 to-purple-600' },
  { word: 'Video Editor', icon: Video, gradient: 'from-indigo-600 to-purple-600' },
  { word: 'Author', icon: Pen, gradient: 'from-teal-600 to-cyan-600' },
  { word: 'Screenwriter', icon: Pen, gradient: 'from-teal-600 to-cyan-600' },
  { word: 'Vibe Coder', icon: Code, gradient: 'from-green-600 to-emerald-600' },
  { word: 'Prompt Engineer', icon: Brain, gradient: 'from-purple-600 to-pink-600' },
  { word: 'Instructor', icon: Sparkles, gradient: 'from-yellow-600 to-orange-600' },
];

const featuredProjects = [
  {
    id: 'ochiyamie',
    title: 'The Last Ochiyamie',
    description: 'Epic fantasy saga now available in print and Kindle editions. Journey into the universe that seeded my cinematic worlds.',
    action: 'View on Amazon',
    href: 'https://www.amazon.com/s?k=The+Last+Ochiyamie',
    stats: ['Novel', 'Worldbuilding', 'Amazon Release'],
    gradient: 'from-emerald-600/70 via-teal-500/60 to-slate-900/85',
  },
  {
    id: 'im-alright',
    title: "I’m Alright — Short Film",
    description: 'Award-winning short film exploring resilience and Afro-futurist identity. Shot on location with hybrid DSLR and mirrorless rigs.',
    action: 'Watch on YouTube',
    href: 'https://www.youtube.com/results?search_query=I%27m+Alright+short+film',
    stats: ['Narrative Film', 'Director', 'YouTube Premiere'],
    gradient: 'from-rose-600/70 via-orange-500/60 to-zinc-900/80',
  },
  {
    id: 'loremaker',
    title: 'The Loremaker Universe',
    description: 'Interactive storyworld that powers my films, games, and novels. Dive into timelines, characters, and the ever-expanding lore.',
    action: 'Explore the Universe',
    href: 'https://loremakeruniverse.com',
    stats: ['Worldbuilding', 'Interactive Hub', 'Transmedia'],
    gradient: 'from-indigo-600/70 via-purple-500/60 to-gray-900/85',
  },
  {
    id: 'starterclass',
    title: 'AI Starterclass by ICUNI',
    description: 'Comprehensive AI curriculum guiding professionals from fundamentals to deployment with real-world creative applications.',
    action: 'Join the Program',
    href: 'https://starterclass.icuni.org',
    stats: ['Education', 'AI Strategy', 'Mentorship'],
    gradient: 'from-blue-600/70 via-cyan-500/60 to-slate-900/85',
  },
];

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/menelekmakonnen', gradient: 'from-blue-600 to-blue-700' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/menelekmakonnen', gradient: 'from-pink-600 to-purple-600' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@menelekmakonnen', gradient: 'from-red-600 to-red-700' },
  { name: 'TikTok', icon: Music, url: 'https://tiktok.com/@menelekmakonnen', gradient: 'from-cyan-600 to-pink-600' },
  { name: 'Email', icon: Mail, url: 'mailto:contact@menelekmakonnen.com', gradient: 'from-orange-600 to-yellow-600' },
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
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === projectIndex ? 'bg-green-400 w-6' : 'bg-white/25 hover:bg-white/40'
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
                  transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                  className={`absolute inset-0 bg-gradient-to-br ${activeProject.gradient}`}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-black/35" aria-hidden="true" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -24 }}
                  transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                  className="relative z-10 p-6 md:p-8 h-full flex flex-col"
                >
                  <div className="space-y-4 flex-1">
                    <h4 className="text-3xl font-bold leading-tight">{activeProject.title}</h4>
                    <p className="text-[color:var(--text-secondary)] leading-relaxed">
                      {activeProject.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {activeProject.stats.map((stat) => (
                        <span
                          key={stat}
                          className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] mono uppercase"
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
            <div className="mb-2">
              Worldbuilder, AI Supernerd and
            </div>
            <div className="relative h-[1.2em]">
              <AnimatePresence mode="popLayout">
                {(() => {
                  const RoleIcon = activeRole.icon;
                  return (
                  <motion.div
                    key={roleIndex}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="text-green-400 absolute flex items-center gap-3"
                  >
                    <RoleIcon className="w-6 h-6" />
                    <span>{activeRole.word}</span>
                  </motion.div>
                  );
                })()}
              </AnimatePresence>
            </div>
          </h1>

          <div className="space-y-4 text-lg text-gray-300">
            <p>
              Welcome to my digital portfolio. I'm Menelek Makonnen, a multidisciplinary creative
              professional specializing in visual storytelling, AI innovation, and world-building.
            </p>
            <p>
              From capturing moments through photography to crafting epic narratives in the
              Loremaker Universe, I blend technical expertise with artistic vision to create
              experiences that inspire and engage.
            </p>
            <p>
              Explore my work to discover how I'm pushing the boundaries of creativity through
              film, AI, and immersive storytelling.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap gap-3 pt-6 justify-center md:justify-start">
            {socialLinks.map((link, i) => {
              const Icon = link.icon;
              return (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="group relative"
                  title={link.name}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${link.gradient} flex items-center justify-center hover:shadow-lg transition-shadow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </motion.a>
              );
            })}
          </div>

          {/* Key achievements */}
          <div className="grid grid-cols-3 gap-4 pt-6">
            {[
              { label: 'Projects', value: '100+' },
              { label: 'Partners', value: '50+' },
              { label: 'Experience', value: '10+ yrs' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="luxury-card text-center"
              >
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
