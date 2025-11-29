import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function NavigationArrows() {
  const { viewLevel, navigateLeft, navigateRight } = useGalleriaContext();

  // Don't show arrows at galleria level (main category view)
  if (viewLevel === 'galleria') return null;

  return (
    <>
      {/* Left Arrow */}
      <motion.button
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -100, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={navigateLeft}
        className="nav-arrow nav-arrow-left"
      >
        <ChevronLeft size={32} className="text-hud-text" />
      </motion.button>

      {/* Right Arrow */}
      <motion.button
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 100, opacity: 0 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={navigateRight}
        className="nav-arrow nav-arrow-right"
      >
        <ChevronRight size={32} className="text-hud-text" />
      </motion.button>
    </>
  );
}
