import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, ChevronLeft, ChevronRight, Heart, Loader2, Sparkles, X } from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';
import { resolveDriveImage } from '@/lib/googleDrive';
import { useCameraContext } from '@/context/CameraContext';

const AI_ALBUM_ROOT = '1LflEx48azcfu_EBnLv12SOYWhUMXYoBj';

const getPreviewSrc = (item, intent = 'preview') => {
  if (!item) return null;
  const variants = item.imageVariants || item.variants || null;
  const viaVariants = resolveDriveImage(variants, intent);
  if (viaVariants) return viaVariants;
  if (intent === 'thumb' && item.thumb) return item.thumb;
  if (item.previewUrl) return item.previewUrl;
  if (item.thumbnail) return item.thumbnail;
  if (item.viewUrl) return item.viewUrl;
  if (item.downloadUrl) return item.downloadUrl;
  if (item.id) {
    return `https://lh3.googleusercontent.com/d/${item.id}=w1600-h1600-no`;
  }
  return null;
};

const describeAlbumTheme = (title = 'this series') =>
  `Custom diffusion and ControlNet workflows inspired by ${title}.`;

export default function AIAlbumsSection() {
  const { loadFolder, getFolder, isLoading, getError } = useDriveFolderCache();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [isAlbumBrowserOpen, setAlbumBrowserOpen] = useState(false);
  const [favoriteFrames, setFavoriteFrames] = useState({});
  const [albumSortMode, setAlbumSortMode] = useState('name');
  const [imageSortMode, setImageSortMode] = useState('original');
  const {
    registerGalleriaSection,
    updateGalleriaSectionMeta,
    engageGalleriaSection,
    releaseGalleriaSection,
  } = useCameraContext();

  const autoScrollToActiveLayer = useCallback(() => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }, []);

  const openAlbumBrowser = useCallback(() => {
    setAlbumBrowserOpen(true);
    setSelectedAlbum(null);
    setSelectedImageIndex(null);
    autoScrollToActiveLayer();
  }, [autoScrollToActiveLayer]);

  const closeAlbumBrowser = useCallback(() => {
    setAlbumBrowserOpen(false);
  }, []);

  useEffect(() => {
    loadFolder(AI_ALBUM_ROOT);
  }, [loadFolder]);

  const aiRoot = getFolder(AI_ALBUM_ROOT);

  const hasAlbumMedia = useCallback(
    (folderId, depth = 0) => {
      if (!folderId || depth > 4) return false;
      const folder = getFolder(folderId);
      if (!folder) return true;
      const fileExists = folder.items.some((item) => item.type === 'file' && getPreviewSrc(item));
      if (fileExists) return true;
      const nestedFolders = folder.items.filter((item) => item.type === 'folder');
      return nestedFolders.some((nested) => hasAlbumMedia(nested.id, depth + 1));
    },
    [getFolder]
  );

  const sortFolders = useCallback((items, mode) => {
    if (!items?.length) return [];
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const clone = [...items];
    switch (mode) {
      case 'name-desc':
        return clone.sort((a, b) => collator.compare(b.title || '', a.title || ''));
      case 'newest':
        return clone.sort((a, b) => new Date(b.modifiedTime || b.createdTime || 0) - new Date(a.modifiedTime || a.createdTime || 0));
      case 'oldest':
        return clone.sort((a, b) => new Date(a.modifiedTime || a.createdTime || 0) - new Date(b.modifiedTime || b.createdTime || 0));
      case 'name':
      default:
        return clone.sort((a, b) => collator.compare(a.title || '', b.title || ''));
    }
  }, []);

  const aiContainer = useMemo(() => {
    if (!aiRoot) return null;
    const folders = aiRoot.items.filter((item) => item.type === 'folder');
    const explicitContainer = folders.find((folder) => /ai\s*albums?/i.test(folder.title));
    return explicitContainer || null;
  }, [aiRoot]);

  useEffect(() => {
    if (!aiContainer) return;
    loadFolder(aiContainer.id);
  }, [aiContainer, loadFolder]);

  const rootLevelAlbums = useMemo(() => {
    if (!aiRoot) return [];
    return aiRoot.items.filter((item) => item.type === 'folder');
  }, [aiRoot]);

  const rawAlbumEntries = useMemo(() => {
    if (aiContainer) {
      const folderData = getFolder(aiContainer.id);
      if (!folderData) return [];
      return folderData.items.filter((item) => item.type === 'folder');
    }

    if (rootLevelAlbums.length) {
      return rootLevelAlbums;
    }

    if (!aiRoot) return [];
    return aiRoot.items.filter((item) => item.type === 'folder');
  }, [aiContainer, getFolder, aiRoot, rootLevelAlbums]);

  const albumEntries = useMemo(() => {
    if (!rawAlbumEntries.length) return [];
    const filtered = rawAlbumEntries.filter((album) => hasAlbumMedia(album.id));
    return sortFolders(filtered, albumSortMode);
  }, [albumSortMode, hasAlbumMedia, rawAlbumEntries, sortFolders]);

  useEffect(() => {
    if (!albumEntries.length) return;
    const sample = albumEntries[Math.floor(Math.random() * albumEntries.length)];
    if (!sample) return;
    const albumData = getFolder(sample.id);
    let cover = null;
    if (albumData) {
      const fileCandidate = albumData.items.find((item) => item.type === 'file' && getPreviewSrc(item));
      if (fileCandidate) {
        cover = getPreviewSrc(fileCandidate);
      }
    }
    if (!cover) {
      cover = getPreviewSrc(sample);
    }
    if (cover) {
      updateGalleriaSectionMeta('ai-albums', { previewImage: cover });
    }
  }, [albumEntries, getFolder, updateGalleriaSectionMeta]);

  useEffect(() => {
    if (!selectedAlbum) return;
    loadFolder(selectedAlbum.id);
  }, [selectedAlbum, loadFolder]);

  const closeAiOverlay = useCallback(() => {
    setSelectedImageIndex(null);
    setSelectedAlbum(null);
    setAlbumBrowserOpen(false);
  }, []);

  const openDefaultAiAlbum = useCallback(
    (options = {}) => {
      if (options.startInGallery) {
        openAlbumBrowser();
        return;
      }
      if (albumEntries.length) {
        setSelectedAlbum(albumEntries[0]);
        setSelectedImageIndex(null);
      }
    },
    [albumEntries, openAlbumBrowser]
  );

  useEffect(() => {
    const unregister = registerGalleriaSection('ai-albums', {
      label: 'AI Albums',
      openDefault: openDefaultAiAlbum,
    });
    return unregister;
  }, [openDefaultAiAlbum, registerGalleriaSection]);

  useEffect(() => {
    if (isAlbumBrowserOpen || selectedAlbum || selectedImageIndex !== null) {
      engageGalleriaSection('ai-albums', closeAiOverlay);
      return () => releaseGalleriaSection('ai-albums');
    }
    return undefined;
  }, [
    closeAiOverlay,
    engageGalleriaSection,
    isAlbumBrowserOpen,
    releaseGalleriaSection,
    selectedAlbum,
    selectedImageIndex,
  ]);

  useEffect(() => {
    if (!selectedAlbum) return;
    setFavoriteFrames((prev) => {
      const scoped = {};
      const prefix = `${selectedAlbum.id}:`;
      Object.keys(prev).forEach((key) => {
        if (key.startsWith(prefix)) {
          scoped[key] = prev[key];
        }
      });
      return scoped;
    });
  }, [selectedAlbum]);

  useEffect(() => {
    if (!albumEntries.length) return;
    albumEntries.forEach((album) => {
      if (!getFolder(album.id)) {
        loadFolder(album.id);
      }
    });
  }, [albumEntries, getFolder, loadFolder]);

  const selectedAlbumImages = useMemo(() => {
    if (!selectedAlbum) return [];
    const albumData = getFolder(selectedAlbum.id);
    if (!albumData) return [];
    return albumData.items.filter((item) => item.type === 'file');
  }, [getFolder, selectedAlbum]);

  const sortedAlbumImages = useMemo(() => {
    if (!selectedAlbumImages.length) return [];
    const collator = new Intl.Collator(undefined, { sensitivity: 'base' });
    const clone = [...selectedAlbumImages];
    switch (imageSortMode) {
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
  }, [imageSortMode, selectedAlbumImages]);

  const preparedAlbumImages = useMemo(() => {
    const albumTitle = selectedAlbum?.title || 'AI Collection';
    const albumSignature = selectedAlbum?.id || 'ai-album';
    return sortedAlbumImages.map((image, index) => {
      const previewSrc = getPreviewSrc(image);
      const fullSrc = getPreviewSrc(image, 'full') || previewSrc;
      const thumbSrc = getPreviewSrc(image, 'thumb') || previewSrc;
      const favoriteKey = `${albumSignature}:${image.id || index}`;
      return {
        ...image,
        displayTitle: `${albumTitle} · Frame ${index + 1}`,
        alt: `${albumTitle} frame ${index + 1} created by Menelek Makonnen`,
        previewSrc,
        fullSrc,
        thumbSrc,
        frameIndex: index,
        favoriteKey,
      };
    });
  }, [selectedAlbum?.id, selectedAlbum?.title, sortedAlbumImages]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    if (!preparedAlbumImages.length) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex >= preparedAlbumImages.length) {
      setSelectedImageIndex(0);
    }
  }, [preparedAlbumImages, selectedImageIndex]);

  const activeImage = selectedImageIndex !== null ? preparedAlbumImages[selectedImageIndex] : null;
  const activeFavoriteKey = activeImage?.favoriteKey || null;
  const isActiveFavorite = activeFavoriteKey ? Boolean(favoriteFrames[activeFavoriteKey]) : false;

  useEffect(() => {
    if (selectedAlbum || selectedImageIndex !== null) {
      autoScrollToActiveLayer();
    }
  }, [autoScrollToActiveLayer, selectedAlbum, selectedImageIndex]);

  useEffect(() => {
    if (selectedImageIndex === null || !preparedAlbumImages.length) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        setSelectedImageIndex((index) => {
          if (index === null) return index;
          return (index + 1) % preparedAlbumImages.length;
        });
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        setSelectedImageIndex((index) => {
          if (index === null) return index;
          return (index - 1 + preparedAlbumImages.length) % preparedAlbumImages.length;
        });
      } else if (event.key === 'Escape') {
        event.preventDefault();
        setSelectedImageIndex(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [preparedAlbumImages.length, selectedImageIndex]);

  const handleAiWheel = useCallback(
    (direction) => {
      if (!preparedAlbumImages.length) return;
      setSelectedImageIndex((index) => {
        if (index === null) return index;
        if (direction === 'next') {
          return (index + 1) % preparedAlbumImages.length;
        }
        return (index - 1 + preparedAlbumImages.length) % preparedAlbumImages.length;
      });
    },
    [preparedAlbumImages.length]
  );

  const toggleFavorite = useCallback((key) => {
    if (!key) return;
    setFavoriteFrames((prev) => {
      const next = { ...prev };
      if (next[key]) {
        delete next[key];
      } else {
        next[key] = true;
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 pt-32 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold">
            AI Albums
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-xl text-[color:var(--text-secondary)] max-w-3xl"
          >
            Dive into evolving machine-crafted series drawn live from the shared Google Drive. Tap an album to review the full AI
            study set in a cinematic lightbox.
          </motion.p>
        </header>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <h2 className="mono text-[12px] uppercase tracking-[0.5em] text-[color:var(--text-secondary)]">Collections</h2>
            <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">
              {getError(AI_ALBUM_ROOT) && (
                <div className="text-xs text-rose-300 normal-case tracking-normal">Unable to reach Google Drive right now.</div>
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
            {albumEntries.map((album) => (
              <motion.button
                key={album.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                onClick={() => {
                  setSelectedAlbum(album);
                  setSelectedImageIndex(null);
                  autoScrollToActiveLayer();
                }}
                className="group rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.8)] p-6 text-left transition-colors hover:border-white/25"
              >
                <div className="relative mb-5 aspect-[2/3] overflow-hidden rounded-2xl">
                  {(() => {
                    const albumData = getFolder(album.id);
                    const coverCandidate = albumData?.items.find((item) => item.type === 'file') || null;
                    const cover = getPreviewSrc(coverCandidate) || getPreviewSrc(album);
                    if (cover) {
                      return (
                        <img
                          src={cover}
                          alt={`${album.title} cover`}
                          className="h-full w-full object-cover"
                          loading="lazy"
                          decoding="async"
                        />
                      );
                    }
                    return (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/70 via-fuchsia-500/65 to-indigo-600/70">
                        <Sparkles className="h-16 w-16 text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)]" />
                      </div>
                    );
                  })()}
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.22),transparent_65%)]" />
                  <div className="absolute bottom-3 left-3 text-xs mono uppercase tracking-[0.35em] text-white/80">Open</div>
                  {isLoading(album.id) && <Loader2 className="absolute right-3 top-3 h-5 w-5 animate-spin text-white/80" />}
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">{album.title}</h3>
                  <p className="text-sm text-[color:var(--text-secondary)]">{describeAlbumTheme(album.title)}</p>
                </div>
              </motion.button>
            ))}
            {!albumEntries.length && isLoading(aiContainer?.id || AI_ALBUM_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-green-300" />
              </div>
            )}
            {!albumEntries.length && !isLoading(aiContainer?.id || AI_ALBUM_ROOT) && !getError(AI_ALBUM_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40 text-sm text-[color:var(--text-secondary)]">
                No AI albums are shared in the connected Google Drive yet.
              </div>
            )}
            {!albumEntries.length && getError(aiContainer?.id || AI_ALBUM_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-rose-400/30 bg-rose-500/10 text-sm text-rose-200">
                Unable to reach the AI albums right now. Please try again shortly.
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {isAlbumBrowserOpen && (
          <FullscreenLightbox
            key="ai-album-browser"
            layerId="ai-album-browser"
            depth={5200}
            onClose={closeAlbumBrowser}
            innerClassName="p-0"
            galleriaSectionId="ai-albums"
            showGalleriaChrome
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(7,9,16,0.96)] shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <p className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">AI Album Vault</p>
                  <h2 className="text-4xl font-semibold text-white/90">Pick an experiment</h2>
                  <p className="text-sm text-white/65">Concept boards, character studies, and prompt explorations.</p>
                </div>
                <button
                  type="button"
                  onClick={closeAlbumBrowser}
                  className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close AI album browser"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-3 text-[10px] uppercase tracking-[0.4em] text-white/60">
                  <span>Sort albums</span>
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
                  {albumEntries.map((album) => {
                    const albumData = getFolder(album.id);
                    const coverCandidate = albumData
                      ? albumData.items.find((item) => item.type === 'file' && getPreviewSrc(item))
                      : null;
                    const cover = coverCandidate ? getPreviewSrc(coverCandidate) : getPreviewSrc(album);
                    return (
                      <motion.button
                        key={album.id}
                        type="button"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => {
                          setAlbumBrowserOpen(false);
                          setSelectedAlbum(album);
                          setSelectedImageIndex(null);
                        }}
                        className="rounded-3xl border border-white/10 bg-[rgba(12,14,22,0.85)] p-5 text-left hover:border-white/35 transition"
                      >
                        <div className="relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-black/40">
                          {cover ? (
                            <img src={cover} alt={`${album.title} cover`} className="h-full w-full object-cover" loading="lazy" />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-500/70 via-pink-500/70 to-indigo-600/70">
                              <Sparkles className="h-8 w-8 text-white" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <div className="absolute bottom-3 left-3 text-xs mono uppercase tracking-[0.35em] text-white/70">Open</div>
                        </div>
                        <h3 className="text-xl font-semibold text-white">{album.title}</h3>
                        <p className="text-sm text-white/70">{describeAlbumTheme(album.title)}</p>
                      </motion.button>
                    );
                  })}
                  {!albumEntries.length && (
                    <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/30 text-white/70">
                      AI albums are loading…
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedAlbum && selectedImageIndex === null && (
          <FullscreenLightbox
            key={selectedAlbum.id}
            layerId={`ai-album-${selectedAlbum.id}`}
            depth={5200}
            onClose={() => setSelectedAlbum(null)}
            innerClassName="p-0"
            galleriaSectionId="ai-albums"
            showGalleriaChrome
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(6,8,16,0.96)] shadow-[0_45px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="flex items-center gap-2 text-sm mono text-green-300 hover:text-green-100"
                  >
                    <ArrowLeft className="h-4 w-4" /> Back to AI Albums
                  </button>
                  <h2 className="text-4xl font-bold text-white">{selectedAlbum.title}</h2>
                  <p className="text-xs text-white/65">{describeAlbumTheme(selectedAlbum.title)}</p>
                  {getError(selectedAlbum.id) && (
                    <p className="text-sm text-rose-300">Unable to load this album. Please try again shortly.</p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedAlbum(null)}
                  className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                  aria-label="Close album"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {preparedAlbumImages.map((image, index) => {
                    const isFavorite = Boolean(favoriteFrames[image.favoriteKey]);
                    const openFrame = () => setSelectedImageIndex(index);
                    return (
                      <motion.div
                        key={image.id || `${image.frameIndex}-${index}`}
                        role="button"
                        tabIndex={0}
                        onClick={openFrame}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            openFrame();
                          }
                        }}
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.01 * index }}
                        className="relative aspect-[2/3] cursor-pointer overflow-hidden rounded-2xl border border-white/12 bg-black/50 shadow-[0_16px_40px_rgba(0,0,0,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                      >
                        {(() => {
                          const preview = getPreviewSrc(image);
                          if (preview) {
                            return (
                              <img
                                src={preview}
                                alt={image.alt}
                                className="h-full w-full object-cover"
                                loading="lazy"
                                decoding="async"
                              />
                            );
                          }
                          return (
                            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white/80">
                              <Sparkles className="h-8 w-8" />
                            </div>
                          );
                        })()}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                        <div className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white/85 truncate">
                          {image.displayTitle}
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            toggleFavorite(image.favoriteKey);
                          }}
                          className={`absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full border transition-all ${
                            isFavorite
                              ? 'border-rose-300/70 bg-rose-500/20 text-rose-200'
                              : 'border-white/20 bg-black/40 text-white/80 hover:border-white/50'
                          }`}
                          aria-pressed={isFavorite}
                          aria-label={isFavorite ? 'Remove favourite' : 'Save favourite frame'}
                        >
                          <Heart className="h-4 w-4" fill={isFavorite ? 'currentColor' : 'none'} />
                        </button>
                      </motion.div>
                    );
                  })}
                </div>

                {!preparedAlbumImages.length && isLoading(selectedAlbum.id) && (
                  <div className="mt-10 flex items-center justify-center rounded-3xl border border-white/10 bg-black/40 py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-green-300" />
                  </div>
                )}
              </div>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeImage && (
          <FullscreenLightbox
            key={`ai-lightbox-${activeImage.id || activeImageIndex}`}
            layerId={`ai-lightbox-${activeImage.id || activeImageIndex}`}
            depth={5200}
            onClose={() => setSelectedImageIndex(null)}
            innerClassName="p-0 overflow-hidden"
            galleriaSectionId="ai-albums"
            showGalleriaChrome
            onWheelNavigate={handleAiWheel}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(4,6,12,0.96)] shadow-[0_55px_140px_rgba(0,0,0,0.7)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
                <div>
                  <p className="mono text-[11px] uppercase tracking-[0.4em] text-white/55">AI Album Lightbox</p>
                  <h2 className="text-3xl font-semibold text-white/90">{selectedAlbum?.title || 'AI Collection'}</h2>
                  <p className="text-sm text-white/65">
                    Frame {selectedImageIndex + 1} of {preparedAlbumImages.length}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {activeFavoriteKey && (
                    <button
                      type="button"
                      onClick={() => toggleFavorite(activeFavoriteKey)}
                      className={`flex items-center gap-2 rounded-full border px-3 py-2 text-[10px] mono uppercase tracking-[0.4em] ${
                        isActiveFavorite
                          ? 'border-rose-300/60 bg-rose-500/10 text-rose-200'
                          : 'border-white/15 bg-white/5 text-white/70 hover:border-white/35'
                      }`}
                      aria-pressed={isActiveFavorite}
                    >
                      <Heart
                        className="h-3.5 w-3.5"
                        fill={isActiveFavorite ? 'currentColor' : 'none'}
                      />
                      {isActiveFavorite ? 'Favourited' : 'Save Frame'}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setSelectedImageIndex(null)}
                    className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
                    aria-label="Close lightbox"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="flex flex-1 flex-col overflow-hidden lg:flex-row">
                <div className="flex flex-1 items-center justify-center bg-black/80 px-4 py-6 md:px-10">
                  <div className="relative flex max-h-full w-full items-center justify-center">
                    <img
                      src={
                        activeImage.fullSrc ||
                        getPreviewSrc(activeImage, 'full') ||
                        activeImage.previewSrc ||
                        activeImage.viewUrl ||
                        activeImage.downloadUrl
                      }
                      alt={activeImage.alt}
                      className="max-h-[80vh] w-auto max-w-full rounded-[28px] object-contain shadow-[0_30px_80px_rgba(0,0,0,0.65)]"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <aside className="w-full overflow-y-auto border-t border-white/10 bg-[rgba(10,12,20,0.9)] p-6 lg:w-[320px] lg:border-t-0 lg:border-l xl:w-[360px]">
                  <div className="space-y-4">
                    <div>
                      <h3 className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">Generated Frames</h3>
                      <p className="text-sm text-white/65">Navigate through the AI sequence</p>
                    </div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.35em] text-white/60">
                      <span>Order</span>
                      <select
                        value={imageSortMode}
                        onChange={(event) => setImageSortMode(event.target.value)}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1"
                      >
                        <option value="original">Curated</option>
                        <option value="name">Name A–Z</option>
                        <option value="name-desc">Name Z–A</option>
                        <option value="newest">Newest</option>
                        <option value="oldest">Oldest</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-3">
                      {preparedAlbumImages.map((image, index) => {
                        const isCurrent = index === selectedImageIndex;
                        const isFavoriteThumb = Boolean(favoriteFrames[image.favoriteKey]);
                        return (
                          <button
                            key={image.id || `${image.frameIndex}-${index}`}
                            type="button"
                            onClick={() => setSelectedImageIndex(index)}
                            className={`flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all ${
                              isCurrent
                                ? 'border-white/45 bg-white/12 text-white'
                                : 'border-white/12 bg-white/5 text-white/70 hover:border-white/35'
                            }`}
                          >
                            <div className="relative h-16 w-20 overflow-hidden rounded-xl bg-black/40">
                              {image.thumbSrc ? (
                                <img
                                  src={image.thumbSrc}
                                  alt={image.alt}
                                  className="h-full w-full object-cover"
                                  loading="lazy"
                                  decoding="async"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center text-white/60">
                                  <Sparkles className="h-5 w-5" />
                                </div>
                              )}
                              {isFavoriteThumb && (
                                <Heart className="absolute right-1 top-1 h-3.5 w-3.5 text-rose-300" fill="currentColor" />
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

              <div className="border-t border-white/10 bg-[rgba(6,8,14,0.88)] px-5 py-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="mono text-[10px] uppercase tracking-[0.45em] text-white/55">Other Albums</span>
                  {albumEntries.length ? (
                    albumEntries.map((album) => (
                      <button
                        key={album.id}
                        type="button"
                        onClick={() => {
                          if (album.id === selectedAlbum?.id) return;
                          setSelectedImageIndex(null);
                          setSelectedAlbum(album);
                          autoScrollToActiveLayer();
                        }}
                        className={`rounded-full px-4 py-2 text-xs mono uppercase tracking-[0.35em] transition-all ${
                          album.id === selectedAlbum?.id
                            ? 'border border-white/45 bg-white/15 text-white'
                            : 'border border-white/15 bg-white/5 text-white/70 hover:border-white/35'
                        }`}
                        title={describeAlbumTheme(album.title)}
                      >
                        {album.title}
                      </button>
                    ))
                  ) : (
                    <span className="text-xs text-white/60">No other albums available.</span>
                  )}
                </div>
              </div>

              {preparedAlbumImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((index) =>
                        index === null ? index : (index - 1 + preparedAlbumImages.length) % preparedAlbumImages.length
                      )
                    }
                    className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedImageIndex((index) =>
                        index === null ? index : (index + 1) % preparedAlbumImages.length
                      )
                    }
                    className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>
    </div>
  );
}
