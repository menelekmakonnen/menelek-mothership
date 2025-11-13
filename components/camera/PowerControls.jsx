import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Power, Moon } from 'lucide-react';

export default function PowerControls() {
  const { powerOff, setStandby } = useCameraContext();

  return (
    <div className="fixed top-4 left-4 z-[1600] flex gap-2 pointer-events-auto">
      <motion.button
        onClick={setStandby}
        className="camera-hud p-3 rounded-full hover:scale-110 transition-transform"
        whileTap={{ scale: 0.95 }}
        title="Standby"
      >
        <Moon className="w-4 h-4" />
      </motion.button>

      <motion.button
        onClick={powerOff}
        className="camera-hud p-3 rounded-full hover:scale-110 transition-transform"
        whileTap={{ scale: 0.95 }}
        title="Power Off"
      >
        <Power className="w-4 h-4" />
      </motion.button>
    </div>
  );
}
