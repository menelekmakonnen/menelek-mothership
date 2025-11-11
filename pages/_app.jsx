import { CameraProvider } from '@/context/CameraContext';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <Component {...pageProps} />
    </CameraProvider>
  );
}
