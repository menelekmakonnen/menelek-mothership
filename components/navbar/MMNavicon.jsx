import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function MMNavicon() {
  const [isActive, setIsActive] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const timeoutRef = useRef(null);

  // When user clicks away, keep animating for 5 seconds
  useEffect(() => {
    if (!isActive && shouldAnimate) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        setShouldAnimate(false);
      }, 5000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isActive, shouldAnimate]);

  const handleClick = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setShouldAnimate(true);
    }
  };

  const handleClickOutside = () => {
    if (isActive) {
      setIsActive(false);
      // Animation will continue for 5 seconds due to useEffect
    }
  };

  // Random animation values for excitement
  const getRandomDelay = () => Math.random() * 0.5;
  const getRandomDuration = () => 0.6 + Math.random() * 0.4;
  const getRandomScale = () => 1.1 + Math.random() * 0.3;
  const getRandomRotate = () => -15 + Math.random() * 30;

  const letterVariants = {
    idle: {
      scale: 1,
      rotate: 0,
      filter: 'drop-shadow(0 0 8px var(--accent)) brightness(1)',
    },
    excited: (custom) => ({
      scale: [1, getRandomScale(), 1],
      rotate: [0, getRandomRotate(), 0],
      filter: [
        'drop-shadow(0 0 8px var(--accent)) brightness(1)',
        `drop-shadow(0 0 ${20 + Math.random() * 20}px var(--accent)) brightness(${1.5 + Math.random() * 0.5})`,
        'drop-shadow(0 0 8px var(--accent)) brightness(1)',
      ],
      transition: {
        duration: getRandomDuration(),
        delay: custom * 0.1 + getRandomDelay(),
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    }),
  };

  const containerVariants = {
    idle: {
      scale: 1,
      rotate: 0,
    },
    excited: {
      scale: [1, 1.05, 0.95, 1],
      rotate: [0, 2, -2, 0],
      transition: {
        duration: 1.2,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  const glowVariants = {
    idle: {
      opacity: 0.3,
      scale: 1,
    },
    excited: {
      opacity: [0.3, 0.8, 0.3],
      scale: [1, 1.2, 1],
      transition: {
        duration: 1,
        repeat: Infinity,
        repeatType: 'reverse',
        ease: 'easeInOut',
      },
    },
  };

  return (
    <div className="relative">
      {/* Click outside detector */}
      {isActive && (
        <div
          className="fixed inset-0 z-[45]"
          onClick={handleClickOutside}
        />
      )}

      {/* MM Navicon */}
      <motion.button
        onClick={handleClick}
        className="relative z-50 p-3 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          variants={containerVariants}
          animate={(isActive || shouldAnimate) ? 'excited' : 'idle'}
          className="relative flex items-center gap-1"
        >
          {/* Background Glow */}
          <motion.div
            variants={glowVariants}
            animate={(isActive || shouldAnimate) ? 'excited' : 'idle'}
            className="absolute inset-0 rounded-lg"
            style={{
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              filter: 'blur(20px)',
              transform: 'scale(1.5)',
            }}
          />

          {/* First M */}
          <motion.span
            variants={letterVariants}
            animate={(isActive || shouldAnimate) ? 'excited' : 'idle'}
            custom={0}
            className="relative text-4xl font-bold tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-secondary) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            M
          </motion.span>

          {/* Second M */}
          <motion.span
            variants={letterVariants}
            animate={(isActive || shouldAnimate) ? 'excited' : 'idle'}
            custom={1}
            className="relative text-4xl font-bold tracking-tighter"
            style={{
              background: 'linear-gradient(135deg, var(--accent-secondary) 0%, var(--accent) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            M
          </motion.span>

          {/* Extra Sparkles when excited */}
          <AnimatePresence>
            {(isActive || shouldAnimate) && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, (Math.random() - 0.5) * 40],
                      y: [0, (Math.random() - 0.5) * 40],
                    }}
                    exit={{ opacity: 0, scale: 0 }}
                    transition={{
                      duration: 1 + Math.random(),
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatDelay: Math.random() * 0.5,
                    }}
                    className="absolute w-1 h-1 rounded-full bg-accent"
                    style={{
                      left: '50%',
                      top: '50%',
                      boxShadow: '0 0 10px var(--accent)',
                    }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.button>
    </div>
  );
}
