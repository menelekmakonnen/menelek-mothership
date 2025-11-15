import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, Film, Music, ExternalLink, X, ChevronLeft, ChevronRight } from 'lucide-react';

// Helper function to extract video ID and platform
function getVideoInfo(url) {
  if (!url) return null;

  // YouTube
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

  // Vimeo
  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return {
      platform: 'vimeo',
      id: videoId,
      thumbnail: null, // Vimeo requires API call for thumbnail
      embed: `https://player.vimeo.com/video/${videoId}`,
    };
  }

  return null;
}

// Placeholder video data - will be replaced with actual video URLs
const videos = [
  {
    id: 1,
    title: 'Epic Short Film',
    type: 'film',
    url: '', // Add YouTube/Vimeo URL here
    duration: '12:45',
    year: '2024',
    description: 'A cinematic journey through visual storytelling',
  },
  {
    id: 2,
    title: 'Music Video - Artist Name',
    type: 'music',
    url: '', // Add YouTube/Vimeo URL here
    duration: '3:30',
    year: '2024',
    description: 'Creative music video production',
  },
  {
    id: 3,
    title: 'Documentary Feature',
    type: 'film',
    url: '', // Add YouTube/Vimeo URL here
    duration: '25:00',
    year: '2023',
    description: 'In-depth documentary storytelling',
  },
  {
    id: 4,
    title: 'Music Video - Collaboration',
    type: 'music',
    url: '', // Add YouTube/Vimeo URL here
    duration: '4:15',
    year: '2023',
    description: 'Collaborative artistic vision',
  },
  {
    id: 5,
    title: 'Narrative Short',
    type: 'film',
    url: '', // Add YouTube/Vimeo URL here
    duration: '8:20',
    year: '2023',
    description: 'Compelling short film narrative',
  },
  {
    id: 6,
    title: 'Concept Music Video',
    type: 'music',
    url: '', // Add YouTube/Vimeo URL here
    duration: '5:00',
    year: '2024',
    description: 'High-concept visual experience',
  },
];

export default function FilmsSection() {
  const [filter, setFilter] = useState('all');
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(null);

  const filteredVideos = filter === 'all'
    ? videos
    : videos.filter(v => v.type === filter);

  // Navigate video lightbox
  const navigateVideo = (direction) => {
    if (selectedVideoIndex === null) return;
    const newIndex = direction === 'next'
      ? (selectedVideoIndex + 1) % filteredVideos.length
      : (selectedVideoIndex - 1 + filteredVideos.length) % filteredVideos.length;
    setSelectedVideoIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedVideoIndex === null) return;

      // Stop propagation to prevent page navigation
      e.stopPropagation();
      e.preventDefault();

      if (e.key === 'ArrowRight') navigateVideo('next');
      if (e.key === 'ArrowLeft') navigateVideo('prev');
      if (e.key === 'Escape') setSelectedVideoIndex(null);
    };

    if (selectedVideoIndex !== null) {
      window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
      return () => window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [selectedVideoIndex, filteredVideos]);

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Films & Music Videos
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-8"
        >
          Cinematic storytelling and visual artistry
        </motion.p>

        {/* Filter buttons */}
        <div className="flex gap-4 mb-8">
          {[
            { id: 'all', label: 'All', icon: Play },
            { id: 'film', label: 'Films', icon: Film },
            { id: 'music', label: 'Music Videos', icon: Music },
          ].map((btn) => {
            const Icon = btn.icon;
            return (
              <button
                key={btn.id}
                onClick={() => setFilter(btn.id)}
                className={`px-6 py-3 rounded-lg flex items-center gap-2 mono font-bold transition-all ${
                  filter === btn.id
                    ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
              >
                <Icon className="w-5 h-5" />
                {btn.label}
              </button>
            );
          })}
        </div>

        {/* Video grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {filteredVideos.map((video, index) => {
            const videoInfo = getVideoInfo(video.url);
            const Icon = video.type === 'film' ? Film : Music;

            return (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => setSelectedVideoIndex(index)}
                className="luxury-card group cursor-pointer overflow-hidden"
              >
                {/* Thumbnail */}
                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 relative overflow-hidden">
                  {videoInfo?.thumbnail ? (
                    <img
                      src={videoInfo.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        // Fallback if thumbnail fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback icon */}
                  <div
                    className="absolute inset-0 flex items-center justify-center text-6xl"
                    style={{ display: videoInfo?.thumbnail ? 'none' : 'flex' }}
                  >
                    <Icon className="w-20 h-20 text-gray-600" />
                  </div>

                  {/* Play button overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                      {video.url ? (
                        <Play className="w-8 h-8 text-white ml-1" />
                      ) : (
                        <ExternalLink className="w-7 h-7 text-white" />
                      )}
                    </div>
                  </div>

                  {/* Duration badge */}
                  {video.duration && (
                    <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs mono">
                      {video.duration}
                    </div>
                  )}

                  {/* Platform badge */}
                  {videoInfo?.platform && (
                    <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded text-xs mono uppercase">
                      {videoInfo.platform}
                    </div>
                  )}
                </div>

                {/* Info */}
                <h3 className="font-bold text-lg mb-2 line-clamp-2">{video.title}</h3>
                {video.description && (
                  <p className="text-sm text-gray-400 mb-2 line-clamp-2">{video.description}</p>
                )}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span className="capitalize flex items-center gap-1">
                    <Icon className="w-4 h-4" />
                    {video.type}
                  </span>
                  <span>{video.year}</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Video Lightbox - Above nav bar but below camera features */}
        <AnimatePresence>
          {selectedVideoIndex !== null && filteredVideos[selectedVideoIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-black/95 flex items-center justify-center p-4"
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                width: '100vw',
                height: '100vh',
                zIndex: 1700
              }}
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
                {selectedVideoIndex + 1} / {filteredVideos.length}
              </div>

              {/* Navigation buttons */}
              {filteredVideos.length > 1 && (
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
                  const video = filteredVideos[selectedVideoIndex];
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
                <h3 className="font-bold text-lg mb-1">{filteredVideos[selectedVideoIndex].title}</h3>
                {filteredVideos[selectedVideoIndex].description && (
                  <p className="text-sm text-gray-400">{filteredVideos[selectedVideoIndex].description}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
