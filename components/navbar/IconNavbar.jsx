import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Grid3x3,
  Film,
  Sparkles,
  Palette,
  BookOpen,
  Mail,
  User,
} from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

const NAV_ITEMS = [
  { id: 'home', icon: Grid3x3, label: 'Galleria', action: 'category', categoryId: 'photography' },
  { id: 'photography', icon: Camera, label: 'Photography', action: 'category', categoryId: 'photography' },
  { id: 'films', icon: Film, label: 'Films', action: 'category', categoryId: 'films' },
  { id: 'ai', icon: Sparkles, label: 'AI Albums', action: 'category', categoryId: 'ai-albums' },
  { id: 'video-edits', icon: Grid3x3, label: 'Epic Video Edits', action: 'category', categoryId: 'video-edits' },
  { id: 'loremaker', icon: Palette, label: 'Loremaker', action: 'external' },
  { id: 'about', icon: User, label: 'About', action: 'scroll' },
  { id: 'blog', icon: BookOpen, label: 'Blog', action: 'scroll' },
  { id: 'contact', icon: Mail, label: 'Contact', action: 'scroll' },
];

export default function IconNavbar() {
  const [hoveredItem, setHoveredItem] = useState(null);
  const { openCategoryById } = useGalleriaContext();

  const handleItemClick = (item) => {
    if (item.action === 'category') {
      openCategoryById(item.categoryId);
    } else if (item.action === 'external' && item.id === 'loremaker') {
      window.open('https://loremaker.cloud', '_blank');
    } else if (item.action === 'scroll') {
      // Scroll to section (placeholder for future implementation)
      console.log(`Scroll to ${item.id}`);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-[1200] flex justify-center pt-4">
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="glass-strong px-6 py-3 rounded-full shadow-xl"
      >
        <div className="flex items-center gap-2">
          {NAV_ITEMS.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="relative">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onMouseEnter={() => setHoveredItem(item.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => handleItemClick(item)}
                  className="p-3 rounded-full hover:bg-hud-element transition-colors duration-200"
                  title={item.label}
                >
                  <Icon size={20} className="text-hud-text" />
                </motion.button>

                {/* Label on Hover */}
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
      </motion.nav>
    </div>
  );
}
