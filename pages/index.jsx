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
    <div className="fixed inset-0 overflow-hidden">
      {powerState === 'on' ? (
        <>
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
        </>
      ) : (
        <>
          {/* Power Off Screen */}
          <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-6 opacity-30">⚫</div>
              <p className="text-secondary text-sm font-mono">Camera is off</p>
              <p className="text-tertiary text-xs font-mono mt-2">Click power button in HUD to turn on</p>
            </div>
          </div>
          {/* Show HUD even when off so user can turn it back on */}
          <CameraHUD />
        </>
      )}
    </div>
  );
}
