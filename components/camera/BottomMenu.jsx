import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronUp, User, Film, BookOpen, Brain, Video, Camera, Sparkles, Image, Link2 } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

const quickNavLinks = [
  { name: 'Intro', icon: User, section: 0, gradient: 'from-purple-600 to-blue-600' },
  { name: 'Films', icon: Film, section: 1, gradient: 'from-red-600 to-orange-600' },
  { name: 'Loremaker', icon: BookOpen, section: 2, gradient: 'from-green-600 to-emerald-600' },
  { name: 'AI', icon: Brain, section: 3, gradient: 'from-fuchsia-600 to-pink-600' },
  { name: 'Edits', icon: Video, section: 4, gradient: 'from-yellow-600 to-orange-600' },
  { name: 'Photos', icon: Camera, section: 5, gradient: 'from-cyan-600 to-blue-600' },
  { name: 'AI Art', icon: Sparkles, section: 6, gradient: 'from-violet-600 to-purple-600' },
  { name: 'Blog', icon: Image, section: 7, gradient: 'from-teal-600 to-green-600' },
  { name: 'Connect', icon: Link2, section: 8, gradient: 'from-pink-600 to-purple-600' },
];

export default function BottomMenu() {
  const { isBottomMenuOpen, setIsBottomMenuOpen, currentSection, setCurrentSection } = useCameraContext();

  const toggleMenu = () => {
    setIsBottomMenuOpen(!isBottomMenuOpen);
  };

  const handleNavClick = (section) => {
    setCurrentSection(section);
    setIsBottomMenuOpen(false); // Close menu after selection
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1400] pointer-events-none">
      {/* Toggle Button - Always visible, more prominent */}
      <div className="flex justify-center pb-3 pointer-events-auto">
        <motion.button
          onClick={toggleMenu}
          className="camera-hud px-6 py-3 rounded-t-xl flex items-center gap-3 mono text-sm font-bold hover:bg-green-500/10 transition-colors shadow-lg border-t-2 border-green-500/30"
          whileTap={{ scale: 0.95 }}
          whileHover={{ y: -2 }}
          animate={{
            boxShadow: isBottomMenuOpen
              ? '0 0 0 rgba(34, 197, 94, 0)'
              : ['0 0 10px rgba(34, 197, 94, 0.3)', '0 0 20px rgba(34, 197, 94, 0.5)', '0 0 10px rgba(34, 197, 94, 0.3)']
          }}
          transition={{
            boxShadow: {
              repeat: Infinity,
              duration: 2,
              ease: 'easeInOut'
            }
          }}
          title={isBottomMenuOpen ? 'Hide menu' : 'Show menu'}
        >
          <motion.div
            animate={{ rotate: isBottomMenuOpen ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <ChevronUp className="w-5 h-5 text-green-400" />
          </motion.div>
          <span className="tracking-wider text-green-400">NAVIGATION</span>
        </motion.button>
      </div>

      {/* Menu Panel - Slides up from bottom */}
      <AnimatePresence>
        {isBottomMenuOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-auto"
          >
            <div className="camera-hud rounded-t-2xl px-4 md:px-8 py-4 md:py-6 border-t-2 border-green-500/30">
              <div className="grid grid-cols-3 md:grid-cols-9 gap-3 md:gap-4 max-w-6xl mx-auto">
                {quickNavLinks.map((link) => {
                  const isActive = currentSection === link.section;
                  return (
                    <button
                      key={link.section}
                      onClick={() => handleNavClick(link.section)}
                      className={`group relative flex flex-col items-center gap-2 hover:scale-110 transition-all ${
                        isActive ? 'scale-110' : ''
                      }`}
                      title={link.name}
                    >
                      <IconBox
                        icon={link.icon}
                        gradient={link.gradient}
                        size="sm"
                        className={`md:w-12 md:h-12 ${isActive ? 'ring-2 ring-green-400 ring-offset-2 ring-offset-black/50' : ''}`}
                      />
                      <span className={`text-[9px] md:text-xs font-mono font-bold transition-all text-center leading-tight ${
                        isActive ? 'text-green-400 opacity-100' : 'opacity-90 group-hover:opacity-100 group-hover:text-green-400'
                      }`}>
                        {link.name}
                      </span>
                      {/* Hover tooltip for desktop */}
                      <span className="hidden md:block absolute -top-12 left-1/2 -translate-x-1/2 bg-black/90 px-3 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-green-500/30 z-50">
                        Go to {link.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
