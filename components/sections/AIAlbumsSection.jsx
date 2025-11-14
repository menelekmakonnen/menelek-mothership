import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';
import BlurLayer from '@/components/ui/BlurLayer';
import useDriveFolderCache from '@/hooks/useDriveFolderCache';

const AI_ALBUM_ROOT = '1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4';

function resolveAiRootFolder(rootFolder) {
  if (!rootFolder) return null;
  const folders = rootFolder.items.filter((item) => item.type === 'folder');
  const aiFolder = folders.find((folder) => folder.title.toLowerCase().includes('ai'));
  return aiFolder || folders[0] || null;
}

export default function AIAlbumsSection() {
  const { loadFolder, getFolder, isLoading, getError } = useDriveFolderCache();
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  useEffect(() => {
    loadFolder(AI_ALBUM_ROOT);
  }, [loadFolder]);

  const aiRoot = getFolder(AI_ALBUM_ROOT);
  const aiAlbumsFolder = resolveAiRootFolder(aiRoot);

  useEffect(() => {
    if (!aiAlbumsFolder) return;
    loadFolder(aiAlbumsFolder.id);
  }, [aiAlbumsFolder, loadFolder]);

  const albumEntries = useMemo(() => {
    if (!aiAlbumsFolder) return [];
    const folderData = getFolder(aiAlbumsFolder.id);
    if (!folderData) return [];
    return folderData.items.filter((item) => item.type === 'folder');
  }, [aiAlbumsFolder, getFolder]);

  useEffect(() => {
    if (!selectedAlbum) return;
    loadFolder(selectedAlbum.id);
  }, [selectedAlbum, loadFolder]);

  const selectedAlbumImages = useMemo(() => {
    if (!selectedAlbum) return [];
    const albumData = getFolder(selectedAlbum.id);
    if (!albumData) return [];
    return albumData.items.filter((item) => item.type === 'file');
  }, [getFolder, selectedAlbum]);

  useEffect(() => {
    if (selectedImageIndex === null) return;
    if (!selectedAlbumImages.length) {
      setSelectedImageIndex(null);
    } else if (selectedImageIndex >= selectedAlbumImages.length) {
      setSelectedImageIndex(0);
    }
  }, [selectedAlbumImages, selectedImageIndex]);

  const activeImage = selectedImageIndex !== null ? selectedAlbumImages[selectedImageIndex] : null;

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
                onClick={() => setSelectedAlbum(album)}
                className="group rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.8)] p-6 text-left transition-colors hover:border-white/25"
              >
                <div className="relative mb-5 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/70 via-fuchsia-500/65 to-indigo-600/70">
                  <Sparkles className="h-16 w-16 text-white drop-shadow-[0_15px_30px_rgba(0,0,0,0.45)]" />
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
            {!albumEntries.length && isLoading(aiAlbumsFolder?.id) && (
              <div className="col-span-full flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                <Loader2 className="h-8 w-8 animate-spin text-green-300" />
              </div>
            )}
          </div>
        </section>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <BlurLayer
            key={selectedAlbum.id}
            layerId={`ai-album-${selectedAlbum.id}`}
            depth={1580}
            type="interactive"
            focusOnMount
            lockGestures
            onClose={() => setSelectedAlbum(null)}
            className="fixed left-0 right-0 bottom-0 top-[calc(var(--camera-top-rail-height,112px)+var(--camera-nav-safe-zone,96px))] z-[1850] flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.9, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full max-w-6xl mx-auto px-6 py-10 max-h-[calc(100%-2rem)]"
            >
              <div className="absolute inset-0 rounded-3xl bg-[rgba(8,10,18,0.94)] border border-white/10 shadow-[0_35px_90px_rgba(0,0,0,0.65)]" />
              <div className="relative z-10 flex h-full flex-col gap-6 overflow-hidden">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedAlbum(null)}
                      className="flex items-center gap-2 text-sm mono text-green-300 hover:text-green-100"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back to AI Albums
                    </button>
                    <h2 className="text-4xl font-bold">{selectedAlbum.title}</h2>
                    {getError(selectedAlbum.id) && (
                      <p className="text-sm text-rose-300">Unable to load this album. Please try again shortly.</p>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedAlbum(null)}
                    className="camera-hud rounded-full w-11 h-11 flex items-center justify-center text-sm"
                    aria-label="Close album"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 overflow-y-auto pr-2">
                  {selectedAlbumImages.map((image, index) => (
                    <motion.button
                      key={image.id}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * index }}
                      className="relative aspect-square overflow-hidden rounded-xl border border-white/10 bg-black/50"
                    >
                      {image.thumbnail ? (
                        <img src={image.thumbnail} alt={image.title} className="h-full w-full object-cover" loading="lazy" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-700 text-white/80">
                          <Sparkles className="h-8 w-8" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent opacity-70" />
                      <div className="absolute bottom-2 left-2 right-2 text-xs font-semibold text-white/85 truncate">
                        {image.title}
                      </div>
                    </motion.button>
                  ))}
                </div>

                {!selectedAlbumImages.length && isLoading(selectedAlbum.id) && (
                  <div className="flex flex-1 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
                    <Loader2 className="h-8 w-8 animate-spin text-green-300" />
                  </div>
                )}
              </div>
            </motion.div>
          </BlurLayer>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {activeImage && (
          <BlurLayer
            key={`ai-lightbox-${activeImage.id}`}
            layerId={`ai-lightbox-${activeImage.id}`}
            depth={1880}
            type="interactive"
            lockGestures
            onClose={() => setSelectedImageIndex(null)}
            className="fixed left-0 right-0 bottom-0 top-[calc(var(--camera-top-rail-height,112px)+var(--camera-nav-safe-zone,96px))] z-[1900]"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.9, scale: 0.97 }}
              transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full items-center justify-center bg-[rgba(4,6,12,0.94)]"
            >
              <img
                src={activeImage.viewUrl || activeImage.thumbnail}
                alt={activeImage.title}
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
          </BlurLayer>
        )}
      </AnimatePresence>
    </div>
  );
}
