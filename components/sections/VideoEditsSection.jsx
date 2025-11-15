import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Play, ChevronDown, ExternalLink, Heart, MessageCircle, Send, X, ChevronLeft, ChevronRight } from 'lucide-react';

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
    };
  }

  if (url.includes('vimeo.com')) {
    const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
    return {
      platform: 'vimeo',
      id: videoId,
      thumbnail: null,
    };
  }

  return null;
}

// Video edit categories with clips
const categories = [
  {
    id: 'action',
    name: 'Action & Sports',
    icon: '⚡',
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

export default function VideoEditsSection() {
  const [openCategory, setOpenCategory] = useState('action');
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Get all clips for navigation
  const allClips = categories.flatMap(cat =>
    cat.clips.map(clip => ({ ...clip, category: cat.name }))
  );

  // Navigate video lightbox
  const navigateVideo = (direction) => {
    if (!selectedVideo) return;
    const currentIndex = allClips.findIndex(c => c.id === selectedVideo.id);
    const newIndex = direction === 'next'
      ? (currentIndex + 1) % allClips.length
      : (currentIndex - 1 + allClips.length) % allClips.length;
    setSelectedVideo(allClips[newIndex]);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedVideo) return;
      if (e.key === 'ArrowRight') navigateVideo('next');
      if (e.key === 'ArrowLeft') navigateVideo('prev');
      if (e.key === 'Escape') setSelectedVideo(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedVideo, allClips]);

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
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

        {/* Collapsible Categories */}
        <div className="space-y-4">
          {categories.map((category, categoryIndex) => {
            const isOpen = openCategory === category.id;

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * categoryIndex }}
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl overflow-hidden"
              >
                {/* Category Header - Clickable */}
                <button
                  onClick={() => setOpenCategory(isOpen ? null : category.id)}
                  className="w-full px-8 py-6 flex items-center justify-between hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl">{category.icon}</span>
                    <div className="text-left">
                      <h2 className="text-2xl font-bold">{category.name}</h2>
                      <p className="text-sm text-gray-400">{category.clips.length} clips</p>
                    </div>
                  </div>

                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <ChevronDown className="w-6 h-6 text-gray-400" />
                  </motion.div>
                </button>

                {/* Category Content - Collapsible */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 pt-4">
                        <div className="grid grid-cols-2 gap-6">
                          {category.clips.map((clip, clipIndex) => {
                            const videoInfo = getVideoInfo(clip.url);

                            return (
                              <motion.div
                                key={clip.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 * clipIndex }}
                                onClick={() => setSelectedVideo(clip)}
                                className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden border border-gray-700 hover:border-green-500/50 transition-all cursor-pointer group"
                              >
                                {/* Thumbnail */}
                                <div className="aspect-video bg-gradient-to-br from-gray-700 to-gray-800 relative overflow-hidden">
                                  {videoInfo?.thumbnail ? (
                                    <img
                                      src={videoInfo.thumbnail}
                                      alt={clip.title}
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                      <Play className="w-20 h-20 text-gray-600" />
                                    </div>
                                  )}

                                  {/* Play overlay */}
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <div className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center">
                                      <Play className="w-8 h-8 text-white ml-1" />
                                    </div>
                                  </div>
                                </div>

                                {/* Post Info - Instagram Style */}
                                <div className="p-4">
                                  {/* Title and description */}
                                  <h3 className="font-bold text-lg mb-2">{clip.title}</h3>
                                  <p className="text-sm text-gray-400 mb-4 line-clamp-2">
                                    {clip.description}
                                  </p>

                                  {/* Actions - Instagram style */}
                                  <div className="flex items-center gap-6 text-gray-400">
                                    <button className="flex items-center gap-2 hover:text-red-400 transition-colors">
                                      <Heart className="w-5 h-5" />
                                      <span className="text-sm">{clip.likes}</span>
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-green-400 transition-colors">
                                      <MessageCircle className="w-5 h-5" />
                                      <span className="text-sm">{clip.comments}</span>
                                    </button>
                                    <button className="flex items-center gap-2 hover:text-blue-400 transition-colors ml-auto">
                                      <ExternalLink className="w-5 h-5" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {/* Video Lightbox */}
        <AnimatePresence>
          {selectedVideo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4"
              onClick={() => setSelectedVideo(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Video counter */}
              <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm mono text-sm">
                {allClips.findIndex(c => c.id === selectedVideo.id) + 1} / {allClips.length}
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
                key={selectedVideo.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="w-full max-w-5xl aspect-video bg-black rounded-lg overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {(() => {
                  const videoInfo = getVideoInfo(selectedVideo.url);

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
                        {selectedVideo.url && (
                          <a
                            href={selectedVideo.url}
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
                <div className="text-xs text-green-400 mb-1 mono">{selectedVideo.category}</div>
                <h3 className="font-bold text-lg mb-1">{selectedVideo.title}</h3>
                <p className="text-sm text-gray-400">{selectedVideo.description}</p>
                <div className="flex items-center gap-4 justify-center mt-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Heart className="w-4 h-4" />
                    {selectedVideo.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {selectedVideo.comments}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
