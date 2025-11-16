import { useMemo } from 'react';
import { Camera, Film, BookOpen, Brain, Video, Image as ImageIcon, X, GalleryHorizontalEnd } from 'lucide-react';
import FullscreenLightbox from '@/components/ui/FullscreenLightbox';
import { useCameraContext } from '@/context/CameraContext';

const SECTION_DETAILS = {
  photography: {
    title: 'Photography',
    description: 'MMM Media beauty, travel, and professional shoots streamed from Drive.',
    icon: Camera,
    accent: 'from-emerald-500/70 via-teal-500/70 to-slate-900/90',
  },
  'ai-albums': {
    title: 'AI Albums',
    description: 'Custom diffusion explorations, prompts, and conceptual artboards.',
    icon: ImageIcon,
    accent: 'from-fuchsia-500/70 via-rose-500/70 to-slate-900/90',
  },
  films: {
    title: 'Films & Music Videos',
    description: 'Narrative features, shorts, and commissioned music films.',
    icon: Film,
    accent: 'from-amber-500/70 via-orange-500/70 to-slate-900/90',
  },
  'video-edits': {
    title: 'Epic Video Edits',
    description: 'High-energy reels parsed directly from Instagram and YouTube.',
    icon: Video,
    accent: 'from-indigo-500/70 via-purple-500/70 to-slate-900/90',
  },
  loremaker: {
    title: 'Loremaker Universe',
    description: 'Living character bible pulled from the online spreadsheet.',
    icon: BookOpen,
    accent: 'from-cyan-500/70 via-blue-500/70 to-slate-900/90',
  },
  'ai-projects': {
    title: 'AI Projects',
    description: 'Interactive demos and prompts across workshops and starterclasses.',
    icon: Brain,
    accent: 'from-sky-500/70 via-cyan-500/70 to-slate-900/90',
  },
};

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
      const meta = SECTION_DETAILS[section.id] || {
        title: section.label,
        description: 'Open this experience inside the viewport-filling Galleria.',
        icon: GalleryHorizontalEnd,
        accent: 'from-slate-600/80 via-slate-700/80 to-slate-900/90',
      };
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
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => handleOpen(section.id)}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 text-left transition hover:-translate-y-1 hover:border-white/30"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${section.accent}`} aria-hidden="true" />
                  <div className="relative flex flex-col gap-4 p-6">
                    <div className="inline-flex items-center gap-3 rounded-full bg-black/30 px-4 py-2 text-[11px] mono uppercase tracking-[0.35em] text-white/75">
                      <Icon className="h-4 w-4" />
                      <span>{section.title}</span>
                    </div>
                    <p className="text-base text-white/80">{section.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Launch <span className="h-px w-6 bg-white/60" />
                    </span>
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

        <div className="mt-auto rounded-3xl border border-white/10 bg-black/40 p-6 text-white/80">
          <div className="flex flex-wrap items-center gap-6 text-sm mono uppercase tracking-[0.35em]">
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
          </div>
        </div>
      </div>
    </FullscreenLightbox>
  );
}
