import { motion } from 'framer-motion';
import { Camera, Sparkles, Film, Video, Palette, ArrowRight, Play } from 'lucide-react';
import { useGalleriaContext, MEDIA_CATEGORIES } from '@/context/GalleriaContext';

const CATEGORY_ICONS = {
  photography: Camera,
  'ai-albums': Sparkles,
  films: Film,
  'video-edits': Video,
  loremaker: Palette,
};

// Use actual working cover images
const getCoverImage = (categoryId, mediaData) => {
  switch(categoryId) {
    case 'films':
      // Use the first film's YouTube thumbnail
      return 'https://img.youtube.com/vi/A8cGpNe2JAE/maxresdefault.jpg';
    case 'video-edits':
      // Use placeholder with gradient
      return null; // We'll use gradient instead
    case 'photography':
      // Use placeholder with gradient
      return null;
    case 'ai-albums':
      // Use placeholder with gradient
      return null;
    case 'loremaker':
      // Use placeholder with gradient
      return null;
    default:
      return null;
  }
};

const CATEGORY_GRADIENTS = {
  photography: 'from-purple-600 via-pink-600 to-rose-600',
  'ai-albums': 'from-cyan-500 via-blue-600 to-purple-600',
  films: 'from-orange-500 via-red-600 to-pink-600',
  'video-edits': 'from-green-500 via-emerald-600 to-teal-600',
  loremaker: 'from-violet-500 via-fuchsia-600 to-pink-600',
};

const CATEGORY_DESCRIPTIONS = {
  photography: 'Beauty shoots, events, and professional photography',
  'ai-albums': 'AI-generated art and creative experiments',
  films: 'Films, documentaries, and music videos',
  'video-edits': 'Epic edits, BTS, beauty reels, and AI tutorials',
  loremaker: 'Characters and worldbuilding from the Loremaker Universe',
};

export default function GalleriaView({ isHomePage }) {
  const { enterGallery, mediaData } = useGalleriaContext();

  return (
    <div className="min-h-screen w-full bg-black">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-16 pb-40">
        {/* Hero Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="text-center mb-20 pt-16"
        >
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-2xl">
              Menelek Makonnen
            </span>
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl md:text-2xl max-w-4xl mx-auto font-light tracking-wide">
            Filmmaker • Creative Director • AI Educator • Photographer • Worldbuilder
          </p>
        </motion.div>

        {/* Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {MEDIA_CATEGORIES.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.id];
            const coverImage = getCoverImage(category.id, mediaData);
            const gradient = CATEGORY_GRADIENTS[category.id];
            const description = CATEGORY_DESCRIPTIONS[category.id];

            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.7,
                  delay: 0.2 + index * 0.15,
                  ease: [0.19, 1, 0.22, 1]
                }}
                whileHover={{ y: -16, scale: 1.02 }}
                onClick={() => enterGallery(category)}
                className="group cursor-pointer"
              >
                {/* Card */}
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden bg-gradient-to-br from-gray-900 to-black border border-gray-800/50 shadow-2xl group-hover:shadow-purple-500/30 transition-all duration-500">
                  {/* Background Layer */}
                  {coverImage ? (
                    <div className="absolute inset-0">
                      <img
                        src={coverImage}
                        alt={category.name}
                        className="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-1000"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
                    </div>
                  ) : (
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 group-hover:opacity-30 transition-opacity duration-500`}></div>
                  )}

                  {/* Icon - Large and Centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                      className="w-32 h-32 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300"
                    >
                      <Icon size={64} className="text-white" strokeWidth={1.5} />
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <div className="mb-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {description}
                      </p>
                    </div>

                    <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-purple-400 transition-all duration-300">
                      {category.name}
                    </h3>

                    {/* CTA */}
                    <div className="flex items-center text-purple-400 font-medium opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-2 transition-all duration-300">
                      <span className="text-sm">Explore Collection</span>
                      <ArrowRight size={18} className="ml-2" />
                    </div>
                  </div>

                  {/* Glow Effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                    <div className={`absolute inset-0 bg-gradient-to-t ${gradient} opacity-20 blur-3xl`}></div>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-purple-500/50 transition-all duration-500"></div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
