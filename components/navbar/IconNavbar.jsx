import { useEffect, useRef, useState } from 'react';
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
  { id: 'galleria', icon: Grid3x3, label: 'Galleria', action: 'openGalleria' },
  { id: 'photography', icon: Camera, label: 'Photography', action: 'openGalleria', category: 'photography' },
  { id: 'films', icon: Film, label: 'Films', action: 'openGalleria', category: 'films' },
  { id: 'ai', icon: Sparkles, label: 'AI Albums', action: 'openGalleria', category: 'ai-albums' },
  { id: 'loremaker', icon: Palette, label: 'Loremaker', action: 'external' },
  { id: 'about', icon: User, label: 'About', action: 'scroll' },
  { id: 'blog', icon: BookOpen, label: 'Blog', action: 'scroll' },
  { id: 'contact', icon: Mail, label: 'Contact', action: 'scroll' },
];

export default function IconNavbar() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isNavAnimating, setIsNavAnimating] = useState(false);
  const navStopTimeout = useRef(null);
  const dragRef = useRef(null);
  const { openGalleria } = useGalleriaContext();

  const stopAnimationWithDelay = () => {
    if (navStopTimeout.current) {
      clearTimeout(navStopTimeout.current);
    }
    navStopTimeout.current = setTimeout(() => {
      setIsNavAnimating(false);
    }, 5000);
  };

  const triggerAnimation = () => {
    if (navStopTimeout.current) {
      clearTimeout(navStopTimeout.current);
    }
    setIsNavAnimating(true);
  };

  useEffect(() => {
    return () => {
      if (navStopTimeout.current) {
        clearTimeout(navStopTimeout.current);
      }
    };
  }, []);

  const handleDoubleClick = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleItemClick = (item) => {
    if (item.action === 'openGalleria') {
      openGalleria(item.category);
    } else if (item.action === 'external' && item.id === 'loremaker') {
      window.open('https://loremaker.cloud', '_blank');
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
        <div className="flex items-center gap-3">
          {/* Animated Navicon */}
          <motion.button
            onMouseEnter={triggerAnimation}
            onFocus={triggerAnimation}
            onMouseLeave={stopAnimationWithDelay}
            onBlur={stopAnimationWithDelay}
            onClick={() => {
              triggerAnimation();
              openGalleria();
            }}
            animate={isNavAnimating ? { scale: [1, 1.08, 0.95, 1.05, 1] } : { scale: 1 }}
            transition={{ duration: 1.6, ease: 'easeInOut', repeat: isNavAnimating ? Infinity : 0 }}
            className="relative px-4 py-2 rounded-full border border-accent/40 bg-accent/10 text-accent font-black tracking-wide shadow-lg"
          >
            <div className="flex items-center gap-1 text-lg">
              {[...'MM'].map((letter, index) => (
                <motion.span
                  key={`${letter}-${index}`}
                  animate={
                    isNavAnimating
                      ? {
                          y: [0, -4, 3, -2, 0],
                          rotate: [0, 3, -3, 2, 0],
                          textShadow: [
                            '0 0 10px var(--accent-glow)',
                            '0 0 18px rgba(255,255,255,0.9)',
                            '0 0 14px var(--accent)',
                            '0 0 22px rgba(255,255,255,0.85)',
                            '0 0 10px var(--accent-glow)',
                          ],
                          color: ['#fff', 'var(--accent)', '#fff', 'var(--text-primary)', '#fff'],
                        }
                      : {
                          y: 0,
                          rotate: 0,
                          textShadow: '0 0 12px var(--accent-glow)',
                        }
                  }
                  transition={{
                    duration: 1.4 + index * 0.1,
                    ease: 'easeInOut',
                    repeat: isNavAnimating ? Infinity : 0,
                  }}
                  className="drop-shadow-[0_0_8px_var(--accent-glow)]"
                >
                  {letter}
                </motion.span>
              ))}
            </div>
          </motion.button>

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
