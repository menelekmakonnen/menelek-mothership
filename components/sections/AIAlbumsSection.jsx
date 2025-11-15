import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';
import { resolveDriveImage } from '@/lib/googleDrive';

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

export default function AIAlbumsSection() {
  const { loadFolder, getFolder, isLoading, getError } = useDriveFolderCache();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

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

  useEffect(() => {
    loadFolder(AI_ALBUM_ROOT);
  }, [loadFolder]);

  const aiRoot = getFolder(AI_ALBUM_ROOT);

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
    return aiRoot.items.filter((item) => item.type === 'folder' && /ai/i.test(item.title));
  }, [aiRoot]);

  const albumEntries = useMemo(() => {
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

  useEffect(() => {
    if (!selectedAlbum) return;
    loadFolder(selectedAlbum.id);
  }, [selectedAlbum, loadFolder]);

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

  const preparedAlbumImages = useMemo(() => {
    const albumTitle = selectedAlbum?.title || 'AI Collection';
    return selectedAlbumImages.map((image) => ({
      ...image,
      displayTitle: albumTitle,
      alt: `${albumTitle} created by Menelek Makonnen`,
    }));
  }, [selectedAlbum?.title, selectedAlbumImages]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    if (!preparedAlbumImages.length) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex >= preparedAlbumImages.length) {
      setSelectedImageIndex(0);
    }
  }, [preparedAlbumImages, selectedImageIndex]);

  const activeImage = selectedImageIndex !== null ? preparedAlbumImages[selectedImageIndex] : null;

  useEffect(() => {
    if (selectedAlbum || selectedImageIndex !== null) {
      autoScrollToActiveLayer();
    }
  }, [autoScrollToActiveLayer, selectedAlbum, selectedImageIndex]);

  useEffect(() => {
    if (selectedImageIndex === null || !preparedAlbumImages.length) return;

    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setSelectedImageIndex((index) => {
          if (index === null) return index;
          return (index + 1) % preparedAlbumImages.length;
        });
      } else if (event.key === 'ArrowLeft') {
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

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
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
          <div className="flex items-center justify-between">
            <h2 className="mono text-[12px] uppercase tracking-[0.5em] text-[color:var(--text-secondary)]">Collections</h2>
            {getError(AI_ALBUM_ROOT) && <div className="text-sm text-rose-300">Unable to reach Google Drive right now.</div>}
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
                <div className="relative mb-5 aspect-square overflow-hidden rounded-2xl">
                  {(() => {
                    const albumData = getFolder(album.id);
                    const coverCandidate = albumData?.items.find((item) => item.type === 'file') || null;
                    const cover = getPreviewSrc(coverCandidate) || getPreviewSrc(album);
                    if (cover) {
                      return <img src={cover} alt={`${album.title} cover`} className="h-full w-full object-cover" loading="lazy" />;
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
                  <p className="text-sm text-[color:var(--text-secondary)]">Tap to explore generated frames.</p>
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
        {selectedAlbum && (
          <FullscreenLightbox
            key={selectedAlbum.id}
            layerId={`ai-album-${selectedAlbum.id}`}
            depth={2100}
            onClose={() => setSelectedAlbum(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.97 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-[rgba(6,8,16,0.96)] shadow-[0_45px_120px_rgba(0,0,0,0.65)]"
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
                  {preparedAlbumImages.map((image, index) => (
                    <motion.button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * index }}
                      className="relative aspect-square overflow-hidden rounded-2xl border border-white/12 bg-black/50 shadow-[0_16px_40px_rgba(0,0,0,0.45)]"
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
                    </motion.button>
                  ))}
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
            key={`ai-lightbox-${activeImage.id}`}
            layerId={`ai-lightbox-${activeImage.id}`}
            depth={2300}
            onClose={() => setSelectedImageIndex(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.92, scale: 0.98 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full items-center justify-center rounded-3xl border border-white/10 bg-[rgba(4,6,12,0.96)] p-6 shadow-[0_55px_140px_rgba(0,0,0,0.7)]"
            >
              <img
                src={
                  resolveDriveImage(activeImage.imageVariants || activeImage.variants, 'full') ||
                  activeImage.imageVariants?.full ||
                  activeImage.imageVariants?.preview ||
                  activeImage.viewUrl ||
                  activeImage.downloadUrl ||
                  getPreviewSrc(activeImage)
                }
                alt={activeImage.alt}
                className="max-h-full max-w-full object-contain"
              />
              <button
                type="button"
                onClick={() => setSelectedImageIndex(null)}
                className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Close lightbox"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          </FullscreenLightbox>
        )}
      </AnimatePresence>
    </div>
  );
}
