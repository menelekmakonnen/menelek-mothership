import { motion } from 'framer-motion';
import { Linkedin, Instagram, Youtube, Music, Mail, Globe } from 'lucide-react';
import IconBox from '@/components/ui/IconBox';

const socialLinks = [
  {
    name: 'LinkedIn',
    icon: Linkedin,
    url: 'https://linkedin.com/in/menelekmakonnen',
    gradient: 'from-blue-600 to-blue-700',
    description: 'Professional network',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/menelekmakonnen',
    gradient: 'from-pink-600 to-purple-600',
    description: 'Visual stories',
  },
  {
    name: 'YouTube',
    icon: Youtube,
    url: 'https://youtube.com/@menelekmakonnen',
    gradient: 'from-red-600 to-red-700',
    description: 'Video content',
  },
  {
    name: 'TikTok',
    icon: Music,
    url: 'https://tiktok.com/@menelekmakonnen',
    gradient: 'from-cyan-600 to-pink-600',
    description: 'Short-form content',
  },
  {
    name: 'Website',
    icon: Globe,
    url: 'https://menelekmakonnen.com',
    gradient: 'from-green-600 to-emerald-600',
    description: 'Official site',
  },
  {
    name: 'Email',
    icon: Mail,
    url: 'mailto:contact@menelekmakonnen.com',
    gradient: 'from-orange-600 to-yellow-600',
    description: 'Get in touch',
  },
];

export default function LinksSection() {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 pt-32 pb-32 overflow-auto">
      <div className="max-w-6xl w-full">
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
          className="text-xl text-gray-400 text-center mb-16"
        >
          Follow my journey across platforms
        </motion.p>

        <div className="grid md:grid-cols-3 gap-6">
          {socialLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 hover:border-green-500 transition-all hover:scale-105"
                whileHover={{ y: -8 }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${link.gradient} opacity-0 group-hover:opacity-10 transition-opacity`} />

                <div className="relative z-10 flex flex-col items-center text-center">
                  <IconBox icon={Icon} gradient={link.gradient} size="lg" className="mb-4" />

                  <h3 className="text-2xl font-bold mb-2">{link.name}</h3>
                  <p className="text-gray-400">{link.description}</p>

                  <div className="mt-4 text-sm text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Visit →
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
