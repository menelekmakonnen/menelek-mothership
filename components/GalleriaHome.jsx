import { useMemo } from 'react';
import { X, GalleryHorizontalEnd } from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import { useCameraContext } from '@/context/CameraContext';
import { getGalleriaSectionDetail } from '@/lib/galleriaSections';

export default function GalleriaHome() {
  const {
    isGalleriaHomeOpen,
    closeGalleriaHome,
    listGalleriaSections,
    openGalleriaSection,
    iso,
    aperture,
    shutterSpeed,
    batteryLevel,
  } = useCameraContext();

  const sections = listGalleriaSections();
  const cards = useMemo(() => {
    if (!sections.length) return [];
    return sections.map((section) => {
      const meta = getGalleriaSectionDetail(section.id);
      return { ...section, ...meta };
    });
  }, [sections]);

  if (!isGalleriaHomeOpen) return null;

  const handleOpen = (sectionId) => {
    closeGalleriaHome();
    requestAnimationFrame(() => {
      openGalleriaSection(sectionId, { viaGalleria: true });
    });
  };

  const shutterLabel = `1/${Math.max(1, Math.round(shutterSpeed))}`;
  const apertureLabel = `ƒ/${aperture.toFixed(1)}`;

  return (
    <FullscreenLightbox
      layerId="galleria-home"
      depth={15000}
      onClose={closeGalleriaHome}
      showGalleriaChrome={false}
      focusOnMount
    >
      <div className="flex min-h-full flex-col gap-8 bg-[rgba(4,6,12,0.92)] px-6 py-8 md:px-10">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="mono text-[11px] uppercase tracking-[0.45em] text-white/60">Camera-native gallery</p>
            <h2 className="text-3xl font-semibold text-white">The Galleria</h2>
          </div>
          <button
            type="button"
            onClick={closeGalleriaHome}
            className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-white/80 transition hover:border-white/60 hover:text-white"
            aria-label="Close Galleria"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="max-w-3xl text-base text-white/70">
          Dive into any media-heavy section instantly. Choose a destination to open its immersive lightbox with the same controls
          that power the camera HUD.
        </p>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {cards.length ? (
            cards.map((section) => {
              const Icon = section.icon || GalleryHorizontalEnd;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleOpen(section.id)}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left shadow-[0_25px_80px_rgba(0,0,0,0.45)] transition hover:-translate-y-1.5 hover:border-white/40"
                  aria-label={`Open ${section.title}`}
                >
                  <div className="absolute inset-0" aria-hidden="true">
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={{
                        backgroundImage: section.previewImage
                          ? `linear-gradient(145deg, rgba(0,0,0,0.55), rgba(6,10,18,0.85)), url(${section.previewImage})`
                          : undefined,
                      }}
                    />
                    <div className={`absolute inset-0 bg-gradient-to-br ${section.accent} opacity-70`} />
                  </div>
                  <div className="relative flex h-full flex-col justify-between gap-6 p-6">
                    <div className="inline-flex items-center gap-3 rounded-full bg-black/35 px-4 py-2 text-[11px] mono uppercase tracking-[0.35em] text-white/75">
                      <Icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    <p className="text-base text-white/85">{section.description}</p>
                    <div className="inline-flex items-center gap-3 text-sm font-semibold text-white">
                      Launch
                      <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-black/30 transition group-hover:border-white/80">
                        <span className="h-0.5 w-6 bg-white" />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })
          ) : (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/5 p-6 text-white/70">
              No Galleria-enabled sections are active yet.
            </div>
          )}
        </div>

        <div className="mt-auto rounded-[32px] border border-white/10 bg-gradient-to-r from-black/80 via-black/70 to-black/80 p-6 text-white/80 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
          <div className="flex flex-wrap items-center gap-6 text-[11px] mono uppercase tracking-[0.35em]">
            <div>
              ISO <span className="text-white">{iso}</span>
            </div>
            <div>
              Shutter <span className="text-white">{shutterLabel}</span>
            </div>
            <div>
              Aperture <span className="text-white">{apertureLabel}</span>
            </div>
            <div>
              Battery <span className="text-white">{Math.max(0, Math.min(100, Math.round(batteryLevel)))}%</span>
            </div>
            <div>
              Sections <span className="text-white">{cards.length}</span>
            </div>
          </div>
        </div>
      </div>
    </FullscreenLightbox>
  );
}
