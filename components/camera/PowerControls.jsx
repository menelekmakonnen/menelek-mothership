import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Power, Moon } from 'lucide-react';

export default function PowerControls() {
  const { powerOff, setStandby } = useCameraContext();

  return (
    <div className="fixed top-28 left-1/2 -translate-x-1/2 z-[1650] pointer-events-auto">
      <div className="flex items-center gap-3 px-4 py-2 bg-black/80 border border-white/10 rounded-full shadow-lg backdrop-blur">
        <motion.button
          onClick={setStandby}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-yellow-300 hover:border-yellow-400 transition-colors"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          title="Standby"
        >
          <Moon className="w-4 h-4" />
        </motion.button>

        <motion.button
          onClick={powerOff}
          className="flex items-center justify-center w-10 h-10 rounded-full border border-white/15 text-red-400 hover:border-red-500 transition-colors"
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          title="Power Off"
        >
          <Power className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
}
