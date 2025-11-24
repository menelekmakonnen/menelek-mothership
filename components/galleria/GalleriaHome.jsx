import { motion } from 'framer-motion';
import { Camera, Image, BookOpen, Video, X } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';

const galleryCards = [
  {
    id: 'photography',
    title: 'Photography',
    description: 'Professional photography portfolio',
    icon: Camera,
    gradient: 'from-teal-600 to-cyan-600',
  },
  {
    id: 'ai-albums',
    title: 'AI Albums',
    description: 'AI-generated artwork and designs',
    icon: Image,
    gradient: 'from-purple-600 to-pink-600',
  },
  {
    id: 'loremaker',
    title: 'Loremaker Universe',
    description: 'Characters and lore from the Loremaker universe',
    icon: BookOpen,
    gradient: 'from-orange-600 to-red-600',
  },
  {
    id: 'epic-edits',
    title: 'Epic Video Edits',
    description: 'Professional video editing showcase',
    icon: Video,
    gradient: 'from-blue-600 to-indigo-600',
  },
];

export default function GalleriaHome({ onClose }) {
  const { goToGallery } = useGalleria();

  return (
    <div className="fixed inset-0 z-[25000] flex items-center justify-center bg-black/95 p-4">
      <div className="relative w-full max-w-6xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white">The Galleria</h1>
            <p className="mt-2 text-lg text-white/70">Select a gallery to explore</p>
          </div>
          <button
            onClick={onClose}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white transition hover:border-white/60 hover:bg-white/10"
            aria-label="Close Galleria"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {galleryCards.map((gallery, index) => {
            const Icon = gallery.icon;
            return (
              <motion.button
                key={gallery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => goToGallery(gallery.id)}
                className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 text-left shadow-2xl transition-all hover:scale-105 hover:border-white/30"
              >
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gallery.gradient} opacity-20 transition-opacity group-hover:opacity-30`} />

                {/* Content */}
                <div className="relative">
                  <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">{gallery.title}</h3>
                  <p className="text-sm text-white/70">{gallery.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
