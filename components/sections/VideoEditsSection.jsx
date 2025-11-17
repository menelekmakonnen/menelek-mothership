import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Brain,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Play,
  X,
  Zap,
  Compass,
} from 'lucide-react';
import IconBox from '@/components/ui/IconBox';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import { parseMediaLink } from '@/lib/mediaLinks';
import { useCameraContext } from '@/context/CameraContext';

const editCollections = [
  {
    id: 'epic-edits',
    title: 'Epic Edits',
    description:
      'High-energy, high-VFX, hyper-stylised reels with fast cuts, punchy transitions, and aggressive motion graphics.',
    icon: Zap,
    gradient: {
      panel: 'from-[#2b1030]/85 via-[#411857]/80 to-[#09020f]/92',
      halo: 'from-fuchsia-200/35 via-purple-200/15 to-transparent',
      icon: 'from-fuchsia-400 to-purple-400',
    },
    links: [
      'https://www.instagram.com/p/DMKpVGwoOC2/',
      'https://www.instagram.com/p/C7TX-jlqQFB/',
      'https://www.instagram.com/reel/C8rQp-kq5PG/',
      'https://www.instagram.com/reel/C8kNL16KIZc/',
      'https://www.instagram.com/reel/C8z0DAtKq8B/',
      'https://www.instagram.com/reel/DFPiXCOo220/',
      'https://www.instagram.com/reel/CIDASf-n6mv/',
    ],
  },
  {
    id: 'beauty-travel',
    title: 'Beauty & Travel',
    description:
      'Soft-power aesthetic reels celebrating black women, glow, and cosmopolitan wanderlust across luxury cityscapes.',
    icon: Compass,
    gradient: {
      panel: 'from-[#142c33]/85 via-[#1f4854]/80 to-[#03080a]/92',
      halo: 'from-teal-200/35 via-cyan-200/15 to-transparent',
      icon: 'from-teal-300 to-cyan-400',
    },
    links: [
      'https://www.instagram.com/reel/C6YtlD2Kbd6/',
      'https://www.instagram.com/reel/C3sDA4AqP5z/',
      'https://www.instagram.com/reel/C-VzUiFqfkm/',
      'https://www.instagram.com/reel/DIx8Dkao7wR/',
      'https://www.instagram.com/reel/DJZC9tpIIOF/',
      'https://www.instagram.com/reel/DEPpHmFIGAl/',
      'https://www.instagram.com/reel/DLfna4ao-z-/',
      'https://www.instagram.com/reel/C7BdCzwqgKo/',
      'https://www.instagram.com/reel/C6JjwNGIKni/',
      'https://www.instagram.com/reel/C5N9JhvK9to/',
      'https://www.instagram.com/reel/C4yA5RKK0zg/',
      'https://www.instagram.com/reel/C4YBtJdqoWr/',
      'https://www.instagram.com/reel/C4LBUi7K9wr/',
      'https://www.instagram.com/reel/C3igTEsqyam/',
    ],
  },
  {
    id: 'bts',
    title: 'BTS & Documentary',
    description:
      'On-set receipts and documentary filmmaking proof that spotlight real clients, trust, and live production energy.',
    icon: Play,
    gradient: {
      panel: 'from-[#0f1f28]/85 via-[#1b3344]/80 to-[#02070b]/92',
      halo: 'from-blue-200/35 via-emerald-200/15 to-transparent',
      icon: 'from-blue-300 to-emerald-400',
    },
    links: [
      'https://www.instagram.com/reel/CthPmc7OKK5/',
      'https://www.instagram.com/reel/CtjWyXJNxwY/',
      'https://www.instagram.com/reel/Ctlc7--veax/',
      'https://www.instagram.com/reel/Ctn4hRENjQW/',
      'https://www.instagram.com/reel/Cttvmy2AdWU/',
      'https://www.instagram.com/reel/Cue_nHag-QS/',
      'https://www.instagram.com/reel/CuhtdZYMwWj/',
      'https://www.instagram.com/reel/C69G68OPF5N/',
      'https://www.instagram.com/reel/C7KeP-sIHBk/',
      'https://www.instagram.com/reel/DFNRIRqoFH_/',
      'https://www.instagram.com/reel/DFPiY-Do1z0/',
    ],
  },
  {
    id: 'ai-learning',
    title: 'AI & Learning',
    description:
      'Clean demos and polished voiceovers that position you as an AI educator for corporate, schools, and consulting engagements.',
    icon: Brain,
    gradient: {
      panel: 'from-[#1a1934]/85 via-[#252b57]/80 to-[#04030b]/92',
      halo: 'from-indigo-200/35 via-blue-200/15 to-transparent',
      icon: 'from-indigo-300 to-cyan-400',
    },
    links: [
      'https://www.instagram.com/reel/DK1bY8couuK/',
      'https://www.instagram.com/reel/DK4gIZtNB-U/',
      'https://www.instagram.com/reel/DIvxSY9tQio/',
      'https://www.instagram.com/reel/DLAbo5mtbC2/',
      'https://www.instagram.com/reel/C5oZNM5KF77/',
      'https://www.instagram.com/reel/C5fciTUqXBR/',
      'https://www.instagram.com/reel/C5c74nYKdI2/',
      'https://www.instagram.com/reel/DMzghyEtXu1/',
    ],
  },
];

const previewFallback = [
  'linear-gradient(135deg, rgba(63,94,251,0.45) 0%, rgba(252,70,107,0.45) 100%)',
  'linear-gradient(135deg, rgba(14,164,212,0.45) 0%, rgba(55,238,207,0.45) 100%)',
  'linear-gradient(135deg, rgba(92,59,206,0.45) 0%, rgba(162,121,241,0.45) 100%)',
];

export default function VideoEditsSection() {
  const [previews, setPreviews] = useState({});
  const initiatedRef = useRef(new Set());
  const [openSectionId, setOpenSectionId] = useState(editCollections[0]?.id || null);
  const [activeSectionId, setActiveSectionId] = useState(null);
  const [activeClipIndex, setActiveClipIndex] = useState(null);
  const sectionRefs = useRef({});
  const initialScrollHandledRef = useRef(false);
  const {
    registerGalleriaSection,
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
    const urls = editCollections.flatMap((collection) => collection.links);
    urls.forEach((url) => {
      if (initiatedRef.current.has(url)) return;
      initiatedRef.current.add(url);
      setPreviews((prev) => ({ ...prev, [url]: { status: 'loading' } }));
      (async () => {
        try {
          const response = await fetch(`/api/link-preview?url=${encodeURIComponent(url)}`);
          if (!response.ok) {
            throw new Error('Failed to load preview');
          }
          const data = await response.json();
          setPreviews((prev) => ({ ...prev, [url]: { status: 'ready', data } }));
        } catch (error) {
          console.error('Preview fetch failed for', url, error);
          setPreviews((prev) => ({ ...prev, [url]: { status: 'error' } }));
        }
      })();
    });
  }, []);

  const closeQuickView = useCallback(() => {
    setActiveSectionId(null);
    setActiveClipIndex(null);
  }, []);

  const openQuickView = useCallback(
    (sectionId, index) => {
      setActiveSectionId(sectionId);
      setActiveClipIndex(index);
      scrollToActiveLayer();
    },
    [scrollToActiveLayer]
  );

  const openDefaultCollection = useCallback(() => {
    const defaultCollection = editCollections[0];
    if (defaultCollection) {
      openQuickView(defaultCollection.id, 0);
    }
  }, [openQuickView]);

  useEffect(() => {
    const unregister = registerGalleriaSection('video-edits', {
      label: 'Epic Video Edits',
      openDefault: openDefaultCollection,
    });
    return unregister;
  }, [openDefaultCollection, registerGalleriaSection]);

  useEffect(() => {
    if (activeSectionId !== null) {
      engageGalleriaSection('video-edits', closeQuickView);
      return () => releaseGalleriaSection('video-edits');
    }
    return undefined;
  }, [activeSectionId, closeQuickView, engageGalleriaSection, releaseGalleriaSection]);

  const activeCollection = useMemo(
    () => editCollections.find((collection) => collection.id === activeSectionId) || null,
    [activeSectionId]
  );

  const activeLinks = activeCollection?.links || [];

  const handleClipWheel = useCallback(
    (direction) => {
      if (activeClipIndex === null || !activeLinks.length) return;
      setActiveClipIndex((index) => {
        if (index === null) return index;
        if (direction === 'next') {
          return (index + 1) % activeLinks.length;
        }
        return (index - 1 + activeLinks.length) % activeLinks.length;
      });
    },
    [activeClipIndex, activeLinks.length]
  );

  useEffect(() => {
    if (!activeCollection) return;
    if (activeClipIndex === null) {
      setActiveClipIndex(0);
      return;
    }
    if (activeClipIndex >= activeLinks.length) {
      setActiveClipIndex(0);
    }
  }, [activeCollection, activeClipIndex, activeLinks.length]);

  useEffect(() => {
    if (activeSectionId === null || activeClipIndex === null) return;

    const handleKeyDown = (event) => {
      if (!activeCollection) return;
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        setActiveClipIndex((index) => ((index ?? 0) + 1) % activeLinks.length);
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault();
        setActiveClipIndex((index) => ((index ?? activeLinks.length) - 1 + activeLinks.length) % activeLinks.length);
      } else if (event.key === 'Escape') {
        event.preventDefault();
        closeQuickView();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSectionId, activeClipIndex, activeCollection, activeLinks.length, closeQuickView]);

  useEffect(() => {
    if (activeSectionId && activeClipIndex !== null) {
      scrollToActiveLayer();
    }
  }, [activeSectionId, activeClipIndex, scrollToActiveLayer]);

  const handleSectionToggle = useCallback(
    (sectionId) => {
      setOpenSectionId((prev) => {
        const next = prev === sectionId ? null : sectionId;
        if (next === null || (activeSectionId && activeSectionId !== next)) {
          closeQuickView();
        }
        return next;
      });
    },
    [activeSectionId, closeQuickView]
  );

  useEffect(() => {
    if (!openSectionId) return;
    if (!sectionRefs.current[openSectionId]) return;
    if (!initialScrollHandledRef.current) {
      initialScrollHandledRef.current = true;
      return;
    }
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      try {
        sectionRefs.current[openSectionId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } catch (error) {
        sectionRefs.current[openSectionId]?.scrollIntoView();
      }
    });
  }, [openSectionId]);

  const getClipPreview = useCallback(
    (url, collection, index) => {
      const preview = previews[url];
      const mediaMeta = parseMediaLink(url);
      const fallbackImage = mediaMeta?.thumbnailUrl || null;
      const title = preview?.data?.title || `${collection.title} · Clip ${index + 1}`;
      const description =
        preview?.data?.description || collection.description || 'Tap to explore this reel inside the camera viewer.';

      return {
        title,
        description,
        image: preview?.data?.image || fallbackImage,
        status: preview?.status || (fallbackImage ? 'fallback' : 'idle'),
        media: mediaMeta,
      };
    },
    [previews]
  );

  const renderClipCard = useCallback(
    (collection, url, index) => {
      const { title, description, image, status } = getClipPreview(url, collection, index);
      const fallbackStyle = previewFallback[index % previewFallback.length];

      return (
        <motion.button
          key={url}
          type="button"
          onClick={() => openQuickView(collection.id, index)}
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.03 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,10,16,0.82)] shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--accent-400)]"
        >
          <div className="relative aspect-[4/5] w-full overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                background: image ? undefined : fallbackStyle,
                backgroundImage: image ? `url(${image})` : undefined,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-white/80" />}
              {status === 'fallback' && (
                <span className="rounded-full bg-black/60 px-2 py-1 text-[9px] mono uppercase tracking-[0.4em] text-white/70">
                  Live
                </span>
              )}
            </div>
            <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4 text-left">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] mono uppercase tracking-[0.4em] text-white/70">
                Reel
              </span>
              <h4 className="text-lg font-semibold text-white line-clamp-2">{title}</h4>
              {description && <p className="text-xs text-white/70 line-clamp-2">{description}</p>}
            </div>
          </div>
        </motion.button>
      );
    },
    [getClipPreview, openQuickView]
  );

  const renderQuickView = () => {
    if (!activeCollection || activeClipIndex === null) return null;
    const clipUrl = activeLinks[activeClipIndex];
    const clipMeta = clipUrl ? getClipPreview(clipUrl, activeCollection, activeClipIndex) : null;
    const embedUrl = clipMeta?.media?.embedUrl;
    const provider = clipMeta?.media?.provider || 'unknown';
    const isVertical = provider === 'instagram' || /reel/i.test(clipUrl || '');
    const aspectClass = isVertical ? 'aspect-[9/16]' : 'aspect-video';
    const playerShellClass = isVertical
      ? 'mx-auto w-full max-w-sm sm:max-w-md lg:max-w-[420px]'
      : 'w-full max-w-4xl';

    const clipEntries = activeLinks.map((url, index) => ({
      url,
      index,
      meta: getClipPreview(url, activeCollection, index),
    }));

    return (
      <FullscreenLightbox
        key={`${activeCollection.id}-clip-${activeClipIndex}`}
        layerId={`video-edit-${activeCollection.id}`}
        depth={5200}
        onClose={closeQuickView}
        innerClassName="p-0 overflow-hidden"
        galleriaSectionId="video-edits"
        showGalleriaChrome
        onWheelNavigate={handleClipWheel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.9, scale: 0.96 }}
          transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
          className="relative flex h-full w-full flex-col overflow-hidden border border-white/10 bg-[rgba(6,8,14,0.96)] shadow-[0_50px_140px_rgba(0,0,0,0.7)]"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 px-6 py-5">
            <div className="space-y-1">
              <button
                type="button"
                onClick={closeQuickView}
                className="flex items-center gap-2 text-xs mono uppercase tracking-[0.35em] text-green-300 hover:text-green-100"
              >
                <ArrowLeft className="h-4 w-4" /> Back to reels
              </button>
              <h2 className="text-2xl font-semibold text-white">{activeCollection.title}</h2>
              <p className="text-sm text-white/65">{activeCollection.description}</p>
            </div>
            <button
              type="button"
              onClick={closeQuickView}
              className="camera-hud flex h-11 w-11 items-center justify-center rounded-full"
              aria-label="Close quick view"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden">
              <div className="flex h-full flex-col overflow-y-auto px-6 pb-6 pt-4 lg:flex-row lg:gap-6">
                <div className="flex flex-1 items-center justify-center">
                <div className={`relative ${playerShellClass}`}>
                  <div
                    className={`relative w-full ${aspectClass} ${isVertical ? 'max-h-[72vh]' : 'max-h-[80vh]'} overflow-hidden rounded-[28px] border border-white/10 bg-black/80 shadow-[0_40px_110px_rgba(0,0,0,0.6)]`}
                  >
                    {embedUrl ? (
                      <iframe
                        key={embedUrl}
                        src={`${embedUrl}${provider === 'youtube' ? '?autoplay=1&rel=0' : ''}`}
                        className="absolute inset-0 h-full w-full"
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                        title={clipMeta?.title || 'Video playback'}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-700 to-slate-900 text-white/70"
                        style={{
                          backgroundImage: clipMeta?.image ? `url(${clipMeta.image})` : undefined,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      >
                        {!clipMeta?.image && <Play className="h-14 w-14" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <aside className="flex w-full flex-col gap-6 border-t border-white/10 bg-[rgba(10,12,20,0.88)] p-6 lg:w-[320px] lg:border-t-0 lg:border-l xl:w-[360px]">
                <div className="space-y-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] mono uppercase tracking-[0.4em] text-white/70">
                    {provider === 'youtube' ? 'YouTube' : provider === 'instagram' ? 'Instagram' : 'Clip'}
                    <span className="rounded-full bg-white/10 px-2 py-[2px] text-[9px] mono">
                      {activeClipIndex + 1} / {activeLinks.length}
                    </span>
                  </span>
                  <h3 className="text-xl font-semibold text-white">{clipMeta?.title}</h3>
                  {clipMeta?.description && (
                    <p className="text-sm text-white/70 leading-relaxed">{clipMeta.description}</p>
                  )}
                </div>
                <div className="space-y-3">
                  <h3 className="mono text-[11px] uppercase tracking-[0.45em] text-white/55">Collection Clips</h3>
                  <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory">
                    {clipEntries.map((entry) => {
                      const isCurrent = entry.index === activeClipIndex;
                      const entryThumb = entry.meta?.image;
                      return (
                        <button
                          key={entry.index}
                          type="button"
                          onClick={() => setActiveClipIndex(entry.index)}
                          className={`min-w-[220px] snap-start flex items-center gap-3 rounded-2xl border px-3 py-2 transition-all ${
                            isCurrent
                              ? 'border-white/45 bg-white/12 text-white'
                              : 'border-white/12 bg-white/5 text-white/70 hover:border-white/35'
                          }`}
                        >
                          <div className="relative h-16 w-24 overflow-hidden rounded-xl bg-black/35">
                            {entryThumb ? (
                              <img src={entryThumb} alt={entry.meta?.title || `Clip ${entry.index + 1}`} className="h-full w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-white/60">
                                <Play className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0 text-left">
                            <p className="mono text-[10px] uppercase tracking-[0.35em] text-white/60">Clip {entry.index + 1}</p>
                            <p className="text-sm font-semibold text-white/85 truncate">{entry.meta?.title || activeCollection.title}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={closeQuickView}
                    className="camera-hud flex items-center gap-2 rounded-full px-4 py-2 text-xs mono uppercase tracking-[0.35em]"
                  >
                    Close
                  </button>
                  {clipUrl && (
                    <a
                      href={clipUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs mono uppercase tracking-[0.35em] text-white/80 hover:text-white"
                    >
                      View on platform
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </aside>
            </div>
          </div>
        </motion.div>
      </FullscreenLightbox>
    );
  };

  return (
    <div className="w-full min-h-screen px-6 sm:px-8 lg:px-10 pt-32 pb-32">
      <div className="max-w-7xl mx-auto space-y-12">
        <header className="space-y-4">
          <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold">
            Epic Video Edits
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="text-xl text-[color:var(--text-secondary)] max-w-3xl"
          >
            Each category unfolds live reels from Instagram — open a set to enter the in-camera quick view, then scrub through clips with your keyboard or on-screen controls.
          </motion.p>
        </header>

        <div className="space-y-10">
          {editCollections.map((collection, sectionIndex) => {
            const collapsed = openSectionId !== collection.id;
            return (
              <motion.section
                key={collection.id}
                ref={(node) => {
                  if (node) {
                    sectionRefs.current[collection.id] = node;
                  } else {
                    delete sectionRefs.current[collection.id];
                  }
                }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * sectionIndex }}
                className="overflow-hidden rounded-3xl border border-white/10 bg-[color:var(--surface-raised)]/85 shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              >
                <button
                  type="button"
                  onClick={() => handleSectionToggle(collection.id)}
                  className="relative flex w-full items-center justify-between gap-3 bg-gradient-to-br from-white/5 via-white/0 to-white/5 px-6 py-5 text-left transition-colors hover:bg-white/10"
                >
                  <div className="flex items-center gap-4">
                    <IconBox icon={collection.icon} gradient={collection.gradient.icon} size="sm" />
                    <div>
                      <h2 className="text-xl font-semibold text-white">{collection.title}</h2>
                      <p className="text-sm text-white/70 max-w-2xl">{collection.description}</p>
                    </div>
                  </div>
                  <motion.div animate={{ rotate: collapsed ? -90 : 0 }} transition={{ duration: 0.24, ease: [0.4, 0, 0.2, 1] }}>
                    <ChevronDown className="h-6 w-6 text-white/70" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.div
                      key="section-content"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                      className="px-6 pb-6"
                    >
                      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {collection.links.map((url, index) => renderClipCard(collection, url, index))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.section>
            );
          })}
        </div>
      </div>

      <AnimatePresence>{renderQuickView()}</AnimatePresence>
    </div>
  );
}
