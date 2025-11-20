import '@/styles/globals.css';
import { CameraProvider } from '@/context/CameraContext';
import { GalleriaProvider } from '@/context/GalleriaContext';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <GalleriaProvider>
        <Component {...pageProps} />
      </GalleriaProvider>
    </CameraProvider>
  );
}
