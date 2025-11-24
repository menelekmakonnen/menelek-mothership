import { createContext, useCallback, useContext, useState } from 'react';

const GalleriaContext = createContext(null);

export function useGalleria() {
  const context = useContext(GalleriaContext);
  if (!context) {
    throw new Error('useGalleria must be used within GalleriaProvider');
  }
  return context;
}

export function GalleriaProvider({ children }) {
  // View state: 'home' | 'gallery' | 'album' | 'single'
  const [currentView, setCurrentView] = useState('home');

  // Current selections
  const [currentGalleryId, setCurrentGalleryId] = useState(null);
  const [currentAlbumId, setCurrentAlbumId] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);

  // Slideshow state
  const [isSlideshow, setIsSlideshow] = useState(false);

  // Image zoom/pan state
  const [imageZoom, setImageZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Gallery data registry
  const [galleries, setGalleries] = useState({});

  // Register a gallery
  const registerGallery = useCallback((galleryId, data) => {
    setGalleries(prev => ({
      ...prev,
      [galleryId]: data
    }));
  }, []);

  // Navigation functions
  const goToHome = useCallback(() => {
    setCurrentView('home');
    setCurrentGalleryId(null);
    setCurrentAlbumId(null);
    setCurrentImageIndex(null);
    setIsSlideshow(false);
  }, []);

  const goToGallery = useCallback((galleryId) => {
    setCurrentView('gallery');
    setCurrentGalleryId(galleryId);
    setCurrentAlbumId(null);
    setCurrentImageIndex(null);
    setIsSlideshow(false);
  }, []);

  const goToAlbum = useCallback((albumId) => {
    setCurrentView('album');
    setCurrentAlbumId(albumId);
    setCurrentImageIndex(null);
    setIsSlideshow(false);
  }, []);

  const goToImage = useCallback((imageIndex) => {
    setCurrentView('single');
    setCurrentImageIndex(imageIndex);
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  const goBack = useCallback(() => {
    if (currentView === 'single') {
      setCurrentView('album');
      setCurrentImageIndex(null);
    } else if (currentView === 'album') {
      setCurrentView('gallery');
      setCurrentAlbumId(null);
    } else if (currentView === 'gallery') {
      setCurrentView('home');
      setCurrentGalleryId(null);
    }
    setIsSlideshow(false);
  }, [currentView]);

  // Slideshow controls
  const startSlideshow = useCallback(() => {
    setIsSlideshow(true);
  }, []);

  const stopSlideshow = useCallback(() => {
    setIsSlideshow(false);
  }, []);

  const toggleSlideshow = useCallback(() => {
    setIsSlideshow(prev => !prev);
  }, []);

  // Zoom controls
  const resetZoom = useCallback(() => {
    setImageZoom(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  const value = {
    // State
    currentView,
    currentGalleryId,
    currentAlbumId,
    currentImageIndex,
    isSlideshow,
    imageZoom,
    imagePosition,
    galleries,

    // Actions
    registerGallery,
    goToHome,
    goToGallery,
    goToAlbum,
    goToImage,
    goBack,
    startSlideshow,
    stopSlideshow,
    toggleSlideshow,
    setImageZoom,
    setImagePosition,
    resetZoom,
    setCurrentImageIndex,
  };

  return (
    <GalleriaContext.Provider value={value}>
      {children}
    </GalleriaContext.Provider>
  );
}
