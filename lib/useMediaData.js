import { useEffect } from 'react';
import { useGalleriaContext } from '@/context/GalleriaContext';
import { SAMPLE_MEDIA_DATA } from './sampleMediaData';

// Hook to load media data into Galleria context
export const useMediaData = () => {
  const { setMediaData } = useGalleriaContext();

  useEffect(() => {
    // In production, this would fetch from Google Drive API or other sources
    // For now, load sample data
    console.log('🔄 useMediaData - Loading sample data...');
    console.log('📊 SAMPLE_MEDIA_DATA:', SAMPLE_MEDIA_DATA);
    setMediaData(SAMPLE_MEDIA_DATA);
    console.log('✅ useMediaData - Sample data loaded!');
  }, [setMediaData]);
};
