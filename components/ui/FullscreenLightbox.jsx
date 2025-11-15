import { useEffect } from 'react';
import BlurLayer from './BlurLayer';

export default function FullscreenLightbox({
  children,
  layerId,
  depth = 2200,
  className = '',
  innerClassName = '',
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
      className={`fixed inset-0 flex flex-col items-stretch justify-stretch overflow-hidden ${className}`.trim()}
    >
      <div className={`relative flex-1 overflow-hidden ${innerClassName}`.trim()}>
        {children}
      </div>
    </BlurLayer>
  );
}
