import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { Play, ChevronLeft, ChevronRight, X, Loader } from 'lucide-react';
import Breadcrumbs from '@/components/ui/Breadcrumbs';
import GalleryNavigation from '@/components/ui/GalleryNavigation';
import ScrollControls from '@/components/ui/ScrollControls';

// Helper function to extract video info
function getVideoInfo(url) {
  if (!url) return null;

  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    const videoId = url.includes('youtu.be')
      ? url.split('youtu.be/')[1]?.split('?')[0]
      : url.split('v=')[1]?.split('&')[0];
    return {
      platform: 'youtube',
      id: videoId,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      embed: `https://www.youtube.com/embed/${videoId}`,
    };
  }

  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return {
      platform: 'vimeo',
      id: videoId,
      thumbnail: null,
      embed: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  return null;
}

// Video edit albums with clips
const albums = [
  {
    id: 'action',
    name: 'Action & Sports',
    icon: '⚡',
    description: 'High-energy athletic moments',
    clips: [
      {
        id: 1,
        title: 'Epic Sports Montage',
        description: 'High-energy compilation of incredible athletic moments',
        url: '', // Add video URL
        likes: '2.5K',
        comments: '142',
      },
      {
        id: 2,
        title: 'Adrenaline Rush',
        description: 'Fast-paced action sequences with dynamic transitions',
        url: '', // Add video URL
        likes: '3.1K',
        comments: '98',
      },
    ],
  },
  {
    id: 'cinematic',
    name: 'Cinematic Edits',
    icon: '🎬',
    description: 'Atmospheric storytelling',
    clips: [
      {
        id: 3,
        title: 'Urban Dreams',
        description: 'Atmospheric cityscape with color grading and slow-mo',
        url: '', // Add video URL
        likes: '4.2K',
        comments: '203',
      },
      {
        id: 4,
        title: 'Golden Hour',
        description: 'Beautiful sunset visuals with emotional storytelling',
        url: '', // Add video URL
        likes: '5.8K',
        comments: '289',
      },
    ],
  },
  {
    id: 'music',
    name: 'Music Synced',
    icon: '🎵',
    description: 'Beat-perfect timing',
    clips: [
      {
        id: 5,
        title: 'Beat Drop Edit',
        description: 'Perfectly timed cuts synced to the music beat',
        url: '', // Add video URL
        likes: '6.3K',
        comments: '412',
      },
      {
        id: 6,
        title: 'Rhythm & Motion',
        description: 'Dynamic editing matching musical rhythm and flow',
        url: '', // Add video URL
        likes: '4.9K',
        comments: '178',
      },
    ],
  },
  {
    id: 'creative',
    name: 'Creative Effects',
    icon: '✨',
    description: 'Advanced VFX and motion graphics',
    clips: [
      {
        id: 7,
        title: 'VFX Showcase',
        description: 'Advanced visual effects and motion graphics',
        url: '', // Add video URL
        likes: '7.1K',
        comments: '521',
      },
      {
        id: 8,
        title: 'Glitch Art',
        description: 'Modern glitch effects and digital aesthetics',
        url: '', // Add video URL
        likes: '3.7K',
        comments: '156',
      },
    ],
  },
];

export default function VideoEditsSection({ onGalleryNavigate }) {
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);
  const containerRef = useRef(null);

  // Get all clips for navigation
  const allClips = selectedAlbum ? selectedAlbum.clips : [];

  // Navigate album view - cycles through albums only
  const navigateAlbum = (direction) => {
    if (!selectedAlbum) return;
    const currentIndex = albums.findIndex(a => a.id === selectedAlbum.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % albums.length
      : (currentIndex - 1 + albums.length) % albums.length;
    setSelectedAlbum(albums[newIndex]);
    setSelectedVideoIndex(null);
  };

  // Navigate video lightbox - cycles through videos only
  const navigateVideo = (direction) => {
    if (selectedVideoIndex === null) return;
    const newIndex = direction === 'next'
      ? (selectedVideoIndex + 1) % allClips.length
      : (selectedVideoIndex - 1 + allClips.length) % allClips.length;
    setSelectedVideoIndex(newIndex);
  };

  // Keyboard navigation - context-aware
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Single video view navigation
      if (selectedVideoIndex !== null) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateVideo('next');
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateVideo('prev');
        }
        if (e.key === 'Escape') {
          setSelectedVideoIndex(null);
        }
      }
      // Album view navigation
      else if (selectedAlbum && selectedVideoIndex === null) {
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateAlbum('next');
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateAlbum('prev');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideoIndex, selectedAlbum, allClips]);

  // Breadcrumbs
  const getBreadcrumbs = () => {
    const crumbs = [
      { id: 'galleria', label: 'Galleria' },
      { id: 'video-edits', label: 'Epic Video Edits' },
    ];

    if (selectedAlbum) {
      crumbs.push({ id: `album-${selectedAlbum.id}`, label: selectedAlbum.name });
    }

    if (selectedVideoIndex !== null && allClips[selectedVideoIndex]) {
      crumbs.push({ id: 'video', label: allClips[selectedVideoIndex].title.substring(0, 20) + '...' });
    }

    return crumbs;
  };

  const handleBreadcrumbNavigate = (id, index) => {
    if (id === 'galleria') {
      onGalleryNavigate && onGalleryNavigate(null);
    } else if (id === 'video-edits') {
      setSelectedAlbum(null);
      setSelectedVideoIndex(null);
    } else if (id.startsWith('album-')) {
      setSelectedVideoIndex(null);
    }
  };

  return (
    <div ref={containerRef} className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs items={getBreadcrumbs()} onNavigate={handleBreadcrumbNavigate} />

        {/* Gallery Navigation */}
        <GalleryNavigation currentGallery="video-edits" onNavigate={onGalleryNavigate} />

        {/* Gallery View - Album Selection */}
        {!selectedAlbum ? (
          <>
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-6xl font-bold mb-4"
            >
              Epic Video Edits
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-400 mb-12"
            >
              Professional video editing and motion graphics
            </motion.p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {albums.map((album, index) => (
                <motion.div
                  key={album.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  onClick={() => setSelectedAlbum(album)}
                  className="group cursor-pointer"
                  whileHover={{ y: -8 }}
                >
                  <div className="luxury-card overflow-hidden">
                    <div className="aspect-video bg-gradient-to-br from-orange-600 to-red-600 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                      <span className="text-6xl">{album.icon}</span>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Play className="w-16 h-16 text-white" />
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-2">{album.name}</h3>
                    <p className="text-sm text-gray-400 mb-2">{album.description}</p>
                    <p className="text-xs text-gray-500">{album.clips.length} videos</p>
                    <div className="mt-3 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Album →
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Album View - Instagram Grid */}
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-2">{selectedAlbum.name}</h2>
              <p className="text-gray-400 mb-8">{allClips.length} video edits</p>
            </div>

            {/* Album Navigation Arrows */}
            <div className="fixed left-4 top-1/2 -translate-y-1/2 z-[1300]">
              <button
                onClick={() => navigateAlbum('prev')}
                className="camera-hud p-3 rounded-full hover:scale-110 transition-transform"
                title="Previous album"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>

            <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[1300]">
              <button
                onClick={() => navigateAlbum('next')}
                className="camera-hud p-3 rounded-full hover:scale-110 transition-transform"
                title="Next album"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Instagram-style Grid - NO VIDEO PLAYER, just thumbnails */}
            <div className="grid grid-cols-3 gap-1">
              {allClips.map((clip, index) => {
                const videoInfo = getVideoInfo(clip.url);

                return (
                  <motion.div
                    key={clip.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 * index }}
                    onClick={() => setSelectedVideoIndex(index)}
                    className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded cursor-pointer relative group overflow-hidden"
                  >
                    {videoInfo?.thumbnail ? (
                      <img
                        src={videoInfo.thumbnail}
                        alt={clip.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Play className="w-12 h-12 text-gray-600" />
                      </div>
                    )}

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </>
        )}

        {/* Video Lightbox - Single Video View */}
        <AnimatePresence>
          {selectedVideoIndex !== null && allClips[selectedVideoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4"
              onClick={() => setSelectedVideoIndex(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideoIndex(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video counter */}
              <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm mono text-sm">
                {selectedVideoIndex + 1} / {allClips.length}
              </div>

              {/* Navigation buttons */}
              {allClips.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateVideo('prev');
                    }}
                    className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateVideo('next');
                    }}
                    className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Video Player */}
              <motion.div
                key={selectedVideoIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const video = allClips[selectedVideoIndex];
                  const videoInfo = getVideoInfo(video.url);

                  if (videoInfo?.embed) {
                    return (
                      <iframe
                        src={videoInfo.embed}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    );
                  }

                  return (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <Play className="w-20 h-20 mx-auto mb-4" />
                        <p>Video player not available</p>
                        {video.url && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400 hover:underline mt-2 inline-block"
                          >
                            Open in new tab
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </motion.div>

              {/* Video info */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/50 backdrop-blur-sm text-center max-w-2xl">
                <div className="text-xs text-orange-400 mb-1 mono">{selectedAlbum.name}</div>
                <h3 className="font-bold text-lg mb-1">{allClips[selectedVideoIndex].title}</h3>
                <p className="text-sm text-gray-400">{allClips[selectedVideoIndex].description}</p>
              </div>

              {/* Keyboard hints */}
              <div className="absolute bottom-4 right-4 px-3 py-2 rounded-lg bg-black/50 backdrop-blur-sm text-xs mono text-gray-400">
                <div>← → : Navigate</div>
                <div>ESC : Close</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Scroll Controls */}
        <ScrollControls containerRef={containerRef} />
      </div>
    </div>
  );
}
