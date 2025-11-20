import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function BootScreen() {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('init');

  useEffect(() => {
    // Simulated boot sequence
    const stages = [
      { name: 'init', text: 'Initializing system...', duration: 500 },
      { name: 'lens', text: 'Calibrating lens...', duration: 600 },
      { name: 'sensor', text: 'Checking sensor...', duration: 500 },
      { name: 'memory', text: 'Loading memory...', duration: 400 },
      { name: 'complete', text: 'Ready', duration: 200 },
    ];

    let currentStage = 0;
    let progressValue = 0;

    const interval = setInterval(() => {
      progressValue += 2;
      setProgress(progressValue);

      // Update stage based on progress
      const stageProgress = (currentStage + 1) * (100 / stages.length);
      if (progressValue >= stageProgress && currentStage < stages.length - 1) {
        currentStage++;
        setStage(stages[currentStage].name);
      }

      if (progressValue >= 100) {
        clearInterval(interval);
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  const stageTexts = {
    init: 'Initializing system...',
    lens: 'Calibrating lens...',
    sensor: 'Checking sensor...',
    memory: 'Loading memory...',
    complete: 'Ready',
  };

  return (
    <div className="fixed inset-0 bg-black z-[10000] flex items-center justify-center">
      <div className="max-w-md w-full px-8">
        {/* Logo/Brand */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-black text-white mb-2 tracking-tighter">
            MM
          </h1>
          <p className="text-gray-400 text-sm tracking-widest uppercase">
            Menelek Makonnen
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
              style={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center"
        >
          <p className="text-gray-300 text-sm font-mono">
            {stageTexts[stage]}
          </p>
          <p className="text-gray-600 text-xs font-mono mt-2">
            {progress}%
          </p>
        </motion.div>

        {/* System Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center space-y-1"
        >
          <p className="text-gray-600 text-xs font-mono">System v2.0</p>
          <p className="text-gray-700 text-xs font-mono">
            {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
