import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BootSequence({ onComplete }) {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const stages = [
      { delay: 300 },
      { delay: 600 },
      { delay: 900 },
      { delay: 1200 },
    ];

    stages.forEach((s, i) => {
      setTimeout(() => setStage(i + 1), s.delay);
    });

    setTimeout(() => {
      onComplete();
    }, 2800);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-black"
    >
      <div className="text-center mono">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-6xl font-bold text-white mb-2 tracking-wider">
            MENELEK MAKONNEN
          </h1>
          <div className="text-sm text-gray-400 tracking-widest">
            DIGITAL CAMERA SYSTEM
          </div>
        </motion.div>

        <div className="space-y-3 text-sm text-gray-300">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 1 ? 1 : 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Initializing system...</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 2 ? 1 : 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Loading firmware v2.5.0</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 3 ? 1 : 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Calibrating sensors...</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: stage >= 4 ? 1 : 0 }}
            className="flex items-center justify-center gap-3"
          >
            <div className="w-2 h-2 bg-green-400 rounded-full" />
            <span>Ready</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 2.5, ease: 'linear' }}
          className="mt-8 h-1 bg-gradient-to-r from-green-600 via-green-400 to-green-600 rounded-full mx-auto max-w-md"
        />
      </div>
    </motion.div>
  );
}
