import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';
import Galleria from '@/components/galleria/Galleria';

// Sample photography data
const photographyData = {
  title: 'Photography',
  description: 'Professional photography portfolio',
  albums: [
    {
      id: 'portraits',
      name: 'Portraits',
      emoji: '👤',
      images: Array.from({ length: 20 }, (_, i) => ({
        id: `portrait-${i}`,
        title: `Portrait ${i + 1}`,
        url: `https://picsum.photos/1200/1600?random=${i + 100}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 100}`,
      })),
    },
    {
      id: 'landscapes',
      name: 'Landscapes',
      emoji: '🏔️',
      images: Array.from({ length: 25 }, (_, i) => ({
        id: `landscape-${i}`,
        title: `Landscape ${i + 1}`,
        url: `https://picsum.photos/1600/1200?random=${i + 200}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 200}`,
      })),
    },
    {
      id: 'street',
      name: 'Street Photography',
      emoji: '🌆',
      images: Array.from({ length: 30 }, (_, i) => ({
        id: `street-${i}`,
        title: `Street ${i + 1}`,
        url: `https://picsum.photos/1400/1400?random=${i + 300}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 300}`,
      })),
    },
    {
      id: 'events',
      name: 'Events',
      emoji: '🎉',
      images: Array.from({ length: 15 }, (_, i) => ({
        id: `event-${i}`,
        title: `Event ${i + 1}`,
        url: `https://picsum.photos/1200/800?random=${i + 400}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 400}`,
      })),
    },
  ],
};

export default function PhotographySection() {
  const [isGalleriaOpen, setIsGalleriaOpen] = useState(false);
  const { registerGallery, goToGallery } = useGalleria();

  // Register this gallery
  useEffect(() => {
    registerGallery('photography', photographyData);
  }, [registerGallery]);

  const handleOpenGalleria = () => {
    setIsGalleriaOpen(true);
    goToGallery('photography');
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button
        onClick={handleOpenGalleria}
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-teal-600/20 to-cyan-600/20 p-12 transition-all hover:scale-105 hover:border-white/40 hover:shadow-2xl"
      >
        <Camera className="h-24 w-24 text-white transition-transform group-hover:scale-110" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Photography</h2>
          <p className="mt-2 text-white/70">Click to explore gallery</p>
        </div>
      </button>

      <Galleria
        isOpen={isGalleriaOpen}
        onClose={() => setIsGalleriaOpen(false)}
        galleriesData={{ photography: photographyData }}
      />
    </div>
  );
}
