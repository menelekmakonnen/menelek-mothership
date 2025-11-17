import { motion } from 'framer-motion';
import { Camera, Video, Sparkles, Film, BookOpen } from 'lucide-react';

const galleries = [
  { id: 'photography', label: 'Photography', icon: Camera },
  { id: 'ai-albums', label: 'AI Albums', icon: Sparkles },
  { id: 'video-edits', label: 'Video Edits', icon: Video },
  { id: 'films', label: 'Films & Music', icon: Film },
  { id: 'loremaker', label: 'Loremaker', icon: BookOpen },
];

export default function GalleryNavigation({ currentGallery, onNavigate }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-2 mb-6 overflow-x-auto pb-2"
    >
      {galleries.map((gallery) => {
        const Icon = gallery.icon;
        const isActive = currentGallery === gallery.id;

        return (
          <button
            key={gallery.id}
            onClick={() => onNavigate && onNavigate(gallery.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              isActive
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-white/5 border border-white/10 hover:border-white/30 text-gray-400 hover:text-white'
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-sm font-bold mono">{gallery.label}</span>
          </button>
        );
      })}
    </motion.div>
  );
}
