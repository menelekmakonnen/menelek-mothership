import { useEffect } from 'react';
import '@/styles/globals.css';
import { CameraProvider } from '@/context/CameraContext';
import { GalleriaProvider } from '@/context/GalleriaContext';
import { initDynamicFavicon } from '@/lib/dynamicFavicon';

export default function App({ Component, pageProps }) {
  // Initialize dynamic animated favicon
  useEffect(() => {
    const favicon = initDynamicFavicon();

    // Cleanup on unmount
    return () => {
      if (favicon) {
        favicon.stop();
      }
    };
  }, []);

  return (
    <CameraProvider>
      <GalleriaProvider>
        <Component {...pageProps} />
      </GalleriaProvider>
    </CameraProvider>
  );
}
