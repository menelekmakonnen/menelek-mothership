import { useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Grid3x3, Film, Sparkles, Palette, Mail } from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

const NAV_ITEMS = [
  { id: 'photography', icon: Camera, label: 'Photography', action: 'category', categoryId: 'photography' },
  { id: 'ai', icon: Sparkles, label: 'AI Albums', action: 'category', categoryId: 'ai-albums' },
  { id: 'films', icon: Film, label: 'Films', action: 'category', categoryId: 'films' },
  { id: 'video-edits', icon: Grid3x3, label: 'Epic Edits', action: 'category', categoryId: 'video-edits' },
  { id: 'loremaker', icon: Palette, label: 'Loremaker', action: 'external' },
];

export default function IconNavbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { openCategoryById } = useGalleriaContext();

  const handleItemClick = (item) => {
    if (item.action === 'category') {
      openCategoryById(item.categoryId);
    } else if (item.action === 'external' && item.id === 'loremaker') {
      window.open('https://loremaker.cloud', '_blank');
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[1200] flex justify-center pt-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-strong px-5 py-2 rounded-full shadow-xl flex items-center gap-4"
      >
        <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs tracking-[0.25em] uppercase text-white/80">
          Menelek
        </div>
        <div className="flex items-center gap-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleItemClick(item)}
                  className="p-3 rounded-full hover:bg-hud-element transition-colors duration-200"
                  title={item.label}
                >
                  <Icon size={20} className="text-hud-text" />
                </motion.button>

                {hoveredItem === item.id && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 glass-strong rounded-lg whitespace-nowrap"
                  >
                    <p className="text-xs font-medium text-hud-text">{item.label}</p>
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-hud-bg rotate-45 border-l border-t border-hud-border" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        <button
          onClick={() => (window.location.href = 'mailto:admin@menelekmakonnen.com')}
          className="ml-4 px-4 py-2 rounded-full bg-accent/15 text-accent text-sm font-semibold border border-accent/40 hover:border-accent"
        >
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>Contact</span>
          </div>
        </button>
      </motion.nav>
    </div>
  );
}
