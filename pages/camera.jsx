import { useState, useEffect, useMemo, useRef } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Aperture,
  Camera,
  CloudSun,
  Cloudy,
  Droplets,
  Flashlight,
  Gauge,
  Moon,
  Play,
  Settings2,
  Sun,
  Thermometer,
  Video,
  Vibrate,
  Wand2,
  ZoomIn,
} from 'lucide-react';

const lenses = [
  {
    name: '50mm Prime',
    subtitle: 'The storyteller',
    vignette: 0.1,
    zoom: 1,
    perspective: 0,
    description: 'Balanced classic with cinematic compression and creamy falloff.',
  },
  {
    name: '24mm Wide',
    subtitle: 'Immersive explorer',
    vignette: 0.2,
    zoom: 0.85,
    perspective: 10,
    description: 'Pulls you into the scene with wide vistas and architectural drama.',
  },
  {
    name: '85mm Portrait',
    subtitle: 'Intimate focus',
    vignette: 0.08,
    zoom: 1.2,
    perspective: -8,
    description: 'Elegant compression and flattering depth for character-driven work.',
  },
  {
    name: '35mm Documentary',
    subtitle: 'Everyday auteur',
    vignette: 0.12,
    zoom: 0.95,
    perspective: 5,
    description: 'Natural perspective ideal for narrative coverage and reportage.',
  },
  {
    name: '16mm Ultra-Wide',
    subtitle: 'Bold visionary',
    vignette: 0.25,
    zoom: 0.75,
    perspective: 16,
    description: 'Surreal point-of-view with dramatic lines and immersive scale.',
  },
];

const shutterStops = [
  { label: '1/8000', value: 1 / 8000 },
  { label: '1/4000', value: 1 / 4000 },
  { label: '1/2000', value: 1 / 2000 },
  { label: '1/1000', value: 1 / 1000 },
  { label: '1/500', value: 1 / 500 },
  { label: '1/250', value: 1 / 250 },
  { label: '1/125', value: 1 / 125 },
  { label: '1/60', value: 1 / 60 },
  { label: '1/30', value: 1 / 30 },
  { label: '1/15', value: 1 / 15 },
  { label: '1/8', value: 1 / 8 },
  { label: '1/4', value: 1 / 4 },
  { label: '1/2', value: 1 / 2 },
  { label: '1"', value: 1 },
];

const apertureStops = [1.2, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16];
const isoStops = [100, 160, 200, 400, 640, 800, 1600, 3200, 6400];

const whiteBalancePresets = [
  { label: 'Auto', value: 5600 },
  { label: 'Tungsten', value: 3200 },
  { label: 'Fluorescent', value: 4200 },
  { label: 'Daylight', value: 5600 },
  { label: 'Cloudy', value: 6500 },
  { label: 'Shade', value: 7000 },
];

const hudModes = [
  { id: 'full', label: 'All HUD' },
  { id: 'minimal', label: 'Essentials' },
  { id: 'off', label: 'No HUD' },
];

const controlModes = [
  { id: 'all', label: 'All Buttons' },
  { id: 'essential', label: 'Key Controls' },
  { id: 'off', label: 'Minimal' },
];

const contentSections = [
  {
    id: 'showreel',
    badge: 'Featured Film & Motion',
    title: 'Showreel 2024',
    description:
      'A visceral montage of directing, cinematography, and cutting-edge post work that defines the Menelek signature.',
    cta: { label: 'Play Showreel', href: '#', icon: Play },
  },
  {
    id: 'films',
    badge: 'Narrative & Documentary',
    title: 'Featured Films',
    description:
      'Award-winning shorts, immersive documentaries, and cinematic experiments at the intersection of culture and futurism.',
    cta: { label: 'View Filmography', href: '#films', icon: Video },
  },
  {
    id: 'photo',
    badge: 'Stills & Campaigns',
    title: 'Photography Portfolio',
    description:
      'Editorial portraiture, experimental fashion, and documentary stills with tactile atmosphere and immersive lighting.',
    cta: { label: 'Open Gallery', href: '#photography', icon: Camera },
  },
  {
    id: 'books',
    badge: 'Storyworlds',
    title: 'Novels & LoreMaker Universe',
    description:
      'Immersive narratives that extend beyond the screen, bridging literature, world-building, and cinematic mythology.',
    cta: { label: 'Enter Lore', href: '#books', icon: Wand2 },
  },
  {
    id: 'education',
    badge: 'Learning',
    title: 'AI Starterclass',
    description:
      'Hands-on curriculum for creators harnessing AI in storytelling, production design, and real-time visuals.',
    cta: { label: 'Join Masterclass', href: '#starterclass', icon: Settings2 },
  },
  {
    id: 'blog',
    badge: 'Dispatches',
    title: 'Blog & Process Journal',
    description:
      'Behind-the-scenes notes, creative process breakdowns, and thought leadership on the future of image-making.',
    cta: { label: 'Read Journal', href: '#blog', icon: CloudSun },
  },
  {
    id: 'contact',
    badge: 'Commissions',
    title: 'Collaborate',
    description:
      'Films, branded content, photography campaigns, immersive experiences. Let’s craft the next iconic moment together.',
    cta: { label: 'Contact Menelek', href: '#contact', icon: Vibrate },
  },
];

const luxuryGradient =
  'conic-gradient(from 160deg at 50% 50%, rgba(255, 211, 129, 0.12), rgba(255, 78, 80, 0.14), rgba(65, 88, 208, 0.12), rgba(200, 109, 215, 0.18), rgba(255, 211, 129, 0.12))';

export default function CameraExperience() {
  const [isoIndex, setIsoIndex] = useState(6);
  const [apertureIndex, setApertureIndex] = useState(3);
  const [shutterIndex, setShutterIndex] = useState(6);
  const [whiteBalance, setWhiteBalance] = useState(5600);
  const [hudMode, setHudMode] = useState('full');
  const [controlMode, setControlMode] = useState('all');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [lensIndex, setLensIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFlashBurst, setShowFlashBurst] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [cursorPoint, setCursorPoint] = useState({ x: 50, y: 50 });
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusLocked, setFocusLocked] = useState(false);
  const [exposureComp, setExposureComp] = useState(0);
  const [hudExpanded, setHudExpanded] = useState(true);
  const [ambientLux, setAmbientLux] = useState(4);

  const viewfinderRef = useRef(null);

  const iso = isoStops[isoIndex];
  const aperture = apertureStops[apertureIndex];
  const shutter = shutterStops[shutterIndex];
  const lens = lenses[lensIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setAmbientLux((prev) => {
        const delta = (Math.random() - 0.5) * 0.4;
        return Math.max(0, Math.min(10, prev + delta));
      });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleViewfinderMove = (event) => {
    if (!viewfinderRef.current) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCursorPoint({ x, y });
  };

  const handleFocusPull = (event) => {
    if (!viewfinderRef.current) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    if (!autoFocus) return;

    setFocusPoint({ x, y });
    setIsFocusing(true);
    setFocusLocked(false);
    setTimeout(() => {
      setIsFocusing(false);
      setFocusLocked(true);
    }, 550);
  };

  const handleLensChange = (index) => {
    if (index === lensIndex) return;
    setIsFlipped(true);
    setTimeout(() => {
      setLensIndex(index);
    }, 220);
    setTimeout(() => {
      setIsFlipped(false);
    }, 820);
  };

  const handleCapture = () => {
    setFocusLocked((locked) => locked || !autoFocus);
    if (flashEnabled) {
      setShowFlashBurst(true);
      setTimeout(() => setShowFlashBurst(false), 220);
    }
  };

  const handleManualFocus = (event) => {
    if (autoFocus) return;
    if (!viewfinderRef.current) return;
    const rect = viewfinderRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFocusPoint({ x, y });
  };

  const whiteBalanceTint = useMemo(() => {
    const normalized = (whiteBalance - 3000) / (7500 - 3000);
    const cool = Math.max(0, 0.5 - normalized) * 240;
    const warm = Math.max(0, normalized - 0.5) * 200;
    return { cool, warm };
  }, [whiteBalance]);

  const isoBrightness = useMemo(() => {
    const base = iso / 1600;
    const shutterFactor = Math.log2(shutter.value * 8000 + 1);
    const exposure = base + shutterFactor + exposureComp * 0.5 + (10 - ambientLux) * 0.05;
    return Math.min(1.3, Math.max(0.6, 0.8 + exposure * 0.18));
  }, [iso, shutter, exposureComp, ambientLux]);

  const grainStrength = useMemo(() => {
    if (iso <= 400) return 0.08;
    if (iso <= 800) return 0.12;
    if (iso <= 1600) return 0.18;
    if (iso <= 3200) return 0.26;
    return 0.34;
  }, [iso]);

  const blurStrength = useMemo(() => {
    const open = Math.max(0, 2.4 - Math.log(aperture));
    return open * 18;
  }, [aperture]);

  const focusRadius = useMemo(() => {
    if (aperture <= 1.4) return 9;
    if (aperture <= 1.8) return 14;
    if (aperture <= 2.8) return 20;
    if (aperture <= 4) return 28;
    return 40;
  }, [aperture]);

  const hudIsVisible = hudMode !== 'off';
  const minimalHud = hudMode === 'minimal';
  const controlsVisible = controlMode !== 'off';
  const essentialsOnly = controlMode === 'essential';

  useEffect(() => {
    document.body.style.background = darkMode
      ? 'radial-gradient(circle at top, rgba(9, 12, 25, 0.96), #03050a 58%)'
      : 'radial-gradient(circle at bottom, rgba(255, 255, 255, 0.92), #f7f3eb 60%)';
    document.body.style.color = darkMode ? '#ffffff' : '#050505';
    return () => {
      document.body.style.background = '';
      document.body.style.color = '';
    };
  }, [darkMode]);

  return (
    <>
      <Head>
        <title>Menelek Makonnen — Immersive Camera Portfolio</title>
        <meta
          name="description"
          content="An interactive cinematic experience exploring Menelek Makonnen's film, photography, writing, and immersive universes."
        />
      </Head>
      <div
        className={`relative min-h-screen overflow-hidden ${darkMode ? 'text-white' : 'text-slate-900'} transition-colors duration-700`}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background: luxuryGradient,
            opacity: darkMode ? 0.45 : 0.28,
            filter: `brightness(${isoBrightness}) saturate(${1 + (whiteBalance - 5600) / 4200})`,
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            mixBlendMode: darkMode ? 'screen' : 'multiply',
            opacity: 0.5,
            background: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, rgba(255,255,255,${darkMode ? 0.12 : 0.32}), transparent 55%)`,
          }}
        />

        <AnimatePresence>
          {showFlashBurst && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{
                background:
                  'radial-gradient(circle at center, rgba(255,255,255,0.95), rgba(255,255,255,0.65), transparent 60%)',
              }}
            />
          )}
        </AnimatePresence>

        <main className="relative z-10 flex min-h-screen flex-col">
          <header className="flex flex-col gap-6 px-8 pb-4 pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-amber-300/70">Immersive Portfolio Mode</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Menelek Makonnen — Director · Photographer · Author
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                Move through this portfolio as if you were behind the lens. Dial settings, swap lenses, and feel how
                exposure, depth of field, and color science reshape the stories, reels, books, and experiences that live
                here.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setDarkMode((d) => !d)}
                className="group flex items-center gap-3 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] transition hover:border-white/50 hover:bg-white/10"
              >
                {darkMode ? <Sun size={16} /> : <Moon size={16} />}
                {darkMode ? 'Bright Mode' : 'Dark Mode'}
              </button>
              <button
                onClick={() => setFlashEnabled((flash) => !flash)}
                className={`group flex items-center gap-3 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                  flashEnabled
                    ? 'border-amber-300/80 bg-amber-300/15 text-amber-200'
                    : 'border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10'
                }`}
              >
                <Flashlight size={16} /> {flashEnabled ? 'Flash Ready' : 'Flash Off'}
              </button>
            </div>
          </header>

          <section className="relative flex flex-1 flex-col pb-36">
            <div
              ref={viewfinderRef}
              className={`relative mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-black/30 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-transform duration-700 ${
                isFlipped ? 'rotate-180' : ''
              }`}
              style={{
                cursor: 'none',
                filter: `contrast(${1.05 + lens.zoom * 0.12}) brightness(${isoBrightness}) saturate(${1 +
                  (whiteBalance - 5600) / 9000})`,
              }}
              onMouseMove={(event) => {
                handleViewfinderMove(event);
                if (!autoFocus) {
                  handleManualFocus(event);
                }
              }}
              onClick={(event) => {
                if (autoFocus) {
                  handleFocusPull(event);
                } else {
                  handleManualFocus(event);
                }
              }}
            >
              <div className="pointer-events-none absolute inset-0" style={{ mixBlendMode: 'overlay', opacity: 0.16 }}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')]" />
              </div>

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at center, rgba(0,0,0,${0.28 + lens.vignette}), transparent 68%)`,
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  backdropFilter: `blur(${(1 / shutter.value) * 0.12}px)`,
                  opacity: Math.min(0.35, (1 / shutter.value) * 0.02),
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  mixBlendMode: darkMode ? 'screen' : 'multiply',
                  background: `linear-gradient(${45 + lens.perspective}deg, rgba(255,255,255,0.08), transparent 45%), linear-gradient(${180 -
                    lens.perspective}deg, rgba(255,255,255,0.05), transparent 60%)`,
                }}
              />

              <div
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, rgba(25, 36, 69, ${darkMode ? 0.82 : 0.38}), transparent 30%), linear-gradient(120deg, rgba(${160 +
                    whiteBalanceTint.warm / 2}, ${120 + whiteBalanceTint.cool / 4}, ${200 +
                    whiteBalanceTint.cool}, ${darkMode ? 0.14 : 0.28}), rgba(0, 0, 0, 0))`,
                }}
              />

              <div className="relative z-10 flex flex-1 flex-col overflow-auto px-10 py-12 text-white">
                <div className="grid gap-8 md:grid-cols-2">
                  {contentSections.map((section, index) => {
                    const Icon = section.cta.icon;
                    const delay = index * 0.04;
                    return (
                      <motion.article
                        key={section.id}
                        className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-7 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-xl transition hover:border-white/30 hover:bg-white/10"
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay, duration: 0.5 }}
                      >
                        <span className="text-[0.65rem] uppercase tracking-[0.28em] text-amber-200/70">
                          {section.badge}
                        </span>
                        <h2 className="mt-3 text-2xl font-semibold md:text-[1.65rem]">{section.title}</h2>
                        <p className="mt-3 text-sm leading-relaxed text-white/70">{section.description}</p>
                        <a
                          href={section.cta.href}
                          className="group mt-6 inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-5 py-2.5 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/60 hover:bg-white/20"
                          onClick={(event) => {
                            if (aperture <= 2) {
                              event.preventDefault();
                              event.stopPropagation();
                            }
                          }}
                        >
                          <Icon size={16} className="transition group-hover:scale-110" />
                          {section.cta.label}
                        </a>
                      </motion.article>
                    );
                  })}
                </div>
              </div>

              {focusLocked && aperture <= 4 && (
                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    backdropFilter: `blur(${blurStrength}px)`,
                    WebkitBackdropFilter: `blur(${blurStrength}px)`,
                    maskImage: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, transparent ${focusRadius}%, rgba(0,0,0,0.75) ${
                      focusRadius + 18
                    }%)`,
                    WebkitMaskImage: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, transparent ${focusRadius}%, rgba(0,0,0,0.75) ${
                      focusRadius + 18
                    }%)`,
                    opacity: aperture <= 2.8 ? 0.85 : 0.6,
                  }}
                />
              )}

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, rgba(255,255,255,${flashEnabled ? 0.25 : 0.1}), transparent 35%)`,
                  mixBlendMode: 'screen',
                }}
              />

              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(120deg, rgba(0,0,0,${0.25 + grainStrength}), rgba(0,0,0,${0.15}))`,
                  mixBlendMode: 'soft-light',
                }}
              />

              {hudIsVisible && (
                <motion.div
                  className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-between px-6 pt-6 text-[0.65rem] uppercase tracking-[0.4em]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: minimalHud ? 0.4 : 0.8 }}
                >
                  <span>Lens · {lens.name}</span>
                  <span>Ambient {ambientLux.toFixed(1)} lux</span>
                </motion.div>
              )}

              <AnimatePresence>
                {(isFocusing || focusLocked) && (
                  <motion.div
                    key="reticle"
                    className="pointer-events-none absolute z-40"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: isFocusing ? [1.2, 0.9, 1.1] : 1,
                      opacity: isFocusing ? 0.9 : 0.7,
                    }}
                    exit={{ opacity: 0, scale: 0.75 }}
                    transition={{ duration: isFocusing ? 0.45 : 0.25 }}
                    style={{
                      left: `${focusPoint.x}%`,
                      top: `${focusPoint.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="h-16 w-16 rounded-full border-2 border-amber-200/80 shadow-[0_0_40px_rgba(255,191,105,0.25)]" />
                    <div className="absolute inset-1 rounded-full border border-amber-200/30" />
                    <div className="absolute inset-1 flex items-center justify-center text-[0.55rem] font-medium tracking-[0.4em] text-amber-100/80">
                      {isFocusing ? 'AF' : 'LOCK'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                <motion.div
                  key="cursor"
                  className="pointer-events-none absolute z-30 hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30 md:block"
                  style={{
                    left: `${cursorPoint.x}%`,
                    top: `${cursorPoint.y}%`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.28 }}
                  exit={{ opacity: 0 }}
                />
              </AnimatePresence>

              {hudIsVisible && hudExpanded && (
                <motion.div
                  className="pointer-events-none absolute inset-x-8 bottom-8 z-40 rounded-3xl border border-white/10 bg-black/60 px-6 py-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 backdrop-blur-xl"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 0.95, y: 0 }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span>ISO {iso}</span>
                    <span>ƒ/{aperture.toFixed(1)}</span>
                    <span>{shutter.label} sec</span>
                    {!minimalHud && <span>{whiteBalance}K WB</span>}
                    {!minimalHud && <span>EC {exposureComp >= 0 ? '+' : ''}{exposureComp.toFixed(1)}</span>}
                    {!minimalHud && <span>{darkMode ? 'Night' : 'Day'} Profile</span>}
                    <span>{flashEnabled ? 'Flash Armed' : 'No Flash'}</span>
                  </div>
                </motion.div>
              )}
            </div>
          </section>

          {controlsVisible && (
            <section className="relative z-20 mx-auto mt-10 flex w-full max-w-6xl flex-col gap-6 rounded-[32px] border border-white/15 bg-black/40 p-8 shadow-[0_48px_120px_-36px_rgba(0,0,0,0.9)] backdrop-blur-3xl">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <h3 className="text-lg font-semibold tracking-wide text-white/80 md:text-xl">
                  Camera Control Deck
                </h3>
                <div className="flex flex-wrap gap-3 text-xs uppercase tracking-[0.3em]">
                  {hudModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setHudMode(mode.id)}
                      className={`rounded-full border px-4 py-2 transition ${
                        hudMode === mode.id
                          ? 'border-amber-300/80 bg-amber-300/15 text-amber-200'
                          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/50 hover:text-white/90'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                  {controlModes.map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setControlMode(mode.id)}
                      className={`rounded-full border px-4 py-2 transition ${
                        controlMode === mode.id
                          ? 'border-white/60 bg-white/10 text-white'
                          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/50 hover:text-white/90'
                      }`}
                    >
                      {mode.label}
                    </button>
                  ))}
                  <button
                    onClick={() => setHudExpanded((value) => !value)}
                    className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-white/60 transition hover:border-white/50 hover:text-white"
                  >
                    {hudExpanded ? 'Hide HUD Strip' : 'Show HUD Strip'}
                  </button>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <ControlCard
                  title="ISO Sensitivity"
                  icon={Gauge}
                  value={`ISO ${iso}`}
                  subtitle="Embrace noise or keep it clean"
                >
                  <Slider
                    min={0}
                    max={isoStops.length - 1}
                    value={isoIndex}
                    step={1}
                    onChange={(value) => setIsoIndex(Number(value))}
                    labels={isoStops.map((stop) => stop)}
                  />
                </ControlCard>

                <ControlCard
                  title="Aperture"
                  icon={Aperture}
                  value={`ƒ/${aperture.toFixed(1)}`}
                  subtitle="Depth of field & focus rendering"
                >
                  <Slider
                    min={0}
                    max={apertureStops.length - 1}
                    value={apertureIndex}
                    step={1}
                    onChange={(value) => setApertureIndex(Number(value))}
                    labels={apertureStops.map((stop) => `ƒ/${stop.toFixed(1)}`)}
                  />
                </ControlCard>

                <ControlCard
                  title="Shutter"
                  icon={Vibrate}
                  value={`${shutter.label} s`}
                  subtitle="Motion blur and exposure"
                >
                  <Slider
                    min={0}
                    max={shutterStops.length - 1}
                    value={shutterIndex}
                    step={1}
                    onChange={(value) => setShutterIndex(Number(value))}
                    labels={shutterStops.map((stop) => stop.label)}
                  />
                </ControlCard>

                <ControlCard
                  title="White Balance"
                  icon={Thermometer}
                  value={`${whiteBalance}K`}
                  subtitle="Color temperature & mood"
                >
                  <div className="mt-2 flex flex-wrap gap-3">
                    {whiteBalancePresets.map((preset) => (
                      <button
                        key={preset.label}
                        onClick={() => setWhiteBalance(preset.value)}
                        className={`rounded-full border px-3 py-1 text-[0.6rem] uppercase tracking-[0.25em] transition ${
                          whiteBalance === preset.value
                            ? 'border-amber-300/80 bg-amber-300/15 text-amber-200'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/50 hover:text-white/90'
                        }`}
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min={3000}
                    max={7500}
                    value={whiteBalance}
                    onChange={(event) => setWhiteBalance(Number(event.target.value))}
                    className="mt-4 w-full"
                  />
                </ControlCard>

                <ControlCard
                  title="Exposure Comp"
                  icon={Sun}
                  value={`${exposureComp >= 0 ? '+' : ''}${exposureComp.toFixed(1)} EV`}
                  subtitle="Lift or lower the exposure"
                >
                  <input
                    type="range"
                    min={-2}
                    max={2}
                    step={0.1}
                    value={exposureComp}
                    onChange={(event) => setExposureComp(Number(event.target.value))}
                    className="mt-4 w-full"
                  />
                </ControlCard>

                <ControlCard
                  title="Lens Cabinet"
                  icon={ZoomIn}
                  value={lens.name}
                  subtitle={lens.subtitle}
                >
                  <div className="mt-3 grid gap-2">
                    {lenses.map((entry, index) => (
                      <button
                        key={entry.name}
                        onClick={() => handleLensChange(index)}
                        className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left text-sm transition ${
                          lensIndex === index
                            ? 'border-amber-300/80 bg-amber-300/20 text-amber-50 shadow-[0_16px_40px_-24px_rgba(255,191,105,0.6)]'
                            : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <div>
                          <p className="font-medium">{entry.name}</p>
                          <p className="text-[0.6rem] uppercase tracking-[0.3em] text-white/40">{entry.subtitle}</p>
                        </div>
                        <span className="text-[0.6rem] uppercase tracking-[0.3em]">{Math.round(entry.zoom * 100)}%</span>
                      </button>
                    ))}
                  </div>
                </ControlCard>

                {!essentialsOnly && (
                  <ControlCard
                    title="Flash Control"
                    icon={Flashlight}
                    value={flashEnabled ? 'Enabled' : 'Disabled'}
                    subtitle="Illuminate the frame"
                  >
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/60">Flash Toggle</span>
                      <button
                        onClick={() => setFlashEnabled((value) => !value)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.3em] transition ${
                          flashEnabled
                            ? 'border-amber-300/80 bg-amber-300/20 text-amber-100'
                            : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        {flashEnabled ? 'Armed' : 'Standby'}
                      </button>
                    </div>
                  </ControlCard>
                )}

                {!essentialsOnly && (
                  <ControlCard
                    title="Focus Mode"
                    icon={Droplets}
                    value={autoFocus ? 'Autofocus' : 'Manual'}
                    subtitle="Tap to focus or drag"
                  >
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/60">Focus Mode</span>
                      <button
                        onClick={() => setAutoFocus((value) => !value)}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white"
                      >
                        {autoFocus ? 'Switch to Manual' : 'Switch to Auto'}
                      </button>
                    </div>
                  </ControlCard>
                )}

                {!essentialsOnly && (
                  <ControlCard
                    title="Ambient Profile"
                    icon={Cloudy}
                    value={darkMode ? 'Night Ops' : 'Daylight Luxe'}
                    subtitle="Curate the colour grade"
                  >
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs uppercase tracking-[0.3em] text-white/60">Profile</span>
                      <button
                        onClick={() => setDarkMode((value) => !value)}
                        className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white/40 hover:text-white"
                      >
                        {darkMode ? 'Bright Mode' : 'Dark Mode'}
                      </button>
                    </div>
                  </ControlCard>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
                <div>
                  <p className="text-sm uppercase tracking-[0.28em]">Capture Moment</p>
                  <p className="mt-1 text-xs text-white/50">
                    Half-press anywhere inside the viewfinder to focus. Fire the shutter to lock the frame and trigger the
                    flash effect.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    onClick={handleCapture}
                    className="group flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/80 hover:bg-white/20"
                  >
                    <Camera size={16} className="transition group-hover:scale-110" />
                    Shoot Frame
                  </button>
                  <button
                    onClick={() => {
                      setIsoIndex(6);
                      setApertureIndex(3);
                      setShutterIndex(6);
                      setWhiteBalance(5600);
                      setExposureComp(0);
                      setLensIndex(0);
                      setAutoFocus(true);
                      setFocusLocked(false);
                      setHudMode('full');
                      setControlMode('all');
                      setHudExpanded(true);
                    }}
                    className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs uppercase tracking-[0.3em] text-white/60 transition hover:border-white/50 hover:text-white"
                  >
                    Reset Rig
                  </button>
                </div>
              </div>
            </section>
          )}

          <footer className="relative z-10 mt-24 px-8 pb-16">
            <div className="mx-auto max-w-5xl rounded-[32px] border border-white/15 bg-white/5 p-10 text-sm text-white/70 backdrop-blur-3xl">
              <h4 className="text-lg font-semibold text-white">Beyond the Lens</h4>
              <p className="mt-3 leading-relaxed">
                This immersive camera interface is built to feel like a premium cinema tool—because your stories, films,
                books, and experiences deserve that prestige. Every dial, toggle, and lens shifts how the work is felt.
                Stay curious and explore every layer.
              </p>
              <div className="mt-6 grid gap-4 text-xs uppercase tracking-[0.3em] text-white/50 md:grid-cols-2">
                <span>© {new Date().getFullYear()} Menelek Makonnen</span>
                <span>Directing · Photography · Writing · LoreMaker Universe</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </>
  );
}

function ControlCard({ title, subtitle, value, icon: Icon, children }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_32px_80px_-48px_rgba(0,0,0,0.85)] backdrop-blur-2xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[0.6rem] uppercase tracking-[0.28em] text-amber-200/70">{title}</p>
          <p className="mt-2 text-lg font-semibold text-white">{value}</p>
          <p className="mt-1 text-xs text-white/50">{subtitle}</p>
        </div>
        {Icon && <Icon size={24} className="text-amber-200/70" />}
      </div>
      {children}
    </div>
  );
}

function Slider({ min, max, step, value, onChange, labels }) {
  return (
    <div className="mt-5">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full"
      />
      <div className="mt-2 flex w-full justify-between text-[0.55rem] uppercase tracking-[0.25em] text-white/40">
        <span>{Array.isArray(labels) ? labels[0] : ''}</span>
        <span>{Array.isArray(labels) ? labels[labels.length - 1] : ''}</span>
      </div>
    </div>
  );
}
