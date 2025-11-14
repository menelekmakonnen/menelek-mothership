import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
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
  User,
  X,
} from 'lucide-react';
import BlurLayer from '@/components/ui/BlurLayer';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';

const MMM_MEDIA_ROOT = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

const albumMeta = {
  Beauty: {
    gradient: 'from-rose-500/80 via-pink-500/70 to-purple-600/80',
    tagline: 'Beauty, fashion and lifestyle editorials',
    icon: User,
  },
  Professional: {
    gradient: 'from-emerald-500/80 via-teal-500/70 to-cyan-600/80',
    tagline: 'Events, commercial experiences and brand storytelling',
    icon: Sparkles,
  },
};

export default function PhotographySection() {
  const { loadFolder, getFolder, isLoading, getError } = useDriveFolderCache();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [lightboxSettings, setLightboxSettings] = useState({
    focusDepth: 48,
    clarity: 0,
    overlays: { peaking: true, waveform: true, zebra: false },
  });

  useEffect(() => {
    loadFolder(MMM_MEDIA_ROOT);
  }, [loadFolder]);

  useEffect(() => {
    if (!selectedAlbum) return;
    loadFolder(selectedAlbum.id);
  }, [loadFolder, selectedAlbum]);

  useEffect(() => {
    if (!selectedGallery) return;
    loadFolder(selectedGallery.id);
  }, [loadFolder, selectedGallery]);

  const rootFolder = getFolder(MMM_MEDIA_ROOT);
  const albumFolders = useMemo(() => {
    if (!rootFolder) return [];
    return rootFolder.items.filter((item) => item.type === 'folder' && albumMeta[item.title]);
  }, [rootFolder]);

  const galleryFolders = useMemo(() => {
    if (!selectedAlbum) return [];
    const albumFolder = getFolder(selectedAlbum.id);
    if (!albumFolder) return [];
    return albumFolder.items.filter((item) => item.type === 'folder');
  }, [getFolder, selectedAlbum]);

  const galleryImages = useMemo(() => {
    if (!selectedGallery) return [];
    const galleryFolder = getFolder(selectedGallery.id);
    if (!galleryFolder) return [];
    return galleryFolder.items.filter((item) => item.type === 'file');
  }, [getFolder, selectedGallery]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    if (!galleryImages.length) {
      setActiveImageIndex(null);
    } else if (activeImageIndex >= galleryImages.length) {
      setActiveImageIndex(0);
    }
  }, [activeImageIndex, galleryImages]);

  const activeImage = activeImageIndex !== null ? galleryImages[activeImageIndex] : null;

  useEffect(() => {
    if (!activeImage) return;
    setLightboxSettings({
      focusDepth: 48,
      clarity: 0,
      overlays: { peaking: true, waveform: true, zebra: false },
    });
  }, [activeImage]);

  useEffect(() => {
    if (activeImageIndex === null) return;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index + 1) % galleryImages.length));
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveImageIndex((index) => (index === null ? null : (index - 1 + galleryImages.length) % galleryImages.length));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeImageIndex, galleryImages.length]);

  const renderAlbumButton = (album) => {
    const meta = albumMeta[album.title] || {
      gradient: 'from-slate-500/80 via-slate-600/70 to-slate-900/80',
      tagline: 'Curated moments',
      icon: Camera,
    };
    const Icon = meta.icon || Camera;
    const isActive = selectedAlbum?.id === album.id;

    return (
      <motion.button
        key={album.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          setSelectedGallery(null);
          setActiveImageIndex(null);
          setSelectedAlbum(album);
        }}
        className={`group text-left rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.75)] p-6 transition-all hover:-translate-y-1 hover:border-white/20 ${
          isActive ? 'outline outline-2 outline-offset-4 outline-green-400/60' : ''
        }`}
      >
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${meta.gradient} flex items-center justify-center`}
        >
          <Icon className="w-16 h-16 text-white/90 drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_65%)]" />
          <div className="absolute bottom-4 left-4 text-xs mono uppercase tracking-[0.4em] text-white/80">Open</div>
        </div>
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">{album.title}</h3>
            {isLoading(album.id) && <Loader2 className="h-5 w-5 animate-spin text-green-300" />}
          </div>
          <p className="text-sm text-[color:var(--text-secondary)]">{meta.tagline}</p>
        </div>
      </motion.button>
    );
  };

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
            {getError(MMM_MEDIA_ROOT) && (
              <div className="text-sm text-rose-300">Unable to load Google Drive albums. Please retry.</div>
            )}
          </div>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {rootFolder ? albumFolders.map(renderAlbumButton) : null}
            {!rootFolder && isLoading(MMM_MEDIA_ROOT) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-green-300" />
              </div>
            )}
          </div>
        </section>

        {selectedAlbum && (
          <section className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedGallery(null);
                    setActiveImageIndex(null);
                    setSelectedAlbum(null);
                  }}
                  className="flex items-center gap-2 text-sm mono text-green-300 hover:text-green-100"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to albums
                </button>
                <h3 className="text-3xl font-semibold">{selectedAlbum.title}</h3>
              </div>
              {getError(selectedAlbum.id) && <div className="text-sm text-rose-300">Unable to load galleries.</div>}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs mono uppercase tracking-[0.35em] text-[color:var(--text-secondary)]">
              <ImageIcon className="h-4 w-4" /> Select a gallery to open photographs. Double-tap outside an image to close.
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
              {galleryFolders.map((gallery) => (
                <button
                  key={gallery.id}
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(null);
                    setSelectedGallery(gallery);
                  }}
                  className={`group rounded-3xl border border-white/10 bg-[rgba(8,10,16,0.78)] p-6 text-left transition-all hover:-translate-y-1 hover:border-white/20 ${
                    selectedGallery?.id === gallery.id ? 'outline outline-2 outline-offset-4 outline-green-400/60' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="mono text-[11px] uppercase tracking-[0.4em] text-white/60">Gallery</p>
                      <p className="text-lg font-semibold text-[color:var(--text-primary)]">{gallery.title}</p>
                    </div>
                    {isLoading(gallery.id) && <Loader2 className="h-5 w-5 animate-spin text-green-300" />}
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--text-secondary)]">Open to browse full-resolution frames.</p>
                </button>
              ))}
              {!galleryFolders.length && isLoading(selectedAlbum.id) && (
                <div className="col-span-full flex h-40 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                  <Loader2 className="h-7 w-7 animate-spin text-green-300" />
                </div>
              )}
            </div>
          </section>
        )}

        {selectedGallery && (
          <section className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setActiveImageIndex(null);
                    setSelectedGallery(null);
                  }}
                  className="flex items-center gap-2 text-sm mono text-green-300 hover:text-green-100"
                >
                  <ArrowLeft className="h-4 w-4" /> Back to galleries
                </button>
                <h4 className="text-2xl font-semibold">{selectedGallery.title}</h4>
              </div>
              {getError(selectedGallery.id) && <div className="text-sm text-rose-300">Unable to load gallery images.</div>}
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryImages.map((image, index) => (
                <motion.button
                  key={image.id}
                  onClick={() => setActiveImageIndex(index)}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/50"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.015 * index }}
                >
                  <div className="relative aspect-square w-full">
                    {image.thumbnail ? (
                      <img
                        src={image.thumbnail}
                        alt={image.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-900 text-white/70">
                        <Camera className="h-10 w-10" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <p className="text-sm font-semibold text-white/90 truncate">{image.title}</p>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>

            {!galleryImages.length && isLoading(selectedGallery.id) && (
              <div className="flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-7 w-7 animate-spin text-green-300" />
              </div>
            )}
          </section>
        )}
      </div>

      <AnimatePresence>
        {activeImage && (
          <BlurLayer
            key={activeImage.id}
            layerId={`lightbox-${activeImage.id}`}
            depth={1680}
            type="interactive"
            lockGestures
            onClose={() => setActiveImageIndex(null)}
            className="fixed left-0 right-0 bottom-0 top-[calc(var(--camera-top-rail-height,112px)+var(--camera-nav-safe-zone,96px))] z-[1850]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.9, scale: 0.98 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden bg-[rgba(6,8,14,0.94)] shadow-[0_40px_120px_rgba(0,0,0,0.65)]"
            >
              <div className="flex flex-1 flex-col lg:flex-row">
                <div className="relative flex-1 min-h-[320px]">
                  <div className="absolute inset-0 flex flex-col gap-6 p-6 lg:p-10">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-semibold text-white/95">{activeImage.title}</h3>
                        <p className="text-sm text-white/70">
                          Gallery {selectedGallery?.title || ''} · Album {selectedAlbum?.title || ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] mono uppercase tracking-[0.35em] text-white/70">
                        <span className="rounded-full bg-white/10 px-3 py-1">
                          Frame {activeImageIndex + 1} / {galleryImages.length}
                        </span>
                      </div>
                    </div>
                    <div className="relative flex-1 overflow-hidden rounded-3xl border border-white/10 bg-black/60">
                      <img
                        src={activeImage.viewUrl || activeImage.thumbnail}
                        alt={activeImage.title}
                        className="h-full w-full object-contain"
                      />
                      {lightboxSettings.overlays.peaking && (
                        <div
                          className="pointer-events-none absolute inset-0"
                          style={{
                            backgroundImage:
                              'repeating-linear-gradient(90deg, rgba(255,80,80,0.18) 0px, rgba(255,80,80,0.18) 6px, transparent 6px, transparent 14px)',
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

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((index) => (index === null ? null : (index - 1 + galleryImages.length) % galleryImages.length))
                    }
                    className="absolute left-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((index) => (index === null ? null : (index + 1) % galleryImages.length))
                    }
                    className="absolute right-6 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </motion.div>
          </BlurLayer>
        )}
      </AnimatePresence>
    </div>
  );
}
