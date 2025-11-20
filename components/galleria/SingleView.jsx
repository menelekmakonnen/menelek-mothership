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
  ExternalLink,
} from 'lucide-react';
import { useGalleriaContext } from '@/context/GalleriaContext';

export default function SingleView() {
  const {
    currentItem,
    currentItemIndex,
    currentAlbum,
    currentCategory,
    mediaData,
    navigateLeft,
    navigateRight,
    goBack,
    zoomLevel,
    handleZoom,
    resetZoom,
    isZoomed,
    isSlideshow,
    toggleSlideshow,
    enterSingle,
  } = useGalleriaContext();

  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const imageRef = useRef(null);
  const sidebarRef = useRef(null);
  const albumRowRef = useRef(null);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        goBack();
      } else if (e.key === 'ArrowLeft') {
        navigateLeft();
      } else if (e.key === 'ArrowRight') {
        navigateRight();
      } else if (e.key === ' ') {
        e.preventDefault();
        toggleSlideshow();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goBack, navigateLeft, navigateRight, toggleSlideshow]);

  // Get all items in current album
  const items = currentAlbum?.items || [];

  // Get all albums/items from current gallery (for bottom row)
  const getAlbumsInGallery = () => {
    if (!currentCategory) return [];

    const categoryId = currentCategory.id;
    const categoryData = mediaData[categoryId];

    if (categoryId === 'films') {
      // For films, return all film items as if they were albums
      return (categoryData?.items || []).map(film => ({
        ...film,
        id: film.id,
        name: film.title,
        items: [film], // Wrap in array for consistency
        coverUrl: film.coverUrl || film.thumbnailUrl,
      }));
    } else if (categoryId === 'video-edits') {
      return categoryData?.categories || [];
    } else if (categoryId === 'photography' || categoryId === 'ai-albums') {
      return categoryData?.galleries || [];
    } else if (categoryId === 'loremaker') {
      return []; // Loremaker doesn't have albums
    }

    return [];
  };

  const albumsInGallery = getAlbumsInGallery();

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

  // Render media content based on type
  const renderMediaContent = () => {
    if (!currentItem) return null;

    // YouTube video
    if (currentItem.embedUrl && (currentItem.type === 'film' || currentItem.type === 'music-video' || currentItem.type === 'documentary')) {
      return (
        <div className="w-full h-full max-w-6xl max-h-[80vh] mx-auto">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <iframe
              src={currentItem.embedUrl}
              title={currentItem.title}
              className="absolute inset-0 w-full h-full rounded-lg"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      );
    }

    // Instagram embed
    if (currentItem.embedUrl && currentItem.type === 'instagram') {
      return (
        <div className="w-full h-full max-w-lg max-h-[80vh] mx-auto">
          <iframe
            src={currentItem.embedUrl}
            className="w-full h-full rounded-lg"
            frameBorder="0"
            scrolling="no"
            allowTransparency="true"
          />
        </div>
      );
    }

    // Regular image
    return (
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
        <img
          src={currentItem?.url || currentItem?.coverUrl}
          alt={currentItem?.name || currentItem?.title || currentItem?.character}
          className="max-w-full max-h-full"
          style={{
            objectFit: 'contain',
            transform: `scale(${zoomLevel})`,
            transition: 'transform 0.2s ease-out',
            cursor: isHoveringImage ? (isZoomed ? 'zoom-out' : 'zoom-in') : 'default',
          }}
        />
      </motion.div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col">
      {/* Main Content Area */}
      <div
        className="flex-1 flex items-center justify-center relative overflow-hidden"
        onWheel={(e) => handleWheel(e, 'mainImage')}
        style={{ paddingBottom: '180px', paddingRight: '160px' }} // Space for HUD + album row + sidebar
      >
        {/* Close Button - More Prominent */}
        <button
          onClick={goBack}
          className="absolute top-6 right-6 z-50 w-14 h-14 rounded-full bg-black/80 backdrop-blur-xl border-2 border-white/20 flex items-center justify-center hover:bg-purple-600 hover:border-purple-400 transition-all duration-300 shadow-2xl group"
        >
          <X size={28} className="text-white group-hover:rotate-90 transition-transform duration-300" />
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
          className="absolute right-40 top-1/2 -translate-y-1/2 z-50 w-16 h-16 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
        >
          <ChevronRight size={32} className="text-white" />
        </button>

        {/* Media Display */}
        <div className="w-full h-full flex items-center justify-center p-8">
          <AnimatePresence mode="wait">
            {renderMediaContent()}
          </AnimatePresence>
        </div>

        {/* Zoom Controls */}
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute top-6 left-6 flex items-center gap-2 z-50"
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
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 glass-strong rounded-full z-50">
          <p className="text-sm font-mono text-white">
            {currentItemIndex + 1} / {items.length}
          </p>
        </div>

        {/* Slideshow Button */}
        <button
          onClick={toggleSlideshow}
          className="absolute bottom-6 left-6 px-4 py-2 glass-strong rounded-full flex items-center gap-2 hover:border-accent transition-colors z-50"
        >
          {isSlideshow ? <Pause size={16} /> : <Play size={16} />}
          <span className="text-sm font-medium text-white">
            {isSlideshow ? 'Stop' : 'Slideshow'}
          </span>
        </button>

        {/* External Link Button (for Loremaker characters) */}
        {currentItem?.externalLink && (
          <a
            href={currentItem.externalLink}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute bottom-6 right-40 px-4 py-2 glass-strong rounded-full flex items-center gap-2 hover:border-accent transition-colors z-50"
          >
            <ExternalLink size={16} className="text-white" />
            <span className="text-sm font-medium text-white">View Character</span>
          </a>
        )}

        {/* Media Info Overlay (Bottom Left) */}
        {currentItem && (
          <div className="absolute bottom-20 left-6 max-w-md glass-strong rounded-xl p-4 z-50">
            <h3 className="text-lg font-bold text-white mb-1">
              {currentItem.title || currentItem.name || currentItem.character}
            </h3>
            {currentItem.description && (
              <p className="text-sm text-gray-300 mb-2">{currentItem.description}</p>
            )}
            {currentItem.role && (
              <p className="text-xs text-gray-400">{currentItem.role}</p>
            )}
            {currentItem.runtime && (
              <p className="text-xs text-gray-400">{currentItem.runtime} • {currentItem.year}</p>
            )}
          </div>
        )}
      </div>

      {/* Sidebar - All Images in Album */}
      <div
        ref={sidebarRef}
        onWheel={(e) => handleWheel(e, 'sidebar')}
        className="fixed right-0 top-0 bottom-0 w-32 bg-black/50 backdrop-blur-xl overflow-y-auto no-scrollbar border-l border-white/10 z-[999]"
        style={{ paddingBottom: '180px' }}
      >
        <div className="p-2 space-y-2">
          {items.map((item, index) => (
            <motion.div
              key={item.id || index}
              whileHover={{ scale: 1.05 }}
              onClick={() => {
                // Navigate to this item
                if (index !== currentItemIndex) {
                  enterSingle(item, index);
                }
              }}
              className={`relative aspect-[9/16] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                index === currentItemIndex
                  ? 'border-accent shadow-lg shadow-accent/50'
                  : 'border-transparent hover:border-white/30'
              }`}
            >
              <img
                src={item.thumbnailUrl || item.coverUrl || item.url}
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
        className="fixed bottom-20 left-0 right-32 h-40 bg-black/50 backdrop-blur-xl overflow-x-auto overflow-y-hidden no-scrollbar border-t border-white/10 z-[998]"
      >
        <div className="flex gap-3 p-3 h-full">
          {albumsInGallery.length > 0 ? (
            albumsInGallery.map((album, index) => (
              <motion.div
                key={album.id || index}
                whileHover={{ scale: 1.05, y: -4 }}
                onClick={() => {
                  // Switch to this album but stay in single view
                  if (album.items && album.items.length > 0) {
                    enterSingle(album.items[0], 0);
                  }
                }}
                className={`relative flex-shrink-0 w-24 h-full rounded-lg overflow-hidden cursor-pointer border transition-all ${
                  album.id === currentAlbum?.id
                    ? 'border-accent shadow-lg shadow-accent/50'
                    : 'border-white/10 hover:border-accent'
                }`}
              >
                <img
                  src={album.coverUrl || album.items?.[0]?.thumbnailUrl || album.items?.[0]?.coverUrl}
                  alt={album.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
                  <p className="text-xs text-white font-medium truncate">
                    {album.name}
                  </p>
                </div>
                {album.id === currentAlbum?.id && (
                  <div className="absolute inset-0 bg-accent/10" />
                )}
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
