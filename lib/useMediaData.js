import { useEffect } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { SAMPLE_MEDIA_DATA } from './sampleMediaData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();

  useEffect(() => {
    // In production, this would fetch from Google Drive API or other sources
    // For now, load sample data
    setMediaData(SAMPLE_MEDIA_DATA);
  }, [setMediaData]);
};
