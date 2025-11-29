import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Maximize,
  Settings,
} from 'lucide-react';

/**
 * Slideshow Mode Component
 * Full-screen slideshow with auto-advance and manual controls
 */
export default function SlideshowMode({ items, initialIndex = 0, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isPlaying, setIsPlaying] = useState(true);
  const [interval, setInterval] = useState(3000); // 3 seconds
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [showSettings, setShowSettings] = useState(false);

  const currentItem = items[currentIndex];

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, interval);

    return () => clearTimeout(timer);
  }, [currentIndex, isPlaying, interval, items.length]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case ' ':
          e.preventDefault();
          setIsPlaying((prev) => !prev);
          break;
        case 'ArrowLeft':
          e.preventDefault();
          goToPrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          goToNext();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    let timer;
    const resetTimer = () => {
      setShowControls(true);
      clearTimeout(timer);
      timer = setTimeout(() => setShowControls(false), 3000);
    };

    const handleMouseMove = () => resetTimer();

    resetTimer();
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  }, []);

  const intervalOptions = [
    { label: '1s', value: 1000 },
    { label: '2s', value: 2000 },
    { label: '3s', value: 3000 },
    { label: '5s', value: 5000 },
    { label: '10s', value: 10000 },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[6000] bg-black flex items-center justify-center"
    >
      {/* Main Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5 }}
          className="w-full h-full flex items-center justify-center p-8"
        >
          {currentItem?.type === 'video' ? (
            <div className="w-full h-full flex items-center justify-center">
              <iframe
                src={currentItem.embedUrl || currentItem.url}
                className="w-full h-full max-w-[90vw] max-h-[90vh]"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <img
              src={currentItem?.url || currentItem?.coverUrl}
              alt={currentItem?.name || currentItem?.title || ''}
              className="max-w-full max-h-full object-contain"
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-black/80 backdrop-blur-md border border-white/20 rounded-full px-6 py-3 flex items-center gap-4">
              {/* Previous */}
              <button
                onClick={goToPrevious}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Previous (Left Arrow)"
              >
                <SkipBack size={20} className="text-white" />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => setIsPlaying((prev) => !prev)}
                className="p-3 rounded-full bg-accent hover:bg-accent-dim transition-colors"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
              >
                {isPlaying ? (
                  <Pause size={24} className="text-black" />
                ) : (
                  <Play size={24} className="text-black" />
                )}
              </button>

              {/* Next */}
              <button
                onClick={goToNext}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Next (Right Arrow)"
              >
                <SkipForward size={20} className="text-white" />
              </button>

              {/* Settings */}
              <div className="relative">
                <button
                  onClick={() => setShowSettings((prev) => !prev)}
                  className="p-2 rounded-full hover:bg-white/10 transition-colors"
                  title="Settings"
                >
                  <Settings size={20} className="text-white" />
                </button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-black/90 border border-white/20 rounded-lg p-4 min-w-[200px]">
                    <div className="text-white text-sm font-medium mb-2">Interval</div>
                    <div className="flex gap-2">
                      {intervalOptions.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => setInterval(option.value)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                            interval === option.value
                              ? 'bg-accent text-black'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Fullscreen (F)"
              >
                <Maximize size={20} className="text-white" />
              </button>

              {/* Close */}
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Exit (Esc)"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed top-8 left-1/2 transform -translate-x-1/2 z-10"
          >
            <div className="bg-black/60 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2">
              <span className="text-white text-sm font-medium">
                {currentIndex + 1} / {items.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
