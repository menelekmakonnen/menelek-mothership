import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function FocusIndicator() {
  const { focusPoint } = useCameraContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      className="focus-indicator"
      animate={{
        left: position.x - 30,
        top: position.y - 30,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
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
  );
}
