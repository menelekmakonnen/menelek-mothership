import { Linkedin, Twitter, Instagram, Github, Mail } from 'lucide-react';

export const SOCIAL_LINKS = [
  { icon: Linkedin, url: 'https://linkedin.com/in/menelekmakonnen', label: 'LinkedIn', color: 'hover:bg-blue-600' },
  { icon: Twitter, url: 'https://twitter.com/menelekmakonnen', label: 'Twitter', color: 'hover:bg-sky-500' },
  { icon: Instagram, url: 'https://instagram.com/menelekmakonnen', label: 'Instagram', color: 'hover:bg-pink-600' },
  { icon: Github, url: 'https://github.com/menelekmakonnen', label: 'GitHub', color: 'hover:bg-gray-700' },
  { icon: Mail, url: 'mailto:contact@menelekmakonnen.com', label: 'Email', color: 'hover:bg-purple-600' },
];

export default function SocialLinks({ className = '', compact = false }) {
  const itemClasses = compact
    ? 'w-10 h-10 md:w-11 md:h-11 bg-gray-900/70 border border-gray-800'
    : 'w-16 h-16 bg-gray-900 border border-gray-800';

  const iconSize = compact ? 18 : 24;

  const containerClasses = ['flex flex-wrap justify-center gap-4', className].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {SOCIAL_LINKS.map((social) => (
        <a
          key={social.label}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          className={[
            'rounded-full flex items-center justify-center transition-all duration-300',
            'hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/20',
            itemClasses,
            social.color,
          ].join(' ')}
          aria-label={social.label}
        >
          <social.icon size={iconSize} className="text-white" />
          <span className="sr-only">{social.label}</span>
        </a>
      ))}
    </div>
  );
}
