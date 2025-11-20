import { motion } from 'framer-motion';
import { Camera, Sparkles, Film, Video, Palette, ArrowRight } from 'lucide-react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

// Get cover images from actual media data
const getCoverImage = (categoryId, mediaData) => {
  switch(categoryId) {
    case 'films':
      return mediaData?.films?.items?.[0]?.coverUrl || 'https://img.youtube.com/vi/A8cGpNe2JAE/maxresdefault.jpg';
    case 'video-edits':
      return mediaData?.['video-edits']?.categories?.[0]?.coverUrl || 'https://via.placeholder.com/400x600/8B5CF6/ffffff?text=Epic+Edits';
    case 'photography':
      return 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400&h=600&fit=crop';
    case 'ai-albums':
      return 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=600&fit=crop';
    case 'loremaker':
      return 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?w=400&h=600&fit=crop';
    default:
      return 'https://via.placeholder.com/400x600/1a1a1a/ffffff';
  }
};

const CATEGORY_DESCRIPTIONS = {
  photography: 'Professional photography and visual storytelling',
  'ai-albums': 'AI-generated art and creative experiments',
  films: 'Films, music videos, and cinematic work',
  'video-edits': 'High-energy edits and visual effects',
  loremaker: 'Characters and worldbuilding from the Loremaker Universe',
};

export default function GalleriaView({ isHomePage }) {
  const { enterGallery, mediaData } = useGalleriaContext();

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-950 via-black to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-32">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-16 pt-12"
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight">
            <span
              className="bg-gradient-to-r from-white via-gray-100 to-purple-400 bg-clip-text text-transparent"
            >
              Menelek Makonnen
            </span>
          </h1>
          <p className="text-gray-400 text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed">
            Filmmaker • Creative Director • AI Educator • Photographer • Worldbuilder
          </p>
          <div className="mt-8 h-px w-32 mx-auto bg-gradient-to-r from-transparent via-purple-500 to-transparent"></div>
        </motion.div>

        {/* Category Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 text-center">
            Explore My Work
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {MEDIA_CATEGORIES.map((category, index) => {
              const Icon = CATEGORY_ICONS[category.id];
              const coverImage = getCoverImage(category.id, mediaData);
              const description = CATEGORY_DESCRIPTIONS[category.id];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + index * 0.1,
                    ease: 'easeOut'
                  }}
                  whileHover={{ y: -12, scale: 1.03 }}
                  onClick={() => enterGallery(category)}
                  className="group cursor-pointer"
                >
                  {/* Card Container */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 shadow-2xl group-hover:shadow-purple-500/20 transition-all duration-500">
                    {/* Cover Image */}
                    <div className="absolute inset-0">
                      <img
                        src={coverImage}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-700"
                      />
                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90"></div>
                    </div>

                    {/* Icon Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center group-hover:bg-white/20 transition-all duration-300">
                        <Icon size={24} className="text-white" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors duration-300">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-300 mb-4 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        {description}
                      </p>

                      {/* View Button */}
                      <div className="flex items-center text-sm text-purple-400 font-medium opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <span>Explore</span>
                        <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-600/0 via-purple-600/0 to-purple-600/0 group-hover:from-purple-600/20 group-hover:via-purple-600/10 transition-all duration-500 pointer-events-none"></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Bottom Tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-20"
        >
          <p className="text-gray-500 text-sm">
            Built with passion. Powered by creativity.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
