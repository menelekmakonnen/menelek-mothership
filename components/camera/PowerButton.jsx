import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

export default function PowerButton() {
  const { powerOn } = useCameraContext();

  return (
    <div className="fixed inset-0 z-modal bg-black flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <motion.button
          onClick={powerOn}
          className="group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              filter: 'blur(30px)',
              transform: 'scale(2)',
            }}
          />

          {/* Power Button */}
          <div className="relative w-32 h-32 rounded-full glass-strong flex items-center justify-center border-2 border-hud-border">
            <Power size={48} className="text-accent" />
          </div>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-secondary font-mono text-sm uppercase tracking-wider"
        >
          Press to Power On
        </motion.p>
      </motion.div>
    </div>
  );
}
