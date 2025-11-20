import { motion, AnimatePresence } from 'framer-motion';
import { useCameraContext } from '@/context/CameraContext';
import { useEffect } from 'react';
import { useMediaData } from '@/lib/useMediaData';
import IconNavbar from '@/components/navbar/IconNavbar';
import CameraHUD from '@/components/camera/CameraHUD';
import BootSequence from '@/components/camera/BootSequence';
import InteractiveCameraEffects from '@/components/camera/InteractiveCameraEffects';
import GalleriaRouter from '@/components/galleria/GalleriaRouter';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function Home() {
  const { powerState } = useCameraContext();
  const { openGalleria, closeGalleria } = useGalleriaContext();

  // Load media data
  useMediaData();

  // Power-gated galleria boot: once power is on, show galleria as base
  useEffect(() => {
    if (powerState === 'on') {
      openGalleria();
    } else if (powerState === 'off') {
      closeGalleria();
    }
  }, [powerState, openGalleria, closeGalleria]);

  return (
    <>
      {/* Boot Sequence */}
      {powerState === 'booting' && <BootSequence />}

      {/* Main Content - Galleria IS the home page */}
      <AnimatePresence mode="wait">
        <motion.div
          key="galleria-shell"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 overflow-hidden"
          data-power-state={powerState}
        >
          {/* Icon Navbar */}
          <IconNavbar />

          {/* Galleria Router (handles all view navigation) */}
          <div className="h-full w-full camera-viewport">
            <GalleriaRouter />
          </div>

          {/* Interactive Camera Effects */}
          <InteractiveCameraEffects />

          {/* Camera HUD */}
          <CameraHUD />
        </motion.div>
      </AnimatePresence>
    </>
  );
}
