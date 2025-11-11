import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Home } from 'lucide-react';

export default function HomeButton({ onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="fixed top-24 left-6 z-[1400] bg-gradient-to-br from-green-600 to-emerald-600 p-3 rounded-2xl hover:scale-110 transition-all shadow-lg border border-green-500/30 pointer-events-auto group"
      whileTap={{ scale: 0.95 }}
      whileHover={{ y: -2, boxShadow: "0 20px 40px rgba(0, 255, 136, 0.3)" }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
      title="Return Home"
    >
      <Home className="w-5 h-5 text-white" />
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-gray-900/90 px-3 py-1 rounded-lg text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-white">
        Home
      </span>
    </motion.button>
  );
}
