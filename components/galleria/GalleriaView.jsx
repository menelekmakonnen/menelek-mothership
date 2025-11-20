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

export default function GalleriaView({ isHomePage }) {
  const { enterGallery, viewLevel, currentCategory } = useGalleriaContext();

  const handleCategoryClick = (category) => {
    console.log('🎯 Category clicked:', category);
    console.log('📍 enterGallery function:', enterGallery);
    enterGallery(category);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Debug Panel */}
      <div className="fixed bottom-24 right-6 z-[60] glass-strong p-4 rounded-lg text-xs font-mono max-w-xs">
        <div className="text-accent font-bold mb-2">DEBUG PANEL</div>
        <div>View Level: <span className="text-green-400">{viewLevel}</span></div>
        <div>Current Category: <span className="text-green-400">{currentCategory?.id || 'none'}</span></div>
        <div>isHomePage: <span className="text-green-400">{String(isHomePage)}</span></div>
      </div>


      <div className="max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center py-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-3 tracking-tight">
            <span
              style={{
                background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Menelek Makonnen
            </span>
          </h1>
          <p className="text-secondary text-sm md:text-base">
            Filmmaker • Creative Director • AI Educator • Photographer • Worldbuilder
          </p>
        </motion.div>

        {/* Category Grid - Centered and fits on screen */}
        <div className="flex-1 flex items-center justify-center pb-24">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6 max-w-6xl">
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
                  onTap={() => handleCategoryClick(category)}
                  onClick={() => handleCategoryClick(category)}
                  className="group cursor-pointer"
                  style={{ touchAction: 'manipulation' }}
                >
                  {/* Portrait Cover */}
                  <div className="relative aspect-[9/16] rounded-xl lg:rounded-2xl overflow-hidden glass border border-glass-border pointer-events-none">
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-60 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />

                    {/* Icon */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                        <Icon size={48} className="text-white/90 lg:w-16 lg:h-16" />
                      </div>
                    </div>

                    {/* Title Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 lg:p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none">
                      <h3 className="text-sm lg:text-base font-bold text-white">{category.name}</h3>
                    </div>

                    {/* Hover Glow */}
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: 'radial-gradient(circle at center, var(--accent-glow), transparent 70%)',
                      }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
