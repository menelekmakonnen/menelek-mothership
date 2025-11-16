import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import BlurLayer from './BlurLayer';
import { useCameraContext } from '@/context/CameraContext';
import { ChevronLeft, ChevronRight, GalleryHorizontalEnd } from 'lucide-react';
import { getGalleriaSectionDetail } from '@/lib/galleriaSections';

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

  const showGalleriaNav = Boolean(showGalleriaChrome && galleriaSectionId);
  const galleriaMeta = galleriaSectionId ? getGalleriaSectionMeta(galleriaSectionId) : null;
  const galleriaDetail = galleriaSectionId ? getGalleriaSectionDetail(galleriaSectionId) : null;

  if (!portalElement) {
    return null;
  }

  const ActiveIcon = galleriaDetail?.icon || GalleryHorizontalEnd;
  const activeTitle = galleriaMeta?.label || galleriaDetail?.title || 'Galleria';

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
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/20 bg-black/70 px-6 py-2 text-[11px] mono uppercase tracking-[0.45em] text-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
              {ActiveIcon && <ActiveIcon className="mr-2 inline h-4 w-4" />}Galleria · {activeTitle}
            </div>
            <button
              type="button"
              className="pointer-events-auto absolute left-10 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
              aria-label="Previous Galleria section"
              onClick={() => navigateGalleriaSection('prev', galleriaSectionId)}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="pointer-events-auto absolute right-10 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
              aria-label="Next Galleria section"
              onClick={() => navigateGalleriaSection('next', galleriaSectionId)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
         </div>
       )}
      </div>
    </BlurLayer>
  );

  return createPortal(lightbox, portalElement);
}
