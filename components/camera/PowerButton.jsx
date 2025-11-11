import { motion } from 'framer-motion';
import { Power } from 'lucide-react';

export default function PowerButton({ onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black"
    >
      <motion.button
        onClick={onClick}
        className="group relative"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />

        <div className="relative flex items-center justify-center w-24 h-24 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border-2 border-gray-700 group-hover:border-green-500 transition-all">
          <Power className="w-12 h-12 text-gray-400 group-hover:text-green-400 transition-colors" />
        </div>
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-green-400 mono text-lg tracking-wider font-bold"
      >
        PRESS POWER TO START
      </motion.div>

      {/* Social media icons when powered off */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-12 flex gap-6"
      >
        <SocialIcon href="https://linkedin.com/in/menelekmakonnen" icon="in" label="LinkedIn" />
        <SocialIcon href="https://instagram.com/menelekmakonnen" icon="ig" label="Instagram" />
        <SocialIcon href="https://youtube.com/@menelekmakonnen" icon="yt" label="YouTube" />
        <SocialIcon href="https://tiktok.com/@menelekmakonnen" icon="tk" label="TikTok" />
      </motion.div>
    </motion.div>
  );
}

function SocialIcon({ href, icon, label }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col items-center gap-2"
    >
      <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400 group-hover:border-green-500 group-hover:text-green-400 transition-all mono font-bold">
        {icon}
      </div>
      <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
        {label}
      </span>
    </a>
  );
}
