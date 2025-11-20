import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Camera,
  Grid3x3,
  Film,
  Sparkles,
  Palette,
  Video,
  Home,
} from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

const NAV_ITEMS = [
  { id: 'home', icon: Home, label: 'Home', categoryId: null },
  { id: 'films', icon: Film, label: 'Films', categoryId: 'films' },
  { id: 'photography', icon: Camera, label: 'Photography', categoryId: 'photography' },
  { id: 'ai-albums', icon: Sparkles, label: 'AI Albums', categoryId: 'ai-albums' },
  { id: 'video-edits', icon: Video, label: 'Video Edits', categoryId: 'video-edits' },
  { id: 'loremaker', icon: Palette, label: 'Loremaker', categoryId: 'loremaker' },
];

export default function IconNavbar() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const dragRef = useRef(null);
  const { enterGallery, goBack, viewLevel } = useGalleriaContext();

  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleItemClick = (item) => {
    // Home button - reset to GalleriaView (home page)
    if (item.id === 'home') {
      // Navigate back to home (which is GalleriaView)
      // Since we're on GalleriaView by default, this is essentially a no-op
      // But if we're deep in navigation, we should go back
      if (viewLevel !== 'galleria') {
        // Keep going back until we're at galleria level
        goBack();
        setTimeout(() => {
          if (viewLevel !== 'galleria') {
            goBack();
          }
        }, 100);
      }
      return;
    }

    // Category navigation - directly enter the gallery for that category
    if (item.categoryId) {
      enterGallery({ id: item.categoryId });
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
                    className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1.5 glass-strong rounded-lg whitespace-nowrap z-50"
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
