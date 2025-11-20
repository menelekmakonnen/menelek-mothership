import '@/styles/globals.css';
import { CameraProvider } from '@/context/CameraContext';
import { GalleriaProvider } from '@/context/GalleriaContext';
import DynamicFavicon from '@/components/system/DynamicFavicon';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <GalleriaProvider>
        <DynamicFavicon />
        <Component {...pageProps} />
      </GalleriaProvider>
    </CameraProvider>
  );
}
