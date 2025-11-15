import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraContext } from '@/context/CameraContext';

const sectionNames = [
  'HOME',
  'INTRODUCTION',
  'LINKS',
  'FILMS & MUSIC',
  'LAWMAKER',
  'AI PROJECTS',
  'VIDEO EDITS',
  'PHOTOGRAPHY',
  'AI ALBUMS',
  'BLOG'
];

export default function NavbarTextPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const { currentSection } = useCameraContext();

  useEffect(() => {
    const cycle = () => {
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 2500);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % sectionNames.length);
      }, 3000);
    };

    // Start the cycle
    const interval = setInterval(cycle, 3000);
    cycle(); // Initial display

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-[1450] pointer-events-none pt-2">
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="camera-hud px-6 py-2 rounded-full"
          >
            <span className="mono text-xs tracking-widest font-bold">
              {sectionNames[currentIndex]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
