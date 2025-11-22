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
import Galleria from '@/components/galleria/Galleria';
import GalleriaView from '@/components/galleria/GalleriaView';

export default function Home() {
  const { powerState } = useCameraContext();
  const { openGalleria } = useGalleriaContext();

  // Load media data
  useMediaData();

  useEffect(() => {
    if (powerState === 'on') {
      openGalleria();
    }
  }, [powerState, openGalleria]);

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

            {/* Galleria overlay */}
            <Galleria />

            {/* Galleria View (Main Home Page) */}
            <div className="h-full w-full camera-viewport">
              <GalleriaView isHomePage />
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
