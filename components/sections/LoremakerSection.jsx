import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, Loader2, X } from 'lucide-react';
import BlurLayer from '@/components/ui/BlurLayer';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import { resolveDriveImage } from '@/lib/googleDrive';

const LOREMAKER_URL = 'https://loremaker.cloud';

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function LoremakerSection() {
  const [characters, setCharacters] = useState([]);
  const [displayedCharacters, setDisplayedCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCharacter, setActiveCharacter] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

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
    let isMounted = true;
    (async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/loremaker-characters');
        if (!response.ok) {
          throw new Error('Failed to load characters');
        }
        const data = await response.json();
        if (!isMounted) return;
        setCharacters(data.characters || []);
      } catch (err) {
        console.error('Failed to load Loremaker roster', err);
        if (isMounted) {
          setError('Unable to load characters right now.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!characters.length) {
      setDisplayedCharacters([]);
      return;
    }
    setDisplayedCharacters(shuffle(characters).slice(0, 12));
  }, [characters]);

  useEffect(() => {
    if (!activeCharacter) return;
    const handleKeyDown = (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveImageIndex((index) =>
          !activeCharacter?.galleryImages?.length
            ? index
            : (index + 1) % activeCharacter.galleryImages.length
        );
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveImageIndex((index) =>
          !activeCharacter?.galleryImages?.length
            ? index
            : (index - 1 + activeCharacter.galleryImages.length) % activeCharacter.galleryImages.length
        );
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCharacter]);

  const activeImage = useMemo(() => {
    if (!activeCharacter) return null;
    const galleryAsset = activeCharacter.galleryImages?.[activeImageIndex] || null;
    if (galleryAsset) {
      return (
        resolveDriveImage(galleryAsset.variants, 'full') ||
        galleryAsset.full ||
        galleryAsset.preview ||
        galleryAsset.view ||
        galleryAsset.thumb
      );
    }
    return (
      resolveDriveImage(activeCharacter.coverVariants, 'full') ||
      activeCharacter.coverImageFull ||
      activeCharacter.coverImage ||
      null
    );
  }, [activeCharacter, activeImageIndex]);

  const openCharacter = useCallback(
    (character) => {
      setActiveCharacter(character);
      setActiveImageIndex(0);
      scrollToActiveLayer();
    },
    [scrollToActiveLayer]
  );

  useEffect(() => {
    if (activeCharacter) {
      scrollToActiveLayer();
    }
  }, [activeCharacter, scrollToActiveLayer]);

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold">
            Loremaker Universe
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-xl text-[color:var(--text-secondary)] max-w-3xl"
          >
            Randomised vignettes from the living Loremaker roster. Each hero includes live gallery pulls direct from the shared
            universe bible.
          </motion.p>
        </header>

        {error && <div className="rounded-3xl border border-rose-400/40 bg-rose-500/10 p-4 text-rose-200">{error}</div>}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayedCharacters.map((character, index) => (
            <motion.button
              key={`${character.id}-${index}`}
              type="button"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * index }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-[rgba(8,10,16,0.78)] text-left shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              onClick={() => openCharacter(character)}
            >
              {(() => {
                const cover =
                  resolveDriveImage(character.coverVariants, 'preview') ||
                  character.coverImage ||
                  character.coverImageFull;
                return (
                  <div className="relative aspect-[3/4] w-full overflow-hidden">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: cover ? `url(${cover})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundColor: cover ? undefined : 'rgba(20,24,32,0.85)',
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 space-y-1">
                      <p className="text-lg font-semibold text-white">{character.character}</p>
                      {character.alias && (
                        <p className="text-xs uppercase mono tracking-[0.35em] text-white/65">{character.alias}</p>
                      )}
                    </div>
                  </div>
                );
              })()}
              <div className="p-4 space-y-3">
                <p className="text-sm text-[color:var(--text-secondary)] line-clamp-3">
                  {character.shortDescription || character.longDescription || 'Character dossier from the Loremaker Universe.'}
                </p>
                <div className="flex flex-wrap gap-2 text-[10px] uppercase mono tracking-[0.35em] text-white/60">
                  {character.alignment && <span className="rounded-full border border-white/15 px-3 py-1">{character.alignment}</span>}
                  {character.faction && <span className="rounded-full border border-white/15 px-3 py-1">{character.faction}</span>}
                  {character.era && <span className="rounded-full border border-white/15 px-3 py-1">{character.era}</span>}
                </div>
                <div className="text-xs text-green-300 opacity-0 transition-opacity group-hover:opacity-100">
                  Open dossier →
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {loading && (
          <div className="flex h-48 items-center justify-center rounded-3xl border border-white/10 bg-black/40">
            <Loader2 className="h-7 w-7 animate-spin text-green-300" />
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center text-sm text-[color:var(--text-secondary)]"
        >
          Characters rotate on each visit. Explore the full archive on the Loremaker Universe site.
        </motion.div>
      </div>

      <AnimatePresence>
        {activeCharacter && (
          <FullscreenLightbox
            key={activeCharacter.id}
            layerId={`loremaker-${activeCharacter.id}`}
            depth={2650}
            onClose={() => setActiveCharacter(null)}
            innerClassName="p-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0.9, scale: 0.96 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(8,10,18,0.96)] shadow-[0_55px_140px_rgba(0,0,0,0.7)]"
            >
              <div className="flex flex-1 flex-col lg:flex-row">
                <div className="relative flex-1 min-h-[320px]">
                  {activeImage ? (
                    <img src={activeImage} alt={activeCharacter.character} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-black/50 text-white/60">No image</div>
                  )}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <h3 className="text-3xl font-semibold text-white">{activeCharacter.character}</h3>
                        {activeCharacter.alias && (
                          <p className="text-sm uppercase mono tracking-[0.35em] text-white/70">{activeCharacter.alias}</p>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <a
                          href={LOREMAKER_URL}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white hover:bg-white/15"
                        >
                          Visit Loremaker
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  </div>
                  {activeCharacter.galleryImages?.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2">
                      {activeCharacter.galleryImages.map((image, idx) => (
                        <button
                          key={image.id || idx}
                          type="button"
                          onClick={() => setActiveImageIndex(idx)}
                          className={`h-2 w-6 rounded-full border border-white/40 transition-all ${
                            idx === activeImageIndex ? 'bg-white/80' : 'bg-white/30 hover:bg-white/50'
                          }`}
                          aria-label={`Show image ${idx + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
                <aside className="w-full max-h-full overflow-y-auto border-t border-white/10 bg-black/45 p-6 lg:w-[360px] lg:border-l lg:border-t-0">
                  <div className="space-y-4 text-sm text-[color:var(--text-secondary)]">
                    {activeCharacter.shortDescription && <p>{activeCharacter.shortDescription}</p>}
                    {!activeCharacter.shortDescription && activeCharacter.longDescription && <p>{activeCharacter.longDescription}</p>}
                    <div className="grid grid-cols-2 gap-3 text-xs uppercase mono tracking-[0.35em] text-white/60">
                      {[
                        ['Alignment', activeCharacter.alignment],
                        ['Location', activeCharacter.location],
                        ['Era', activeCharacter.era],
                        ['Status', activeCharacter.status],
                      ]
                        .filter(([, value]) => value)
                        .map(([label, value]) => (
                          <div key={label} className="rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                            <div className="text-[10px] text-white/50">{label}</div>
                            <div className="text-[color:var(--text-primary)]/85 text-xs normal-case tracking-normal">{value}</div>
                          </div>
                        ))}
                    </div>
                    {activeCharacter.powers && (
                      <div>
                        <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-2">Abilities</h4>
                        <p>{activeCharacter.powers}</p>
                      </div>
                    )}
                    {activeCharacter.stories && (
                      <div>
                        <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-2">Stories</h4>
                        <p>{activeCharacter.stories}</p>
                      </div>
                    )}
                  </div>
                </aside>
              </div>

              <button
                type="button"
                onClick={() => setActiveCharacter(null)}
                className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                aria-label="Close character"
              >
                <X className="h-4 w-4" />
              </button>

              {activeCharacter.galleryImages?.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImageIndex((index) =>
                        !activeCharacter.galleryImages?.length
                          ? index
                          : (index - 1 + activeCharacter.galleryImages.length) % activeCharacter.galleryImages.length
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
                        !activeCharacter.galleryImages?.length
                          ? index
                          : (index + 1) % activeCharacter.galleryImages.length
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
