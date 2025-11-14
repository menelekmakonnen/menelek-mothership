import { motion } from 'framer-motion';

const linkGroups = [
  {
    id: 'personal-socials',
    title: '🌍 Personal Socials',
    description: 'Follow Menelek’s day-to-day voice, perspective, and authentic creative life.',
    accent: {
      panel: 'from-[#161b32]/85 via-[#202c4a]/78 to-[#03050a]/92',
      halo: 'from-blue-200/30 via-indigo-200/12 to-transparent',
    },
    items: [
      {
        label: 'Instagram',
        meta: '@menelek.makonnen',
        description: 'Personal photography, filmmaking notes, and life moments.',
        href: 'https://instagram.com/menelek.makonnen',
      },
      {
        label: 'YouTube',
        meta: '@menelekmakonnen',
        description: 'Films, essays, and behind-the-scenes drops.',
        href: 'https://youtube.com/@menelekmakonnen',
      },
      {
        label: 'LinkedIn',
        meta: 'menelekmakonnen',
        description: 'Professional profile and collaborations.',
        href: 'https://linkedin.com/in/menelekmakonnen',
      },
      {
        label: 'Email',
        meta: 'admin@menelekmakonnen.com',
        description: 'Direct contact for speaking and inquiries.',
        href: 'mailto:admin@menelekmakonnen.com',
      },
    ],
  },
  {
    id: 'professional-socials',
    title: '🏢 Professional & Brand Pages',
    description: 'The director’s studio ecosystem — production brands, education arms, and corporate presence.',
    accent: {
      panel: 'from-[#2e1a30]/85 via-[#48263f]/78 to-[#0a040c]/92',
      halo: 'from-rose-200/30 via-amber-200/12 to-transparent',
    },
    items: [
      {
        label: 'Director YouTube',
        meta: '@director_menelek',
        description: 'Director-level reels and flagship edits.',
        href: 'https://www.youtube.com/@director_menelek',
      },
      {
        label: 'Director Instagram',
        meta: '@menelek.makonnen',
        description: 'Set life, directing, and cinematic stills.',
        href: 'https://www.instagram.com/menelek.makonnen/',
      },
      {
        label: 'Loremaker Instagram',
        meta: '@lore.maker',
        description: 'Immersive lore drops and world-building visuals.',
        href: 'https://www.instagram.com/lore.maker',
      },
      {
        label: 'ICUNI Instagram',
        meta: '@icuni_',
        description: 'AI education and Starterclass community.',
        href: 'https://www.instagram.com/icuni_',
      },
      {
        label: 'MMM Media Instagram',
        meta: '@mm.m.media',
        description: 'Commercial production house portfolio.',
        href: 'https://www.instagram.com/mm.m.media/',
      },
      {
        label: 'AI Educator Instagram',
        meta: '@mr.mikaelgabriel',
        description: 'Corporate AI educator persona.',
        href: 'https://www.instagram.com/mr.mikaelgabriel/',
      },
      {
        label: 'Corporate LinkedIn',
        meta: 'Mikael Gabriel',
        description: 'Business-facing updates and partnerships.',
        href: 'https://www.linkedin.com/in/mikaelgabriel/',
      },
    ],
  },
  {
    id: 'websites',
    title: '🌐 Websites',
    description: 'Flagship platforms and archived storytelling hubs.',
    accent: {
      panel: 'from-[#1b2234]/85 via-[#273553]/78 to-[#05060c]/92',
      halo: 'from-indigo-200/30 via-slate-200/12 to-transparent',
    },
    items: [
      {
        label: 'Loremaker Universe',
        meta: 'loremaker.cloud',
        description: 'Home for the transmedia lore universe.',
        href: 'https://loremaker.cloud',
      },
      {
        label: 'Starterclass',
        meta: 'starterclass.icuni.org',
        description: 'AI Starterclass by ICUNI.',
        href: 'https://starterclass.icuni.org',
      },
      {
        label: 'Old Blog',
        meta: 'wordpress.com/mikaelgabriel',
        description: 'Legacy essays and archives.',
        href: 'https://wordpress.com/mikaelgabriel',
      },
    ],
  },
];

const isExternalLink = (href) => /^https?:/i.test(href);

export default function LinksSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold text-center mb-4"
        >
          Connect With Me
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[color:var(--text-secondary)] text-center mb-16"
        >
          Films, socials, and knowledge hubs across the Menelek universe.
        </motion.p>

        <div className="grid gap-6">
          {linkGroups.map((group, groupIndex) => (
            <motion.section
              key={group.id}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * groupIndex }}
              className="rounded-3xl border border-white/10 overflow-hidden bg-[color:var(--surface-raised)]/95 shadow-[0_25px_60px_rgba(0,0,0,0.55)]"
            >
              <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-br ${group.accent.panel}`} />
                <div className={`absolute inset-0 bg-gradient-to-br ${group.accent.halo}`} />
                <div className="relative z-10 p-6 md:p-8">
                  <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">{group.title}</h2>
                  <p className="text-sm md:text-base text-white/70 max-w-3xl">{group.description}</p>
                </div>
              </div>
              <div className="p-6 md:p-8 bg-[color:var(--surface-raised)]">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {group.items.map((item) => {
                    const external = isExternalLink(item.href);
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target={external ? '_blank' : undefined}
                        rel={external ? 'noopener noreferrer' : undefined}
                        className="group flex flex-col gap-2 rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5 transition-all hover:border-white/25"
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-[color:var(--text-primary)]">{item.label}</h3>
                            {item.meta && (
                              <p className="mono text-[11px] uppercase tracking-[0.3em] text-[color:var(--text-tertiary)]">{item.meta}</p>
                            )}
                          </div>
                          <span className="text-xs mono uppercase tracking-[0.3em] text-[color:var(--text-secondary)] group-hover:text-[color:var(--accent-300)]">
                            Visit
                          </span>
                        </div>
                        {item.description && (
                          <p className="text-sm text-[color:var(--text-secondary)] leading-relaxed">{item.description}</p>
                        )}
                      </a>
                    );
                  })}
                </div>
              </div>
            </motion.section>
          ))}
        </div>
      </div>
    </div>
  );
}
