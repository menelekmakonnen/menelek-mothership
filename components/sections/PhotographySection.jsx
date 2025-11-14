import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import {
  Grid,
  Grid2x2,
  Grid3x3,
  Aperture,
  User,
  Mountain,
  Building2,
  Sparkles,
  SlidersHorizontal,
  Focus,
  X,
} from 'lucide-react';
import BlurLayer from '@/components/ui/BlurLayer';

const albums = [
  {
    id: 'portraits',
    name: 'Portrait Atlas',
    count: 24,
    gradient: 'from-emerald-500 to-teal-500',
    icon: User,
    tagline: 'Studio & editorial characters',
  },
  {
    id: 'landscapes',
    name: 'Earth Lines',
    count: 28,
    gradient: 'from-sky-500 to-cyan-500',
    icon: Mountain,
    tagline: 'Atmospheric nature studies',
  },
  {
    id: 'urban',
    name: 'Urban Stories',
    count: 32,
    gradient: 'from-purple-500 to-indigo-500',
    icon: Building2,
    tagline: 'City lights & architecture',
  },
  {
    id: 'events',
    name: 'Live Moments',
    count: 36,
    gradient: 'from-amber-500 to-rose-500',
    icon: Sparkles,
    tagline: 'Weddings, concerts & culture',
  },
];

const albumImages = Object.fromEntries(
  albums.map((album) => [
    album.id,
    Array.from({ length: album.count }, (_, index) => {
      const primeStops = [1.8, 2.2, 2.8, 3.5];
      const shutters = [125, 160, 200, 250, 320];
      const moods = ['amber', 'cool', 'mono'];
      return {
        id: `${album.id}-${index}`,
        title: `${album.name} ${index + 1}`,
        iso: 160 + (index % 8) * 80,
        aperture: primeStops[index % primeStops.length],
        shutter: shutters[index % shutters.length],
        focalLength: [35, 50, 85, 105][index % 4],
        mood: moods[index % moods.length],
      };
    }),
  ])
);

const viewModes = [
  { id: 'detail', label: 'Large', icon: Grid2x2, className: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' },
  { id: 'gallery', label: 'Gallery', icon: Grid3x3, className: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' },
  { id: 'contact', label: 'Contact', icon: Grid, className: 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7' },
];

const sortModes = [
  { id: 'chronological', label: 'Chronological' },
  { id: 'aperture', label: 'Aperture' },
  { id: 'mood', label: 'Mood Map' },
];

const colorProfiles = [
  { id: 'neutral', label: 'Neutral Science' },
  { id: 'vivid', label: 'Vivid Chrome' },
  { id: 'noir', label: 'Mono Noir' },
];

export default function PhotographySection() {
  const [viewMode, setViewMode] = useState('gallery');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [sortMode, setSortMode] = useState('chronological');
  const [activeImage, setActiveImage] = useState(null);
  const [lightboxSettings, setLightboxSettings] = useState({
    focusDepth: 48,
    clarity: 0,
    colorProfile: 'neutral',
    overlays: { peaking: true, waveform: true, zebra: false },
  });

  useEffect(() => {
    if (!activeImage) return;
    setLightboxSettings({
      focusDepth: 48,
      clarity: 0,
      colorProfile: 'neutral',
      overlays: { peaking: true, waveform: true, zebra: false },
    });
  }, [activeImage]);

  const sortedImages = useMemo(() => {
    if (!selectedAlbum) return [];
    const images = [...(albumImages[selectedAlbum.id] || [])];
    if (sortMode === 'aperture') {
      images.sort((a, b) => a.aperture - b.aperture);
    } else if (sortMode === 'mood') {
      images.sort((a, b) => a.mood.localeCompare(b.mood));
    }
    return images;
  }, [selectedAlbum, sortMode]);

  const previewFilter = useMemo(() => {
    const profile = lightboxSettings.colorProfile;
    const profileLooks = {
      neutral: { saturate: 1, contrast: 1, hue: 0 },
      vivid: { saturate: 1.25, contrast: 1.1, hue: 6 },
      noir: { saturate: 0, contrast: 1.18, hue: 0 },
    };
    const look = profileLooks[profile] || profileLooks.neutral;
    const clarityBoost = 1 + lightboxSettings.clarity * 0.12;
    return `saturate(${look.saturate}) contrast(${look.contrast * clarityBoost}) hue-rotate(${look.hue}deg)`;
  }, [lightboxSettings]);

  const focusOverlayStrength = useMemo(() => lightboxSettings.focusDepth / 100, [lightboxSettings.focusDepth]);

  return (
    <div className="w-full min-h-screen p-8 pt-32 pb-32">
      <div className="max-w-7xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-6xl font-bold mb-4"
        >
          Photography
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-[color:var(--text-secondary)] mb-12"
        >
          Camera-first storytelling across continents and timelines.
        </motion.p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {albums.map((album, index) => {
            const Icon = album.icon;
            return (
              <motion.button
                key={album.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 * index }}
                onClick={() => setSelectedAlbum(album)}
                className="group text-left"
              >
                <div className={`aspect-square rounded-3xl bg-gradient-to-br ${album.gradient} p-6 flex flex-col justify-between shadow-xl transition-transform group-hover:-translate-y-2`}>
                  <Icon className="w-10 h-10 text-white" />
                  <div className="text-white/80 text-sm mono uppercase tracking-[0.4em]">Open</div>
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">{album.name}</h3>
                  <p className="text-[color:var(--text-secondary)] text-sm">{album.tagline}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      <AnimatePresence>
        {selectedAlbum && (
          <BlurLayer
            key={selectedAlbum.id}
            layerId={`photography-album-${selectedAlbum.id}`}
            depth={1450}
            type="interactive"
            focusOnMount
            lockGestures
            onClose={() => {
              setActiveImage(null);
              setSelectedAlbum(null);
            }}
            className="fixed left-0 right-0 bottom-0 top-[calc(var(--camera-top-rail-height,112px)+96px)] z-[1800] flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="relative w-full h-full max-w-6xl mx-auto px-6 py-8 max-h-[calc(100%-2rem)]"
            >
              <div className="absolute inset-0 rounded-3xl bg-[rgba(6,8,14,0.92)] border border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)]" />
              <div className="relative z-10 h-full flex flex-col gap-6 overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveImage(null);
                        setSelectedAlbum(null);
                      }}
                      className="text-green-300 hover:text-green-100 transition-colors text-sm mono"
                    >
                      ← Back to Library
                    </button>
                    <h2 className="text-3xl font-bold">{selectedAlbum.name}</h2>
                    <p className="text-[color:var(--text-secondary)]">
                      {selectedAlbum.count} curated photographs · {selectedAlbum.tagline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {viewModes.map((mode) => {
                      const Icon = mode.icon;
                      const isActive = viewMode === mode.id;
                      return (
                        <button
                          key={mode.id}
                          onClick={() => setViewMode(mode.id)}
                          className={`px-4 py-2 rounded-xl flex items-center gap-2 mono text-xs transition-all ${
                            isActive
                              ? 'bg-green-500/20 text-green-300 border border-green-400/60'
                              : 'bg-white/5 border border-white/10 hover:border-white/30'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {mode.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <SlidersHorizontal className="w-4 h-4 text-green-300" />
                  {sortModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setSortMode(mode.id)}
                      className={`px-3 py-1 rounded-full text-[11px] mono uppercase tracking-[0.3em] transition-colors ${
                        sortMode === mode.id
                          ? 'bg-green-500/20 text-green-300 border border-green-400/40'
                          : 'bg-white/5 border border-white/10 text-white/70 hover:text-white'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                </div>

                <div className={`grid flex-1 gap-4 overflow-y-auto pr-2 ${viewModes.find((mode) => mode.id === viewMode)?.className}`}>
                  {sortedImages.map((image, index) => (
                    <motion.button
                      key={image.id}
                      onClick={() => setActiveImage(image)}
                      className="relative aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-zinc-900/80 to-zinc-800/60 border border-white/10 group"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.01 * index }}
                    >
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_60%)] opacity-60 group-hover:opacity-80 transition-opacity" />
                      <div className="absolute inset-0 flex flex-col justify-between p-3 text-left">
                        <div className="text-[11px] mono uppercase tracking-[0.3em] text-white/60">{image.mood}</div>
                        <div className="space-y-1">
                          <div className="text-sm font-semibold text-white/90">{image.title}</div>
                          <div className="text-[10px] text-white/60 mono">
                            f/{image.aperture.toFixed(1)} · 1/{image.shutter} · ISO {image.iso}
                          </div>
                        </div>
                      </div>
                    </motion.button>
                  ))}
                </div>

                <AnimatePresence>
                  {activeImage && (
                    <BlurLayer
                      key={activeImage.id}
                      layerId={`lightbox-${activeImage.id}`}
                      depth={1680}
                      type="interactive"
                      lockGestures
                      onClose={() => setActiveImage(null)}
                      className="absolute inset-0 flex items-center justify-center px-4 py-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        className="relative w-full max-w-5xl mx-auto bg-[rgba(4,6,10,0.94)] border border-white/10 rounded-3xl shadow-[0_40px_80px_rgba(0,0,0,0.65)] overflow-hidden"
                      >
                        <div className="flex flex-col lg:flex-row">
                          <div className="relative lg:w-2/3 p-6 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-2xl font-semibold">{activeImage.title}</h3>
                                <p className="text-[color:var(--text-secondary)] text-sm">
                                  f/{activeImage.aperture.toFixed(1)} · 1/{activeImage.shutter} · ISO {activeImage.iso} · {activeImage.focalLength}mm
                                </p>
                              </div>
                              <button
                                onClick={() => setActiveImage(null)}
                                className="camera-hud rounded-full w-10 h-10 flex items-center justify-center"
                                aria-label="Close lightbox"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="relative flex-1 rounded-2xl overflow-hidden border border-white/10 bg-black/60">
                              <div
                                className="absolute inset-0"
                                style={{ filter: previewFilter }}
                              >
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_65%)]" />
                                <div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{
                                    backdropFilter: `blur(${Math.max(0, 24 - focusOverlayStrength * 24)}px)`
                                  }}
                                />
                              </div>
                              {lightboxSettings.overlays.peaking && (
                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(90deg, rgba(255,76,76,0.18) 0px, rgba(255,76,76,0.18) 6px, transparent 6px, transparent 14px)' }} />
                              )}
                              {lightboxSettings.overlays.zebra && (
                                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, rgba(255,255,255,0.12) 0px, rgba(255,255,255,0.12) 10px, transparent 10px, transparent 20px)' }} />
                              )}
                              {lightboxSettings.overlays.waveform && (
                                <div className="absolute bottom-4 left-4 right-4 h-16 bg-black/60 border border-white/10 rounded-lg px-3 py-2 flex items-end gap-1">
                                  {Array.from({ length: 32 }).map((_, i) => (
                                    <div
                                      key={i}
                                      className="flex-1 bg-gradient-to-t from-green-500/30 via-green-400/50 to-green-200/80 rounded"
                                      style={{ height: `${40 + Math.sin((i + focusOverlayStrength) * 0.5) * 20 + lightboxSettings.clarity * 5}%` }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="lg:w-1/3 border-t lg:border-l border-white/10 p-6 space-y-5 bg-black/40">
                            <div>
                              <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-3">Tuning Suite</h4>
                              <div className="space-y-3">
                                <label className="flex flex-col gap-1 text-xs">
                                  <span className="mono uppercase tracking-[0.3em] text-white/60">Focus Depth</span>
                                  <input
                                    type="range"
                                    min={0}
                                    max={100}
                                    value={lightboxSettings.focusDepth}
                                    onChange={(e) =>
                                      setLightboxSettings((prev) => ({ ...prev, focusDepth: Number(e.target.value) }))
                                    }
                                    className="camera-slider"
                                  />
                                </label>
                                <label className="flex flex-col gap-1 text-xs">
                                  <span className="mono uppercase tracking-[0.3em] text-white/60">Clarity Microcontrast</span>
                                  <input
                                    type="range"
                                    min={-4}
                                    max={4}
                                    value={lightboxSettings.clarity}
                                    onChange={(e) =>
                                      setLightboxSettings((prev) => ({ ...prev, clarity: Number(e.target.value) }))
                                    }
                                    className="camera-slider"
                                  />
                                </label>
                              </div>
                            </div>

                            <div>
                              <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-3">Colour Science</h4>
                              <div className="flex flex-wrap gap-2">
                                {colorProfiles.map((profile) => (
                                  <button
                                    key={profile.id}
                                    onClick={() =>
                                      setLightboxSettings((prev) => ({ ...prev, colorProfile: profile.id }))
                                    }
                                    className={`px-3 py-1 rounded-full text-[11px] mono uppercase tracking-[0.3em] transition-colors ${
                                      lightboxSettings.colorProfile === profile.id
                                        ? 'bg-green-500/20 text-green-300 border border-green-400/50'
                                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white'
                                    }`}
                                  >
                                    {profile.label}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <h4 className="mono text-[11px] uppercase tracking-[0.4em] text-white/50 mb-3">Assist Modules</h4>
                              <div className="space-y-2">
                                {[
                                  { key: 'peaking', label: 'Focus Peaking' },
                                  { key: 'waveform', label: 'Waveform Monitor' },
                                  { key: 'zebra', label: 'Zebra Warning' },
                                ].map((overlay) => (
                                  <button
                                    key={overlay.key}
                                    onClick={() =>
                                      setLightboxSettings((prev) => ({
                                        ...prev,
                                        overlays: {
                                          ...prev.overlays,
                                          [overlay.key]: !prev.overlays[overlay.key],
                                        },
                                      }))
                                    }
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs mono tracking-[0.3em] ${
                                      lightboxSettings.overlays[overlay.key]
                                        ? 'bg-green-500/15 text-green-300 border border-green-400/40'
                                        : 'bg-white/5 border border-white/10 text-white/60 hover:text-white/80'
                                    }`}
                                  >
                                    <span>{overlay.label}</span>
                                    {lightboxSettings.overlays[overlay.key] ? <Focus className="w-4 h-4" /> : <Aperture className="w-4 h-4" />}
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </BlurLayer>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </BlurLayer>
        )}
      </AnimatePresence>
    </div>
  );
}
