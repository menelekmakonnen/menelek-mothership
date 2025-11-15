import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Grid, Grid2x2, Grid3x3, Maximize, X, ChevronLeft, ChevronRight, Folder, Image as ImageIcon, Loader } from 'lucide-react';

// Google Drive API configuration
const DRIVE_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY || '',
  folderId: process.env.NEXT_PUBLIC_PHOTOGRAPHY_FOLDER_ID || '',
};

// Helper to get Google Drive image URL
function getDriveImageUrl(fileId, size = 'w800') {
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=${size}`;
}

// Helper to get direct view URL
function getDriveViewUrl(fileId) {
  return `https://drive.google.com/uc?id=${fileId}&export=view`;
}

// Fetch folders from Google Drive
async function fetchPhotoFolders(folderId) {
  if (!DRIVE_CONFIG.apiKey || !folderId) {
    // Return placeholder data
    return [
      {
        id: 'beauty',
        name: 'Beauty',
        coverImage: '',
        imageCount: 24,
        subfolders: [],
      },
      {
        id: 'portraits',
        name: 'Portraits',
        coverImage: '',
        imageCount: 32,
        subfolders: [],
      },
      {
        id: 'landscapes',
        name: 'Landscapes',
        coverImage: '',
        imageCount: 18,
        subfolders: [],
      },
      {
        id: 'urban',
        name: 'Urban',
        coverImage: '',
        imageCount: 45,
        subfolders: [],
      },
    ];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType='application/vnd.google-apps.folder'&key=${DRIVE_CONFIG.apiKey}&fields=files(id,name,mimeType)`
    );
    const data = await response.json();

    // For each folder, get the first image as cover
    const foldersWithCovers = await Promise.all(
      (data.files || []).map(async (folder) => {
        const imagesResponse = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${folder.id}'+in+parents+and+(mimeType+contains+'image/'+or+mimeType='application/vnd.google-apps.folder')&key=${DRIVE_CONFIG.apiKey}&fields=files(id,name,mimeType)&pageSize=1000`
        );
        const imagesData = await imagesResponse.json();
        const files = imagesData.files || [];

        const images = files.filter(f => f.mimeType.includes('image/'));
        const subfolders = files.filter(f => f.mimeType === 'application/vnd.google-apps.folder');

        // Get cover image - first image in folder or first image in first subfolder
        let coverImage = images[0]?.id || '';
        if (!coverImage && subfolders.length > 0) {
          const subfolderImagesResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${subfolders[0].id}'+in+parents+and+mimeType+contains+'image/'&key=${DRIVE_CONFIG.apiKey}&fields=files(id)&pageSize=1`
          );
          const subfolderData = await subfolderImagesResponse.json();
          coverImage = subfolderData.files?.[0]?.id || '';
        }

        return {
          id: folder.id,
          name: folder.name,
          coverImage,
          imageCount: images.length,
          subfolders: subfolders,
        };
      })
    );

    return foldersWithCovers;
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
}

// Fetch images from a specific folder
async function fetchFolderImages(folderId) {
  if (!DRIVE_CONFIG.apiKey) {
    return [];
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents+and+mimeType+contains+'image/'&key=${DRIVE_CONFIG.apiKey}&fields=files(id,name,mimeType)&pageSize=1000`
    );
    const data = await response.json();

    return (data.files || []).map(file => ({
      id: file.id,
      name: file.name,
      url: getDriveViewUrl(file.id),
      thumbnail: getDriveImageUrl(file.id, 'w400'),
    }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}

export default function PhotographySection() {
  const [viewMode, setViewMode] = useState('grid-4');
  const [albums, setAlbums] = useState([]);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [albumImages, setAlbumImages] = useState([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [loadedImages, setLoadedImages] = useState(new Set());

  const viewModes = [
    { id: 'single', label: 'Single', icon: Maximize },
    { id: 'grid-4', label: '4-up', icon: Grid2x2 },
    { id: 'grid-8', label: '8-up', icon: Grid3x3 },
    { id: 'grid-16', label: '16-up', icon: Grid },
  ];

  // Load albums on mount
  useEffect(() => {
    async function loadAlbums() {
      setLoading(true);
      const folders = await fetchPhotoFolders(DRIVE_CONFIG.folderId);
      setAlbums(folders);
      setLoading(false);
    }
    loadAlbums();
  }, []);

  // Load images when album is selected
  useEffect(() => {
    if (selectedAlbum) {
      async function loadImages() {
        setImagesLoading(true);
        const images = await fetchFolderImages(selectedAlbum.id);
        setAlbumImages(images);
        setImagesLoading(false);
      }
      loadImages();
    }
  }, [selectedAlbum]);

  // Lazy loading observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            const src = img.dataset.src;
            if (src && !loadedImages.has(src)) {
              img.src = src;
              setLoadedImages(prev => new Set([...prev, src]));
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    const images = document.querySelectorAll('img[data-src]');
    images.forEach((img) => observer.observe(img));

    return () => observer.disconnect();
  }, [albumImages, loadedImages]);

  // Navigate lightbox
  const navigateLightbox = (direction) => {
    if (selectedImageIndex === null) return;
    const newIndex = direction === 'next'
      ? (selectedImageIndex + 1) % albumImages.length
      : (selectedImageIndex - 1 + albumImages.length) % albumImages.length;
    setSelectedImageIndex(newIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'Escape') setSelectedImageIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImageIndex, albumImages]);

  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Photography
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 mb-8"
        >
          Capturing moments through the lens
        </motion.p>

        {/* Album Selection View */}
        {!selectedAlbum ? (
          <>
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-green-400" />
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {albums.map((album, index) => (
                  <motion.div
                    key={album.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                    onClick={() => setSelectedAlbum(album)}
                    className="luxury-card group cursor-pointer overflow-hidden"
                    whileHover={{ y: -8 }}
                  >
                    {/* Album cover */}
                    <div className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg mb-4 overflow-hidden relative">
                      {album.coverImage ? (
                        <img
                          src={getDriveImageUrl(album.coverImage, 'w600')}
                          alt={album.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Folder className="w-20 h-20 text-gray-600" />
                        </div>
                      )}

                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                        <p className="text-xs text-white/90">
                          {album.subfolders?.length > 0 && `${album.subfolders.length} galleries • `}
                          {album.imageCount} photos
                        </p>
                      </div>
                    </div>

                    {/* Album info */}
                    <h3 className="font-bold text-xl mb-2">{album.name}</h3>
                    <p className="text-sm text-gray-400">{album.imageCount} photos</p>

                    <div className="mt-4 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      View Album →
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Album View with Controls */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <button
                  onClick={() => {
                    setSelectedAlbum(null);
                    setAlbumImages([]);
                  }}
                  className="text-green-400 hover:underline mb-2 flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Back to Albums
                </button>
                <h2 className="text-3xl font-bold">{selectedAlbum.name}</h2>
                <p className="text-gray-400">{albumImages.length} photos</p>
              </div>

              {/* View mode selector */}
              <div className="flex gap-2">
                {viewModes.map((mode) => {
                  const Icon = mode.icon;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setViewMode(mode.id)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 mono text-xs transition-all ${
                        viewMode === mode.id
                          ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                          : 'bg-white/5 border border-white/10 hover:border-white/30'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {mode.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photo Grid */}
            {imagesLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-green-400" />
              </div>
            ) : (
              <div className={`grid gap-4 ${
                viewMode === 'single' ? 'grid-cols-1' :
                viewMode === 'grid-4' ? 'grid-cols-2' :
                viewMode === 'grid-8' ? 'grid-cols-4' :
                'grid-cols-4 md:grid-cols-6'
              }`}>
                {albumImages.map((image, i) => (
                  <motion.div
                    key={image.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.02 * i }}
                    onClick={() => setSelectedImageIndex(i)}
                    className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform relative group"
                  >
                    <img
                      data-src={image.thumbnail}
                      alt={image.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />

                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-white" />
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Lightbox */}
        <AnimatePresence>
          {selectedImageIndex !== null && albumImages[selectedImageIndex] && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-[2000] flex items-center justify-center p-4"
              onClick={() => setSelectedImageIndex(null)}
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Image counter */}
              <div className="absolute top-4 left-4 z-10 px-4 py-2 rounded-lg bg-black/50 backdrop-blur-sm mono text-sm">
                {selectedImageIndex + 1} / {albumImages.length}
              </div>

              {/* Navigation buttons */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('prev');
                }}
                className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigateLightbox('next');
                }}
                className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image */}
              <motion.img
                key={selectedImageIndex}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                src={albumImages[selectedImageIndex].url}
                alt={albumImages[selectedImageIndex].name}
                className="max-w-full max-h-full object-contain"
                onClick={(e) => e.stopPropagation()}
              />

              {/* Image name */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-lg bg-black/50 backdrop-blur-sm text-center max-w-2xl">
                <p className="text-sm text-gray-300">{albumImages[selectedImageIndex].name}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
