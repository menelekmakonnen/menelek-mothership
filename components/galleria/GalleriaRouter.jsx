import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import GalleriaView from './GalleriaView';
import GalleryView from './GalleryView';
import AlbumView from './AlbumView';
import SingleView from './SingleView';
import NavigationArrows from './NavigationArrows';

export default function GalleriaRouter() {
  const { viewLevel, goBack } = useGalleriaContext();

  console.log('🔄 GalleriaRouter rendering with viewLevel:', viewLevel);

  return (
    <div className="h-full w-full relative">
      {/* Back Button (shows when not on home view) */}
      {viewLevel !== 'galleria' && (
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={goBack}
          className="fixed top-24 left-6 z-50 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <ArrowLeft size={24} className="text-hud-text" />
        </motion.button>
      )}

      {/* Navigation Arrows (for gallery/album/single views) */}
      {viewLevel !== 'galleria' && <NavigationArrows />}

      {/* View Router */}
      <AnimatePresence mode="wait">
        {viewLevel === 'galleria' && (
          <motion.div
            key="galleria"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
          >
            <GalleriaView isHomePage />
          </motion.div>
        )}

        {viewLevel === 'gallery' && (
          <motion.div
            key="gallery"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.4 }}
            className="h-full w-full"
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
            className="h-full w-full"
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
            className="h-full w-full"
          >
            <SingleView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
