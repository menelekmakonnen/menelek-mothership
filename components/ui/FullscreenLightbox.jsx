import { useEffect } from 'react';
import BlurLayer from './BlurLayer';

export default function FullscreenLightbox({
  children,
  layerId,
  depth = 2200,
  className = '',
  focusOnMount = true,
  lockGestures = true,
  onClose,
}) {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.requestAnimationFrame(() => {
      try {
        window.scrollTo({ top: 0, behavior: 'auto' });
      } catch (error) {
        window.scrollTo(0, 0);
      }
    });
  }, []);

  return (
    <BlurLayer
      layerId={layerId}
      depth={depth}
      type="interactive"
      focusOnMount={focusOnMount}
      lockGestures={lockGestures}
      onClose={onClose}
      className={`fixed inset-0 flex items-center justify-center p-4 sm:p-8 ${className}`.trim()}
    >
      {children}
    </BlurLayer>
  );
}
