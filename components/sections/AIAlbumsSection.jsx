import { useState, useEffect } from 'react';
import { Image } from 'lucide-react';
import { useGalleria } from '@/context/GalleriaContext';
import Galleria from '@/components/galleria/Galleria';

// Sample AI Albums data
const aiAlbumsData = {
  title: 'AI Albums',
  description: 'AI-generated artwork and designs',
  albums: [
    {
      id: 'ai-portraits',
      name: 'AI Portraits',
      emoji: '🤖',
      images: Array.from({ length: 18 }, (_, i) => ({
        id: `ai-portrait-${i}`,
        title: `AI Portrait ${i + 1}`,
        url: `https://picsum.photos/1000/1000?random=${i + 500}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 500}`,
      })),
    },
    {
      id: 'concept-art',
      name: 'Concept Art',
      emoji: '🎨',
      images: Array.from({ length: 22 }, (_, i) => ({
        id: `concept-${i}`,
        title: `Concept ${i + 1}`,
        url: `https://picsum.photos/1200/900?random=${i + 600}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 600}`,
      })),
    },
    {
      id: 'digital-dreams',
      name: 'Digital Dreams',
      emoji: '✨',
      images: Array.from({ length: 28 }, (_, i) => ({
        id: `dream-${i}`,
        title: `Dream ${i + 1}`,
        url: `https://picsum.photos/1100/1100?random=${i + 700}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 700}`,
      })),
    },
    {
      id: 'future-visions',
      name: 'Future Visions',
      emoji: '🔮',
      images: Array.from({ length: 20 }, (_, i) => ({
        id: `vision-${i}`,
        title: `Vision ${i + 1}`,
        url: `https://picsum.photos/1300/900?random=${i + 800}`,
        thumbnail: `https://picsum.photos/400/400?random=${i + 800}`,
      })),
    },
  ],
};

export default function AIAlbumsSection() {
  const [isGalleriaOpen, setIsGalleriaOpen] = useState(false);
  const { registerGallery, goToGallery } = useGalleria();

  // Register this gallery
  useEffect(() => {
    registerGallery('ai-albums', aiAlbumsData);
  }, [registerGallery]);

  const handleOpenGalleria = () => {
    setIsGalleriaOpen(true);
    goToGallery('ai-albums');
  };

  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <button
        onClick={handleOpenGalleria}
        className="group flex flex-col items-center gap-4 rounded-3xl border-2 border-white/20 bg-gradient-to-br from-purple-600/20 to-pink-600/20 p-12 transition-all hover:scale-105 hover:border-white/40 hover:shadow-2xl"
      >
        <Image className="h-24 w-24 text-white transition-transform group-hover:scale-110" />
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white">AI Albums</h2>
          <p className="mt-2 text-white/70">Click to explore gallery</p>
        </div>
      </button>

      <Galleria
        isOpen={isGalleriaOpen}
        onClose={() => setIsGalleriaOpen(false)}
        galleriesData={{ 'ai-albums': aiAlbumsData }}
      />
    </div>
  );
}
