import { CameraProvider } from '@/context/CameraContext';
import '@/styles/globals.css';
import AppErrorBoundary from '@/components/ui/AppErrorBoundary';

export default function App({ Component, pageProps }) {
  return (
    <CameraProvider>
      <AppErrorBoundary>
        <Component {...pageProps} />
      </AppErrorBoundary>
    </CameraProvider>
  );
}
