import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { GalleryHorizontalEnd, GripVertical } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const NAV_GALLERIA_MAP = {
  1: 'films',
  2: 'loremaker',
  4: 'video-edits',
  5: 'photography',
  6: 'ai-albums',
};

export default function SectionNavButtons({ currentSection, onNavigate, navItems }) {
  const visibleSections = useMemo(() => navItems || [], [navItems]);
  const { performFullReset, openGalleriaHome, openGalleriaSection, activeGalleriaSection } =
    useCameraContext();

  const navRef = useRef(null);
  const dragControls = useDragControls();
  const [navSize, setNavSize] = useState({ width: 0, height: 0 });
  const [viewport, setViewport] = useState(() => ({
    width: typeof window === 'undefined' ? 0 : window.innerWidth,
    height: typeof window === 'undefined' ? 0 : window.innerHeight,
  }));
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isFloating, setIsFloating] = useState(false);
  const [floatPosition, setFloatPosition] = useState({ x: 0, y: 0 });
  const labelItems = useMemo(() => navItems || [], [navItems]);
  const [activeLabelIndex, setActiveLabelIndex] = useState(0);
  const lastTapRef = useRef(0);
  const [hoveredId, setHoveredId] = useState(null);
  const [isNavActive, setIsNavActive] = useState(false);

  const markInteraction = useCallback(() => {
    setIsCollapsed(false);
  }, []);

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

  const hiddenOffset = Math.max(0, navSize.height - 18);
  const activeFloatX = !isCollapsed && isFloating ? floatPosition.x : 0;
  const activeFloatY = !isCollapsed && isFloating ? floatPosition.y : 0;

  const navTop = `calc(var(--camera-top-rail-height, 112px) + ${12 + activeFloatY - (isCollapsed ? hiddenOffset : 0)}px)`;

  const resetNavPosition = useCallback(() => {
    setIsFloating(false);
    setFloatPosition({ x: 0, y: 0 });
    setIsCollapsed(false);
    markInteraction();
    performFullReset();
  }, [markInteraction, performFullReset]);

  useEffect(() => {
    if (!labelItems.length) return undefined;
    setActiveLabelIndex((index) => (index >= labelItems.length ? 0 : index));
    return undefined;
  }, [labelItems]);

  useEffect(() => {
    if (!labelItems.length || isNavActive || hoveredId) return undefined;
    const interval = setInterval(() => {
      setActiveLabelIndex((index) => (index + 1) % labelItems.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [hoveredId, isNavActive, labelItems]);

  useEffect(() => {
    if (!labelItems.length) return;
    setActiveLabelIndex((index) => {
      if (!labelItems.length) return 0;
      if (hoveredId) return index;
      return currentSection % labelItems.length;
    });
  }, [currentSection, hoveredId, labelItems.length]);

  const hoveredLabel = hoveredId ? labelItems.find((item) => item.id === hoveredId) : null;
  const currentLabel = labelItems.find((item) => item.id === currentSection) || null;
  const cyclingLabel =
    labelItems.length && activeLabelIndex < labelItems.length
      ? labelItems[activeLabelIndex % labelItems.length]
      : currentLabel;
  const effectiveLabel = hoveredLabel || (isNavActive ? currentLabel : cyclingLabel);
  const effectiveLabelId = effectiveLabel?.id;

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

      // Keep the navigation rail present at all times to avoid the hidden-state feedback from earlier revisions.

      const clamped = clampFloatPosition(attempted.x, attempted.y);

      if (Math.abs(clamped.x) > 2 || Math.abs(clamped.y) > 2) {
        setIsFloating(true);
      }

        setFloatPosition(clamped);
        markInteraction();
      },
    [clampFloatPosition, floatPosition, isFloating, markInteraction]
  );

  const handleHandlePointerDown = useCallback(
    (event) => {
      event.preventDefault();
      const now = Date.now();
      if (now - lastTapRef.current < 320) {
        lastTapRef.current = 0;
        resetNavPosition();
        return;
      }
      lastTapRef.current = now;
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
    [dragControls, isCollapsed, markInteraction, resetNavPosition]
  );

  const handleNavigate = useCallback(
    (id) => {
      markInteraction();
      onNavigate(id);
    },
    [markInteraction, onNavigate]
  );

  const handleGalleriaLaunch = useCallback(() => {
    markInteraction();
    const targetSection = NAV_GALLERIA_MAP[currentSection];
    if (targetSection) {
      openGalleriaSection(targetSection, { viaNav: true, startInGallery: true });
      return;
    }
    openGalleriaHome();
  }, [currentSection, markInteraction, openGalleriaHome, openGalleriaSection]);

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
          onPointerEnter={(event) => {
            markInteraction();
            setIsNavActive(true);
          }}
          onFocusCapture={(event) => {
            markInteraction();
            setIsNavActive(true);
          }}
          onPointerLeave={() => {
            setIsNavActive(false);
            setHoveredId(null);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setIsNavActive(false);
              setHoveredId(null);
            }
          }}
          onPointerDownCapture={() => {
            if (isCollapsed) {
              markInteraction();
            }
          }}
        >
          <div className="camera-hud rounded-full border border-white/10 px-3 sm:px-4 py-2 shadow-[0_16px_40px_rgba(0,0,0,0.45)] backdrop-blur-xl bg-[color:var(--nav-blend-color)]/90">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onPointerDown={handleHandlePointerDown}
                className="flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[11px] mono uppercase tracking-[0.35em] text-white/70 hover:bg-white/15 transition-colors"
                aria-label="Move navigation bar"
              >
                <GripVertical className="w-4 h-4" />
              </button>

              <div className="h-6 w-px bg-white/10" aria-hidden="true" />

              <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                <AnimatePresence mode="popLayout">
                  {visibleSections.map((section, index) => {
                    const Icon = section.icon;
                    const isActive = section.id === currentSection;
                    const labelIndex = labelItems.findIndex((item) => item.id === section.id);
                    return (
                      <motion.button
                        key={section.id}
                        onClick={() => {
                          if (section.id !== currentSection) {
                            handleNavigate(section.id);
                          } else {
                            markInteraction();
                          }
                        }}
                        onPointerEnter={() => {
                          setHoveredId(section.id);
                          setIsNavActive(true);
                          if (labelIndex >= 0) {
                            setActiveLabelIndex(labelIndex);
                          }
                        }}
                        onPointerLeave={() => {
                          setHoveredId((prev) => (prev === section.id ? null : prev));
                        }}
                        onFocus={() => {
                          setHoveredId(section.id);
                          setIsNavActive(true);
                          if (labelIndex >= 0) {
                            setActiveLabelIndex(labelIndex);
                          }
                        }}
                        onBlur={() => {
                          setHoveredId((prev) => (prev === section.id ? null : prev));
                        }}
                        className={`group relative flex ${
                          isActive ? 'h-12 w-12 border-white/40' : 'h-11 w-11 border-white/15'
                        } items-center justify-center rounded-2xl border bg-gradient-to-br ${section.gradient} text-white shadow-lg transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black/30 ${
                          isActive ? 'ring-2 ring-white/30' : ''
                        }`}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.94 }}
                        initial={{ opacity: 0, scale: 0.85, y: 12 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.85, y: 12 }}
                        transition={{ delay: index * 0.04, duration: 0.24 }}
                        title={section.name}
                        aria-label={`Go to ${section.name}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <Icon className="w-5 h-5" />
                        <div className="pointer-events-none absolute left-1/2 top-full mt-2 flex -translate-x-1/2 justify-center">
                          <AnimatePresence>
                            {effectiveLabelId === section.id && (
                              <motion.span
                                key={`label-${section.id}`}
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -8 }}
                                transition={{ duration: 0.25 }}
                                className="mono text-[10px] uppercase tracking-[0.45em] text-white/85"
                              >
                                {effectiveLabel?.name}
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.button>
                    );
                  })}
                </AnimatePresence>
              </div>

              <div className="h-6 w-px bg-white/10" aria-hidden="true" />

              <button
                type="button"
                onClick={handleGalleriaLaunch}
                className={`group relative flex h-11 w-11 items-center justify-center rounded-2xl border text-white transition ${
                  activeGalleriaSection
                    ? 'border-emerald-400/70 bg-emerald-500/20'
                    : 'border-white/20 bg-white/5 hover:border-white/50'
                }`}
                aria-label="Open Galleria"
              >
                <GalleryHorizontalEnd className="h-5 w-5" />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
