import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BlurLayer({ children, depth = 100, className = '' }) {
  const { focusedLayer, calculateBlur, getIsoNoise, getWhiteBalanceFilter } = useCameraContext();
  const [blurAmount, setBlurAmount] = useState(0);

  useEffect(() => {
    const blur = calculateBlur(depth, focusedLayer);
    setBlurAmount(blur);
  }, [depth, focusedLayer, calculateBlur]);

  const isoNoise = getIsoNoise();
  const wbFilter = getWhiteBalanceFilter();

  return (
    <motion.div
      className={`blur-layer ${className}`}
      style={{
        filter: `blur(${blurAmount}px) ${wbFilter.filter || ''}`,
        position: 'relative',
        zIndex: depth,
      }}
      animate={{
        filter: `blur(${blurAmount}px) ${wbFilter.filter || ''}`,
      }}
      transition={{ duration: 0.3 }}
    >
      {children}

      {/* ISO noise overlay */}
      {isoNoise > 0 && (
        <div
          className="iso-noise"
          style={{ opacity: isoNoise }}
        />
      )}
    </motion.div>
  );
}
