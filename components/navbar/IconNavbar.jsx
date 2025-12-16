import { useState, useRef } from 'react';
import { useRouter } from 'next/router';
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
  FileJson,
} from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

const NAV_ITEMS = [
  { id: 'galleria', icon: Grid3x3, label: 'Galleria', action: 'openGalleria' },
  { id: 'photography', icon: Camera, label: 'Photography', action: 'openGalleria' },
  { id: 'films', icon: Film, label: 'Films', action: 'openGalleria' },
  { id: 'ai', icon: Sparkles, label: 'AI Albums', action: 'openGalleria' },
  { id: 'loremaker', icon: Palette, label: 'Loremaker', action: 'external' },
  { id: 'json-viewer', icon: FileJson, label: 'JSON Viewer', action: 'page' },
  { id: 'about', icon: User, label: 'About', action: 'scroll' },
  { id: 'blog', icon: BookOpen, label: 'Blog', action: 'scroll' },
  { id: 'contact', icon: Mail, label: 'Contact', action: 'scroll' },
];

export default function IconNavbar() {
  const router = useRouter();
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dragRef = useRef(null);
  const { openGalleria } = useGalleriaContext();

  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleItemClick = (item) => {
    if (item.action === 'openGalleria') {
      openGalleria();
    } else if (item.action === 'external' && item.id === 'loremaker') {
      window.open('https://loremaker.cloud', '_blank');
    } else if (item.action === 'page') {
      router.push(`/${item.id}`);
    } else if (item.action === 'scroll') {
      // Scroll to section (placeholder for future implementation)
      console.log(`Scroll to ${item.id}`);
    }
  };

  return (
    <motion.div
      ref={dragRef}
      drag
      dragMomentum={false}
      dragElastic={0}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      onDoubleClick={handleDoubleClick}
      style={{
        x: position.x,
        y: position.y,
      }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50"
    >
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

        {/* Drag Hint */}
        {!isDragging && (
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs text-tertiary font-mono opacity-50">
            Drag to move • Double-click to reset
          </div>
        )}
      </motion.nav>
    </motion.div>
  );
}
