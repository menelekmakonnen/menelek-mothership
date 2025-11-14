import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useRef, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlurLayer from './ui/BlurLayer';

export default function SectionNavigation({ sections, contentStyle = {} }) {
  const {
    currentSection,
    setCurrentSection,
    currentLens,
    shutterSpeed,
    setFocusedLayer,
    gestureLock,
  } = useCameraContext();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(1); // 1 for next, -1 for prev
  const [scrollOpacity, setScrollOpacity] = useState(1);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ x: 0, y: 0, scrollTop: 0, scrollLeft: 0, pointerId: null });
  const containerRef = useRef(null);

  const minSwipeDistance = 50;

  const totalSections = sections.length;

  const nextSection = useCallback(() => {
    if (gestureLock) return;
    setSwipeDirection(1);
    setCurrentSection((prev) => (prev + 1) % totalSections);
    setFocusedLayer(100);
  }, [gestureLock, setCurrentSection, totalSections, setFocusedLayer]);

  const prevSection = useCallback(() => {
    if (gestureLock) return;
    setSwipeDirection(-1);
    setCurrentSection((prev) => (prev - 1 + totalSections) % totalSections);
    setFocusedLayer(100);
  }, [gestureLock, setCurrentSection, totalSections, setFocusedLayer]);

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
      if (e.key === 'ArrowLeft') prevSection();
      if (e.key === 'ArrowRight') nextSection();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [prevSection, nextSection]);

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
    if (e.pointerType === 'touch' || e.button !== 0) return;
    const container = containerRef.current;
    if (!container) return;

    setIsDragging(true);
    dragState.current = {
      x: e.clientX,
      y: e.clientY,
      scrollTop: container.scrollTop,
      scrollLeft: container.scrollLeft,
      pointerId: e.pointerId,
    };

    container.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const container = containerRef.current;
    if (!container) return;

    const deltaX = e.clientX - dragState.current.x;
    const deltaY = e.clientY - dragState.current.y;

    container.scrollLeft = dragState.current.scrollLeft - deltaX;
    container.scrollTop = dragState.current.scrollTop - deltaY;
  };

  const endPointerDrag = (e) => {
    const container = containerRef.current;
    if (container && dragState.current.pointerId !== null) {
      try {
        container.releasePointerCapture(dragState.current.pointerId);
      } catch (err) {
        // ignore
      }
    }
    dragState.current.pointerId = null;
    setIsDragging(false);
  };

  const handlePointerUp = (e) => {
    if (e.pointerType === 'touch') return;
    endPointerDrag(e);
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
    if (shutterSpeed < 30) {
      return Math.min(shutterSpeed / 100, 0.5);
    }
    return 0;
  };

  // Enable scrolling when zoomed in significantly
  const isZoomedIn = currentLens.zoom > 1;

  const scrollClasses = isZoomedIn
    ? 'overflow-x-auto overflow-y-auto'
    : 'overflow-y-auto overflow-x-hidden';

  return (
    <div
      ref={containerRef}
      className={`section-scroll-container w-full h-full relative ${scrollClasses}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerLeave}
      style={isZoomedIn ? {
        paddingTop: '120px',
        paddingBottom: '120px',
        cursor: isDragging ? 'grabbing' : 'grab',
      } : { cursor: isDragging ? 'grabbing' : 'grab' }}
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
      <div
        className="w-full h-full transition-transform duration-700 ease-out"
        style={{
          transform: `scale(${currentLens.zoom})`,
          transformOrigin: 'center center',
          minHeight: isZoomedIn ? 'max-content' : '100%',
          minWidth: isZoomedIn ? 'max-content' : '100%',
        }}
      >
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
            className="w-full h-full"
            style={contentStyle}
          >
            <BlurLayer depth={100}>
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
            className="fixed bottom-28 right-6 z-[1450] camera-hud px-4 py-2 rounded-full flex items-center gap-2 text-xs uppercase tracking-[0.3em]"
          >
            Back to Top
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
