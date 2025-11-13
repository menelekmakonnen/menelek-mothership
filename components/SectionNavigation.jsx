import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import BlurLayer from './ui/BlurLayer';

export default function SectionNavigation({ sections }) {
  const { currentSection, setCurrentSection, currentLens, shutterSpeed, setFocusedLayer } = useCameraContext();
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [swipeDirection, setSwipeDirection] = useState(1); // 1 for next, -1 for prev

  const minSwipeDistance = 50;

  const nextSection = () => {
    setSwipeDirection(1);
    setCurrentSection((prev) => (prev + 1) % sections.length);
    // Trigger refocus event
    setFocusedLayer(100);
  };

  const prevSection = () => {
    setSwipeDirection(-1);
    setCurrentSection((prev) => (prev - 1 + sections.length) % sections.length);
    // Trigger refocus event
    setFocusedLayer(100);
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

  // Enable scrolling when zoomed in significantly
  const isZoomedIn = currentLens.zoom > 1;

  return (
    <div
      className={`w-full h-full relative ${isZoomedIn ? 'overflow-auto' : 'overflow-hidden'}`}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      {/* Navigation arrows - Fixed desktop position */}
      <button
        onClick={prevSection}
        className="hidden md:flex fixed left-8 top-1/2 -translate-y-1/2 z-[1500] camera-hud p-4 rounded-full hover:scale-110 transition-all pointer-events-auto items-center justify-center shadow-lg"
        style={{ width: '56px', height: '56px' }}
      >
        <ChevronLeft className="w-8 h-8" />
      </button>

      <button
        onClick={nextSection}
        className="hidden md:flex fixed right-8 top-1/2 -translate-y-1/2 z-[1500] camera-hud p-4 rounded-full hover:scale-110 transition-all pointer-events-auto items-center justify-center shadow-lg"
        style={{ width: '56px', height: '56px' }}
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
          transformOrigin: 'center center'
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
          >
            <BlurLayer depth={100}>
              {sections[currentSection]}
            </BlurLayer>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
