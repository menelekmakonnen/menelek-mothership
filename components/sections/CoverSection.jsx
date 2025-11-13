import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

const slides = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Worldbuilder, AI Supernerd, and Creative Visionary',
    gradient: 'from-purple-900 via-blue-900 to-indigo-900',
    targetSection: 0,
  },
  {
    id: 'films',
    title: 'Films & Music Videos',
    description: 'Cinematic storytelling and visual artistry',
    gradient: 'from-red-900 via-orange-900 to-yellow-900',
    targetSection: 1,
  },
  {
    id: 'loremaker',
    title: 'Loremaker Universe',
    description: 'Epic character-driven narratives',
    gradient: 'from-green-900 via-emerald-900 to-teal-900',
    targetSection: 2,
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capturing moments through the lens',
    gradient: 'from-blue-900 via-cyan-900 to-sky-900',
    targetSection: 5,
  },
  {
    id: 'ai',
    title: 'AI Projects',
    description: 'Innovation in artificial intelligence',
    gradient: 'from-pink-900 via-fuchsia-900 to-purple-900',
    targetSection: 3,
  },
];

export default function CoverSection({ onSectionSelect }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 7000); // Slower transitions: 7 seconds

    return () => clearInterval(interval);
  }, [autoPlay]);

  const nextSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setAutoPlay(false);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background gradient - Always fills screen, crossfade transitions */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: 'easeInOut' }}
            className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient}`}
          />
        </AnimatePresence>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-4 md:px-8 w-full pt-32 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-7xl lg:text-8xl font-bold mb-4 md:mb-6 tracking-tight">
              {slides[currentSlide].title}
            </h1>
            <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12">
              {slides[currentSlide].description}
            </p>
            <motion.button
              onClick={() => onSectionSelect && onSectionSelect(slides[currentSlide].targetSection)}
              className="btn-luxury text-base md:text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                <Play className="w-4 h-4 md:w-5 md:h-5" />
                Explore
              </span>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 camera-hud p-2 md:p-4 rounded-full hover:scale-110 transition-transform"
      >
        <ChevronLeft className="w-5 h-5 md:w-8 md:h-8" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 camera-hud p-2 md:p-4 rounded-full hover:scale-110 transition-transform"
      >
        <ChevronRight className="w-5 h-5 md:w-8 md:h-8" />
      </button>

      {/* Slide indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setAutoPlay(false);
              setCurrentSlide(index);
            }}
            className={`transition-all ${
              index === currentSlide
                ? 'w-8 md:w-12 h-2 md:h-3 bg-white rounded-full'
                : 'w-2 md:w-3 h-2 md:h-3 bg-white/40 rounded-full hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
