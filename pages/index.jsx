import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Film, Palette, Sparkles, Video, ArrowRight } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { useMediaData } from '@/lib/useMediaData';
import IconNavbar from '@/components/navbar/IconNavbar';
import CameraHUD from '@/components/camera/CameraHUD';
import PowerButton from '@/components/camera/PowerButton';
import BootSequence from '@/components/camera/BootSequence';
import InteractiveCameraEffects from '@/components/camera/InteractiveCameraEffects';
import Galleria from '@/components/galleria/Galleria';

const PERSONA_TITLES = [
  'Filmmaker',
  'Creative Director',
  'AI Educator',
  'Photographer',
  'Worldbuilder',
  'Lore Architect',
];

const QUICK_LINKS = [
  { id: 'films', icon: Film, name: 'Films' },
  { id: 'photography', icon: Camera, name: 'Photography' },
  { id: 'ai-albums', icon: Sparkles, name: 'AI Albums' },
  { id: 'video-edits', icon: Video, name: 'Edits' },
  { id: 'loremaker', icon: Palette, name: 'Loremaker' },
];

export default function Home() {
  const { powerState } = useCameraContext();
  const { openGalleria, enterGallery, isGalleriaOpen } = useGalleriaContext();
  const [currentPersona, setCurrentPersona] = useState(0);

  // Load media data
  useMediaData();

  // Rotate persona titles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPersona((prev) => (prev + 1) % PERSONA_TITLES.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLaunchGalleria = () => {
    openGalleria();
  };

  const handleQuickLink = (categoryId) => {
    const category = { id: categoryId };
    enterGallery(category);
  };

  return (
    <>
      {/* Boot Sequence */}
      {powerState === 'booting' && <BootSequence />}

      {/* Power Button */}
      {powerState === 'off' && <PowerButton />}

      {/* Main Content */}
      <AnimatePresence mode="wait">
        {powerState === 'on' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black"
          >
            {/* Icon Navbar */}
            <IconNavbar />

            {/* Home Page Hero */}
            {!isGalleriaOpen && (
              <div className="h-full w-full flex flex-col items-center justify-center px-6 camera-viewport">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="text-center max-w-5xl"
                >
                  {/* Main Title */}
                  <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
                    <span
                      style={{
                        background: 'linear-gradient(135deg, #ffffff 0%, var(--accent) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      Menelek Makonnen
                    </span>
                  </h1>

                  {/* Rotating Persona Subtitle */}
                  <div className="h-12 mb-12 overflow-hidden">
                    <AnimatePresence mode="wait">
                      <motion.p
                        key={currentPersona}
                        initial={{ y: 40, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -40, opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-2xl md:text-3xl lg:text-4xl font-light text-secondary"
                      >
                        {PERSONA_TITLES[currentPersona]}
                      </motion.p>
                    </AnimatePresence>
                  </div>

                  {/* Launch Galleria Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    whileHover={{ scale: 1.05, boxShadow: '0 0 40px var(--accent-glow)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLaunchGalleria}
                    className="group relative px-12 py-5 rounded-full text-lg font-medium overflow-hidden border border-accent/30 backdrop-blur-xl"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-3 text-white">
                      Launch Galleria
                      <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-accent/20 to-purple-500/20"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: 0 }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.button>

                  {/* Quick Links - Icon Only */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="flex items-center justify-center gap-4 mt-16"
                  >
                    {QUICK_LINKS.map((link, index) => {
                      const Icon = link.icon;
                      return (
                        <motion.button
                          key={link.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 + index * 0.05 }}
                          whileHover={{ scale: 1.1, y: -4 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleQuickLink(link.id)}
                          className="group relative w-14 h-14 rounded-full glass border border-glass-border flex items-center justify-center hover:border-accent transition-all"
                          title={link.name}
                        >
                          <Icon size={24} className="text-hud-text group-hover:text-accent transition-colors" />

                          {/* Hover Label */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-secondary pointer-events-none"
                          >
                            {link.name}
                          </motion.div>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </motion.div>
              </div>
            )}

            {/* Galleria Overlay */}
            <Galleria />

            {/* Interactive Camera Effects */}
            <InteractiveCameraEffects />

            {/* Camera HUD */}
            <CameraHUD />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
