import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Film, User, Link2, Camera, Brain, Video, Image, Sparkles, BookOpen } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

const slides = [
  {
    id: 'intro',
    title: 'Introduction',
    description: 'Worldbuilder, AI Supernerd, and Creative Visionary',
    gradient: 'from-purple-900 via-blue-900 to-indigo-900',
    targetSection: 1,
  },
  {
    id: 'films',
    title: 'Films & Music Videos',
    description: 'Cinematic storytelling and visual artistry',
    gradient: 'from-red-900 via-orange-900 to-yellow-900',
    targetSection: 3,
  },
  {
    id: 'loremaker',
    title: 'Loremaker Universe',
    description: 'Epic character-driven narratives',
    gradient: 'from-green-900 via-emerald-900 to-teal-900',
    targetSection: 4,
  },
  {
    id: 'photography',
    title: 'Photography',
    description: 'Capturing moments through the lens',
    gradient: 'from-blue-900 via-cyan-900 to-sky-900',
    targetSection: 7,
  },
  {
    id: 'ai',
    title: 'AI Projects',
    description: 'Innovation in artificial intelligence',
    gradient: 'from-pink-900 via-fuchsia-900 to-purple-900',
    targetSection: 5,
  },
];

const quickNavLinks = [
  { name: 'Intro', icon: User, section: 1, gradient: 'from-purple-600 to-blue-600' },
  { name: 'Links', icon: Link2, section: 2, gradient: 'from-pink-600 to-purple-600' },
  { name: 'Films', icon: Film, section: 3, gradient: 'from-red-600 to-orange-600' },
  { name: 'Loremaker', icon: BookOpen, section: 4, gradient: 'from-green-600 to-emerald-600' },
  { name: 'AI', icon: Brain, section: 5, gradient: 'from-fuchsia-600 to-pink-600' },
  { name: 'Edits', icon: Video, section: 6, gradient: 'from-yellow-600 to-orange-600' },
  { name: 'Photos', icon: Camera, section: 7, gradient: 'from-cyan-600 to-blue-600' },
  { name: 'AI Art', icon: Sparkles, section: 8, gradient: 'from-violet-600 to-purple-600' },
  { name: 'Blog', icon: Image, section: 9, gradient: 'from-teal-600 to-green-600' },
];

export default function CoverSection({ onSectionSelect }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

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
    <div className="w-full min-h-screen flex items-center justify-center relative overflow-hidden p-4 md:p-8 pt-32 pb-32">
      {/* Background gradient */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className={`absolute inset-0 bg-gradient-to-br ${slides[currentSlide].gradient}`}
        />
      </AnimatePresence>

      {/* Content */}
      <div className="relative z-10 text-center max-w-5xl px-4 md:px-8 w-full">
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
      <div className="absolute bottom-20 md:bottom-32 left-1/2 -translate-x-1/2 z-20 flex gap-2 md:gap-3">
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

      {/* Floating Quick Nav */}
      {/* Floating Quick Nav - Premium Style */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 max-w-full px-4"
      >
        <div className="camera-hud rounded-2xl px-4 md:px-6 py-3 md:py-4 flex gap-2 md:gap-4 overflow-x-auto scrollbar-hide max-w-[90vw]">
          {quickNavLinks.map((link) => {
            return (
              <button
                key={link.section}
                onClick={() => onSectionSelect && onSectionSelect(link.section)}
                className="group flex flex-col items-center gap-2 flex-shrink-0 hover:scale-105 transition-transform"
                title={link.name}
              >
                <IconBox icon={link.icon} gradient={link.gradient} size="sm" />
                <span className="text-[9px] md:text-xs font-mono opacity-75 group-hover:opacity-100 transition-opacity">
                  {link.name}
                </span>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
