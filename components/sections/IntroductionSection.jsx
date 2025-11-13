import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import IconBox from '@/components/ui/IconBox';
import { Camera, Film, Brain, Code, Sparkles, Heart, Video, Pen, Linkedin, Instagram, Youtube, Music, Mail, Globe } from 'lucide-react';

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

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/menelekmakonnen', gradient: 'from-blue-600 to-blue-700' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/menelekmakonnen', gradient: 'from-pink-600 to-purple-600' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/@menelekmakonnen', gradient: 'from-red-600 to-red-700' },
  { name: 'TikTok', icon: Music, url: 'https://tiktok.com/@menelekmakonnen', gradient: 'from-cyan-600 to-pink-600' },
  { name: 'Email', icon: Mail, url: 'mailto:contact@menelekmakonnen.com', gradient: 'from-orange-600 to-yellow-600' },
];

export default function IntroductionSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Rotate content every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % rotatingContent.length);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 pt-32 overflow-auto">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">
        {/* Left - Rotating Icon */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="aspect-square rounded-2xl overflow-hidden border-2 border-green-500/30 shadow-2xl bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full"
              >
                <IconBox
                  icon={rotatingContent[currentIndex].icon}
                  gradient={rotatingContent[currentIndex].gradient}
                  size="xl"
                  className="w-full h-full !rounded-3xl"
                />
              </motion.div>
            </AnimatePresence>
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
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="text-green-400"
              >
                {rotatingContent[currentIndex].word}
              </motion.div>
            </AnimatePresence>
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
