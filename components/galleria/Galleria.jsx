import { motion, AnimatePresence } from 'framer-motion';
import { useGalleriaContext } from '@/context/GalleriaContext';
import GalleriaView from './GalleriaView';
import GalleryView from './GalleryView';
import AlbumView from './AlbumView';
import SingleView from './SingleView';
import NavigationArrows from './NavigationArrows';

export default function Galleria() {
  const { isGalleriaOpen, viewLevel } = useGalleriaContext();

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
