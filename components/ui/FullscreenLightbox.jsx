import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import BlurLayer from './BlurLayer';
import { useCameraContext } from '@/context/CameraContext';
import {
  ArrowDownToLine,
  ArrowUpToLine,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontalEnd,
} from 'lucide-react';
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
  onWheelNavigate,
  breadcrumbs = [],
  galleriaLevel = 'single',
  onNavigateLeft,
  onNavigateRight,
  enableGalleryNav = true,
  slideshowControl = null,
}) {
  const [portalElement, setPortalElement] = useState(null);
  const {
    activeGalleriaSection,
    navigateGalleriaSection,
    getGalleriaSectionMeta,
    listGalleriaSections,
    openGalleriaSection,
    openGalleriaHome,
  } = useCameraContext();
  const scrollRef = useRef(null);

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
  const restrictSectionSwitch = galleriaLevel && galleriaLevel !== 'gallery';
  const galleriaMeta = galleriaSectionId ? getGalleriaSectionMeta(galleriaSectionId) : null;
  const galleriaDetail = galleriaSectionId ? getGalleriaSectionDetail(galleriaSectionId) : null;
  const galleryNavItems = useMemo(() => {
    if (!showGalleriaNav || !enableGalleryNav) return [];
    return listGalleriaSections();
  }, [enableGalleryNav, listGalleriaSections, showGalleriaNav]);

  const combinedBreadcrumbs = useMemo(() => {
    if (!showGalleriaNav) return [];
    const items = [];
    items.push({
      label: 'Galleria',
      action: () => openGalleriaHome(),
    });
    if (galleriaDetail?.title) {
      items.push({
        label: galleriaDetail.title,
        action: () => openGalleriaSection(galleriaSectionId, {
          viaGalleria: true,
          startInGallery: true,
        }),
      });
    }
    breadcrumbs.forEach((crumb) => {
      if (!crumb?.label) return;
      items.push(crumb);
    });
    return items;
  }, [breadcrumbs, galleriaDetail?.title, galleriaSectionId, openGalleriaHome, openGalleriaSection, showGalleriaNav]);

  const handleNavigate = useCallback(
    (direction) => {
      if (direction === 'prev') {
        if (typeof onNavigateLeft === 'function') {
          const handled = onNavigateLeft();
          if (handled !== false) return;
        }
      } else if (typeof onNavigateRight === 'function') {
        const handled = onNavigateRight();
        if (handled !== false) return;
      }

      if (restrictSectionSwitch || !showGalleriaNav) return;
      navigateGalleriaSection(direction === 'prev' ? 'prev' : 'next', galleriaSectionId);
    },
    [
      galleriaSectionId,
      navigateGalleriaSection,
      onNavigateLeft,
      onNavigateRight,
      restrictSectionSwitch,
      showGalleriaNav,
    ]
  );

  const handleScrollJump = (position) => {
    const node = scrollRef.current;
    if (!node) return;
    const top = position === 'bottom' ? node.scrollHeight : 0;
    try {
      node.scrollTo({ top, behavior: 'smooth' });
    } catch (error) {
      node.scrollTop = top;
    }
  };

  const shouldInterceptWheel = useCallback(
    (target) => {
      if (!target || !scrollRef.current) return true;
      let node = target;
      while (node && node !== scrollRef.current) {
        if (node.dataset?.galleriaWheel === 'allow' || node.dataset?.galleriaWheel === 'custom') {
          return false;
        }
        node = node.parentNode || node.host || null;
      }
      return true;
    },
    []
  );

  const handleWheelEvent = useCallback(
    (event) => {
      if (typeof onWheelNavigate !== 'function') return;
      if (!shouldInterceptWheel(event.target)) return;
      if (Math.abs(event.deltaY) < 4 && Math.abs(event.deltaX) < 4) return;
      event.preventDefault();
      const direction = event.deltaY > 0 || event.deltaX > 0 ? 'next' : 'prev';
      onWheelNavigate(direction, event);
    },
    [onWheelNavigate, shouldInterceptWheel]
  );

  const handleKeyNavigation = useCallback(
    (event) => {
      if (!showGalleriaNav) return;
      if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
        event.preventDefault();
        handleNavigate(event.key === 'ArrowLeft' ? 'prev' : 'next');
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        handleScrollJump('top');
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        handleScrollJump('bottom');
      }
    },
    [handleNavigate, handleScrollJump, showGalleriaNav]
  );

  useEffect(() => {
    if (!showGalleriaNav) return undefined;
    const listener = (event) => {
      if (event.defaultPrevented) return;
      handleKeyNavigation(event);
    };
    window.addEventListener('keydown', listener);
    return () => window.removeEventListener('keydown', listener);
  }, [handleKeyNavigation, showGalleriaNav]);

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
      <div
        ref={scrollRef}
        className={`relative flex-1 overflow-y-auto overflow-x-hidden ${innerClassName}`.trim()}
        onWheel={handleWheelEvent}
      >
        {children}
        {showGalleriaNav && (
          <div className="pointer-events-none absolute inset-0">
            <div className="pointer-events-auto flex flex-col gap-3 px-4 pt-4 sm:px-6">
              <div className="flex flex-wrap items-center gap-2 rounded-full border border-white/10 bg-black/70 px-4 py-2 text-[11px] mono uppercase tracking-[0.35em] text-white/80 shadow-[0_18px_46px_rgba(0,0,0,0.5)]">
                {combinedBreadcrumbs.map((crumb, index) => (
                  <div key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                    {index > 0 && <span className="text-white/40">/</span>}
                    <button
                      type="button"
                      onClick={() => crumb.action && crumb.action()}
                      className={`transition ${crumb.action ? 'text-white hover:text-white' : 'text-white/60 cursor-default'}`}
                      disabled={!crumb.action}
                    >
                      {crumb.label}
                    </button>
                  </div>
                ))}
                <span className="ml-auto rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.4em] text-white/70">
                  {galleriaLevel}
                </span>
              </div>

              {galleryNavItems.length > 1 && (
                <div className="pointer-events-auto flex flex-wrap gap-2 rounded-3xl border border-white/10 bg-[rgba(4,6,12,0.82)] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)]">
                  {galleryNavItems.map((item) => {
                    const ItemIcon = item.icon || ActiveIcon;
                    const isActive = item.id === activeGalleriaSection;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openGalleriaSection(item.id, { viaGalleria: true, startInGallery: true })}
                        className={`flex items-center gap-2 rounded-2xl border px-3 py-2 text-sm text-white transition ${
                          isActive
                            ? 'border-emerald-300/70 bg-emerald-400/10'
                            : 'border-white/15 bg-white/5 hover:border-white/40'
                        }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="pointer-events-auto absolute left-8 top-1/2 hidden -translate-y-1/2 lg:flex">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
                aria-label="Previous"
                onClick={() => handleNavigate('prev')}
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            </div>
            <div className="pointer-events-auto absolute right-8 top-1/2 hidden -translate-y-1/2 lg:flex">
              <button
                type="button"
                className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
                aria-label="Next"
                onClick={() => handleNavigate('next')}
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            <div className="pointer-events-auto fixed bottom-6 right-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => handleScrollJump('top')}
                className="camera-hud inline-flex h-11 w-11 items-center justify-center rounded-full"
                aria-label="Back to top"
              >
                <ArrowUpToLine className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => handleScrollJump('bottom')}
                className="camera-hud inline-flex h-11 w-11 items-center justify-center rounded-full"
                aria-label="Skip to bottom"
              >
                <ArrowDownToLine className="h-5 w-5" />
              </button>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-4 -translate-x-1/2 rounded-full border border-white/20 bg-black/70 px-6 py-2 text-[11px] mono uppercase tracking-[0.45em] text-white/80 shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
              {ActiveIcon && <ActiveIcon className="mr-2 inline h-4 w-4" />}Galleria · {activeTitle}
            </div>
          </div>
        )}
      </div>
      {slideshowControl && (
        <div className="pointer-events-auto absolute left-1/2 top-20 -translate-x-1/2">
          {slideshowControl}
        </div>
      )}
    </BlurLayer>
  );

  return createPortal(lightbox, portalElement);
}
