import { motion } from 'framer-motion';
import { Play, Zap, Compass, Brain } from 'lucide-react';
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

export default function VideoEditsSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Epic Video Edits
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[color:var(--text-secondary)] mb-12"
        >
          Professional video editing and motion graphics
        </motion.p>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {editCollections.map((collection, index) => {
            const Icon = collection.icon;
            const theme = collection.gradient;
            return (
              <motion.div
                key={collection.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                className="rounded-3xl border border-white/10 overflow-hidden bg-[color:var(--surface-raised)]/95 shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
              >
                <div className="relative aspect-video">
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.panel}`} />
                  <div className={`absolute inset-0 bg-gradient-to-br ${theme.halo}`} />
                  <div className="relative z-10 h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <IconBox icon={Icon} gradient={theme.icon} size="md" className="shadow-xl" />
                      <div className="px-3 py-1 rounded-full bg-black/35 backdrop-blur text-[11px] mono uppercase tracking-[0.3em] text-white">
                        {collection.links.length} reels
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-white/85">
                      <div>
                        <p className="mono text-[11px] uppercase tracking-[0.35em] opacity-80">Signature Style</p>
                        <p className="text-sm font-semibold">{collection.title}</p>
                      </div>
                      <div className="rounded-full px-4 py-2 bg-[rgba(10,12,18,0.85)] text-xs mono uppercase tracking-[0.3em]">
                        View Reels
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-semibold text-[color:var(--text-primary)]">{collection.title}</h3>
                  <p className="text-sm leading-relaxed text-[color:var(--text-secondary)]">{collection.description}</p>
                  <div className="max-h-32 overflow-y-auto pr-1 flex flex-col gap-2">
                    {collection.links.map((link, linkIndex) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-xs mono uppercase tracking-[0.3em] text-[color:var(--text-primary)]/80 hover:border-white/25"
                      >
                        <span className="truncate">Clip {linkIndex + 1}</span>
                        <Play className="w-4 h-4" />
                      </a>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
