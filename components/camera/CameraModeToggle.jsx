import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Camera } from 'lucide-react';

export default function CameraModeToggle() {
  const { cameraMode, setCameraMode, setHasModifiedSettings } = useCameraContext();

  const toggleMode = () => {
    setHasModifiedSettings(true);
    setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr');
  };

  return (
    <motion.button
      onClick={toggleMode}
      className="hidden md:flex camera-hud px-4 py-2 rounded-lg items-center gap-2 mono text-xs font-bold hover:scale-105 transition-transform"
      whileTap={{ scale: 0.95 }}
    >
      <Camera className="w-4 h-4" />
      <span className="tracking-wider">
        {cameraMode === 'dslr' ? 'DSLR' : 'MIRRORLESS'}
      </span>
    </motion.button>
  );
}
