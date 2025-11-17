import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Loader2,
  PauseCircle,
  PlayCircle,
  Sparkles,
  X,
} from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';
import { resolveDriveImage } from '@/lib/googleDrive';
import { useCameraContext } from '@/context/CameraContext';

const MMM_MEDIA_ROOT = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

const albumMeta = {
  Beauty: {
    gradient: 'from-rose-500/80 via-pink-500/70 to-purple-600/80',
    tagline: 'Beauty, fashion and lifestyle editorials',
    icon: Sparkles,
  },
  Professional: {
    gradient: 'from-emerald-500/80 via-teal-500/70 to-cyan-600/80',
    tagline: 'Events, commercial experiences and brand storytelling',
    icon: Camera,
  },
};

const resolveItemImage = (item, intent = 'preview') => {
  if (!item) return null;
  const variants = item.imageVariants || item.variants || null;
  const viaVariants = resolveDriveImage(variants, intent);
  if (viaVariants) return viaVariants;
  if (intent === 'thumb' && item.thumb) return item.thumb;
  if (intent !== 'thumb' && item.previewUrl) return item.previewUrl;
  if (item.thumbnail) return item.thumbnail;
  if (item.viewUrl) return item.viewUrl;
  if (item.downloadUrl) return item.downloadUrl;
  if (item.id) {
    return `https://lh3.googleusercontent.com/d/${item.id}=w1600-h1600-no`;
  }
  return null;
};

export default function PhotographySection() {
  const { loadFolder, getFolder, isLoading, getError } = useDriveFolderCache();
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [activeGallery, setActiveGallery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isAlbumPickerOpen, setAlbumPickerOpen] = useState(false);
  const [albumSortMode, setAlbumSortMode] = useState('name');
  const [gallerySortMode, setGallerySortMode] = useState('name');
  const [frameSortMode, setFrameSortMode] = useState('original');
  const [isSlideshowActive, setSlideshowActive] = useState(false);
  const {
    registerGalleriaSection,
    updateGalleriaSectionMeta,
    engageGalleriaSection,
    releaseGalleriaSection,
  } = useCameraContext();

  const scrollToActiveLayer = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }, []);

  useEffect(() => {
    loadFolder(MMM_MEDIA_ROOT);
  }, [loadFolder]);

  const rootFolder = getFolder(MMM_MEDIA_ROOT);

  const hasMedia = useCallback(
    (folderId, depth = 0) => {
      if (!folderId || depth > 4) return false;
      const folderData = getFolder(folderId);
      if (!folderData) return true; // still loading, optimistically keep
      const hasFiles = folderData.items.some((item) => item.type === 'file' && resolveItemImage(item));
      if (hasFiles) return true;
      const nestedFolders = folderData.items.filter((item) => item.type === 'folder');
      return nestedFolders.some((nested) => hasMedia(nested.id, depth + 1));
    },
    [getFolder]
  );

  const sortFolders = useCallback((folders, mode) => {
    if (!folders?.length) return [];
    const clone = [...folders];
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    switch (mode) {
      case 'newest':
        return clone.sort((a, b) => new Date(b.modifiedTime || b.createdTime || 0) - new Date(a.modifiedTime || a.createdTime || 0));
      case 'oldest':
        return clone.sort((a, b) => new Date(a.modifiedTime || a.createdTime || 0) - new Date(b.modifiedTime || b.createdTime || 0));
      case 'name-desc':
        return clone.sort((a, b) => collator.compare(b.title || '', a.title || ''));
      case 'name':
      default:
        return clone.sort((a, b) => collator.compare(a.title || '', b.title || ''));
    }
  }, []);

  const albumFolders = useMemo(() => {
    if (!rootFolder) return [];
    const folders = rootFolder.items.filter((item) => item.type === 'folder' && albumMeta[item.title]);
    const filtered = folders.filter((folder) => hasMedia(folder.id));
    return sortFolders(filtered, albumSortMode);
  }, [albumSortMode, hasMedia, rootFolder, sortFolders]);

  useEffect(() => {
    if (!albumFolders.length) return;
    albumFolders.forEach((album) => {
      loadFolder(album.id);
    });
  }, [albumFolders, loadFolder]);

  const findFirstImage = useCallback(
    (folderId, depth = 0) => {
      if (!folderId || depth > 4) return null;
      const data = getFolder(folderId);
      if (!data) return null;
      const fileCandidate = data.items.find((item) => item.type === 'file' && resolveItemImage(item));
      if (fileCandidate) {
        return resolveItemImage(fileCandidate);
      }
      const nestedFolders = data.items.filter((item) => item.type === 'folder');
      for (const nested of nestedFolders) {
        const result = findFirstImage(nested.id, depth + 1);
        if (result) return result;
      }
      return null;
    },
    [getFolder]
  );

  const resolveCoverImage = useCallback(
    (folder) => {
      if (!folder) return null;
      const folderData = getFolder(folder.id);
      if (folderData) {
        const fileCandidate = folderData.items.find((item) => item.type === 'file' && resolveItemImage(item));
        if (fileCandidate) {
          return resolveItemImage(fileCandidate);
        }
        const nestedFolders = folderData.items.filter((item) => item.type === 'folder');
        for (const nested of nestedFolders) {
          const nestedCover = findFirstImage(nested.id, 1);
          if (nestedCover) return nestedCover;
        }
      }
      return resolveItemImage(folder) || findFirstImage(folder.id);
    },
    [findFirstImage, getFolder]
  );

  useEffect(() => {
    if (!albumFolders.length) return;
    const sample = albumFolders[Math.floor(Math.random() * albumFolders.length)];
    const cover = resolveCoverImage(sample);
    if (cover) {
      updateGalleriaSectionMeta('photography', { previewImage: cover });
    }
  }, [albumFolders, resolveCoverImage, updateGalleriaSectionMeta]);

  const openAlbumPicker = useCallback(() => {
    setAlbumPickerOpen(true);
    setActiveAlbum(null);
    setActiveGallery(null);
    setActiveImageIndex(null);
    scrollToActiveLayer();
  }, [scrollToActiveLayer]);

  const closeAlbumPicker = useCallback(() => {
    setAlbumPickerOpen(false);
  }, []);

  const openAlbum = useCallback(
    (album) => {
      setActiveAlbum(album);
      setActiveGallery(null);
      setActiveImageIndex(null);
      scrollToActiveLayer();
    },
    [scrollToActiveLayer]
  );

  const closeAlbum = useCallback(() => {
    setActiveAlbum(null);
    setActiveGallery(null);
    setActiveImageIndex(null);
    setSlideshowActive(false);
  }, []);

  const closePhotographyOverlay = useCallback(() => {
    setActiveImageIndex(null);
    setActiveGallery(null);
    setActiveAlbum(null);
    setAlbumPickerOpen(false);
    setSlideshowActive(false);
  }, []);

  const openDefaultAlbum = useCallback(
    (options = {}) => {
      if (options.startInGallery) {
        openAlbumPicker();
        return;
      }
      if (albumFolders.length) {
        openAlbum(albumFolders[0]);
      }
    },
    [albumFolders, openAlbum, openAlbumPicker]
  );

  useEffect(() => {
    const unregister = registerGalleriaSection('photography', {
      label: 'Photography',
      openDefault: openDefaultAlbum,
    });
    return unregister;
  }, [openDefaultAlbum, registerGalleriaSection]);

  useEffect(() => {
    if (isAlbumPickerOpen || activeAlbum || activeImageIndex !== null) {
      engageGalleriaSection('photography', closePhotographyOverlay);
      return () => releaseGalleriaSection('photography');
    }
    return undefined;
  }, [
    activeAlbum,
    activeImageIndex,
    closePhotographyOverlay,
    engageGalleriaSection,
    isAlbumPickerOpen,
    releaseGalleriaSection,
  ]);

  useEffect(() => {
    if (!activeAlbum) return;
    loadFolder(activeAlbum.id);
  }, [activeAlbum, loadFolder]);

  const activeAlbumData = activeAlbum ? getFolder(activeAlbum.id) : null;
  const galleryFolders = useMemo(() => {
    if (!activeAlbumData) return [];
    const folders = activeAlbumData.items.filter((item) => item.type === 'folder' && hasMedia(item.id));
    return sortFolders(folders, gallerySortMode);
  }, [activeAlbumData, gallerySortMode, hasMedia, sortFolders]);

  useEffect(() => {
    if (!galleryFolders.length) return;
    galleryFolders.forEach((gallery) => {
      if (!getFolder(gallery.id)) {
        loadFolder(gallery.id);
      }
    });
  }, [galleryFolders, getFolder, loadFolder]);

  useEffect(() => {
    if (!activeGallery) return;
    loadFolder(activeGallery.id);
  }, [activeGallery, loadFolder]);

  const activeGalleryData = activeGallery ? getFolder(activeGallery.id) : null;
  const galleryImages = useMemo(() => {
    if (!activeGalleryData) return [];
    return activeGalleryData.items.filter((item) => item.type === 'file');
  }, [activeGalleryData]);

  const sortedGalleryImages = useMemo(() => {
    if (!galleryImages.length) return [];
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const clone = [...galleryImages];
    switch (frameSortMode) {
      case 'name':
        return clone.sort((a, b) => collator.compare(a.title || '', b.title || ''));
      case 'name-desc':
        return clone.sort((a, b) => collator.compare(b.title || '', a.title || ''));
      case 'newest':
        return clone.sort((a, b) => new Date(b.modifiedTime || b.createdTime || 0) - new Date(a.modifiedTime || a.createdTime || 0));
      case 'oldest':
        return clone.sort((a, b) => new Date(a.modifiedTime || a.createdTime || 0) - new Date(b.modifiedTime || b.createdTime || 0));
      case 'original':
      default:
        return clone;
    }
  }, [frameSortMode, galleryImages]);

  const galleryQuickLook = useMemo(
    () =>
      galleryFolders.map((gallery) => ({
        id: gallery.id,
        title: gallery.title,
        cover: resolveCoverImage(gallery),
      })),
    [galleryFolders, resolveCoverImage]
  );

  const preparedGalleryImages = useMemo(() => {
    const galleryTitle = activeGallery?.title || activeAlbum?.title || 'Photography Gallery';
    return sortedGalleryImages.map((image, index) => {
      const previewSrc = resolveItemImage(image);
      const fullSrc = resolveItemImage(image, 'full') || previewSrc;
      const thumbSrc = resolveItemImage(image, 'thumb') || previewSrc;
      return {
        ...image,
        displayTitle: `${galleryTitle} · Frame ${index + 1}`,
        alt: `${galleryTitle} frame ${index + 1} shot by Menelek Makonnen`,
        frameIndex: index,
        previewSrc,
        fullSrc,
        thumbSrc,
      };
    });
  }, [activeAlbum?.title, activeGallery?.title, sortedGalleryImages]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    if (!preparedGalleryImages.length) {
      setActiveImageIndex(null);
      return;
    }
    if (activeImageIndex >= preparedGalleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, preparedGalleryImages]);

  const galleryOpenRef = useRef(false);
  const slideshowTimerRef = useRef(null);
  useEffect(() => {
    const isOpen = Boolean(activeGallery);
    if (isOpen && !galleryOpenRef.current) {
      scrollToActiveLayer();
    }
    galleryOpenRef.current = isOpen;
  }, [activeGallery, scrollToActiveLayer]);

  const imageOpenRef = useRef(false);
  useEffect(() => {
    const isOpen = activeImageIndex !== null;
    if (isOpen && !imageOpenRef.current) {
      scrollToActiveLayer();
    }
    imageOpenRef.current = isOpen;
  }, [activeImageIndex, scrollToActiveLayer]);

  const activeImage = activeImageIndex !== null ? preparedGalleryImages[activeImageIndex] : null;

  const stopSlideshow = useCallback(() => {
    setSlideshowActive(false);
  }, []);

  useEffect(() => {
    if (!isSlideshowActive || activeImageIndex === null || !preparedGalleryImages.length) {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
        slideshowTimerRef.current = null;
      }
      return undefined;
    }

    slideshowTimerRef.current = setInterval(() => {
      setActiveImageIndex((index) => {
        if (index === null) return index;
        return (index + 1) % preparedGalleryImages.length;
      });
    }, 4500);

    return () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
        slideshowTimerRef.current = null;
      }
    };
  }, [isSlideshowActive, activeImageIndex, preparedGalleryImages.length]);

  useEffect(() => {
    if (activeImageIndex === null || !activeGallery) {
      stopSlideshow();
    }
  }, [activeGallery, activeImageIndex, stopSlideshow]);

  useEffect(
    () => () => {
      if (slideshowTimerRef.current) {
        clearInterval(slideshowTimerRef.current);
        slideshowTimerRef.current = null;
      }
    },
    []
  );

  const toggleSlideshow = useCallback(() => {
    if (!isSlideshowActive && activeImageIndex === null) {
      setActiveImageIndex(0);
    }
    setSlideshowActive((prev) => !prev);
  }, [activeImageIndex, isSlideshowActive]);

  const startGallerySlideshow = useCallback(() => {
    const targetGallery = activeGallery || galleryFolders[0];
    if (!targetGallery) return;
    if (!activeGallery || targetGallery.id !== activeGallery.id) {
      setActiveGallery(targetGallery);
      setActiveImageIndex(0);
    } else if (activeImageIndex === null) {
      setActiveImageIndex(0);
    }
    setSlideshowActive(true);
    scrollToActiveLayer();
  }, [activeGallery, activeImageIndex, galleryFolders, scrollToActiveLayer]);

  const handleManualFrameSelect = useCallback(
    (index) => {
      stopSlideshow();
      setActiveImageIndex(index);
    },
    [stopSlideshow]
  );

  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (event) => {
      if (!preparedGalleryImages.length) return;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index + 1) % preparedGalleryImages.length));
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index - 1 + preparedGalleryImages.length) % preparedGalleryImages.length));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, preparedGalleryImages.length]);

  const handleImageWheel = useCallback(
    (direction) => {
      if (!preparedGalleryImages.length) return;
      stopSlideshow();
      setActiveImageIndex((index) => {
        if (index === null) return index;
        if (direction === 'next') {
          return (index + 1) % preparedGalleryImages.length;
        }
        return (index - 1 + preparedGalleryImages.length) % preparedGalleryImages.length;
      });
    },
    [preparedGalleryImages.length, stopSlideshow]
  );

  const renderAlbumCard = (album, { onOpen } = {}) => {
    const meta = albumMeta[album.title] || {
      gradient: 'from-slate-500/80 via-slate-600/70 to-slate-900/80',
      tagline: 'Curated moments',
      icon: ImageIcon,
    };
    const Icon = meta.icon;
    const cover = resolveCoverImage(album);
    const loadingCover = !cover && (isLoading(album.id) || !getFolder(album.id));
    const handleOpen = typeof onOpen === 'function' ? onOpen : openAlbum;

    return (
      <motion.button
        key={album.id}
        type="button"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => handleOpen(album)}
        className="group text-left rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.78)] p-6 transition-all hover:-translate-y-1 hover:border-white/20"
      >
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
          {cover ? (
            <img src={cover} alt={`${album.title} cover`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className={`flex h-full w-full items-center justify-center rounded-2xl bg-gradient-to-br ${meta.gradient}`}>
              {loadingCover ? <Loader2 className="h-8 w-8 animate-spin text-white/80" /> : <Icon className="h-14 w-14 text-white/80" />}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/85">
            <div>
              <p className="text-lg font-semibold">{album.title}</p>
              <p className="text-xs uppercase mono tracking-[0.35em] text-white/65">Open Collection</p>
            </div>
            <Icon className="h-6 w-6 drop-shadow-[0_8px_18px_rgba(0,0,0,0.45)]" />
          </div>
        </div>
        <div className="mt-5 space-y-2">
          <p className="text-sm text-[color:var(--text-secondary)]">{meta.tagline}</p>
          {getError(album.id) && <p className="text-xs text-rose-300">Unable to load album contents.</p>}
        </div>
      </motion.button>
    );
  };

  const renderGalleryCard = (gallery) => {
    const cover = resolveCoverImage(gallery);
    const galleryData = getFolder(gallery.id);
    const imageCount = galleryData ? galleryData.items.filter((item) => item.type === 'file').length : 0;
    const loadingGallery = !galleryData || isLoading(gallery.id);

    return (
      <motion.button
        key={gallery.id}
        type="button"
        onClick={() => {
          stopSlideshow();
          setActiveGallery(gallery);
          setActiveImageIndex(null);
          scrollToActiveLayer();
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,10,16,0.78)] text-left shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          {cover ? (
            <img src={cover} alt={`${gallery.title} cover`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-900 text-white/70">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <p className="text-base font-semibold text-white truncate">{gallery.title}</p>
            {loadingGallery ? (
              <Loader2 className="h-5 w-5 animate-spin text-white/80" />
            ) : (
              <span className="rounded-full bg-black/60 px-3 py-1 text-[10px] uppercase mono tracking-[0.35em] text-white/70">
                {imageCount} Frames
              </span>
            )}
          </div>
        </div>
        <div className="p-4 text-sm text-[color:var(--text-secondary)]">
          Tap to enter gallery lightbox and camera toolkit.
        </div>
      </motion.button>
    );
  };

  const renderGalleryGrid = () => {
    if (!activeGallery) {
      return (
        <div className="space-y-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <span className="mono text-[11px] uppercase tracking-[0.4em] text-white/60">Galleries</span>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/60">
              <span className="hidden sm:inline">Sort</span>
              <select
                value={gallerySortMode}
                onChange={(event) => setGallerySortMode(event.target.value)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
              >
                <option value="name">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
              <button
                type="button"
                onClick={startGallerySlideshow}
                className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/80 transition hover:border-white/50"
              >
                <PlayCircle className="h-3.5 w-3.5" />
                <span>Slideshow</span>
              </button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 overflow-y-auto pr-2">
            {galleryFolders.map(renderGalleryCard)}
            {!galleryFolders.length && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-black/35">
                {activeAlbum ? (
                  isLoading(activeAlbum.id) ? (
                    <Loader2 className="h-8 w-8 animate-spin text-green-300" />
                  ) : (
                    <p className="text-sm text-white/70">No galleries found in this album yet.</p>
                  )
                ) : null}
              </div>
            )}
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(6,8,14,0.92)]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
          <div>
            <p className="mono text-[10px] uppercase tracking-[0.35em] text-white/55">Gallery</p>
            <h3 className="text-2xl font-semibold text-white/90">{activeGallery.title}</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] mono uppercase tracking-[0.35em] text-white/70">
              {preparedGalleryImages.length} Frames
            </span>
            <button
              type="button"
              onClick={() => {
                setActiveGallery(null);
                setActiveImageIndex(null);
              }}
              className="camera-hud rounded-full px-4 py-2 text-xs mono uppercase tracking-[0.35em]"
            >
              Back to Galleries
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs uppercase tracking-[0.4em] text-white/55">Frame order</div>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.4em] text-white/60">
              <select
                value={frameSortMode}
                onChange={(event) => setFrameSortMode(event.target.value)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
              >
                <option value="original">Curated</option>
                <option value="name">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {preparedGalleryImages.map((image, index) => {
              const preview = resolveItemImage(image);
              return (
                <motion.button
                  key={image.id || image.title || index}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(index);
                    scrollToActiveLayer();
                  }}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.015 * index }}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/55"
                >
                  <div className="relative aspect-[2/3] w-full">
                    {preview ? (
                      <img src={preview} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-900 text-white/70">
                        <Camera className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <p className="text-sm font-semibold text-white/90 truncate">{image.displayTitle}</p>
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </div>
          {!preparedGalleryImages.length && (
            <div className="flex h-48 items-center justify-center rounded-2xl border border-white/10 bg-black/45">
              {isLoading(activeGallery.id) ? (
                <Loader2 className="h-7 w-7 animate-spin text-green-300" />
              ) : (
                <p className="text-sm text-white/70">No images available yet.</p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const activeAlbumMeta = activeAlbum ? albumMeta[activeAlbum.title] || null : null;
  const activeImageSrc = activeImage
    ?
        activeImage.fullSrc ||
        activeImage.imageVariants?.full ||
        activeImage.imageVariants?.preview ||
        activeImage.viewUrl ||
        activeImage.downloadUrl ||
        activeImage.previewSrc ||
        resolveItemImage(activeImage)
    : null;

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 pt-32 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold">
            Photography
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-xl text-[color:var(--text-secondary)] max-w-3xl"
          >
            Open the MMM Media library of beauty portraiture and professional storytelling. Each album streams directly from the
            curated Google Drive collections so you always see the latest edits.
          </motion.p>
        </header>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="mono text-[12px] uppercase tracking-[0.5em] text-[color:var(--text-secondary)]">Albums</h2>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">
              {getError(MMM_MEDIA_ROOT) && (
                <div className="text-xs text-rose-300 normal-case tracking-normal">Unable to load albums.</div>
              )}
              <label className="hidden md:block">Sort</label>
              <select
                value={albumSortMode}
                onChange={(event) => setAlbumSortMode(event.target.value)}
                className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] uppercase tracking-[0.35em]"
              >
                <option value="name">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {albumFolders.map((album) => renderAlbumCard(album))}
            {!rootFolder && isLoading(MMM_MEDIA_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-green-300" />
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isAlbumPickerOpen && (
          <FullscreenLightbox
            key="photography-album-picker"
            layerId="photography-album-picker"
            depth={5200}
            onClose={closeAlbumPicker}
            innerClassName="p-0"
            galleriaSectionId="photography"
            showGalleriaChrome
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(5,7,12,0.96)] shadow-[0_45px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <p className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">Photography Galleria</p>
                  <h2 className="text-4xl font-semibold text-white/90">Choose a collection</h2>
                  <p className="text-sm text-white/65">Dive into Beauty, Professional, and collaborative shoots.</p>
                </div>
                <button
                  type="button"
                  onClick={closeAlbumPicker}
                  className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close album picker"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.4em] text-white/60">
                  <span>Sort collections</span>
                  <select
                    value={albumSortMode}
                    onChange={(event) => setAlbumSortMode(event.target.value)}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
                  >
                    <option value="name">Name A–Z</option>
                    <option value="name-desc">Name Z–A</option>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                  {albumFolders.map((album) =>
                    renderAlbumCard(album, {
                      onOpen: (entry) => {
                        setAlbumPickerOpen(false);
                        openAlbum(entry);
                      },
                    })
                  )}
                  {!albumFolders.length && (
                    <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40 text-white/70">
                      Albums are loading from Drive…
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeAlbum && activeImageIndex === null && (
          <FullscreenLightbox
            key={activeAlbum.id}
            layerId={`album-${activeAlbum.id}`}
            depth={5200}
            onClose={closeAlbum}
            innerClassName="p-0"
            galleriaSectionId="photography"
            showGalleriaChrome
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(6,8,16,0.96)] shadow-[0_50px_140px_rgba(0,0,0,0.7)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={closeAlbum}
                    className="flex items-center gap-2 text-sm mono text-green-300 hover:text-green-100"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to albums
                  </button>
                  <h2 className="text-4xl font-bold text-white/90">{activeAlbum.title}</h2>
                  {activeAlbumMeta && <p className="text-sm text-white/70 max-w-xl">{activeAlbumMeta.tagline}</p>}
                  {getError(activeAlbum.id) && (
                    <p className="text-sm text-rose-300">Unable to load this album. Please try again shortly.</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={closeAlbum}
                  className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close album"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto">{renderGalleryGrid()}</div>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeImage && activeImageSrc && (
          <FullscreenLightbox
            key={`lightbox-${activeImage.id || activeImageIndex}`}
            layerId={`lightbox-${activeImage.id || activeImageIndex}`}
            depth={5200}
            onClose={() => setActiveImageIndex(null)}
            innerClassName="p-0 overflow-hidden"
            galleriaSectionId="photography"
            showGalleriaChrome
            onWheelNavigate={handleImageWheel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(4,6,12,0.96)] shadow-[0_65px_160px_rgba(0,0,0,0.75)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <p className="mono text-[11px] uppercase tracking-[0.4em] text-white/55">Gallery Lightbox</p>
                  <h2 className="text-3xl font-semibold text-white/90">
                    {activeGallery?.title || activeAlbum?.title || 'Photography Gallery'}
                  </h2>
                  <p className="text-sm text-white/65">
                    Frame {activeImageIndex + 1} of {preparedGalleryImages.length} · {activeAlbum?.title || 'MMM Media'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={toggleSlideshow}
                    className={`camera-hud flex items-center gap-2 rounded-full px-4 py-2 text-[11px] uppercase tracking-[0.35em] ${
                      isSlideshowActive ? 'text-emerald-200' : 'text-white/80'
                    }`}
                  >
                    {isSlideshowActive ? (
                      <PauseCircle className="h-4 w-4" />
                    ) : (
                      <PlayCircle className="h-4 w-4" />
                    )}
                    {isSlideshowActive ? 'Pause' : 'Play'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageIndex(null)}
                    className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                    aria-label="Close lightbox"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                <div className="relative flex flex-1 items-center justify-center bg-black/85 px-4 py-6 md:px-10">
                  <div className="relative mx-auto flex max-h-[80vh] w-auto max-w-full items-center justify-center">
                    <img
                      src={activeImageSrc}
                      alt={activeImage.alt}
                      className="max-h-[80vh] max-w-[90vw] rounded-[28px] object-contain shadow-[0_35px_90px_rgba(0,0,0,0.65)]"
                    />
                  </div>
                  {preparedGalleryImages.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleImageWheel('prev')}
                        className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 rounded-full bg-black/70 p-3 text-white transition hover:bg-black/80"
                        aria-label="Previous image"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleImageWheel('next')}
                        className="absolute right-0 top-1/2 translate-x-full -translate-y-1/2 rounded-full bg-black/70 p-3 text-white transition hover:bg-black/80"
                        aria-label="Next image"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>
                <aside className="w-full overflow-y-auto border-t border-white/10 bg-[rgba(8,10,16,0.9)] p-6 lg:w-[320px] lg:border-t-0 lg:border-l xl:w-[360px]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">Frames</h3>
                      <p className="text-sm text-white/65">Select another perspective</p>
                    </div>
                    <div className="flex flex-col gap-3">
                      {preparedGalleryImages.map((image, index) => {
                        const isCurrent = index === activeImageIndex;
                        return (
                          <button
                            key={image.id || `${image.frameIndex}-${index}`}
                            type="button"
                            onClick={() => handleManualFrameSelect(index)}
                            className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all ${
                              isCurrent
                                ? 'border-white/45 bg-white/12 text-white'
                                : 'border-white/12 bg-white/5 text-white/70 hover:border-white/35'
                            }`}
                          >
                            <div className="relative h-16 w-20 overflow-hidden rounded-xl bg-black/35">
                              {image.thumbSrc ? (
                                <img src={image.thumbSrc} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-white/60">
                                  <Camera className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <div className="text-left">
                              <p className="mono text-[10px] uppercase tracking-[0.35em] text-white/60">Frame {index + 1}</p>
                              <p className="text-sm font-semibold text-white/85 truncate">{image.displayTitle}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>
              </div>

              <div className="border-t border-white/10 bg-[rgba(4,6,12,0.92)] px-5 py-4">
                <div className="flex flex-col gap-3">
                  <span className="mono text-[10px] uppercase tracking-[0.45em] text-white/55">Other Galleries</span>
                  {galleryQuickLook.length ? (
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {galleryQuickLook.map((gallery) => {
                        const isCurrent = gallery.id === activeGallery?.id;
                        return (
                          <button
                            key={gallery.id}
                            type="button"
                            onClick={() => {
                              if (gallery.id === activeGallery?.id) return;
                              const nextGallery = galleryFolders.find((item) => item.id === gallery.id) || null;
                              if (!nextGallery) return;
                              stopSlideshow();
                              setActiveGallery(nextGallery);
                              setActiveImageIndex(0);
                              scrollToActiveLayer();
                            }}
                            className={`flex min-w-[140px] flex-col rounded-2xl border bg-white/5 px-2 pb-3 pt-2 text-left transition-all ${
                              isCurrent ? 'border-white/50 text-white' : 'border-white/15 text-white/80 hover:border-white/35'
                            }`}
                          >
                            <div className="relative mb-2 h-16 w-full overflow-hidden rounded-xl bg-black/40">
                              {gallery.cover ? (
                                <img src={gallery.cover} alt={`${gallery.title} cover`} className="h-full w-full object-cover" loading="lazy" />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-white/60">
                                  <ImageIcon className="h-5 w-5" />
                                </div>
                              )}
                            </div>
                            <p className="mono text-[10px] uppercase tracking-[0.35em] truncate">{gallery.title}</p>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <span className="text-xs text-white/60">No additional galleries available.</span>
                  )}
                </div>
              </div>

            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>
    </div>
  );
}
