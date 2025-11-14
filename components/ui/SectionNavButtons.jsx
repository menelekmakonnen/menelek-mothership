import { motion, AnimatePresence } from 'framer-motion';
import { Home, Film, BookOpen, Brain, Video, Camera, Image, FileText, Link2 } from 'lucide-react';

const sections = [
  { id: 0, name: 'Home', icon: Home, gradient: 'from-green-600 to-emerald-600' },
  { id: 1, name: 'Films', icon: Film, gradient: 'from-red-600 to-orange-600' },
  { id: 2, name: 'Loremaker', icon: BookOpen, gradient: 'from-purple-600 to-pink-600' },
  { id: 3, name: 'AI Projects', icon: Brain, gradient: 'from-blue-600 to-cyan-600' },
  { id: 4, name: 'Video Edits', icon: Video, gradient: 'from-indigo-600 to-purple-600' },
  { id: 5, name: 'Photography', icon: Camera, gradient: 'from-teal-600 to-cyan-600' },
  { id: 6, name: 'AI Albums', icon: Image, gradient: 'from-pink-600 to-rose-600' },
  { id: 7, name: 'Blog', icon: FileText, gradient: 'from-yellow-600 to-orange-600' },
  { id: 8, name: 'Links', icon: Link2, gradient: 'from-cyan-600 to-blue-600' },
];

export default function SectionNavButtons({ currentSection, onNavigate }) {
  // Filter out the current section
  const visibleSections = sections.filter(section => section.id !== currentSection);

  const topOffset = `calc(var(--camera-top-rail-height, 112px) + 16px)`;

  return (
    <div
      className="fixed z-[1400] w-full px-4 sm:px-6 flex justify-center pointer-events-none"
      style={{ top: topOffset }}
    >
      <div className="pointer-events-auto w-full max-w-4xl">
        <div className="camera-hud rounded-full border border-white/10 px-4 py-2 shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-3 overflow-x-auto scrollbar-hide">
            <AnimatePresence mode="popLayout">
              {visibleSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => onNavigate(section.id)}
                    className={`bg-gradient-to-br ${section.gradient} p-3 rounded-2xl transition-all shadow-lg border border-white/20 group flex-shrink-0`}
                    whileTap={{ scale: 0.95 }}
                    whileHover={{ y: -2, boxShadow: '0 20px 40px rgba(0, 255, 136, 0.3)' }}
                    initial={{ opacity: 0, scale: 0.8, x: -20 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                    title={section.name}
                  >
                    <Icon className="w-5 h-5 text-white" />
                    <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-[rgba(10,12,18,0.9)] px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-white">
                      {section.name}
                    </span>
                  </motion.button>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
