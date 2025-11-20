import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import GalleriaView from './GalleriaView';
import GalleryView from './GalleryView';
import AlbumView from './AlbumView';
import SingleView from './SingleView';
import NavigationArrows from './NavigationArrows';

export default function Galleria() {
  const { isGalleriaOpen, viewLevel, closeGalleria } = useGalleriaContext();

  if (!isGalleriaOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="galleria-overlay"
        style={{ zIndex: 'var(--z-galleria, 1000)' }}
      >
        {/* Close Button */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={closeGalleria}
          className="fixed top-6 right-6 z-50 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <X size={24} className="text-hud-text" />
        </motion.button>

        {/* Navigation Arrows */}
        <NavigationArrows />

        {/* Content Container */}
        <div className="galleria-container">
          <AnimatePresence mode="wait">
            {viewLevel === 'galleria' && (
              <motion.div
                key="galleria"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="galleria-content"
              >
                <GalleriaView />
              </motion.div>
            )}

            {viewLevel === 'gallery' && (
              <motion.div
                key="gallery"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="galleria-content"
              >
                <GalleryView />
              </motion.div>
            )}

            {viewLevel === 'album' && (
              <motion.div
                key="album"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                transition={{ duration: 0.4 }}
                className="galleria-content"
              >
                <AlbumView />
              </motion.div>
            )}

            {viewLevel === 'single' && (
              <motion.div
                key="single"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="galleria-content"
              >
                <SingleView />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
