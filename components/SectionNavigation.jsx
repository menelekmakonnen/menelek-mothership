import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlurLayer from './ui/BlurLayer';

export default function SectionNavigation({ sections }) {
  const { currentSection, setCurrentSection, currentLens, shutterSpeed } = useCameraContext();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [lastClickTime, setLastClickTime] = useState(0);

  const minSwipeDistance = 50;

  const handleDoubleClick = (e) => {
    const now = Date.now();
    if (now - lastClickTime < 300) {
      // Double click detected - reset page
      window.location.reload();
    }
    setLastClickTime(now);
  };

  const nextSection = () => {
    setCurrentSection((prev) => (prev + 1) % sections.length);
  };

  const prevSection = () => {
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
  };

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
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
  }, []);

  // Motion blur effect based on shutter speed
  const getMotionBlur = () => {
    if (shutterSpeed < 30) {
      return Math.min(shutterSpeed / 100, 0.5);
    }
    return 0;
  };

  return (
    <div
      className="w-full h-full overflow-hidden relative"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Navigation arrows - Double-click to reset */}
      <button
        onClick={(e) => {
          prevSection();
          handleDoubleClick(e);
        }}
        className="fixed left-4 top-1/2 -translate-y-1/2 z-[1300] camera-hud p-3 rounded-full hover:scale-110 transition-transform pointer-events-auto"
        title="Double-click to reset page"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          nextSection();
          handleDoubleClick(e);
        }}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-[1300] camera-hud p-3 rounded-full hover:scale-110 transition-transform pointer-events-auto"
        title="Double-click to reset page"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Section indicator dots */}
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[1300] flex gap-2 pointer-events-auto max-w-[90vw] flex-wrap justify-center px-4">
        {sections.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={`w-2 h-2 md:w-2 md:h-2 rounded-full transition-all ${
              index === currentSection
                ? 'bg-green-400 w-6 md:w-8'
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>

      {/* Sections */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, x: 100, filter: `blur(${getMotionBlur()}px)` }}
          animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, x: -100, filter: `blur(${getMotionBlur()}px)` }}
          transition={{
            duration: 0.5,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="w-full h-full overflow-y-auto overflow-x-hidden"
          style={{
            transform: `scale(${currentLens.zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <BlurLayer depth={100}>
            {sections[currentSection]}
          </BlurLayer>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
