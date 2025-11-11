import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function IrisTransition({ isActive }) {
  const [blades, setBlades] = useState([]);

  useEffect(() => {
    // Create 8 iris blades in a circular pattern
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
          className="fixed inset-0 z-[5000] pointer-events-none flex items-center justify-center"
        >
          {/* Darkening overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black"
          />

          {/* Iris blade mechanism */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <radialGradient id="bladeGrad" cx="50%" cy="50%">
                <stop offset="0%" stopColor="#2a2a2a" />
                <stop offset="100%" stopColor="#1a1a1a" />
              </radialGradient>
            </defs>

            {/* Iris blades closing animation */}
            {blades.map((blade, index) => {
              const angle = blade.rotation;
              const angleRad = (angle * Math.PI) / 180;

              return (
                <motion.g
                  key={blade.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {/* Individual blade */}
                  <motion.path
                    d={`M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 100} ${50 + Math.sin(angleRad - 0.3) * 100} L ${50 + Math.cos(angleRad + 0.3) * 100} ${50 + Math.sin(angleRad + 0.3) * 100} Z`}
                    fill="url(#bladeGrad)"
                    stroke="#000"
                    strokeWidth="0.2"
                    initial={{
                      d: `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 0} ${50 + Math.sin(angleRad - 0.3) * 0} L ${50 + Math.cos(angleRad + 0.3) * 0} ${50 + Math.sin(angleRad + 0.3) * 0} Z`,
                    }}
                    animate={{
                      d: [
                        `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 0} ${50 + Math.sin(angleRad - 0.3) * 0} L ${50 + Math.cos(angleRad + 0.3) * 0} ${50 + Math.sin(angleRad + 0.3) * 0} Z`,
                        `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 50} ${50 + Math.sin(angleRad - 0.3) * 50} L ${50 + Math.cos(angleRad + 0.3) * 50} ${50 + Math.sin(angleRad + 0.3) * 50} Z`,
                        `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 100} ${50 + Math.sin(angleRad - 0.3) * 100} L ${50 + Math.cos(angleRad + 0.3) * 100} ${50 + Math.sin(angleRad + 0.3) * 100} Z`,
                        `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 50} ${50 + Math.sin(angleRad - 0.3) * 50} L ${50 + Math.cos(angleRad + 0.3) * 50} ${50 + Math.sin(angleRad + 0.3) * 50} Z`,
                        `M 50 50 L ${50 + Math.cos(angleRad - 0.3) * 0} ${50 + Math.sin(angleRad - 0.3) * 0} L ${50 + Math.cos(angleRad + 0.3) * 0} ${50 + Math.sin(angleRad + 0.3) * 0} Z`,
                      ],
                    }}
                    transition={{
                      duration: 1.2,
                      times: [0, 0.4, 0.5, 0.9, 1],
                      ease: 'easeInOut',
                      delay: index * 0.02,
                    }}
                  />
                </motion.g>
              );
            })}

            {/* Center circle for complete closure */}
            <motion.circle
              cx="50"
              cy="50"
              fill="#000"
              initial={{ r: 0 }}
              animate={{ r: [0, 5, 50, 5, 0] }}
              transition={{ duration: 1.2, times: [0, 0.4, 0.5, 0.9, 1], ease: 'easeInOut' }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
