import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function HomeButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-4 left-4 z-[1600] camera-hud p-3 rounded-full hover:scale-110 transition-transform pointer-events-auto"
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <Home className="w-5 h-5" />
    </motion.button>
  );
}
