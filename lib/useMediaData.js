import { useEffect } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { SAMPLE_MEDIA_DATA } from './sampleMediaData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();

  useEffect(() => {
    setMediaData(SAMPLE_MEDIA_DATA);
  }, [setMediaData]);
};
