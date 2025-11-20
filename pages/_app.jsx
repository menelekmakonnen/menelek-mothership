import '@/styles/globals.css';
import { CameraProvider } from '@/context/CameraContext';
import { GalleriaProvider } from '@/context/GalleriaContext';
import FaviconAnimator from '@/components/FaviconAnimator';
import CameraDials from '@/components/camera/CameraDials';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <GalleriaProvider>
        <FaviconAnimator />
        <CameraDials />
        <Component {...pageProps} />
      </GalleriaProvider>
    </CameraProvider>
  );
}
