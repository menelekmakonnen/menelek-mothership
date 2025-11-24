import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { ArrowLeft, PlayCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';

export default function GalleryView({ albums, title, description }) {
  const { goBack, goToAlbum, goToGallery, currentGalleryId, galleries, startSlideshow } = useGalleria();

  // Get all gallery IDs for navigation
  const galleryIds = Object.keys(galleries);
  const currentIndex = galleryIds.indexOf(currentGalleryId);

  // Navigate to next/previous gallery
  const navigateGallery = (direction) => {
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % galleryIds.length
      : (currentIndex - 1 + galleryIds.length) % galleryIds.length;

    goToGallery(galleryIds[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        navigateGallery('prev');
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        navigateGallery('next');
      } else if (e.key === 'Escape') {
        e.preventDefault();
        goBack();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, galleryIds.length]);

  const handleStartSlideshow = () => {
    if (albums.length > 0 && albums[0].images?.length > 0) {
      goToAlbum(albums[0].id);
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
                aria-label="Back to Galleria"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h2 className="text-3xl font-bold">{title}</h2>
                <p className="text-sm text-white/70">{description}</p>
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

      {/* Albums Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="mx-auto grid max-w-7xl gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {albums.map((album, index) => (
            <motion.button
              key={album.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              onClick={() => goToAlbum(album.id)}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 text-left transition-all hover:scale-105 hover:border-white/30"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[4/3] overflow-hidden bg-black/50">
                {album.thumbnail ? (
                  <img
                    src={album.thumbnail}
                    alt={album.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl">
                    {album.emoji || '📷'}
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              </div>

              {/* Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="mb-1 text-lg font-semibold">{album.name}</h3>
                <p className="text-xs text-white/60">{album.images?.length || 0} images</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={() => navigateGallery('prev')}
        className="fixed left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-4 text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
        aria-label="Previous gallery"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={() => navigateGallery('next')}
        className="fixed right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-black/70 p-4 text-white backdrop-blur-sm transition hover:border-white/60 hover:bg-black/80"
        aria-label="Next gallery"
      >
        <ChevronRight className="h-6 w-6" />
      </button>
    </div>
  );
}
