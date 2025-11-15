import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function Histogram() {
  const { showHistogram } = useCameraContext();
  const [histogramData, setHistogramData] = useState([]);

  useEffect(() => {
    if (!showHistogram) return;

    // Simplified histogram generation
    // In a real implementation, this would analyze actual page content
    const generateHistogram = () => {
      const bars = 32; // Number of histogram bars
      const data = Array.from({ length: bars }, (_, i) => {
        // Create a bell curve distribution
        const normalized = (i - bars / 2) / (bars / 4);
        const height = Math.exp(-normalized * normalized / 2) * 100;
        return Math.max(5, height + Math.random() * 20);
      });
      setHistogramData(data);
    };

    generateHistogram();
    const interval = setInterval(generateHistogram, 3000);

    return () => clearInterval(interval);
  }, [showHistogram]);

  return (
    <AnimatePresence>
      {showHistogram && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-20 right-4 z-[1400] camera-hud rounded-lg p-3 w-48 md:w-64 pointer-events-auto"
        >
          <div className="mono text-[10px] mb-2 opacity-75 tracking-wider">
            HISTOGRAM
          </div>
          <div className="flex items-end gap-0.5 h-16">
            {histogramData.map((value, i) => (
              <motion.div
                key={i}
                className="flex-1 bg-gradient-to-t from-green-400 to-green-600 rounded-t-sm"
                initial={{ height: 0 }}
                animate={{ height: `${value}%` }}
                transition={{ duration: 0.3, delay: i * 0.01 }}
              />
            ))}
          </div>
          <div className="flex justify-between mt-1 text-[8px] opacity-50">
            <span>SHADOWS</span>
            <span>HIGHLIGHTS</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
