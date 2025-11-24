import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowLeft, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';

export default function AlbumView({ album, allAlbums }) {
  const { goBack, goToImage, startSlideshow, currentAlbumId, goToAlbum } = useGalleria();

  // Find current album index for navigation
  const currentIndex = allAlbums.findIndex(a => a.id === currentAlbumId);

  // Navigate to next/previous album
  const navigateAlbum = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % allAlbums.length
      : (currentIndex - 1 + allAlbums.length) % allAlbums.length;

    goToAlbum(allAlbums[newIndex].id);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateAlbum('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateAlbum('next');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, allAlbums.length]);

  const handleStartSlideshow = () => {
    if (album.images?.length > 0) {
      goToImage(0);
      setTimeout(() => startSlideshow(), 100);
    }
  };

  return (
    <div className="fixed inset-0 z-[25000] flex flex-col bg-black/95 text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={goBack}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 transition hover:border-white/60 hover:bg-white/10"
                aria-label="Back to Gallery"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-3xl font-bold">{album.name}</h2>
                <p className="text-sm text-white/70">{album.images?.length || 0} images</p>
              </div>
            </div>
            <button
              onClick={handleStartSlideshow}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 transition hover:border-white/60 hover:bg-white/20"
            >
              <PlayCircle className="h-5 w-5" />
              <span>Start Slideshow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Images Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {album.images?.map((image, index) => (
            <motion.button
              key={image.id || index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02, duration: 0.2 }}
              onClick={() => goToImage(index)}
              className="group relative overflow-hidden rounded-xl border border-white/10 bg-white/5 transition-all hover:scale-105 hover:border-white/30"
            >
              <div className="aspect-square overflow-hidden bg-black/50">
                {image.thumbnail || image.url ? (
                  <img
                    src={image.thumbnail || image.url}
                    alt={image.title || `Image ${index + 1}`}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl">
                    {image.emoji || '📷'}
                  </div>
                )}
              </div>
              {image.title && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-2">
                  <p className="truncate text-xs font-medium">{image.title}</p>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => navigateAlbum('prev')}
        className="fixed left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-4 text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
        aria-label="Previous album"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => navigateAlbum('next')}
        className="fixed right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-4 text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
        aria-label="Next album"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
