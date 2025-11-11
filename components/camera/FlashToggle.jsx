import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Zap, ZapOff, Sparkles } from 'lucide-react';

export default function FlashToggle() {
  const { flashMode, setFlashMode } = useCameraContext();

  const cycleFlashMode = () => {
    const modes = ['auto', 'on', 'off'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
  };

  const getIcon = () => {
    if (flashMode === 'on') return Zap;
    if (flashMode === 'off') return ZapOff;
    return Sparkles;
  };

  const getLabel = () => {
    if (flashMode === 'on') return 'FLASH ON';
    if (flashMode === 'off') return 'FLASH OFF';
    return 'AUTO';
  };

  const Icon = getIcon();

  return (
    <div className="fixed top-4 right-4 z-[1600] pointer-events-auto">
      <motion.button
        onClick={cycleFlashMode}
        className="camera-hud px-4 py-2 rounded-lg flex items-center gap-2 mono text-xs font-bold hover:scale-105 transition-transform"
        whileTap={{ scale: 0.95 }}
      >
        <Icon className="w-4 h-4" />
        <span className="tracking-wider">{getLabel()}</span>
      </motion.button>
    </div>
  );
}
