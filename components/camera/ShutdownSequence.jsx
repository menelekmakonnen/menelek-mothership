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
      }, 2600),
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
        className={`absolute inset-6 rounded-[32px] border border-white/5 bg-gradient-to-br from-[#0b1120] via-[#04070f] to-black transition-opacity duration-600 ${
          phase >= 1 ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`absolute inset-10 rounded-[28px] border border-white/10 transition-opacity duration-400 ${
          phase >= 2 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(0,255,200,0.08),transparent_60%)]" />
        <div className="absolute inset-4 border border-white/5 opacity-40" />
        <div className="absolute inset-x-6 top-1/3 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
        <div className="absolute inset-y-6 left-1/2 w-px bg-gradient-to-b from-transparent via-white/30 to-transparent" />
      </div>
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: phase >= 3 ? 1 : 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          initial={{ scale: 1.2, opacity: 0.5 }}
          animate={{ scale: phase >= 3 ? 0 : 1.2, opacity: phase >= 3 ? 1 : 0.5 }}
          transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="h-[420px] w-[420px] rounded-full border border-white/20"
        />
      </motion.div>
      <div className="relative z-10 text-center space-y-6">
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
          <p className="text-xs text-white/60">Cooling sensors · Collapsing HUD · Closing iris</p>
          <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.6em]">
            <span className={phase >= 1 ? 'text-green-300' : 'text-white/30'}>Display</span>
            <span className={phase >= 2 ? 'text-green-300' : 'text-white/30'}>HUD</span>
            <span className={phase >= 3 ? 'text-green-300' : 'text-white/30'}>Iris</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
