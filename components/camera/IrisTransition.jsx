import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function IrisTransition({ isActive }) {
  const [blades, setBlades] = useState([]);

  useEffect(() => {
    // Create 8 iris blades
    const bladeCount = 8;
    const newBlades = Array.from({ length: bladeCount }, (_, i) => ({
      id: i,
      rotation: (360 / bladeCount) * i,
    }));
    setBlades(newBlades);
  }, []);

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[5000] pointer-events-none"
        >
          {/* Background overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />

          {/* Iris blades */}
          <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
            {blades.map((blade) => (
              <motion.div
                key={blade.id}
                className="absolute w-[200%] h-[200%] origin-center"
                style={{
                  transform: `rotate(${blade.rotation}deg)`,
                }}
                initial={{ clipPath: 'polygon(50% 50%, 50% 50%, 50% 50%)' }}
                animate={{
                  clipPath: [
                    'polygon(50% 50%, 50% 50%, 50% 50%)',
                    'polygon(50% 50%, 48% 45%, 52% 45%)',
                    'polygon(50% 50%, 45% 40%, 55% 40%)',
                    'polygon(50% 50%, 40% 30%, 60% 30%)',
                    'polygon(50% 50%, 30% 0%, 70% 0%)',
                  ],
                }}
                transition={{
                  duration: 0.6,
                  times: [0, 0.25, 0.5, 0.75, 1],
                  ease: 'easeInOut',
                }}
              >
                <div className="w-full h-full bg-gradient-to-b from-gray-800 to-gray-900 opacity-95" />
              </motion.div>
            ))}

            {/* Center circle that grows */}
            <motion.div
              className="absolute rounded-full bg-black"
              initial={{ width: 0, height: 0 }}
              animate={{ width: '120%', height: '120%' }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
