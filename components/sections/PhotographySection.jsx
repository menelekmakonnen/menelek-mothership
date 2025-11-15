import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Aperture,
  ArrowLeft,
  Camera,
  ChevronLeft,
  ChevronRight,
  Focus,
  Image as ImageIcon,
  Loader2,
  Sparkles,
  X,
} from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';
import { resolveDriveImage } from '@/lib/googleDrive';

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
  const [lightboxSettings, setLightboxSettings] = useState({
    focusDepth: 48,
    clarity: 0,
    overlays: { peaking: false, waveform: false, zebra: false },
  });

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
  const albumFolders = useMemo(() => {
    if (!rootFolder) return [];
    return rootFolder.items.filter((item) => item.type === 'folder' && albumMeta[item.title]);
  }, [rootFolder]);

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
  }, []);

  useEffect(() => {
    if (!activeAlbum) return;
    loadFolder(activeAlbum.id);
  }, [activeAlbum, loadFolder]);

  const activeAlbumData = activeAlbum ? getFolder(activeAlbum.id) : null;
  const galleryFolders = useMemo(() => {
    if (!activeAlbumData) return [];
    return activeAlbumData.items.filter((item) => item.type === 'folder');
  }, [activeAlbumData]);

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

  const preparedGalleryImages = useMemo(() => {
    const galleryTitle = activeGallery?.title || activeAlbum?.title || 'Photography Gallery';
    return galleryImages.map((image, index) => ({
      ...image,
      displayTitle: galleryTitle,
      alt: `${galleryTitle} shot by Menelek Makonnen`,
      frameIndex: index,
    }));
  }, [activeAlbum?.title, activeGallery?.title, galleryImages]);

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

  useEffect(() => {
    if (activeGallery || activeImageIndex !== null) {
      scrollToActiveLayer();
    }
  }, [activeGallery, activeImageIndex, scrollToActiveLayer]);

  const activeImage = activeImageIndex !== null ? preparedGalleryImages[activeImageIndex] : null;

  useEffect(() => {
    if (!activeImage) return;
    setLightboxSettings({
      focusDepth: 48,
      clarity: 0,
      overlays: { peaking: false, waveform: false, zebra: false },
    });
  }, [activeImage]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (event) => {
      if (!preparedGalleryImages.length) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index + 1) % preparedGalleryImages.length));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index - 1 + preparedGalleryImages.length) % preparedGalleryImages.length));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, preparedGalleryImages.length]);

  const renderAlbumCard = (album) => {
    const meta = albumMeta[album.title] || {
      gradient: 'from-slate-500/80 via-slate-600/70 to-slate-900/80',
      tagline: 'Curated moments',
      icon: ImageIcon,
    };
    const Icon = meta.icon;
    const cover = resolveCoverImage(album);
    const loadingCover = !cover && (isLoading(album.id) || !getFolder(album.id));

    return (
      <motion.button
        key={album.id}
        type="button"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => openAlbum(album)}
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
                  <div className="relative aspect-square w-full">
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
        resolveItemImage(activeImage, 'full') ||
        activeImage.imageVariants?.full ||
        activeImage.viewUrl ||
        activeImage.downloadUrl ||
        resolveItemImage(activeImage)
    : null;

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
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
          <div className="flex items-center justify-between">
            <h2 className="mono text-[12px] uppercase tracking-[0.5em] text-[color:var(--text-secondary)]">Albums</h2>
            {getError(MMM_MEDIA_ROOT) && <div className="text-sm text-rose-300">Unable to load Google Drive albums. Please retry.</div>}
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {albumFolders.map(renderAlbumCard)}
            {!rootFolder && isLoading(MMM_MEDIA_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-green-300" />
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {activeAlbum && (
          <FullscreenLightbox
            key={activeAlbum.id}
            layerId={`album-${activeAlbum.id}`}
            depth={2100}
            onClose={closeAlbum}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(6,8,16,0.96)] shadow-[0_50px_140px_rgba(0,0,0,0.7)]"
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

              <div className="flex-1 overflow-hidden">{renderGalleryGrid()}</div>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeImage && activeImageSrc && (
          <FullscreenLightbox
            key={`lightbox-${activeImage.id || activeImageIndex}`}
            layerId={`lightbox-${activeImage.id || activeImageIndex}`}
            depth={2300}
            onClose={() => setActiveImageIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(4,6,12,0.96)] shadow-[0_65px_160px_rgba(0,0,0,0.75)]"
            >
              <div className="flex flex-1 flex-col lg:flex-row">
                <div className="relative flex-1 min-h-[320px]">
                  <div className="absolute inset-0 flex flex-col gap-6 p-6 lg:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-semibold text-white/95">{activeImage.displayTitle}</h3>
                        <p className="text-sm text-white/70">
                          {activeGallery?.title || 'Gallery'} · Album {activeAlbum?.title || ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] mono uppercase tracking-[0.35em] text-white/70">
                        <span className="rounded-full bg-white/10 px-3 py-1">
                          Frame {activeImageIndex + 1} / {preparedGalleryImages.length}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/60">
                      <img src={activeImageSrc} alt={activeImage.alt} className="h-full w-full object-contain" />
                      {lightboxSettings.overlays.peaking && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(135deg, rgba(0,255,184,0.55) 0px, rgba(0,255,184,0.55) 6px, transparent 6px, transparent 14px)',
                          }}
                        />
                      )}
                      {lightboxSettings.overlays.zebra && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 10px, transparent 10px, transparent 20px)',
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <aside className="relative w-full border-t border-white/10 bg-black/45 p-6 lg:w-[340px] lg:border-l lg:border-t-0">
                  <div className="space-y-6">
                    <div>
                      <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-3">Focus Suite</h4>
                      <label className="flex flex-col gap-1 text-xs">
                        <span className="mono uppercase tracking-[0.3em] text-white/60">Focus Depth</span>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={lightboxSettings.focusDepth}
                          onChange={(event) =>
                            setLightboxSettings((prev) => ({ ...prev, focusDepth: Number(event.target.value) }))
                          }
                          className="camera-slider"
                        />
                      </label>
                      <label className="mt-3 flex flex-col gap-1 text-xs">
                        <span className="mono uppercase tracking-[0.3em] text-white/60">Clarity</span>
                        <input
                          type="range"
                          min={-4}
                          max={4}
                          value={lightboxSettings.clarity}
                          onChange={(event) =>
                            setLightboxSettings((prev) => ({ ...prev, clarity: Number(event.target.value) }))
                          }
                          className="camera-slider"
                        />
                      </label>
                    </div>

                    <div>
                      <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-3">Assist Modules</h4>
                      {[{ key: 'peaking', label: 'Focus Peaking' }, { key: 'waveform', label: 'Waveform Monitor' }, { key: 'zebra', label: 'Zebra Warning' }].map((overlay) => (
                        <button
                          key={overlay.key}
                          type="button"
                          onClick={() =>
                            setLightboxSettings((prev) => ({
                              ...prev,
                              overlays: { ...prev.overlays, [overlay.key]: !prev.overlays[overlay.key] },
                            }))
                          }
                          className={`mb-2 flex w-full items-center justify-between rounded-xl border px-3 py-2 text-xs mono tracking-[0.3em] transition-all ${
                            lightboxSettings.overlays[overlay.key]
                              ? 'border-green-400/50 bg-green-500/15 text-green-200'
                              : 'border-white/10 bg-white/5 text-white/65 hover:text-white'
                          }`}
                        >
                          <span>{overlay.label}</span>
                          {lightboxSettings.overlays[overlay.key] ? <Focus className="h-4 w-4" /> : <Aperture className="h-4 w-4" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>
              </div>

              <button
                type="button"
                onClick={() => setActiveImageIndex(null)}
                className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Close lightbox"
              >
                <X className="h-4 w-4" />
              </button>

              {preparedGalleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((index) =>
                        index === null ? null : (index - 1 + preparedGalleryImages.length) % preparedGalleryImages.length
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
                      setActiveImageIndex((index) =>
                        index === null ? null : (index + 1) % preparedGalleryImages.length
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
