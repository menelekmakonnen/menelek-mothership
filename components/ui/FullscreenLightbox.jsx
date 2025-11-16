import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BlurLayer from './BlurLayer';
import { useCameraContext } from '@/context/CameraContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

let activeLightboxCount = 0;

export default function FullscreenLightbox({
  children,
  layerId,
  depth = 24000,
  className = '',
  innerClassName = '',
  focusOnMount = true,
  lockGestures = true,
  onClose,
  galleriaSectionId,
  showGalleriaChrome = false,
}) {
  const [portalElement, setPortalElement] = useState(null);
  const { activeGalleriaSection, navigateGalleriaSection, getGalleriaSectionMeta } = useCameraContext();

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

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    activeLightboxCount += 1;
    document.body.classList.add('galleria-open');
    return () => {
      activeLightboxCount = Math.max(0, activeLightboxCount - 1);
      if (activeLightboxCount === 0) {
        document.body.classList.remove('galleria-open');
      }
    };
  }, []);

  if (!portalElement) {
    return null;
  }

  const showGalleriaNav = Boolean(
    showGalleriaChrome && galleriaSectionId && activeGalleriaSection === galleriaSectionId
  );
  const galleriaMeta = galleriaSectionId ? getGalleriaSectionMeta(galleriaSectionId) : null;

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
        {showGalleriaNav && (
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <div className="flex items-center justify-between px-6 pt-6 text-white/80">
              <button
                type="button"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-4 py-2 text-xs mono uppercase tracking-[0.35em] hover:border-white/60 hover:text-white"
                onClick={() => navigateGalleriaSection('prev')}
              >
                <ChevronLeft className="h-4 w-4" /> Prev Section
              </button>
              <div className="rounded-full bg-black/50 px-4 py-2 text-[11px] mono uppercase tracking-[0.5em] text-white/70">
                Galleria · {galleriaMeta?.label || 'Gallery'}
              </div>
              <button
                type="button"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/60 px-4 py-2 text-xs mono uppercase tracking-[0.35em] hover:border-white/60 hover:text-white"
                onClick={() => navigateGalleriaSection('next')}
              >
                Next Section <ChevronRight className="h-4 w-4" />
              </button>
            </div>
            <div className="px-6 pb-6 text-right text-[11px] mono uppercase tracking-[0.45em] text-white/60">
              Arrow keys stay inside the Galleria
            </div>
          </div>
        )}
      </div>
    </BlurLayer>
  );

  return createPortal(lightbox, portalElement);
}
