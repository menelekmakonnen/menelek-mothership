import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export default function LensToggle() {
  const { currentLens, cycleLens } = useCameraContext();

  return (
    <div className="hidden md:block fixed top-36 right-4 z-[1600] pointer-events-auto">
      <motion.button
        onClick={cycleLens}
        className="camera-hud px-4 py-2 rounded-lg flex items-center gap-2 mono text-xs font-bold hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
        title={`Current: ${currentLens.name}`}
      >
        <Camera className="w-4 h-4" />
        <span className="tracking-wider">{currentLens.id.toUpperCase()}</span>
      </motion.button>
    </div>
  );
}
