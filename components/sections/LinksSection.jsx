import { motion } from 'framer-motion';
import { Instagram, Youtube, Linkedin, Mail, Globe, ArrowUpRight } from 'lucide-react';

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
        icon: Instagram,
      },
      {
        label: 'YouTube',
        meta: '@menelekmakonnen',
        description: 'Films, essays, and behind-the-scenes drops.',
        href: 'https://youtube.com/@menelekmakonnen',
        icon: Youtube,
      },
      {
        label: 'LinkedIn',
        meta: 'menelekmakonnen',
        description: 'Professional profile and collaborations.',
        href: 'https://linkedin.com/in/menelekmakonnen',
        icon: Linkedin,
      },
      {
        label: 'Email',
        meta: 'admin@menelekmakonnen.com',
        description: 'Direct contact for speaking and inquiries.',
        href: 'mailto:admin@menelekmakonnen.com',
        icon: Mail,
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
        icon: Youtube,
      },
      {
        label: 'Director Instagram',
        meta: '@menelek.makonnen',
        description: 'Set life, directing, and cinematic stills.',
        href: 'https://www.instagram.com/menelek.makonnen/',
        icon: Instagram,
      },
      {
        label: 'Loremaker Instagram',
        meta: '@lore.maker',
        description: 'Immersive lore drops and world-building visuals.',
        href: 'https://www.instagram.com/lore.maker',
        icon: Instagram,
      },
      {
        label: 'ICUNI Instagram',
        meta: '@icuni_',
        description: 'AI education and Starterclass community.',
        href: 'https://www.instagram.com/icuni_',
        icon: Instagram,
      },
      {
        label: 'MMM Media Instagram',
        meta: '@mm.m.media',
        description: 'Commercial production house portfolio.',
        href: 'https://www.instagram.com/mm.m.media/',
        icon: Instagram,
      },
      {
        label: 'AI Educator Instagram',
        meta: '@mr.mikaelgabriel',
        description: 'Corporate AI educator persona.',
        href: 'https://www.instagram.com/mr.mikaelgabriel/',
        icon: Instagram,
      },
      {
        label: 'Corporate LinkedIn',
        meta: 'Mikael Gabriel',
        description: 'Business-facing updates and partnerships.',
        href: 'https://www.linkedin.com/in/mikaelgabriel/',
        icon: Linkedin,
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
        icon: Globe,
      },
      {
        label: 'Starterclass',
        meta: 'starterclass.icuni.org',
        description: 'AI Starterclass by ICUNI.',
        href: 'https://starterclass.icuni.org',
        icon: Globe,
      },
      {
        label: 'Old Blog',
        meta: 'wordpress.com/mikaelgabriel',
        description: 'Legacy essays and archives.',
        href: 'https://wordpress.com/mikaelgabriel',
        icon: Globe,
      },
    ],
  },
];

const isExternalLink = (href) => /^https?:/i.test(href);

export default function LinksSection() {
  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="mx-auto flex max-w-4xl flex-col items-center text-center gap-6">
        <motion.h1 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-6xl font-bold">
          Connect With Me
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[color:var(--text-secondary)] max-w-2xl"
        >
          A curated directory of the socials, studios, and platforms where I build stories, teach, and collaborate.
        </motion.p>
      </div>

      <div className="mx-auto mt-14 flex max-w-3xl flex-col gap-12">
        {linkGroups.map((group, groupIndex) => (
          <motion.section
            key={group.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * groupIndex }}
            className="space-y-5"
          >
            <div className="text-left">
              <p className="mono text-[11px] uppercase tracking-[0.5em] text-[color:var(--text-tertiary)]">{group.title}</p>
              <h2 className="mt-2 text-2xl font-semibold text-[color:var(--text-primary)]">{group.description}</h2>
            </div>

            <div className="flex flex-col gap-4">
              {group.items.map((item, itemIndex) => {
                const external = isExternalLink(item.href);
                const Icon = item.icon || Globe;
                return (
                  <motion.a
                    key={item.label}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: itemIndex * 0.05 }}
                    href={item.href}
                    target={external ? '_blank' : undefined}
                    rel={external ? 'noopener noreferrer' : undefined}
                    className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-[rgba(10,12,18,0.78)] px-5 py-4 transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-[rgba(14,18,26,0.9)]"
                  >
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white/12 via-white/5 to-white/0 border border-white/15">
                      <Icon className="h-5 w-5 text-[color:var(--text-primary)]" />
                    </div>
                    <div className="flex-1 text-left">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold text-[color:var(--text-primary)]">{item.label}</p>
                          {item.meta && (
                            <p className="mono text-[10px] uppercase tracking-[0.4em] text-[color:var(--text-tertiary)]">{item.meta}</p>
                          )}
                        </div>
                        <ArrowUpRight className="h-4 w-4 text-[color:var(--text-secondary)] transition-colors group-hover:text-[color:var(--accent-300)]" />
                      </div>
                      {item.description && (
                        <p className="mt-2 text-sm text-[color:var(--text-secondary)] leading-relaxed">{item.description}</p>
                      )}
                    </div>
                  </motion.a>
                );
              })}
            </div>
          </motion.section>
        ))}
      </div>
    </div>
  );
}
