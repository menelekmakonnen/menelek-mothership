import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Compass, Loader2, Play, Zap } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

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

  const renderClipCard = useCallback(
    (url, index) => {
      const preview = previews[url];
      const image = preview?.data?.image;
      const title = preview?.data?.title || `Clip ${index + 1}`;
      const description = preview?.data?.description;
      const status = preview?.status || 'idle';
      const fallbackStyle = previewFallback[index % previewFallback.length];

      return (
        <a
          key={url}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[rgba(8,10,16,0.82)] shadow-[0_25px_70px_rgba(0,0,0,0.55)] transition-transform hover:-translate-y-2"
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
            <div className="absolute top-3 right-3">
              {status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-white/80" />}
            </div>
            <div className="absolute bottom-0 left-0 right-0 space-y-2 p-4">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-[10px] mono uppercase tracking-[0.4em] text-white/70">
                Reel
              </span>
              <h4 className="text-lg font-semibold text-white line-clamp-2">{title}</h4>
              {description && <p className="text-xs text-white/70 line-clamp-2">{description}</p>}
            </div>
          </div>
        </a>
      );
    },
    [previews]
  );

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
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
            Each reel opens into its Instagram showcase, complete with live thumbnails and metadata pulled straight from the source links.
          </motion.p>
        </header>

        {editCollections.map((collection, index) => {
          const Icon = collection.icon;
          const theme = collection.gradient;
          return (
            <section key={collection.id} className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="rounded-3xl border border-white/10 bg-[rgba(10,12,18,0.85)] shadow-[0_30px_90px_rgba(0,0,0,0.55)]"
              >
                <div className="relative overflow-hidden rounded-t-3xl">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="relative z-10 flex flex-col gap-6 p-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <IconBox icon={Icon} gradient={theme.icon} size="lg" className="shadow-xl" />
                      <div>
                        <p className="mono text-[11px] uppercase tracking-[0.35em] text-white/70">Signature Series</p>
                        <h2 className="text-2xl font-semibold text-white">{collection.title}</h2>
                      </div>
                    </div>
                    <p className="max-w-2xl text-sm text-white/75 md:text-right">{collection.description}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {collection.links.map((url, clipIndex) => renderClipCard(url, clipIndex))}
                  </div>
                </div>
              </motion.div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
