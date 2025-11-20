import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraContext } from '@/context/CameraContext';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { useMediaData } from '@/lib/useMediaData';
import IconNavbar from '@/components/navbar/IconNavbar';
import CameraHUD from '@/components/camera/CameraHUD';
import PowerButton from '@/components/camera/PowerButton';
import BootSequence from '@/components/camera/BootSequence';
import InteractiveCameraEffects from '@/components/camera/InteractiveCameraEffects';
import GalleriaView from '@/components/galleria/GalleriaView';
import GalleryView from '@/components/galleria/GalleryView';
import AlbumView from '@/components/galleria/AlbumView';
import SingleView from '@/components/galleria/SingleView';

export default function Home() {
  const { powerState } = useCameraContext();
  const { viewLevel } = useGalleriaContext();

  // Load media data
  useMediaData();

  return (
    <>
      {/* Boot Sequence */}
      {powerState === 'booting' && <BootSequence />}

      {/* Power Button */}
      {powerState === 'off' && <PowerButton />}

      {/* Main Content - Galleria IS the home page */}
      <AnimatePresence mode="wait">
        {powerState === 'on' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 overflow-hidden"
          >
            {/* Icon Navbar */}
            <IconNavbar />

            {/* Content Container - switches based on navigation level */}
            <div className="h-full w-full camera-viewport">
              <AnimatePresence mode="wait">
                {viewLevel === 'galleria' && (
                  <motion.div
                    key="galleria"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
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
