import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useCallback, useState } from 'react';
import { X, PlayCircle, PauseCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';

export default function SingleImageView({ images, album }) {
  const {
    currentImageIndex,
    setCurrentImageIndex,
    goBack,
    isSlideshow,
    startSlideshow,
    stopSlideshow,
    imageZoom,
    setImageZoom,
    imagePosition,
    setImagePosition,
    resetZoom,
  } = useGalleria();

  const [isOverImage, setIsOverImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchDistance, setTouchDistance] = useState(null);

  const currentImage = images[currentImageIndex];

  // Navigate images
  const navigateImage = (direction) => {
    const newIndex = direction === 'next'
      ? (currentImageIndex + 1) % images.length
      : (currentImageIndex - 1 + images.length) % images.length;
    setCurrentImageIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateImage('next');
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateImage('prev');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      } else if (e.key === ' ') {
        e.preventDefault();
        if (isSlideshow) {
          stopSlideshow();
        } else {
          startSlideshow();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentImageIndex, images.length, isSlideshow]);

  // Slideshow auto-advance
  useEffect(() => {
    if (!isSlideshow) return;

    const interval = setInterval(() => {
      navigateImage('next');
    }, 3000);

    return () => clearInterval(interval);
  }, [isSlideshow, currentImageIndex]);

  // Zoom handlers
  const handleZoomWheel = useCallback((e) => {
    if (!isOverImage) return;
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newZoom = Math.min(Math.max(0.5, imageZoom + delta), 5);
    setImageZoom(newZoom);
  }, [isOverImage, imageZoom, setImageZoom]);

  const handleImageMouseDown = useCallback((e) => {
    if (imageZoom <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  }, [imageZoom, imagePosition]);

  const handleImageMouseMove = useCallback((e) => {
    if (!isDragging) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart, setImagePosition]);

  const handleImageMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 2) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchDistance(distance);
    } else if (e.touches.length === 1 && imageZoom > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.touches[0].clientX - imagePosition.x,
        y: e.touches[0].clientY - imagePosition.y,
      });
    }
  }, [imageZoom, imagePosition]);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length === 2 && touchDistance) {
      const distance = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const scale = distance / touchDistance;
      const newZoom = Math.min(Math.max(0.5, imageZoom * scale), 5);
      setImageZoom(newZoom);
      setTouchDistance(distance);
    } else if (e.touches.length === 1 && isDragging) {
      setImagePosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      });
    }
  }, [touchDistance, imageZoom, isDragging, dragStart, setImageZoom, setImagePosition]);

  const handleTouchEnd = useCallback(() => {
    setTouchDistance(null);
    setIsDragging(false);
  }, []);

  return (
    <div className="fixed inset-0 z-[25000] flex flex-col bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-xl font-semibold">{album.name}</h3>
            <span className="text-sm text-white/60">
              {currentImageIndex + 1} / {images.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={isSlideshow ? stopSlideshow : startSlideshow}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 transition hover:border-white/60 hover:bg-white/20"
            >
              {isSlideshow ? (
                <>
                  <PauseCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Pause</span>
                </>
              ) : (
                <>
                  <PlayCircle className="h-5 w-5" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>
            <button
              onClick={goBack}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-white/60 hover:bg-white/10"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Image Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Image Container */}
        <div
          className="relative flex flex-1 items-center justify-center overflow-hidden"
          onWheel={handleZoomWheel}
          onMouseMove={handleImageMouseMove}
          onMouseUp={handleImageMouseUp}
          onMouseLeave={handleImageMouseUp}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImageIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex h-full w-full items-center justify-center"
            >
              <img
                src={currentImage.url || currentImage.thumbnail}
                alt={currentImage.title || `Image ${currentImageIndex + 1}`}
                className="max-h-full max-w-full object-contain transition-transform"
                style={{
                  transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                  cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
                }}
                onMouseEnter={() => setIsOverImage(true)}
                onMouseLeave={() => setIsOverImage(false)}
                onMouseDown={handleImageMouseDown}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                draggable={false}
              />
            </motion.div>
          </AnimatePresence>

          {/* Reset Zoom Button */}
          {(imageZoom !== 1 || imagePosition.x !== 0 || imagePosition.y !== 0) && (
            <button
              onClick={resetZoom}
              className="absolute right-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-black/70 px-4 py-2 text-sm backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => navigateImage('prev')}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={() => navigateImage('next')}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-3 backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>

        {/* Sidebar with thumbnails */}
        <div className="hidden w-80 overflow-y-auto border-l border-white/10 bg-black/50 p-4 lg:block">
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white/60">All Images</h4>
          <div className="space-y-2">
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setCurrentImageIndex(index)}
                className={`group relative w-full overflow-hidden rounded-lg transition ${
                  index === currentImageIndex
                    ? 'ring-2 ring-white'
                    : 'ring-1 ring-white/10 hover:ring-white/30'
                }`}
              >
                <div className="aspect-video overflow-hidden bg-black/50">
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.title || `Image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform group-hover:scale-110"
                  />
                </div>
                {image.title && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                    <p className="truncate text-xs">{image.title}</p>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
