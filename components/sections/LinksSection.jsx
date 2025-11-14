import { motion } from 'framer-motion';
import { Linkedin, Instagram, Youtube, Music, Mail, Globe, Twitter, Facebook } from 'lucide-react';

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/menelekmakonnen',
    color: '#E4405F',
    description: 'Follow my visual stories and daily updates',
  },
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/menelekmakonnen',
    color: '#0A66C2',
    description: 'Connect professionally and view my experience',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@menelekmakonnen',
    color: '#FF0000',
    description: 'Watch my latest videos and creative content',
  },
  {
    name: 'TikTok',
    icon: Music,
    url: 'https://tiktok.com/@menelekmakonnen',
    color: '#00F2EA',
    description: 'Discover short-form creative content',
  },
  {
    name: 'Twitter',
    icon: Twitter,
    url: 'https://twitter.com/menelekmakonnen',
    color: '#1DA1F2',
    description: 'Follow my thoughts and updates',
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/menelekmakonnen',
    color: '#1877F2',
    description: 'Stay connected on Facebook',
  },
  {
    name: 'Website',
    icon: Globe,
    url: 'https://menelekmakonnen.com',
    color: '#10B981',
    description: 'Visit my official website',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:contact@menelekmakonnen.com',
    color: '#F59E0B',
    description: 'Get in touch directly',
  },
];

export default function LinksSection() {
  return (
    <div className="w-full h-full flex items-center justify-center p-8 overflow-auto bg-gradient-to-b from-black via-gray-900 to-black">
      <div className="max-w-2xl w-full">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 p-1">
            <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-5xl">
              🎬
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Menelek Makonnen
          </h1>

          <p className="text-lg text-gray-400 mb-2">
            Filmmaker | Creative Director | Visual Artist
          </p>

          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Exploring the intersection of technology and storytelling through film, photography, and digital art
          </p>
        </motion.div>

        {/* Social Links */}
        <div className="space-y-4">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative block"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 hover:border-gray-600 transition-all p-6">
                  {/* Hover effect */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity"
                    style={{
                      background: `linear-gradient(135deg, ${link.color}, transparent)`,
                    }}
                  />

                  <div className="relative flex items-center gap-4">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110"
                      style={{ backgroundColor: link.color }}
                    >
                      <Icon className="w-7 h-7 text-white" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold mb-1 text-white group-hover:text-green-400 transition-colors">
                        {link.name}
                      </h3>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {link.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="text-gray-500 group-hover:text-green-400 transition-all group-hover:translate-x-1">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12 text-center text-sm text-gray-600"
        >
          <p>© 2024 Menelek Makonnen. All rights reserved.</p>
        </motion.div>
      </div>
    </div>
  );
}
