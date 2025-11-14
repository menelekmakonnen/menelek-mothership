import { motion } from 'framer-motion';

const linkGroups = [
  {
    id: 'films',
    title: '🎬 Films (with descriptions)',
    description: 'Award-ready shorts, features, and documentaries that define the Menelek visual language.',
    accent: {
      panel: 'from-[#2a1236]/85 via-[#3d2060]/78 to-[#08030f]/92',
      halo: 'from-purple-200/35 via-indigo-200/12 to-transparent',
    },
    items: [
      {
        label: "I'm Alright (2024)",
        meta: 'Writer–Director · 8 min',
        description: 'A raw psychological short about addiction and depression during the lockdown.',
        href: 'https://www.youtube.com/watch?v=A8cGpNe2JAE&pp=ygUTbWVuZWxlayBJJ20gYWxyaWdodA%3D%3D',
      },
      {
        label: 'Blinded by Magic (2022)',
        meta: 'Writer–Director · 12 min',
        description: 'A cursed camera grants visions and powers — at the cost of the user’s sight.',
        href: 'https://www.youtube.com/watch?v=ivsCBuD1JYQ&pp=ygUYbWVuZWxlayBibGluZGVkIGJ5IG1hZ2lj',
      },
      {
        label: 'Heroes & Gods (2024)',
        meta: 'Writer–Director, Editor · 120 min',
        description: 'Ten-part anthology fused into a feature film — gods, vengeance, superheroes, lore foundations.',
        href: 'https://www.youtube.com/watch?v=jtiOv0OvD-0&pp=ygUXbWVuZWxlayBoZXJvZXMgYW5kIGdvZHM%3D',
      },
      {
        label: 'SPAR (Doc, 2024)',
        meta: 'Director, Cinematographer, Editor · 14 min',
        description: 'BTS-style boxing pilot documentary shot in London’s Left Hook Gym.',
        href: 'https://www.youtube.com/watch?v=4q6X6prhVOE',
      },
      {
        label: 'Soldier (Music Video)',
        meta: 'Director, Editor · 3 min',
        description: 'Full-cycle creative direction — concept, video, cover art.',
        href: 'https://www.youtube.com/watch?v=BHPaJieCAXY&pp=ygUMd29udSBzb2xkaWVy0gcJCfsJAYcqIYzv',
      },
      {
        label: 'Abranteers (Proof, 2023)',
        meta: 'Writer–Director · 9 min',
        description: 'Anti-magic vet + rookie take on a dangerous magic user.',
        href: 'https://www.youtube.com/shorts/CPPkq5zsXgE',
      },
    ],
  },
  {
    id: 'novel',
    title: '📘 Novel',
    description: 'Author of The Last Ochiyamie — experience the prose world-building that fuels the visuals.',
    accent: {
      panel: 'from-[#122633]/85 via-[#1e3d4d]/78 to-[#02080c]/92',
      halo: 'from-teal-200/35 via-cyan-200/12 to-transparent',
    },
    items: [
      {
        label: 'The Last Ochiyamie',
        meta: 'Amazon Release',
        description: 'Purchase the novel and dive into the universe in print.',
        href: 'https://a.co/d/iG5DOBk',
      },
    ],
  },
  {
    id: 'personal-socials',
    title: '🌍 Personal Socials',
    description: 'Follow Menelek’s personal voice, art, and day-to-day updates.',
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
    description: 'The director’s studio ecosystem — brand channels, companies, and corporate presence.',
    accent: {
      panel: 'from-[#2e1a30]/85 via-[#48263f]/78 to-[#0a040c]/92',
      halo: 'from-rose-200/30 via-amber-200/12 to-transparent',
    },
    items: [
      {
        label: 'Director YouTube',
        meta: '@director_menelek',
        description: 'Director-level reels and projects.',
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
  {
    id: 'albums',
    title: '📸 Albums & Libraries',
    description: 'High-resolution galleries and AI concept vaults.',
    accent: {
      panel: 'from-[#311631]/85 via-[#482244]/78 to-[#0b050d]/92',
      halo: 'from-rose-200/30 via-violet-200/12 to-transparent',
    },
    items: [
      {
        label: 'MMM Media Albums',
        meta: 'Google Drive',
        description: 'Beauty & professional shoots organised by shoot date and gallery.',
        href: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
      },
      {
        label: 'AI Albums',
        meta: 'Google Drive',
        description: 'AI-generated galleries by theme — ready for case studies and decks.',
        href: 'https://drive.google.com/drive/folders/1G_6TgOtftLKwqRWjH-tFLuCgp_Oydor4?usp=sharing',
      },
    ],
  },
  {
    id: 'database',
    title: '📊 Loremaker Universe Database',
    description: 'The central spreadsheet for characters, timelines, factions, and lore assets.',
    accent: {
      panel: 'from-[#132830]/85 via-[#1e3e4a]/78 to-[#03090c]/92',
      halo: 'from-cyan-200/30 via-emerald-200/12 to-transparent',
    },
    items: [
      {
        label: 'Universe Spreadsheet',
        meta: 'Google Sheets',
        description: 'Character bios, powers, locations, galleries, and story references.',
        href: 'https://docs.google.com/spreadsheets/d/1nbAsU-zNe4HbM0bBLlYofi1pHhneEjEIWfW22JODBeM/edit?usp=sharing',
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
