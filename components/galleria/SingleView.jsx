import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function SingleView() {
  const {
    currentItem,
    currentItemIndex,
    currentAlbum,
    navigateLeft,
    navigateRight,
    goBack,
    zoomLevel,
    handleZoom,
    resetZoom,
    isZoomed,
    isSlideshow,
    toggleSlideshow,
  } = useGalleriaContext();

  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageRef = useRef(null);
  const sidebarRef = useRef(null);
  const albumRowRef = useRef(null);

  // Handle scroll wheel behavior
  const handleWheel = (e, area) => {
    if (area === 'image' && isHoveringImage) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.2 : 0.2;
      handleZoom(delta);
    } else if (area === 'sidebar') {
      // Let natural scrolling happen
    } else if (area === 'albumRow') {
      // Let natural scrolling happen
    } else if (area === 'mainImage' && !isHoveringImage) {
      // Navigate to next/prev image
      e.preventDefault();
      if (e.deltaY > 0) {
        navigateRight();
      } else {
        navigateLeft();
      }
    }
  };

  const items = currentAlbum?.items || [];
  const albumsInGallery = []; // TODO: Get from gallery context

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Main Image Display */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onWheel={(e) => handleWheel(e, 'mainImage')}
        style={{ paddingBottom: '200px' }} // Space for HUD + album row
      >
        {/* Close Button */}
        <button
          onClick={goBack}
          className="absolute top-6 right-6 z-50 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <X size={24} className="text-white" />
        </button>

        {/* Navigation Arrows */}
        <button
          onClick={navigateLeft}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <ChevronLeft size={32} className="text-white" />
        </button>

        <button
          onClick={navigateRight}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <ChevronRight size={32} className="text-white" />
        </button>

        {/* Image/Video Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentItem?.id || currentItemIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative max-w-full max-h-full flex items-center justify-center"
            ref={imageRef}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => setIsHoveringImage(false)}
            onWheel={(e) => handleWheel(e, 'image')}
          >
            {currentItem?.type === 'video' ? (
              <video
                src={currentItem.url}
                controls
                autoPlay
                className="max-w-full max-h-full"
                style={{
                  objectFit: 'contain',
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                }}
              />
            ) : (
              <img
                src={currentItem?.url}
                alt={currentItem?.name || currentItem?.title}
                className="max-w-full max-h-full"
                style={{
                  objectFit: 'contain',
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                  cursor: isHoveringImage ? 'zoom-in' : 'default',
                }}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Zoom Controls */}
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-6 left-6 flex items-center gap-2"
          >
            <button
              onClick={() => handleZoom(-0.2)}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
            >
              <ZoomOut size={20} className="text-white" />
            </button>
            <button
              onClick={resetZoom}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
            >
              <Maximize2 size={20} className="text-white" />
            </button>
            <button
              onClick={() => handleZoom(0.2)}
              className="w-10 h-10 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
            >
              <ZoomIn size={20} className="text-white" />
            </button>
          </motion.div>
        )}

        {/* Item Counter */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 glass-strong rounded-full">
          <p className="text-sm font-mono text-white">
            {currentItemIndex + 1} / {items.length}
          </p>
        </div>

        {/* Slideshow Button */}
        <button
          onClick={toggleSlideshow}
          className="absolute bottom-6 left-6 px-4 py-2 glass-strong rounded-full flex items-center gap-2 hover:border-accent transition-colors"
        >
          {isSlideshow ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-sm font-medium">
            {isSlideshow ? 'Stop' : 'Slideshow'}
          </span>
        </button>
      </div>

      {/* Sidebar - All Images */}
      <div
        ref={sidebarRef}
        onWheel={(e) => handleWheel(e, 'sidebar')}
        className="fixed right-0 top-0 bottom-0 w-32 bg-black/50 backdrop-blur-xl overflow-y-auto no-scrollbar border-l border-white/10"
        style={{ paddingBottom: '200px' }}
      >
        <div className="p-2 space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Navigate to this item
                const diff = index - currentItemIndex;
                if (diff > 0) {
                  for (let i = 0; i < diff; i++) navigateRight();
                } else if (diff < 0) {
                  for (let i = 0; i < Math.abs(diff); i++) navigateLeft();
                }
              }}
              className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentItemIndex
                  ? 'border-accent shadow-lg shadow-accent/50'
                  : 'border-transparent hover:border-white/30'
              }`}
            >
              <img
                src={item.thumbnailUrl || item.url}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === currentItemIndex && (
                <div className="absolute inset-0 bg-accent/20" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Album Row */}
      <div
        ref={albumRowRef}
        onWheel={(e) => handleWheel(e, 'albumRow')}
        className="fixed bottom-20 left-0 right-32 h-40 bg-black/50 backdrop-blur-xl overflow-x-auto overflow-y-hidden no-scrollbar border-t border-white/10"
        style={{ zIndex: 999 }}
      >
        <div className="flex gap-3 p-3 h-full">
          {albumsInGallery.length > 0 ? (
            albumsInGallery.map((album, index) => (
              <motion.div
                key={album.id || index}
                whileHover={{ scale: 1.05, y: -4 }}
                className="relative flex-shrink-0 w-24 h-full rounded-lg overflow-hidden cursor-pointer border border-white/10 hover:border-accent transition-all"
              >
                <img
                  src={album.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-xs text-white font-medium truncate">
                    {album.name}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-sm text-white/50">No other albums</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
