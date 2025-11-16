import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpToLine } from 'lucide-react';
import BlurLayer from './ui/BlurLayer';

export default function SectionNavigation({ sections, contentStyle = {}, sectionMeta }) {
  const {
    currentSection,
    setCurrentSection,
    currentLens,
    shutterSpeed,
    gestureLock,
    closeTopLayer,
    hasInteractiveLayer,
    lensLayout,
  } = useCameraContext();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(1); // 1 for next, -1 for prev
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ x: 0, y: 0, scrollTop: 0, scrollLeft: 0, pointerId: null, isActive: false });
  const containerRef = useRef(null);

  const minSwipeDistance = 50;

  const totalSections = sections.length;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    try {
      container.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    } catch (error) {
      container.scrollTop = 0;
      container.scrollLeft = 0;
    }
    setScrollOpacity(1);
    setShowBackToTop(false);
  }, [currentSection]);

  const nextSection = useCallback(() => {
    if (gestureLock) return;
    setSwipeDirection(1);
    setCurrentSection((prev) => (prev + 1) % totalSections);
  }, [gestureLock, setCurrentSection, totalSections]);

  const prevSection = useCallback(() => {
    if (gestureLock) return;
    setSwipeDirection(-1);
    setCurrentSection((prev) => (prev - 1 + totalSections) % totalSections);
  }, [gestureLock, setCurrentSection, totalSections]);

  const onTouchStart = (e) => {
    if (gestureLock) return;
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    if (gestureLock) return;
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (gestureLock) return;
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextSection();
    } else if (isRightSwipe) {
      prevSection();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      const tagName = e.target?.tagName;
      if (tagName && ['INPUT', 'TEXTAREA', 'SELECT'].includes(tagName)) return;

      if (hasInteractiveLayer) {
        if (['Escape', 'Esc', 'Backspace', 'BrowserBack', 'GoBack'].includes(e.key)) {
          const closed = closeTopLayer();
          if (closed) {
            e.preventDefault();
            return;
          }
        }
        if (
          ['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)
        ) {
          return;
        }
      }

      if (gestureLock) return;

      if (['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSection();
      if (e.key === 'ArrowRight' || e.key === 'PageDown') nextSection();
      if (e.key === 'Home') {
        setSwipeDirection(1);
        setCurrentSection(0);
      }
      if (e.key === 'End') {
        setSwipeDirection(-1);
        setCurrentSection(totalSections - 1);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevSection, nextSection, gestureLock, hasInteractiveLayer, closeTopLayer, totalSections, setCurrentSection, setSwipeDirection]);

  // Scroll-based arrow fade
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop || 0;
      // Fade out arrows as user scrolls down (fully faded at 300px scroll)
      const opacity = Math.max(0.2, 1 - scrollTop / 300);
      setScrollOpacity(opacity);
      setShowBackToTop(scrollTop > 240);
    };

    container.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentSection]);

  const handlePointerDown = (e) => {
    if (gestureLock) return;
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    dragState.current = {
      x: e.clientX,
      y: e.clientY,
      scrollTop: container.scrollTop,
      scrollLeft: container.scrollLeft,
      pointerId: e.pointerId,
      isActive: false,
    };
  };

  const handlePointerMove = (e) => {
    if (gestureLock) return;
    const container = containerRef.current;
    if (!container || dragState.current.pointerId !== e.pointerId) return;

    const deltaX = e.clientX - dragState.current.x;
    const deltaY = e.clientY - dragState.current.y;
    const distance = Math.max(Math.abs(deltaX), Math.abs(deltaY));

    if (!dragState.current.isActive) {
      if (distance > 4) {
        dragState.current.isActive = true;
        setIsDragging(true);
        try {
          container.setPointerCapture(e.pointerId);
        } catch (err) {
          // ignore capture errors
        }
      } else {
        return;
      }
    }

    container.scrollLeft = dragState.current.scrollLeft - deltaX;
    container.scrollTop = dragState.current.scrollTop - deltaY;
  };

  const endPointerDrag = (e) => {
    const container = containerRef.current;
    if (container && dragState.current.pointerId !== null && dragState.current.isActive) {
      try {
        container.releasePointerCapture(dragState.current.pointerId);
      } catch (err) {
        // ignore
      }
    }
    dragState.current.pointerId = null;
    dragState.current.isActive = false;
    setIsDragging(false);
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch' || gestureLock) return;
    if (dragState.current.pointerId === e.pointerId) {
      endPointerDrag(e);
    }
  };

  const handlePointerLeave = (e) => {
    if (isDragging) {
      endPointerDrag(e);
    }
  };

  const scrollToTop = () => {
    const container = containerRef.current;
    if (!container) return;
    container.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Motion blur effect based on shutter speed
  const getMotionBlur = () => {
    const slowThreshold = 30;
    const fadeOutPoint = 400;
    if (shutterSpeed > fadeOutPoint) return 0;
    const clamped = Math.max(slowThreshold, Math.min(shutterSpeed, fadeOutPoint));
    const normalized = (clamped - slowThreshold) / (fadeOutPoint - slowThreshold);
    return Number((8 * (1 - normalized)).toFixed(2));
  };

  // Enable scrolling when zoomed in significantly
  const isZoomedIn = currentLens.zoom > 1;

  const scrollClasses = 'overflow-y-auto overflow-x-hidden';
  const lensClass = lensLayout ? ` lens-${lensLayout}` : '';

  const navOffset = 'calc(var(--camera-top-rail-height, 112px) + var(--camera-nav-safe-zone, 96px))';
  const baseBottomPadding = '140px';
  const containerStyle = {
    cursor: isDragging ? 'grabbing' : 'auto',
    paddingTop: isZoomedIn ? `calc(${navOffset} + 64px)` : navOffset,
    paddingBottom: baseBottomPadding,
    minHeight: '100vh',
  };

  const stageBackgroundStyle = {
    background: 'var(--content-stage-gradient)',
    backgroundSize: '160% 160%',
    ...(contentStyle && contentStyle.filter ? { filter: contentStyle.filter } : {}),
  };

  return (
    <div
      ref={containerRef}
      className={`section-scroll-container relative w-full min-h-screen ${scrollClasses}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={containerStyle}
    >
      {/* Navigation arrows - Fixed desktop position, fade with scroll */}
      <button
        onClick={prevSection}
        className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[1500] camera-hud p-4 rounded-full hover:scale-110 pointer-events-auto items-center justify-center shadow-lg"
        style={{
          width: '56px',
          height: '56px',
          opacity: scrollOpacity,
          transition: 'opacity 0.2s ease-out'
        }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSection}
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[1500] camera-hud p-4 rounded-full hover:scale-110 pointer-events-auto items-center justify-center shadow-lg"
        style={{
          width: '56px',
          height: '56px',
          opacity: scrollOpacity,
          transition: 'opacity 0.2s ease-out'
        }}
      >
        <ChevronRight className="w-8 h-8" />
      </button>

      {/* Section indicator dots */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1300] flex gap-2">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSection
                ? 'bg-green-400 w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Sections with lens zoom effect */}
      <div className={`relative w-full min-h-screen transition-all duration-500 ease-out${lensClass}`}>
        <div className="absolute inset-0 -z-10 pointer-events-none" style={{ ...stageBackgroundStyle, minHeight: '100%' }} />
        <AnimatePresence mode="wait" initial={false} custom={swipeDirection}>
          <motion.div
            key={currentSection}
            custom={swipeDirection}
            initial={{ opacity: 0, x: swipeDirection * 100, filter: `blur(${getMotionBlur()}px)` }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, x: swipeDirection * -100, filter: `blur(${getMotionBlur()}px)` }}
            transition={{
              duration: 0.5,
              ease: [0.4, 0, 0.2, 1],
            }}
            className="w-full min-h-screen content-stage"
            style={contentStyle}
          >
            <BlurLayer
              depth={400}
              layerId={`section-${currentSection}`}
              focusOnMount
              className="w-full min-h-screen"
            >
              {sections[currentSection]}
            </BlurLayer>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Back to top button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            onClick={scrollToTop}
            className="fixed bottom-28 right-6 z-[1450] camera-hud w-12 h-12 rounded-full flex items-center justify-center"
            aria-label="Back to top"
          >
            <ArrowUpToLine className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
