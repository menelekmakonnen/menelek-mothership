import { useEffect, useMemo, useState } from 'react';
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
  const {
    activeGalleriaSection,
    navigateGalleriaSection,
    getGalleriaSectionMeta,
    listGalleriaSections,
    switchGalleriaSection,
    iso,
    aperture,
    shutterSpeed,
    batteryLevel,
  } = useCameraContext();

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

  const showGalleriaNav = Boolean(showGalleriaChrome && galleriaSectionId);
  const galleriaMeta = galleriaSectionId ? getGalleriaSectionMeta(galleriaSectionId) : null;
  const galleriaDetail = galleriaSectionId ? getGalleriaSectionDetail(galleriaSectionId) : null;
  const shutterLabel = `1/${Math.max(1, Math.round(shutterSpeed))}`;
  const apertureLabel = `ƒ/${aperture.toFixed(1)}`;

  const galleriaSections = useMemo(() => {
    if (!showGalleriaNav) return [];
    const sections = listGalleriaSections();
    return sections.map((section) => {
      const detail = getGalleriaSectionDetail(section.id);
      return { ...section, ...detail };
    });
  }, [listGalleriaSections, showGalleriaNav]);

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
              className="pointer-events-auto absolute left-4 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
              aria-label="Previous Galleria section"
              onClick={() => navigateGalleriaSection('prev', galleriaSectionId)}
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              type="button"
              className="pointer-events-auto absolute right-4 top-1/2 -translate-y-1/2 inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/70 text-white shadow-2xl transition hover:border-white/80 hover:bg-black/85"
              aria-label="Next Galleria section"
              onClick={() => navigateGalleriaSection('next', galleriaSectionId)}
            >
              <ChevronRight className="h-6 w-6" />
            </button>
            <div className="pointer-events-auto absolute inset-x-0 bottom-0 px-4 pb-6">
              <div className="mx-auto w-full max-w-6xl rounded-[30px] border border-white/10 bg-gradient-to-r from-black/80 via-black/65 to-black/80 p-5 shadow-[0_30px_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
                <div className="flex flex-wrap items-center gap-4 text-[11px] mono uppercase tracking-[0.35em] text-white/65">
                  <span>
                    ISO <span className="text-white">{iso}</span>
                  </span>
                  <span>
                    Shutter <span className="text-white">{shutterLabel}</span>
                  </span>
                  <span>
                    Aperture <span className="text-white">{apertureLabel}</span>
                  </span>
                  <span>
                    Battery <span className="text-white">{Math.max(0, Math.min(100, Math.round(batteryLevel)))}%</span>
                  </span>
                  <span className="hidden sm:inline">
                    Section <span className="text-white">{activeTitle}</span>
                  </span>
                </div>
                <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                  {galleriaSections.map((section) => {
                    const Icon = section.icon || GalleryHorizontalEnd;
                    const isActive = section.id === galleriaSectionId;
                    return (
                      <button
                        key={section.id}
                        type="button"
                        onClick={() => switchGalleriaSection(section.id)}
                        className={`group relative flex h-28 w-40 min-w-[10rem] flex-none overflow-hidden rounded-3xl border transition ${
                          isActive
                            ? 'border-white/80 shadow-[0_20px_60px_rgba(0,0,0,0.45)]'
                            : 'border-white/25 hover:border-white/60 hover:shadow-[0_15px_40px_rgba(0,0,0,0.35)]'
                        }`}
                        aria-label={`Switch to ${section.title}`}
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center"
                          style={{
                            backgroundImage: section.previewImage
                              ? `linear-gradient(135deg, rgba(6,10,18,0.6), rgba(6,10,18,0.9)), url(${section.previewImage})`
                              : undefined,
                          }}
                        />
                        <div className={`absolute inset-0 bg-gradient-to-br ${section.accent} opacity-50`} />
                        <div className="relative z-10 flex h-full w-full flex-col justify-between p-4 text-left text-white">
                          <div className="inline-flex items-center gap-2 text-[11px] mono uppercase tracking-[0.3em] text-white/80">
                            <Icon className="h-4 w-4" />
                            <span>{section.title}</span>
                          </div>
                          <div className="text-[10px] uppercase tracking-[0.55em] text-white/70">View</div>
                        </div>
                      </button>
                    );
                  })}
                  {!galleriaSections.length && (
                    <div className="flex h-24 flex-1 items-center justify-center rounded-3xl border border-dashed border-white/20 text-[11px] uppercase tracking-[0.4em] text-white/40">
                      No linked sections
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </BlurLayer>
  );

  return createPortal(lightbox, portalElement);
}
