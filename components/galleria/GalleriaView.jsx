import { motion } from 'framer-motion';
import { Camera, Sparkles, Film, Video, Palette } from 'lucide-react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

const CATEGORY_GRADIENTS = {
  photography: 'from-purple-600/30 via-pink-600/30 to-red-600/30',
  'ai-albums': 'from-cyan-600/30 via-blue-600/30 to-purple-600/30',
  films: 'from-amber-600/30 via-orange-600/30 to-red-600/30',
  'video-edits': 'from-green-600/30 via-emerald-600/30 to-teal-600/30',
  loremaker: 'from-rose-600/30 via-fuchsia-600/30 to-violet-600/30',
};

export default function GalleriaView() {
  const { enterGallery } = useGalleriaContext();

  return (
    <div className="h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            <span
              style={{
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              The Galleria
            </span>
          </h1>
          <p className="text-secondary text-lg">
            Explore collections of photography, films, AI art, and more
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {MEDIA_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            const gradient = CATEGORY_GRADIENTS[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => enterGallery(category)}
                className="group cursor-pointer"
              >
                {/* Portrait Cover */}
                <div className="relative aspect-[9/16] rounded-2xl overflow-hidden glass border border-glass-border">
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500`} />

                  {/* Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.2, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon size={64} className="text-white/90" />
                    </motion.div>
                  </div>

                  {/* Title Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent">
                    <h3 className="text-xl font-bold text-white mb-1">{category.name}</h3>
                    {category.defaultAlbum && (
                      <p className="text-sm text-white/70">Default: {category.defaultAlbum}</p>
                    )}
                  </div>

                  {/* Hover Glow */}
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: 'radial-gradient(circle at center, var(--accent-glow), transparent 70%)',
                    }}
                  />
                </div>

                {/* Category Label */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  className="mt-4 text-center text-sm font-medium text-secondary group-hover:text-accent transition-colors"
                >
                  Click to explore
                </motion.p>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center"
        >
          <p className="text-xs text-tertiary font-mono uppercase tracking-wider">
            Use arrow keys to navigate • ESC to close
          </p>
        </motion.div>
      </div>
    </div>
  );
}
