import { useState, useEffect } from 'react';
import { Video } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';
import Galleria from '@/components/galleria/Galleria';

// Video categories as albums
const epicEditsData = {
  title: 'Epic Video Edits',
  description: 'Professional video editing showcase',
  albums: [
    {
      id: 'music-videos',
      name: 'Music Videos',
      emoji: '🎵',
      images: Array.from({ length: 15 }, (_, i) => ({
        id: `music-${i}`,
        title: `Music Video ${i + 1}`,
        url: `https://picsum.photos/1920/1080?random=${i + 1000}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 1000}`,
      })),
    },
    {
      id: 'commercials',
      name: 'Commercials',
      emoji: '📺',
      images: Array.from({ length: 20 }, (_, i) => ({
        id: `commercial-${i}`,
        title: `Commercial ${i + 1}`,
        url: `https://picsum.photos/1920/1080?random=${i + 1100}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 1100}`,
      })),
    },
    {
      id: 'short-films',
      name: 'Short Films',
      emoji: '🎬',
      images: Array.from({ length: 10 }, (_, i) => ({
        id: `film-${i}`,
        title: `Short Film ${i + 1}`,
        url: `https://picsum.photos/1920/1080?random=${i + 1200}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 1200}`,
      })),
    },
    {
      id: 'social-media',
      name: 'Social Media',
      emoji: '📱',
      images: Array.from({ length: 25 }, (_, i) => ({
        id: `social-${i}`,
        title: `Social ${i + 1}`,
        url: `https://picsum.photos/1080/1920?random=${i + 1300}`,
        thumbnail: `https://picsum.photos/300/400?random=${i + 1300}`,
      })),
    },
    {
      id: 'events',
      name: 'Event Highlights',
      emoji: '🎉',
      images: Array.from({ length: 18 }, (_, i) => ({
        id: `event-video-${i}`,
        title: `Event Highlight ${i + 1}`,
        url: `https://picsum.photos/1920/1080?random=${i + 1400}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 1400}`,
      })),
    },
    {
      id: 'trailers',
      name: 'Trailers & Teasers',
      emoji: '🎥',
      images: Array.from({ length: 12 }, (_, i) => ({
        id: `trailer-${i}`,
        title: `Trailer ${i + 1}`,
        url: `https://picsum.photos/1920/1080?random=${i + 1500}`,
        thumbnail: `https://picsum.photos/400/300?random=${i + 1500}`,
      })),
    },
  ],
};

export default function VideoEditsSection() {
  const [isGalleriaOpen, setIsGalleriaOpen] = useState(false);
  const { registerGallery, goToGallery } = useGalleria();

  // Register this gallery
  useEffect(() => {
    registerGallery('epic-edits', epicEditsData);
  }, [registerGallery]);

  const handleOpenGalleria = () => {
    setIsGalleriaOpen(true);
    goToGallery('epic-edits');
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button
        onClick={handleOpenGalleria}
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 p-12 transition-all hover:scale-105 hover:border-white/40 hover:shadow-2xl"
      >
        <Video className="h-24 w-24 text-white transition-transform group-hover:scale-110" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">Epic Video Edits</h2>
          <p className="mt-2 text-white/70">Click to explore categories</p>
        </div>
      </button>

      <Galleria
        isOpen={isGalleriaOpen}
        onClose={() => setIsGalleriaOpen(false)}
        galleriesData={{ 'epic-edits': epicEditsData }}
      />
    </div>
  );
}
