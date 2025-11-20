import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Activity } from 'lucide-react';

const BOOT_MESSAGES = [
  'INITIALIZING SYSTEM...',
  'LOADING CAMERA MODULES...',
  'CALIBRATING LENS ARRAY...',
  'MOUNTING MEDIA LIBRARY...',
  'READY',
];

export default function BootSequence() {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messageIndex < BOOT_MESSAGES.length - 1) {
      const timeout = setTimeout(() => {
        setMessageIndex(messageIndex + 1);
      }, 600);
      return () => clearTimeout(timeout);
    }
  }, [messageIndex]);

  return (
    <div className="fixed inset-0 z-modal flex items-center justify-center bg-gradient-to-b from-black via-[#080812] to-black overflow-hidden">
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_20%_20%,rgba(90,240,255,0.08),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(255,122,245,0.1),transparent_20%),radial-gradient(circle_at_40%_70%,rgba(124,255,181,0.08),transparent_22%)]" />
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[pulse_2.5s_ease-in-out_infinite]" />
      </motion.div>
      <div className="relative text-center">
        {/* Camera Icon with Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1],
            opacity: [0.6, 1, 0.6],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-10 flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-accent/30" />
            <Camera size={72} className="text-accent relative" />
          </div>
        </motion.div>

        {/* Boot Messages */}
        <div className="h-24 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.p
              key={messageIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="font-mono text-accent text-sm tracking-wider"
            >
              {BOOT_MESSAGES[messageIndex]}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress Bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-accent via-white to-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.4, ease: 'easeInOut' }}
          />
        </div>

        <div className="mt-6 flex items-center justify-center gap-3 text-xs text-white/70">
          <Activity size={14} className="text-accent animate-pulse" />
          <span>Boot kernel ready for on/off cycles</span>
        </div>
      </div>
    </div>
  );
}
