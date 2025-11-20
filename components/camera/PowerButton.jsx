import { motion } from 'framer-motion';
import { Power, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';
import { SOCIAL_LINKS } from '@/lib/realMediaData';

export default function PowerButton() {
  const { powerOn } = useCameraContext();

  const socialIcons = [
    { icon: Instagram, url: SOCIAL_LINKS.personal.instagram, label: 'Instagram' },
    { icon: Youtube, url: SOCIAL_LINKS.personal.youtube, label: 'YouTube' },
    { icon: Linkedin, url: SOCIAL_LINKS.personal.linkedin, label: 'LinkedIn' },
    { icon: Mail, url: `mailto:${SOCIAL_LINKS.personal.email}`, label: 'Email' },
  ];

  return (
    <div className="fixed inset-0 z-modal bg-black flex flex-col items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        {/* Site Title */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-8 tracking-tight"
          style={{
            background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          Menelek Makonnen
        </motion.h1>

        {/* Power Button */}
        <motion.button
          onClick={powerOn}
          className="group relative mb-6"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Glow Effect */}
          <motion.div
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: 'radial-gradient(circle, var(--accent-glow) 0%, transparent 70%)',
              filter: 'blur(30px)',
              transform: 'scale(2)',
            }}
          />

          {/* Power Button */}
          <div className="relative w-32 h-32 rounded-full glass-strong flex items-center justify-center border-2 border-hud-border">
            <Power size={48} className="text-accent" />
          </div>
        </motion.button>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-secondary font-mono text-sm uppercase tracking-wider mb-12"
        >
          Press to Power On
        </motion.p>

        {/* Social Media Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-6"
        >
          {socialIcons.map((social, index) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={social.label}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                whileHover={{ scale: 1.2, y: -4 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-full glass flex items-center justify-center hover:border-accent transition-colors"
                aria-label={social.label}
              >
                <Icon size={20} className="text-accent" />
              </motion.a>
            );
          })}
        </motion.div>
      </motion.div>
    </div>
  );
}
