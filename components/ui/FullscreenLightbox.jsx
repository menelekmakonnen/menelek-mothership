import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BlurLayer from './BlurLayer';

export default function FullscreenLightbox({
  children,
  layerId,
  depth = 5200,
  className = '',
  innerClassName = '',
  focusOnMount = true,
  lockGestures = true,
  onClose,
}) {
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const node = document.createElement('div');
    node.className = 'fullscreen-lightbox-portal';
    document.body.appendChild(node);
    setPortalElement(node);
    return () => {
      document.body.removeChild(node);
    };
  }, []);

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

  if (!portalElement) {
    return null;
  }

  const lightbox = (
    <BlurLayer
      layerId={layerId}
      depth={depth}
      type="interactive"
      focusOnMount={focusOnMount}
      lockGestures={lockGestures}
      onClose={onClose}
      className={`fixed inset-0 flex flex-col items-stretch justify-stretch overflow-hidden ${className}`.trim()}
    >
      <div className={`relative flex-1 overflow-y-auto overflow-x-hidden ${innerClassName}`.trim()}>
        {children}
      </div>
    </BlurLayer>
  );

  return createPortal(lightbox, portalElement);
}
