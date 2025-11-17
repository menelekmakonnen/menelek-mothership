import { motion } from 'framer-motion';
import { Camera, Video, Sparkles, Film, BookOpen } from 'lucide-react';

// Define all galleries with their metadata
const galleries = [
  {
    id: 'photography',
    name: 'Photography',
    description: 'Capturing moments through the lens',
    icon: Camera,
    gradient: 'from-blue-600 to-cyan-600',
    thumbnail: '', // Will be populated from Google Drive
    itemCount: '150+ photos',
    hasAlbums: true,
  },
  {
    id: 'ai-albums',
    name: 'AI Albums',
    description: 'AI-generated visual art and experiments',
    icon: Sparkles,
    gradient: 'from-purple-600 to-pink-600',
    thumbnail: '',
    itemCount: '200+ images',
    hasAlbums: true,
  },
  {
    id: 'video-edits',
    name: 'Epic Video Edits',
    description: 'Professional video editing and motion graphics',
    icon: Video,
    gradient: 'from-orange-600 to-red-600',
    thumbnail: '',
    itemCount: '20+ edits',
    hasAlbums: true,
  },
  {
    id: 'films',
    name: 'Films & Music Videos',
    description: 'Cinematic storytelling and visual artistry',
    icon: Film,
    gradient: 'from-green-600 to-emerald-600',
    thumbnail: '',
    itemCount: '15+ videos',
    hasAlbums: false,
  },
  {
    id: 'loremaker',
    name: 'Loremaker Universe',
    description: 'Epic character-driven narratives',
    icon: BookOpen,
    gradient: 'from-indigo-600 to-purple-600',
    thumbnail: '',
    itemCount: '50+ characters',
    hasAlbums: false,
  },
];

export default function GalleriaSection({ onGallerySelect }) {
  return (
    <div className="w-full h-full p-8 overflow-auto">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-7xl font-bold mb-4"
        >
          Galleria
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl text-gray-400 mb-12"
        >
          Explore my visual universe across multiple mediums
        </motion.p>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleries.map((gallery, index) => {
            const Icon = gallery.icon;

            return (
              <motion.div
                key={gallery.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index }}
                onClick={() => onGallerySelect && onGallerySelect(gallery.id)}
                className="group cursor-pointer"
                whileHover={{ y: -8 }}
              >
                {/* Gallery Card */}
                <div className="luxury-card overflow-hidden h-full">
                  {/* Thumbnail */}
                  <div className={`aspect-video bg-gradient-to-br ${gallery.gradient} rounded-lg mb-4 overflow-hidden relative`}>
                    {gallery.thumbnail ? (
                      <img
                        src={gallery.thumbnail}
                        alt={gallery.name}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Icon className="w-24 h-24 text-white/50 group-hover:scale-110 transition-transform" />
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="text-center">
                        <Icon className="w-16 h-16 mx-auto mb-2 text-white" />
                        <p className="text-white text-sm mono">EXPLORE</p>
                      </div>
                    </div>

                    {/* Item count badge */}
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs mono">
                      {gallery.itemCount}
                    </div>
                  </div>

                  {/* Gallery Info */}
                  <h3 className="text-2xl font-bold mb-2">{gallery.name}</h3>
                  <p className="text-sm text-gray-400 mb-4">{gallery.description}</p>

                  {/* View Gallery CTA */}
                  <div className="flex items-center gap-2 text-green-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-sm font-bold">View Gallery</span>
                    <span>→</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-center text-sm text-gray-500"
        >
          All galleries are integrated with Google Drive for seamless content management
        </motion.div>
      </div>
    </div>
  );
}
