import { useGalleria } from '@/context/GalleriaContext';
import GalleriaHome from './GalleriaHome';
import GalleryView from './GalleryView';
import AlbumView from './AlbumView';
import SingleImageView from './SingleImageView';

export default function Galleria({ isOpen, onClose, galleriesData }) {
  const { currentView, currentGalleryId, currentAlbumId } = useGalleria();

  if (!isOpen) return null;

  // Home view - show all galleries
  if (currentView === 'home') {
    return <GalleriaHome onClose={onClose} />;
  }

  // Get current gallery data
  const currentGallery = galleriesData[currentGalleryId];
  if (!currentGallery) {
    return <GalleriaHome onClose={onClose} />;
  }

  // Gallery view - show all albums
  if (currentView === 'gallery') {
    return (
      <GalleryView
        albums={currentGallery.albums}
        title={currentGallery.title}
        description={currentGallery.description}
      />
    );
  }

  // Get current album data
  const currentAlbum = currentGallery.albums.find(a => a.id === currentAlbumId);
  if (!currentAlbum) {
    return (
      <GalleryView
        albums={currentGallery.albums}
        title={currentGallery.title}
        description={currentGallery.description}
      />
    );
  }

  // Album view - show all images in grid
  if (currentView === 'album') {
    return (
      <AlbumView
        album={currentAlbum}
        allAlbums={currentGallery.albums}
      />
    );
  }

  // Single image view - full screen image with zoom/pan
  if (currentView === 'single') {
    return (
      <SingleImageView
        images={currentAlbum.images}
        album={currentAlbum}
      />
    );
  }

  return <GalleriaHome onClose={onClose} />;
}
