import { useState } from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Loremaker Character Card Component
 * Displays character information with proper text overflow handling
 */
export function LoremCharacterCard({ character, onClick }) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      onClick={onClick}
      className="gallery-item cursor-pointer group"
    >
      {/* Character Cover Image */}
      <div className="w-full h-full bg-bg-tertiary relative">
        <img
          src={character.coverUrl}
          alt={character.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Character Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
          <h3 className="font-bold text-xl text-white text-truncate-2">
            {character.name}
          </h3>

          {character.alias && (
            <p className="text-sm text-white/80 text-truncate italic">
              "{character.alias}"
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2">
            {character.powers && (
              <span className="px-2 py-1 bg-accent/20 text-accent text-xs rounded-full text-truncate">
                {character.powers}
              </span>
            )}
            {character.faction && (
              <span className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full text-truncate">
                {character.faction}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Loremaker Character Detail View
 * Full view of a single character with gallery
 */
export function LoremakerCharacterDetail({ character, onClose }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [character.coverUrl, ...character.galleryImages].filter(Boolean);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="fixed inset-0 bg-black/95 z-[3000] overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={onClose}
            className="px-4 py-2 glass hover:border-accent transition-colors rounded-full"
          >
            ← Back
          </button>

          <a
            href={character.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 bg-accent text-black rounded-full hover:bg-accent-dim transition-colors"
          >
            <span className="font-medium">View on Loremaker</span>
            <ExternalLink size={16} />
          </a>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-bg-secondary relative">
              <motion.img
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                src={images[currentImageIndex]}
                alt={`${character.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-full object-cover"
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
                  >
                    <ChevronLeft size={24} className="text-white" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full glass-strong flex items-center justify-center hover:border-accent transition-colors"
                  >
                    <ChevronRight size={24} className="text-white" />
                  </button>

                  {/* Image Counter */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 glass-strong rounded-full text-white text-sm">
                    {currentImageIndex + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Character Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2 text-break">
                {character.name}
              </h1>
              {character.alias && (
                <p className="text-xl text-secondary italic text-break">
                  "{character.alias}"
                </p>
              )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              {character.powers && (
                <div className="glass p-4 rounded-lg">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Powers
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.powers}
                  </div>
                </div>
              )}

              {character.faction && (
                <div className="glass p-4 rounded-lg">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Faction
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.faction}
                  </div>
                </div>
              )}

              {character.alignment && (
                <div className="glass p-4 rounded-lg">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Alignment
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.alignment}
                  </div>
                </div>
              )}

              {character.status && (
                <div className="glass p-4 rounded-lg">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Status
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.status}
                  </div>
                </div>
              )}

              {character.location && (
                <div className="glass p-4 rounded-lg col-span-2">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Location
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.location}
                  </div>
                </div>
              )}

              {character.era && (
                <div className="glass p-4 rounded-lg col-span-2">
                  <div className="text-xs text-secondary uppercase tracking-wider mb-1">
                    Era
                  </div>
                  <div className="text-sm font-medium text-break">
                    {character.era}
                  </div>
                </div>
              )}
            </div>

            {/* Descriptions */}
            {character.shortDescription && (
              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Overview</h3>
                <p className="text-secondary leading-relaxed text-break">
                  {character.shortDescription}
                </p>
              </div>
            )}

            {character.longDescription && (
              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Biography</h3>
                <p className="text-secondary leading-relaxed text-break whitespace-pre-wrap">
                  {character.longDescription}
                </p>
              </div>
            )}

            {character.stories && (
              <div className="glass p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">Appears In</h3>
                <p className="text-secondary text-break">
                  {character.stories}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default { LoremCharacterCard, LoremakerCharacterDetail };
