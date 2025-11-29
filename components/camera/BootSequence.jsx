import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera } from 'lucide-react';

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
    <div className="fixed inset-0 z-modal bg-black flex items-center justify-center">
      <div className="text-center">
        {/* Camera Icon with Pulse */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="mb-12 flex justify-center"
        >
          <Camera size={64} className="text-accent" />
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
        <div className="w-64 h-1 bg-bg-tertiary rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-accent"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 3, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
}
