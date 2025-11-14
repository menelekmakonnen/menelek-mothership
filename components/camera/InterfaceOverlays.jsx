import { useCameraContext } from '@/context/CameraContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';

export default function InterfaceOverlays() {
  const { interfaceModules } = useCameraContext();
  const [horizonTilt, setHorizonTilt] = useState(0);
  const [waveform, setWaveform] = useState(() => generateWaveform());

  useEffect(() => {
    if (!interfaceModules.waveformMonitor) return;
    const interval = setInterval(() => {
      setWaveform(generateWaveform());
    }, 2000);
    return () => clearInterval(interval);
  }, [interfaceModules.waveformMonitor]);

  useEffect(() => {
    if (!interfaceModules.horizonLevel) {
      setHorizonTilt(0);
      return;
    }

    const interval = setInterval(() => {
      setHorizonTilt((Math.random() - 0.5) * 4);
    }, 2500);

    return () => clearInterval(interval);
  }, [interfaceModules.horizonLevel]);

  const peakingPattern = useMemo(() => {
    return `repeating-linear-gradient(90deg, rgba(255,0,0,0.15) 0px, rgba(255,0,0,0.15) 6px, transparent 6px, transparent 14px)`;
  }, []);

  return (
    <>
      <AnimatePresence>
        {interfaceModules.cinemaScope && (
          <motion.div
            className="fixed inset-x-0 top-0 h-24 md:h-28 bg-black/65 z-[1600] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {interfaceModules.cinemaScope && (
          <motion.div
            className="fixed inset-x-0 bottom-0 h-24 md:h-28 bg-black/65 z-[1600] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interfaceModules.focusPeaking && (
          <motion.div
            className="fixed inset-0 z-[1550] pointer-events-none"
            style={{ backgroundImage: peakingPattern }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interfaceModules.zebraHighlight && (
          <motion.div
            className="hidden sm:block fixed top-24 right-6 md:right-24 w-40 md:w-48 h-28 md:h-32 z-[1650] pointer-events-none rounded-2xl border border-white/20"
            style={{
              backgroundImage:
                'repeating-linear-gradient(-45deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 8px, transparent 8px, transparent 16px)',
              backdropFilter: 'blur(6px)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 flex items-center justify-center text-[10px] mono tracking-[0.3em] text-white/60">
              ZEBRA
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interfaceModules.waveformMonitor && (
          <motion.div
            className="hidden sm:block fixed bottom-28 left-4 md:left-8 w-44 md:w-48 h-28 md:h-32 z-[1650] pointer-events-none camera-hud rounded-2xl border border-white/10 p-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/60 mb-2">Waveform</div>
            <div className="flex items-end gap-1 h-20">
              {waveform.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-gradient-to-t from-green-500/20 via-green-400/40 to-green-200/80 rounded"
                  style={{ height: `${value}%` }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interfaceModules.horizonLevel && (
          <motion.div
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[2000] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="relative w-44 h-44 rounded-full border border-green-400/40 bg-black/30 backdrop-blur-sm">
              <div className="absolute inset-4 rounded-full border border-green-400/20" />
              <div
                className="absolute left-1/2 top-1/2 w-36 h-0.5 bg-green-400/80 origin-center"
                style={{ transform: `translate(-50%, -50%) rotate(${horizonTilt}deg)` }}
              />
              <div className="absolute inset-0 flex items-center justify-center mono text-[10px] tracking-[0.4em] text-green-200/80">
                LEVEL
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {interfaceModules.filmMatte && (
          <motion.div
            className="fixed inset-0 z-[1500] pointer-events-none"
            style={{
              background: 'radial-gradient(circle at center, transparent 60%, rgba(20, 16, 8, 0.6) 100%)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function generateWaveform() {
  return Array.from({ length: 24 }, (_, index) => {
    const base = 30 + Math.sin(index / 3) * 20;
    const noise = Math.random() * 25;
    return Math.min(100, Math.max(10, base + noise));
  });
}
