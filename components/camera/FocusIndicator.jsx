import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FocusIndicator() {
  const { focusPoint } = useCameraContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [tapIndicator, setTapIndicator] = useState({ show: false, x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    // Handle touch/tap events on mobile
    const handleTouch = (e) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        setPosition({ x: touch.clientX, y: touch.clientY });
        setTapIndicator({ show: true, x: touch.clientX, y: touch.clientY });
        setIsVisible(true);

        // Show tap feedback for 1.5 seconds
        setTimeout(() => {
          setTapIndicator({ show: false, x: 0, y: 0 });
        }, 1500);
      }
    };

    const handleClick = (e) => {
      // Show tap feedback on click (desktop)
      setTapIndicator({ show: true, x: e.clientX, y: e.clientY });
      setTimeout(() => {
        setTapIndicator({ show: false, x: 0, y: 0 });
      }, 1500);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchstart', handleTouch);
    window.addEventListener('touchmove', handleTouch);
    window.addEventListener('click', handleClick);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleTouch);
      window.removeEventListener('touchmove', handleTouch);
      window.removeEventListener('click', handleClick);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Focus indicator - follows cursor */}
      <motion.div
        className="focus-indicator"
        animate={{
          left: position.x - 30,
          top: position.y - 30,
          opacity: isVisible ? 1 : 0,
        }}
        transition={{ type: 'spring', stiffness: 1200, damping: 40, mass: 0.5 }}
      >
        {/* Focus frame corners */}
        <div className="absolute inset-0">
          {/* Top left */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-current" />
          {/* Top right */}
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-current" />
          {/* Bottom left */}
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-current" />
          {/* Bottom right */}
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-current" />
        </div>

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-current rounded-full" />
      </motion.div>

      {/* Tap feedback indicator */}
      {tapIndicator.show && (
        <motion.div
          initial={{ opacity: 0, scale: 1.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed z-[2000] pointer-events-none"
          style={{
            left: tapIndicator.x - 40,
            top: tapIndicator.y - 40,
            width: '80px',
            height: '80px',
          }}
        >
          {/* Animated focus confirmation */}
          <motion.div
            className="absolute inset-0 border-2 border-green-400 rounded"
            initial={{ scale: 1.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.2 }}
          />

          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-green-400" />
          <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-green-400" />
          <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-green-400" />
          <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-green-400" />

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-green-400 rounded-full" />
        </motion.div>
      )}
    </>
  );
}
