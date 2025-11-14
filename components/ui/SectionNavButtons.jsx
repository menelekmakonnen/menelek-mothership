import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import {
  Home,
  Film,
  BookOpen,
  Brain,
  Video,
  Camera,
  Image,
  FileText,
  Link2,
  Move,
  ArrowDownToLine,
} from 'lucide-react';

const sections = [
  { id: 0, name: 'Home', icon: Home, gradient: 'from-green-600 to-emerald-600' },
  { id: 1, name: 'Films', icon: Film, gradient: 'from-red-600 to-orange-600' },
  { id: 2, name: 'Loremaker', icon: BookOpen, gradient: 'from-purple-600 to-pink-600' },
  { id: 3, name: 'AI Projects', icon: Brain, gradient: 'from-blue-600 to-cyan-600' },
  { id: 4, name: 'Video Edits', icon: Video, gradient: 'from-indigo-600 to-purple-600' },
  { id: 5, name: 'Photography', icon: Camera, gradient: 'from-teal-600 to-cyan-600' },
  { id: 6, name: 'AI Albums', icon: Image, gradient: 'from-pink-600 to-rose-600' },
  { id: 7, name: 'Blog', icon: FileText, gradient: 'from-yellow-600 to-orange-600' },
  { id: 8, name: 'Links', icon: Link2, gradient: 'from-cyan-600 to-blue-600' },
];

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function SectionNavButtons({ currentSection, onNavigate }) {
  const visibleSections = useMemo(
    () => sections.filter((section) => section.id !== currentSection),
    [currentSection]
  );

  const navRef = useRef(null);
  const dragControls = useDragControls();
  const hideTimerRef = useRef(null);
  const [navSize, setNavSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }));
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [isFloating, setIsFloating] = useState(false);
  const [floatPosition, setFloatPosition] = useState({ x: 0, y: 0 });

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const scheduleHide = useCallback(() => {
    if (typeof window === 'undefined') return;
    clearHideTimer();
    hideTimerRef.current = window.setTimeout(() => {
      setIsCollapsed(true);
    }, 5200);
  }, [clearHideTimer]);

  const markInteraction = useCallback(() => {
    setIsCollapsed(false);
    scheduleHide();
  }, [scheduleHide]);

  useEffect(() => () => clearHideTimer(), [clearHideTimer]);

  useEffect(() => {
    const handleResize = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
    return undefined;
  }, []);

  useEffect(() => {
    if (!navRef.current || typeof ResizeObserver === 'undefined') return undefined;

    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setNavSize({ width, height });
    });

    observer.observe(navRef.current);
    return () => observer.disconnect();
  }, []);

  const readCameraRailHeight = useCallback(() => {
    if (typeof window === 'undefined') return 112;
    const raw = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue('--camera-top-rail-height')
    );
    return Number.isFinite(raw) ? raw : 112;
  }, []);

  const clampFloatPosition = useCallback(
    (nextX, nextY) => {
      if (!viewport.width || !viewport.height || !navSize.width || !navSize.height) {
        return { x: nextX, y: nextY };
      }

      const margin = 24;
      const horizontalLimit = Math.max(0, (viewport.width - navSize.width - margin * 2) / 2);
      const baseTop = readCameraRailHeight() + 12;
      const maxY = Math.max(0, viewport.height - navSize.height - baseTop - margin);
      const minY = -Math.max(navSize.height * 0.65, baseTop - margin);

      return {
        x: clamp(nextX, -horizontalLimit, horizontalLimit),
        y: clamp(nextY, minY, maxY),
      };
    },
    [navSize, viewport, readCameraRailHeight]
  );

  const hiddenOffset = Math.max(0, navSize.height - 28);
  const activeFloatX = !isCollapsed && isFloating ? floatPosition.x : 0;
  const activeFloatY = !isCollapsed && isFloating ? floatPosition.y : 0;

  const navTop = `calc(var(--camera-top-rail-height, 112px) + ${12 + activeFloatY - (isCollapsed ? hiddenOffset : 0)}px)`;

  useEffect(() => {
    if (
      isCollapsed &&
      (isFloating || Math.abs(floatPosition.x) > 0.5 || Math.abs(floatPosition.y) > 0.5)
    ) {
      setIsFloating(false);
      setFloatPosition({ x: 0, y: 0 });
    }
  }, [floatPosition, isCollapsed, isFloating]);

  useEffect(() => {
    const root = document.documentElement;
    const revealHeight = isCollapsed ? Math.min(navSize.height || 56, 32) : navSize.height || 72;
    const verticalOffset = Math.max(0, activeFloatY);
    const safeZone = Math.max(56, Math.ceil(revealHeight + verticalOffset + 24));
    root.style.setProperty('--camera-nav-safe-zone', `${safeZone}px`);
  }, [activeFloatY, isCollapsed, navSize.height]);

  useEffect(
    () => () => {
      document.documentElement.style.setProperty('--camera-nav-safe-zone', '96px');
    },
    []
  );

  const handleDragEnd = useCallback(
    (_, info) => {
      const origin = isFloating ? floatPosition : { x: 0, y: 0 };
      const attempted = {
        x: origin.x + info.offset.x,
        y: origin.y + info.offset.y,
      };

      if (!isFloating && info.offset.y < -36 && Math.abs(info.offset.x) < 60) {
        clearHideTimer();
        setIsCollapsed(true);
        setIsFloating(false);
        setFloatPosition({ x: 0, y: 0 });
        return;
      }

      const clamped = clampFloatPosition(attempted.x, attempted.y);

      if (Math.abs(clamped.x) > 2 || Math.abs(clamped.y) > 2) {
        setIsFloating(true);
      }

      setFloatPosition(clamped);
      markInteraction();
    },
    [clampFloatPosition, clearHideTimer, floatPosition, isFloating, markInteraction]
  );

  const handleHandlePointerDown = useCallback(
    (event) => {
      event.preventDefault();
      if (isCollapsed) {
        markInteraction();
        requestAnimationFrame(() => {
          dragControls.start(event);
        });
      } else {
        markInteraction();
        dragControls.start(event);
      }
    },
    [dragControls, isCollapsed, markInteraction]
  );

  const handleDock = useCallback(() => {
    clearHideTimer();
    setIsCollapsed(true);
    setIsFloating(false);
    setFloatPosition({ x: 0, y: 0 });
  }, [clearHideTimer]);

  const handleNavigate = useCallback(
    (id) => {
      markInteraction();
      onNavigate(id);
    },
    [markInteraction, onNavigate]
  );

  return (
    <div className="fixed inset-0 z-[1400] pointer-events-none">
      <div
        className="absolute w-full pointer-events-none"
        style={{ top: navTop }}
      >
        <motion.div
          ref={navRef}
          className="pointer-events-auto mx-auto w-max"
          style={{ x: activeFloatX }}
          drag
          dragControls={dragControls}
          dragListener={false}
          dragMomentum={false}
          dragElastic={0.18}
          onDragEnd={handleDragEnd}
          onPointerEnter={markInteraction}
          onFocusCapture={markInteraction}
          onPointerLeave={scheduleHide}
          onBlurCapture={scheduleHide}
        >
          <div className="camera-hud rounded-full border border-white/10 px-3 sm:px-4 py-2.5 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl bg-[color:var(--nav-blend-color)]/90">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onPointerDown={handleHandlePointerDown}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] mono uppercase tracking-[0.35em] text-white/70 hover:bg-white/15 transition-colors"
                aria-label="Move navigation bar"
              >
                <Move className="w-4 h-4" />
                <span className="hidden sm:inline">Nav</span>
              </button>

              <div className="h-6 w-px bg-white/10" aria-hidden="true" />

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {visibleSections.map((section, index) => {
                    const Icon = section.icon;
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => handleNavigate(section.id)}
                        className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br ${section.gradient} text-white shadow-lg transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30`}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        initial={{ opacity: 0, scale: 0.85, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 12 }}
                        transition={{ delay: index * 0.04, duration: 0.24 }}
                        title={section.name}
                        aria-label={`Go to ${section.name}`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="pointer-events-none absolute -bottom-8 left-1/2 -translate-x-1/2 rounded-md bg-black/75 px-2 py-1 text-[10px] mono uppercase tracking-[0.35em] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                          {section.name}
                        </span>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="h-6 w-px bg-white/10" aria-hidden="true" />

              <button
                type="button"
                onClick={handleDock}
                className="rounded-full bg-white/10 p-2 text-white/80 hover:bg-white/20 transition-colors"
                aria-label="Hide navigation bar"
              >
                <ArrowDownToLine className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
