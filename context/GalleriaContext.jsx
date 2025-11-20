import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const GalleriaContext = createContext();

export const useGalleriaContext = () => {
  const context = useContext(GalleriaContext);
  if (!context) {
    throw new Error('useGalleriaContext must be used within GalleriaProvider');
  }
  return context;
};

// Media Categories
export const MEDIA_CATEGORIES = [
  {
    id: 'films',
    name: 'Films & Music Videos',
    type: 'direct', // no albums, direct to grid view
  },
  {
    id: 'photography',
    name: 'Photography',
    type: 'gallery', // has albums (Beauty, Professional subfolders)
    defaultAlbum: 'All Frames',
  },
  {
    id: 'video-edits',
    name: 'Epic Video Edits',
    type: 'gallery', // categories as albums (Epic Edits, Beauty & Travel, BTS, AI & Learning)
  },
  {
    id: 'ai-albums',
    name: 'AI Albums',
    type: 'gallery', // has albums
    defaultAlbum: 'All Creations',
  },
  {
    id: 'loremaker',
    name: 'Loremaker Universe',
    type: 'characters', // special character display from Google Sheets
  },
];

export const GalleriaProvider = ({ children }) => {
  // Galleria State
  const [isGalleriaOpen, setIsGalleriaOpen] = useState(false);

  // View Level: 'galleria' | 'gallery' | 'album' | 'single'
  const [viewLevel, setViewLevel] = useState('galleria');

  // Current Selections
  const [currentCategory, setCurrentCategory] = useState(null); // MEDIA_CATEGORIES[index]
  const [currentGallery, setCurrentGallery] = useState(null); // { id, name, albums: [] }
  const [currentAlbum, setCurrentAlbum] = useState(null); // { id, name, items: [] }
  const [currentItem, setCurrentItem] = useState(null); // { id, url, type, ... }
  const [currentItemIndex, setCurrentItemIndex] = useState(0);

  // Sorting & Display
  const [sortMode, setSortMode] = useState('default'); // 'default' | 'a-z' | 'z-a' | 'random'
  const [isSlideshow, setIsSlideshow] = useState(false);
  const [slideshowInterval, setSlideshowInterval] = useState(3000);

  // Zoom State (for Single View)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  // Media Data (will be populated from files/API)
  const [mediaData, setMediaData] = useState({
    photography: { galleries: [] },
    'ai-albums': { galleries: [] },
    films: { items: [] },
    'video-edits': { categories: [] },
    loremaker: { characters: [] },
  });

  // Open/Close Galleria
  const openGalleria = useCallback(() => {
    setIsGalleriaOpen(true);
    setViewLevel('galleria');
    setCurrentCategory(null);
    setCurrentGallery(null);
    setCurrentAlbum(null);
    setCurrentItem(null);
  }, []);

  const closeGalleria = useCallback(() => {
    setIsGalleriaOpen(false);
    setViewLevel('galleria');
    setIsSlideshow(false);
    setZoomLevel(1);
    setIsZoomed(false);
  }, []);

  // Navigation Functions
  const enterGallery = useCallback((category) => {
    setCurrentCategory(category);
    setViewLevel('gallery');
    setCurrentGallery(null);
    setCurrentAlbum(null);
    setCurrentItem(null);
  }, []);

  const enterAlbum = useCallback((album) => {
    setCurrentAlbum(album);
    setViewLevel('album');
    setCurrentItem(null);
  }, []);

  const enterSingle = useCallback((item, index = 0) => {
    setCurrentItem(item);
    setCurrentItemIndex(index);
    setViewLevel('single');
    setZoomLevel(1);
    setIsZoomed(false);
  }, []);

  const goBack = useCallback(() => {
    if (viewLevel === 'single') {
      setViewLevel('album');
      setCurrentItem(null);
      setZoomLevel(1);
      setIsZoomed(false);
    } else if (viewLevel === 'album') {
      setViewLevel('gallery');
      setCurrentAlbum(null);
    } else if (viewLevel === 'gallery') {
      setViewLevel('galleria');
      setCurrentCategory(null);
      setCurrentGallery(null);
    } else {
      closeGalleria();
    }
  }, [viewLevel, closeGalleria]);

  // Arrow Navigation (level-specific)
  const navigateLeft = useCallback(() => {
    if (viewLevel === 'galleria') {
      // Navigate to previous category
      const currentIndex = MEDIA_CATEGORIES.findIndex(cat => cat.id === currentCategory?.id);
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : MEDIA_CATEGORIES.length - 1;
      setCurrentCategory(MEDIA_CATEGORIES[prevIndex]);
    } else if (viewLevel === 'gallery') {
      // Navigate to previous gallery (cross-category)
      const currentCatIndex = MEDIA_CATEGORIES.findIndex(cat => cat.id === currentCategory?.id);
      const prevCatIndex = currentCatIndex > 0 ? currentCatIndex - 1 : MEDIA_CATEGORIES.length - 1;
      setCurrentCategory(MEDIA_CATEGORIES[prevCatIndex]);
    } else if (viewLevel === 'album') {
      // Navigate to previous album (within + cross gallery)
      // Implementation depends on album structure
    } else if (viewLevel === 'single') {
      // Navigate to previous item in current album
      if (currentAlbum && currentAlbum.items) {
        const prevIndex = currentItemIndex > 0 ? currentItemIndex - 1 : currentAlbum.items.length - 1;
        setCurrentItemIndex(prevIndex);
        setCurrentItem(currentAlbum.items[prevIndex]);
      }
    }
  }, [viewLevel, currentCategory, currentAlbum, currentItemIndex]);

  const navigateRight = useCallback(() => {
    if (viewLevel === 'galleria') {
      // Navigate to next category
      const currentIndex = MEDIA_CATEGORIES.findIndex(cat => cat.id === currentCategory?.id);
      const nextIndex = (currentIndex + 1) % MEDIA_CATEGORIES.length;
      setCurrentCategory(MEDIA_CATEGORIES[nextIndex]);
    } else if (viewLevel === 'gallery') {
      // Navigate to next gallery (cross-category)
      const currentCatIndex = MEDIA_CATEGORIES.findIndex(cat => cat.id === currentCategory?.id);
      const nextCatIndex = (currentCatIndex + 1) % MEDIA_CATEGORIES.length;
      setCurrentCategory(MEDIA_CATEGORIES[nextCatIndex]);
    } else if (viewLevel === 'album') {
      // Navigate to next album (within + cross gallery)
      // Implementation depends on album structure
    } else if (viewLevel === 'single') {
      // Navigate to next item in current album
      if (currentAlbum && currentAlbum.items) {
        const nextIndex = (currentItemIndex + 1) % currentAlbum.items.length;
        setCurrentItemIndex(nextIndex);
        setCurrentItem(currentAlbum.items[nextIndex]);
      }
    }
  }, [viewLevel, currentCategory, currentAlbum, currentItemIndex]);

  // Sorting Functions
  const applySorting = useCallback((items, mode) => {
    if (!items) return [];

    const sortedItems = [...items];

    switch (mode) {
      case 'a-z':
        return sortedItems.sort((a, b) => (a.name || a.title || '').localeCompare(b.name || b.title || ''));
      case 'z-a':
        return sortedItems.sort((a, b) => (b.name || b.title || '').localeCompare(a.name || a.title || ''));
      case 'random':
        return sortedItems.sort(() => Math.random() - 0.5);
      default:
        return sortedItems;
    }
  }, []);

  // Slideshow Control
  const toggleSlideshow = useCallback(() => {
    setIsSlideshow(prev => !prev);
  }, []);

  useEffect(() => {
    if (isSlideshow && viewLevel === 'single' && currentAlbum?.items) {
      const interval = setInterval(() => {
        navigateRight();
      }, slideshowInterval);

      return () => clearInterval(interval);
    }
  }, [isSlideshow, viewLevel, currentAlbum, slideshowInterval, navigateRight]);

  // Zoom Control
  const handleZoom = useCallback((delta) => {
    setZoomLevel(prev => {
      const newZoom = Math.max(1, Math.min(3, prev + delta));
      setIsZoomed(newZoom > 1);
      return newZoom;
    });
  }, []);

  const resetZoom = useCallback(() => {
    setZoomLevel(1);
    setIsZoomed(false);
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    if (!isGalleriaOpen) return;

    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'Escape':
          if (viewLevel === 'single' && isZoomed) {
            resetZoom();
          } else {
            goBack();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          navigateLeft();
          break;
        case 'ArrowRight':
          e.preventDefault();
          navigateRight();
          break;
        case ' ':
          e.preventDefault();
          if (viewLevel === 'single' || viewLevel === 'album') {
            toggleSlideshow();
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGalleriaOpen, viewLevel, isZoomed, navigateLeft, navigateRight, goBack, toggleSlideshow, resetZoom]);

  const value = {
    // State
    isGalleriaOpen,
    viewLevel,
    currentCategory,
    currentGallery,
    currentAlbum,
    currentItem,
    currentItemIndex,
    sortMode,
    isSlideshow,
    slideshowInterval,
    zoomLevel,
    isZoomed,
    mediaData,

    // Actions
    openGalleria,
    closeGalleria,
    enterGallery,
    enterAlbum,
    enterSingle,
    goBack,
    navigateLeft,
    navigateRight,
    setSortMode,
    toggleSlideshow,
    setSlideshowInterval,
    handleZoom,
    resetZoom,
    setMediaData,
    applySorting,
  };

  return <GalleriaContext.Provider value={value}>{children}</GalleriaContext.Provider>;
};
