import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Play } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { useCameraContext } from '@/context/CameraContext';
import { useMediaData } from '@/lib/useMediaData';
import IconNavbar from '@/components/navbar/IconNavbar';
import CameraHUD from '@/components/camera/CameraHUD';
import PowerButton from '@/components/camera/PowerButton';
import BootSequence from '@/components/camera/BootSequence';
import Galleria from '@/components/galleria/Galleria';

const ROTATING_TITLES = [
  'Filmmaker',
  'Creative Director',
  'AI Educator',
  'Photographer',
  'Worldbuilder',
  'Lore Universe Architect',
];

export default function Home() {
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const { openGalleria } = useGalleriaContext();
  const { powerState, hasBooted } = useCameraContext();

  // Load media data
  useMediaData();

  // Rotate titles every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % ROTATING_TITLES.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Boot Sequence */}
      {powerState === 'booting' && !hasBooted && <BootSequence />}

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
            className="min-h-screen relative"
          >
            {/* Icon Navbar */}
            <IconNavbar />

            {/* Hero Section */}
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
              {/* Animated Background Gradient */}
              <motion.div
                className="absolute inset-0 z-0"
                style={{
                  background: 'radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.03) 0%, transparent 70%)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />

              {/* Hero Content */}
              <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
                {/* Logo / Camera Icon */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="mb-8 flex justify-center"
                >
                  <div className="w-24 h-24 rounded-full glass flex items-center justify-center">
                    <Camera size={48} className="text-accent" />
                  </div>
                </motion.div>

                {/* Name */}
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
                  style={{
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Menelek Makonnen
                </motion.h1>

                {/* Rotating Titles */}
                <div className="h-16 mb-12 flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={currentTitleIndex}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-2xl md:text-3xl font-light text-secondary"
                    >
                      {ROTATING_TITLES[currentTitleIndex]}
                    </motion.p>
                  </AnimatePresence>
                </div>

                {/* Launch Galleria Button */}
                <motion.div
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <button
                    onClick={openGalleria}
                    className="btn-luxury group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      <Play size={20} fill="currentColor" />
                      Launch Galleria
                    </span>
                  </button>
                </motion.div>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="mt-12 text-sm md:text-base text-tertiary max-w-2xl mx-auto leading-relaxed"
                >
                  Explore a cinematic collection of photography, films, AI art, epic video edits,
                  and the Loremaker Universe.
                </motion.p>
              </div>

              {/* Decorative Elements */}
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-6 h-10 border-2 border-glass-border rounded-full flex items-start justify-center p-2"
                >
                  <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                </motion.div>
              </div>
            </section>

            {/* Quick Links Section */}
            <section className="py-24 px-6">
              <div className="max-w-7xl mx-auto">
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6"
                >
                  {[
                    {
                      title: 'Photography',
                      description: 'Professional photography across beauty, portraits, and landscapes',
                      gradient: 'from-purple-500/20 to-pink-500/20',
                    },
                    {
                      title: 'Films & Music',
                      description: 'Cinematic storytelling and music video direction',
                      gradient: 'from-blue-500/20 to-cyan-500/20',
                    },
                    {
                      title: 'Loremaker',
                      description: 'An epic universe of characters, stories, and worldbuilding',
                      gradient: 'from-amber-500/20 to-orange-500/20',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ y: 30, opacity: 0 }}
                      whileInView={{ y: 0, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="luxury-card group cursor-pointer"
                      onClick={openGalleria}
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg`} />
                      <div className="relative z-10">
                        <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                        <p className="text-secondary text-sm leading-relaxed">{item.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </section>

            {/* Camera HUD */}
            <CameraHUD />

            {/* Galleria Overlay */}
            <Galleria />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
