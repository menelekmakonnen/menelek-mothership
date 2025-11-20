import { motion } from 'framer-motion';
import { Power, Instagram, Youtube, Linkedin } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

export default function PowerButton() {
  const { powerOn } = useCameraContext();

  return (
    <div className="fixed inset-0 z-modal bg-gradient-to-b from-black via-[#0a0a12] to-black flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-8"
      >
        <motion.button
          onClick={powerOn}
          className="group relative"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              filter: 'blur(30px)',
              transform: 'scale(2)',
            }}
          />

          {/* Power Button */}
          <div className="relative w-32 h-32 rounded-full glass-strong flex items-center justify-center border-2 border-hud-border">
            <Power size={48} className="text-accent" />
          </div>
        </motion.button>

        <div className="space-y-2">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-secondary font-mono text-sm uppercase tracking-wider"
          >
            Daily boot required – press to power on
          </motion.p>
          <div className="flex items-center justify-center gap-3 text-xs text-white/60">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span>Calibrating lenses</span>
            <div className="w-2 h-2 rounded-full bg-accent/70 animate-pulse" />
            <span>Prime media cache</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <a
            href="https://instagram.com/menelek.makonnen"
            target="_blank"
            rel="noreferrer"
            className="glass-strong px-3 py-2 rounded-full border border-accent/40 hover:border-accent transition"
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Instagram size={16} />
              <span>Instagram</span>
            </div>
          </a>
          <a
            href="https://youtube.com/@menelekmakonnen"
            target="_blank"
            rel="noreferrer"
            className="glass-strong px-3 py-2 rounded-full border border-accent/40 hover:border-accent transition"
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Youtube size={16} />
              <span>YouTube</span>
            </div>
          </a>
          <a
            href="https://linkedin.com/in/menelekmakonnen"
            target="_blank"
            rel="noreferrer"
            className="glass-strong px-3 py-2 rounded-full border border-accent/40 hover:border-accent transition"
          >
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Linkedin size={16} />
              <span>LinkedIn</span>
            </div>
          </a>
        </div>
      </motion.div>
    </div>
  );
}
