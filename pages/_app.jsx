import { CameraProvider } from '@/context/CameraContext';
import { GalleriaProvider } from '@/context/GalleriaContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <GalleriaProvider>
        <Component {...pageProps} />
      </GalleriaProvider>
    </CameraProvider>
  );
}
