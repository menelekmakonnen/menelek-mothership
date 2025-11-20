import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraContext } from '@/context/CameraContext';
import { useMediaData } from '@/lib/useMediaData';
import IconNavbar from '@/components/navbar/IconNavbar';
import CameraHUD from '@/components/camera/CameraHUD';
import PowerButton from '@/components/camera/PowerButton';
import BootSequence from '@/components/camera/BootSequence';
import InteractiveCameraEffects from '@/components/camera/InteractiveCameraEffects';
import GalleriaRouter from '@/components/galleria/GalleriaRouter';

export default function Home() {
  const { powerState } = useCameraContext();

  // Load media data
  useMediaData();

  return (
    <>
      {/* Boot Sequence */}
      {powerState === 'booting' && <BootSequence />}

      {/* Power Button Screen */}
      {powerState === 'off' && <PowerButton />}

      {/* Main Content - Galleria IS the home page (shows when powered on) */}
      {powerState === 'on' && (
        <div className="fixed inset-0 overflow-hidden">
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
        </div>
      )}
    </>
  );
}
