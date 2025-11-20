import { useEffect } from 'react';
import { useCameraContext } from '@/context/CameraContext';

export default function InteractiveCameraEffects() {
  const {
    iso,
    aperture,
    whiteBalance,
    currentLens,
    getIsoNoise,
    getWhiteBalanceFilter,
  } = useCameraContext();

  // Apply global effects based on camera settings
  useEffect(() => {
    const root = document.documentElement;

    // ISO Noise Effect
    const noiseOpacity = getIsoNoise();
    root.style.setProperty('--iso-noise-opacity', noiseOpacity);

    // White Balance Filter
    const wbFilter = getWhiteBalanceFilter();
    root.style.setProperty('--wb-filter', wbFilter);

    // Lens Zoom Effect
    const zoomFactor = currentLens.zoom || 1;
    const safeZoom = Math.min(1.05, 1 + (zoomFactor - 1) * 0.18);
    const zoomPadding = Math.max(0, (safeZoom - 1) * 80);
    root.style.setProperty('--lens-zoom', zoomFactor);
    root.style.setProperty('--lens-zoom-safe', safeZoom);
    root.style.setProperty('--lens-zoom-padding', `${zoomPadding}px`);

    // Aperture Blur (affects background elements)
    const blurAmount = Math.max(0, (1 / aperture) * 5);
    root.style.setProperty('--aperture-blur', `${blurAmount}px`);

  }, [iso, aperture, whiteBalance, currentLens, getIsoNoise, getWhiteBalanceFilter]);

  return (
    <>
      {/* ISO Noise Overlay */}
      <div
        className="pointer-events-none fixed inset-0 z-50 mix-blend-overlay"
        style={{
          opacity: getIsoNoise(),
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '200px 200px',
        }}
      />

      {/* Focus Indicator (follows mouse) */}
      <FocusIndicator />
    </>
  );
}

function FocusIndicator() {
  const { focusMode } = useCameraContext();

  useEffect(() => {
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      const indicator = document.getElementById('focus-indicator');
      if (indicator && focusMode !== 'manual') {
        indicator.style.left = `${mouseX}px`;
        indicator.style.top = `${mouseY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [focusMode]);

  if (focusMode === 'manual') return null;

  return (
    <div
      id="focus-indicator"
      className="fixed pointer-events-none z-50 hidden lg:block"
      style={{
        width: '60px',
        height: '60px',
        border: '2px solid var(--accent)',
        transform: 'translate(-50%, -50%)',
        transition: 'opacity 0.2s',
      }}
    >
      {/* Crosshair */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-accent" />
      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-accent" />

      {/* Corner brackets */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent" />
    </div>
  );
}
