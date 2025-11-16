import { motion } from 'framer-motion';
import { Power } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ShutdownSequence({ onComplete }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1500),
      setTimeout(() => setPhase(4), 2100),
      setTimeout(() => {
        if (typeof onComplete === 'function') {
          onComplete();
        }
      }, 2700),
    ];

    return () => timers.forEach((timer) => clearTimeout(timer));
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[26000] flex items-center justify-center overflow-hidden bg-black">
      <div
        className={`absolute inset-0 bg-gradient-to-b from-black via-[#02060c] to-black transition-opacity duration-500 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,200,0.12),transparent_65%)] transition-opacity duration-500 ${
          phase >= 2 ? 'opacity-40' : 'opacity-0'
        }`}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          initial={{ scale: 1.4, opacity: 0.4 }}
          animate={{ scale: phase >= 3 ? 0.05 : 1.4, opacity: phase >= 3 ? 0.9 : 0.4 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          className="h-80 w-80 rounded-full border border-white/15"
        />
      </div>
      <div className="relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 10 }}
          transition={{ duration: 0.4 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-center gap-3 text-white/80">
            <Power className="h-6 w-6 text-red-400" />
            <span className="mono text-sm uppercase tracking-[0.6em]">System shutting down</span>
          </div>
          <p className="text-xs text-white/60">Cooling sensors · Closing iris · Saving state</p>
        </motion.div>
      </div>
    </div>
  );
}
