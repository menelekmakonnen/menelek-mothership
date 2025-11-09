import { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Aperture,
  Camera,
  CameraOff,
  Film,
  Flashlight,
  Focus,
  Gauge,
  Link as LinkIcon,
  Moon,
  RotateCcw,
  Settings2,
  SlidersHorizontal,
  Sun,
  Zap,
} from 'lucide-react';

const lensOptions = [
  {
    id: '14mm',
    name: '14mm Ultra Wide',
    focal: '14mm',
    scale: 0.88,
    depthResponse: 0.18,
    vignette: 0.1,
    description: 'Immersive ultra-wide perspective ideal for sweeping cosmic vistas and architectural work.',
  },
  {
    id: '35mm',
    name: '35mm Street Prime',
    focal: '35mm',
    scale: 0.94,
    depthResponse: 0.32,
    vignette: 0.15,
    description: 'Versatile storyteller that feels like walking beside the subject.',
  },
  {
    id: '50mm',
    name: '50mm Prime',
    focal: '50mm',
    scale: 1,
    depthResponse: 0.5,
    vignette: 0.22,
    description: 'Human-eye feel with sumptuous depth for portraits and character studies.',
  },
  {
    id: '85mm',
    name: '85mm Portrait Prime',
    focal: '85mm',
    scale: 1.12,
    depthResponse: 0.62,
    vignette: 0.25,
    description: 'Dreamy compression and creamy background falloff tailor-made for hero shots.',
  },
  {
    id: '135mm',
    name: '135mm Telephoto',
    focal: '135mm',
    scale: 1.25,
    depthResponse: 0.76,
    vignette: 0.32,
    description: 'Concert-ready reach with cinematic compression and intense focus separation.',
  },
];

const apertureStops = [1.4, 1.8, 2.8, 4, 5.6, 8, 11, 16];
const isoStops = [100, 200, 400, 800, 1600, 3200, 6400];
const shutterStops = [
  { label: '1/30', value: 1 / 30 },
  { label: '1/60', value: 1 / 60 },
  { label: '1/125', value: 1 / 125 },
  { label: '1/250', value: 1 / 250 },
  { label: '1/500', value: 1 / 500 },
  { label: '1/1000', value: 1 / 1000 },
];
const whiteBalanceStops = [
  { label: '3200K Tungsten', value: 3200 },
  { label: '4400K Fluorescent', value: 4400 },
  { label: '5600K Daylight', value: 5600 },
  { label: '6500K Cloudy', value: 6500 },
  { label: '7500K Shade', value: 7500 },
];

const hudLevels = ['all', 'most', 'few', 'none'];
const uiLevels = ['all', 'most', 'few', 'none'];

const hudImportanceRank = {
  all: 3,
  most: 2,
  few: 1,
  none: 0,
};

const uiImportanceRank = {
  all: 3,
  most: 2,
  few: 1,
  none: 0,
};

const rotatingTitles = [
  'Friend',
  'Brother',
  'Boyfriend',
  'Bro',
  'Son',
  'Photographer',
  'Filmmaker',
  'Author',
  'Screen Writer',
  'Director',
  'Producer',
  'Video Editor',
  'Videographer',
  'Vibe Coder',
  'Prompt Engineer',
  'Instructor',
];

const googleDriveStub = '#';

const sections = [
  {
    id: 'links',
    title: 'All My Links',
    icon: LinkIcon,
    importance: 1,
    content: [
      { label: 'LinkedIn', href: 'https://www.linkedin.com/in/menelekmakonnen/' },
      { label: 'Instagram', href: 'https://www.instagram.com/menelekmakonnen/' },
      { label: 'YouTube', href: 'https://www.youtube.com/@menelekmakonnen' },
      { label: 'TikTok', href: 'https://www.tiktok.com/@menelekmakonnen' },
    ],
  },
  {
    id: 'films',
    title: 'Films & Music Videos',
    icon: Film,
    importance: 1,
    content: [
      { label: 'Featured Films', href: 'https://www.youtube.com/@menelekmakonnen/featured' },
      { label: 'Music Videos', href: 'https://www.youtube.com/@menelekmakonnen/videos' },
      { label: 'Behind the Scenes', href: googleDriveStub },
    ],
  },
  {
    id: 'loremaker',
    title: 'Explore the Loremaker Universe',
    icon: Focus,
    importance: 2,
    content: [],
  },
  {
    id: 'ai-projects',
    title: 'AI Projects',
    icon: Settings2,
    importance: 2,
    content: [
      { label: 'Starterclass', href: googleDriveStub },
      { label: 'Scholarships', href: googleDriveStub },
      { label: 'Consultancy', href: googleDriveStub },
    ],
  },
  {
    id: 'video-edits',
    title: 'Epic Video Edits',
    icon: Camera,
    importance: 2,
    content: [
      { label: 'Reel: Kinetic Journeys', href: googleDriveStub },
      { label: 'Dynamic Motion Library', href: googleDriveStub },
      { label: 'Color Grades Vault', href: googleDriveStub },
    ],
  },
  {
    id: 'photo-albums',
    title: 'Photography Albums',
    icon: Aperture,
    importance: 3,
    content: [
      { label: 'Portrait Atlas', href: googleDriveStub },
      { label: 'Street Chronicles', href: googleDriveStub },
      { label: 'Landscape Reveries', href: googleDriveStub },
    ],
  },
  {
    id: 'ai-albums',
    title: 'AI Albums',
    icon: Zap,
    importance: 3,
    content: [
      { label: 'Neural Portraits', href: googleDriveStub },
      { label: 'Synthetic Worlds', href: googleDriveStub },
      { label: 'Animated Experiments', href: googleDriveStub },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    icon: SlidersHorizontal,
    importance: 2,
    content: [
      { label: 'Creative Opinion', href: googleDriveStub },
      { label: 'Process Diaries', href: googleDriveStub },
      { label: 'Storycraft Notes', href: googleDriveStub },
    ],
  },
];

export default function Home() {
  const [cameraType, setCameraType] = useState('dslr');
  const [lens, setLens] = useState(lensOptions[2]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [apertureIndex, setApertureIndex] = useState(2);
  const [isoIndex, setIsoIndex] = useState(1);
  const [shutterIndex, setShutterIndex] = useState(2);
  const [whiteBalanceIndex, setWhiteBalanceIndex] = useState(2);
  const [mode, setMode] = useState('day');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [flashBurst, setFlashBurst] = useState(false);
  const [hudLevelIndex, setHudLevelIndex] = useState(0);
  const [uiLevelIndex, setUiLevelIndex] = useState(0);
  const [focusTarget, setFocusTarget] = useState(null);
  const [focusAnimating, setFocusAnimating] = useState(false);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [titleIndex, setTitleIndex] = useState(0);
  const scrollRef = useRef(null);

  const aperture = apertureStops[apertureIndex];
  const iso = isoStops[isoIndex];
  const shutter = shutterStops[shutterIndex];
  const whiteBalance = whiteBalanceStops[whiteBalanceIndex];
  const hudLevel = hudLevels[hudLevelIndex];
  const uiLevel = uiLevels[uiLevelIndex];

  const characterGrid = useMemo(() => {
    const roster = [
      'Aerin Voss',
      'Kaden Flux',
      'Nova Sera',
      'Harlow Quin',
      'Etta Lune',
      'Sable North',
      'Jax Meridian',
      'Iris Arc',
      'Mara Solis',
      'Zarek Thorn',
      'Lyra Kade',
      'Riven Halo',
      'Cael Omen',
      'Tess Rook',
      'Quinn Overture',
      'Nia Starling',
      'Rowan Ledger',
      'Vega Loom',
      'Tova Glyph',
      'Bex Holliday',
    ];
    const shuffled = roster
      .map((value) => ({ value, order: Math.random() }))
      .sort((a, b) => a.order - b.order)
      .slice(0, 12)
      .map((entry, index) => `${index + 1}. ${entry.value}`);
    return shuffled;
  }, []);

  useEffect(() => {
    const handler = (event) => {
      setPointer({ x: event.clientX, y: event.clientY });
    };
    window.addEventListener('pointermove', handler);
    return () => window.removeEventListener('pointermove', handler);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTitleIndex((index) => (index + 1) % rotatingTitles.length);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;
    const handleWheel = (event) => {
      if (!event.shiftKey) {
        event.preventDefault();
        element.scrollBy({ left: event.deltaY, behavior: 'smooth' });
      }
    };
    element.addEventListener('wheel', handleWheel, { passive: false });
    return () => element.removeEventListener('wheel', handleWheel);
  }, []);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const hudVisibility = hudImportanceRank[hudLevel];
  const uiVisibility = uiImportanceRank[uiLevel];

  const handleHalfPress = () => {
    setFocusAnimating(true);
    setTimeout(() => setFocusAnimating(false), 200);
  };

  const handleFocusSubject = (targetId) => {
    handleHalfPress();
    setFocusTarget(targetId);
  };

  useEffect(() => {
    if (!focusTarget) return undefined;
    const timeout = setTimeout(() => setFocusTarget(null), 1200);
    return () => clearTimeout(timeout);
  }, [focusTarget]);

  const triggerFlash = () => {
    if (!flashEnabled) return;
    setFlashBurst(true);
    setTimeout(() => setFlashBurst(false), 220);
  };

  const handleShutterClick = () => {
    handleFocusSubject('shutter');
    triggerFlash();
  };

  const handleLensChange = (option) => {
    setLens(option);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 720);
    handleHalfPress();
  };

  const cycleHudLevel = () => {
    setHudLevelIndex((index) => (index + 1) % hudLevels.length);
  };

  const cycleUiLevel = () => {
    setUiLevelIndex((index) => (index + 1) % uiLevels.length);
  };

  const shouldBokeh = focusTarget && aperture <= 1.4 + 1e-3;

  const isoFactor = iso / 400;
  const brightnessBase = mode === 'night' ? 0.35 + isoFactor * 0.45 : 0.82 + isoFactor * 0.18;
  const contrastBoost = aperture <= 2 ? 1.18 : 1.05;
  const warmthShift = (whiteBalance.value - 5600) / 1000;
  const saturation = 1 + warmthShift * 0.08;
  const hueRotate = warmthShift * -9;

  const viewFilter = `brightness(${brightnessBase.toFixed(2)}) contrast(${contrastBoost.toFixed(
    2
  )}) saturate(${saturation.toFixed(2)}) hue-rotate(${hueRotate.toFixed(1)}deg)`;

  const exposureValue = useMemo(() => {
    const n = aperture;
    const t = shutter.value || 1 / 125;
    const isoRatio = iso / 100;
    const ev = Math.log2((n ** 2) / t) - Math.log2(isoRatio);
    return ev;
  }, [aperture, shutter, iso]);

  const exposureDescriptor = useMemo(() => {
    if (exposureValue > 12) return 'Bright';
    if (exposureValue > 9) return 'Balanced';
    if (exposureValue > 6) return 'Moody';
    return 'Cinematic';
  }, [exposureValue]);

  const hudSegments = [
    {
      id: 'exposure',
      importance: 3,
      label: `EV ${exposureValue.toFixed(1)} • ${exposureDescriptor}`,
    },
    {
      id: 'aperture',
      importance: 1,
      label: `ƒ/${aperture.toFixed(1)}`,
    },
    {
      id: 'shutter',
      importance: 1,
      label: `S ${shutter.label}s`,
    },
    {
      id: 'iso',
      importance: 1,
      label: `ISO ${iso}`,
    },
    {
      id: 'whiteBalance',
      importance: 2,
      label: `WB ${whiteBalance.label}`,
    },
    {
      id: 'lens',
      importance: 2,
      label: `${lens.name}`,
    },
    {
      id: 'cameraType',
      importance: 2,
      label: cameraType === 'dslr' ? 'DSLR OVF' : 'Mirrorless EVF',
    },
    {
      id: 'mode',
      importance: 3,
      label: mode === 'night' ? 'Night Mode' : 'Day Mode',
    },
  ];

  const controlElements = [
    {
      id: 'cameraType',
      importance: 2,
      render: (
        <button
          key="cameraType"
          onClick={() => setCameraType((type) => (type === 'dslr' ? 'mirrorless' : 'dslr'))}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium tracking-wide transition hover:bg-white/10"
        >
          {cameraType === 'dslr' ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
          {cameraType === 'dslr' ? 'Switch to Mirrorless' : 'Switch to DSLR'}
        </button>
      ),
    },
    {
      id: 'lens',
      importance: 3,
      render: (
        <div key="lens" className="flex w-full flex-col gap-2 rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Lens</span>
            <span>{lens.focal}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 text-sm font-medium hide-scrollbar">
            {lensOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => handleLensChange(option)}
                className={`min-w-[110px] rounded-full border px-3 py-2 transition ${
                  lens.id === option.id
                    ? 'border-white/80 bg-white/20 text-white'
                    : 'border-white/10 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
          <p className="text-xs text-white/60">{lens.description}</p>
        </div>
      ),
    },
    {
      id: 'mode',
      importance: 2,
      render: (
        <button
          key="mode"
          onClick={() => setMode((state) => (state === 'day' ? 'night' : 'day'))}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          {mode === 'day' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {mode === 'day' ? 'Enter Night Mode' : 'Back to Day Mode'}
        </button>
      ),
    },
    {
      id: 'aperture',
      importance: 3,
      render: (
        <div key="aperture" className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Aperture</span>
            <span>ƒ/{aperture.toFixed(1)}</span>
          </div>
          <input
            type="range"
            min={0}
            max={apertureStops.length - 1}
            step={1}
            value={apertureIndex}
            onChange={(event) => setApertureIndex(Number(event.target.value))}
            className="mt-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
          />
        </div>
      ),
    },
    {
      id: 'shutter',
      importance: 3,
      render: (
        <div key="shutter" className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>Shutter</span>
            <span>{shutter.label}s</span>
          </div>
          <input
            type="range"
            min={0}
            max={shutterStops.length - 1}
            step={1}
            value={shutterIndex}
            onChange={(event) => setShutterIndex(Number(event.target.value))}
            className="mt-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
          />
        </div>
      ),
    },
    {
      id: 'iso',
      importance: 3,
      render: (
        <div key="iso" className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>ISO</span>
            <span>{iso}</span>
          </div>
          <input
            type="range"
            min={0}
            max={isoStops.length - 1}
            step={1}
            value={isoIndex}
            onChange={(event) => setIsoIndex(Number(event.target.value))}
            className="mt-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
          />
        </div>
      ),
    },
    {
      id: 'whiteBalance',
      importance: 2,
      render: (
        <div key="whiteBalance" className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-white/60">
            <span>White Balance</span>
            <span>{whiteBalance.label}</span>
          </div>
          <input
            type="range"
            min={0}
            max={whiteBalanceStops.length - 1}
            step={1}
            value={whiteBalanceIndex}
            onChange={(event) => setWhiteBalanceIndex(Number(event.target.value))}
            className="mt-3 h-1 w-full cursor-pointer rounded-full bg-white/20"
          />
        </div>
      ),
    },
    {
      id: 'hudToggle',
      importance: 0,
      render: (
        <button
          key="hudToggle"
          onClick={cycleHudLevel}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          <Gauge className="h-4 w-4" /> HUD: {hudLevel.toUpperCase()}
        </button>
      ),
    },
    {
      id: 'uiToggle',
      importance: 0,
      render: (
        <button
          key="uiToggle"
          onClick={cycleUiLevel}
          className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium transition hover:bg-white/10"
        >
          <RotateCcw className="h-4 w-4" /> Interface: {uiLevel.toUpperCase()}
        </button>
      ),
    },
    {
      id: 'shutterButton',
      importance: 0,
      render: (
        <button
          key="shutterButton"
          onClick={handleShutterClick}
          className="flex h-16 w-16 items-center justify-center rounded-full border-4 border-white/50 bg-white/10 text-lg font-semibold uppercase tracking-[0.3em] transition hover:bg-white/20"
        >
          Shoot
        </button>
      ),
    },
  ];

  const controlStack = controlElements.filter((control) => control.importance <= uiVisibility);

  const containerTransform = `scale(${lens.scale}) ${isFlipping ? 'rotateZ(180deg)' : 'rotateZ(0deg)'}`;

  const lensVignetteStrength = Math.min(0.6, lens.vignette + (aperture <= 1.8 ? 0.1 : 0));

  const gradientOverlay = mode === 'night'
    ? 'radial-gradient(circle at 50% 20%, rgba(80, 120, 255, 0.18), transparent 55%), radial-gradient(circle at 20% 80%, rgba(255, 80, 120, 0.12), transparent 65%)'
    : 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.12), transparent 55%), radial-gradient(circle at 20% 80%, rgba(255, 200, 120, 0.08), transparent 65%)';

  const bokehBlur = shouldBokeh ? 20 + lens.depthResponse * 40 : 0;

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center bg-neutral-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.06),transparent_55%),radial-gradient(circle_at_70%_70%,rgba(255,255,255,0.04),transparent_60%)]" />

      <div className="relative z-10 flex h-[92vh] w-[92vw] max-w-7xl flex-col gap-6 p-8">
        <header className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">Menelek Makonnen</p>
            <h1 className="text-2xl font-light tracking-wider text-white/80">
              Worldbuilder, AI Supernerd and{' '}
              <span className="text-white">{rotatingTitles[titleIndex]}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setFlashEnabled((value) => !value)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold tracking-[0.2em] transition ${
                flashEnabled
                  ? 'border-yellow-300/80 bg-yellow-300/20 text-yellow-200'
                  : 'border-white/20 bg-white/5 text-white/70 hover:border-white/50 hover:text-white'
              }`}
            >
              <Flashlight className="h-4 w-4" /> Flash {flashEnabled ? 'On' : 'Off'}
            </button>
          </div>
        </header>

        <div className="relative flex flex-1 gap-6 overflow-visible">
          <aside className="flex w-64 flex-col gap-4">
            {controlStack.map((control) => (
              <div key={control.id} className="pointer-events-auto">
                {control.render}
              </div>
            ))}
          </aside>

          <main className="relative flex-1">
            <div
              className="camera-glass relative flex h-full w-full items-center justify-center overflow-hidden rounded-[48px] viewfinder-grid lens-vignette"
              style={{
                transform: containerTransform,
                transition: 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)',
                filter: viewFilter,
              }}
              onPointerDown={() => handleHalfPress()}
            >
              <div
                className="absolute inset-0"
                style={{
                  background: gradientOverlay,
                  opacity: mode === 'night' ? 0.8 : 0.6,
                  mixBlendMode: 'screen',
                }}
              />

              <div className="absolute inset-0 bg-black/40" style={{ opacity: mode === 'night' ? 0.5 : 0.2 }} />

              <div className="absolute inset-0 pointer-events-none" style={{
                background: `radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,${lensVignetteStrength}))`,
              }} />

              <div className="relative z-10 flex h-full w-full flex-col justify-between px-8 py-10">
                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
                    <span>{cameraType === 'dslr' ? 'Optical Viewfinder' : 'Electronic Viewfinder'}</span>
                    <span>{lens.focal}</span>
                  </div>

                  <div
                    ref={scrollRef}
                    className="relative flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 pt-2 hide-scrollbar"
                    style={{ WebkitOverflowScrolling: 'touch' }}
                  >
                    {sections.map((section) => {
                      const Icon = section.icon;
                      const isFocused = focusTarget === section.id;
                      return (
                        <motion.article
                          key={section.id}
                          className={`relative flex min-w-[320px] max-w-[320px] snap-center flex-col gap-4 rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm transition ${
                            isFocused
                              ? 'focus-target bg-white/15 text-white'
                              : shouldBokeh
                              ? 'scale-[0.96] opacity-40 blur-lg'
                              : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                          }`}
                          whileHover={{ scale: shouldBokeh ? 0.96 : 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onPointerDown={(event) => {
                            event.stopPropagation();
                            handleFocusSubject(section.id);
                          }}
                          onClick={() => handleFocusSubject(section.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-white">
                              <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/10">
                                <Icon className="h-4 w-4" />
                              </span>
                              <h2 className="text-lg font-semibold tracking-wide">{section.title}</h2>
                            </div>
                            <span className="text-xs uppercase tracking-[0.3em] text-white/40">
                              {section.id}
                            </span>
                          </div>

                          {section.id === 'loremaker' ? (
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              {characterGrid.map((character) => (
                                <span key={character} className="rounded-xl bg-white/5 px-3 py-2 text-white/80">
                                  {character}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <ul className="flex flex-col gap-2 text-sm text-white/80">
                              {section.content.map((item) => (
                                <li key={item.label}>
                                  <a
                                    href={item.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-transparent px-3 py-2 transition hover:border-white/30 hover:bg-white/10 hover:text-white"
                                  >
                                    <span>{item.label}</span>
                                    <span className="text-[10px] uppercase tracking-[0.4em] text-white/30">View</span>
                                  </a>
                                </li>
                              ))}
                            </ul>
                          )}
                        </motion.article>
                      );
                    })}
                  </div>
                </div>

                <footer className="flex flex-col gap-4">
                  {hudLevel !== 'none' && (
                    <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                      {hudSegments
                        .filter((segment) => segment.importance <= hudVisibility)
                        .map((segment) => (
                          <span
                            key={segment.id}
                            className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-white/70"
                          >
                            {segment.label}
                          </span>
                        ))}
                    </div>
                  )}
                  <div className="text-[10px] uppercase tracking-[0.6em] text-white/30">
                    Swipe sideways • Half-press anywhere to focus • Shutter fires flash when enabled
                  </div>
                </footer>
              </div>

              <AnimatePresence>
                {shouldBokeh && (
                  <motion.div
                    key="bokeh"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="pointer-events-none absolute inset-0"
                    style={{ backdropFilter: `blur(${bokehBlur}px)` }}
                  />
                )}
              </AnimatePresence>

              <AnimatePresence>
                {flashBurst && (
                  <motion.div
                    key="flash"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: mode === 'night' ? 0.9 : 0.6 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.22 }}
                    className="pointer-events-none absolute inset-0 flash-burst"
                    style={{
                      background:
                        'radial-gradient(circle at center, rgba(255,255,255,0.8), rgba(255,255,255,0.05))',
                    }}
                  />
                )}
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <motion.div
        className="pointer-events-none fixed top-0 left-0 z-[100] -translate-x-1/2 -translate-y-1/2"
        animate={{ x: pointer.x, y: pointer.y, scale: focusAnimating ? 0.92 : 1 }}
        transition={{ type: 'spring', stiffness: 600, damping: 35, mass: 0.5 }}
      >
        <div className={`relative h-16 w-16 rounded-full border-2 border-white/60 ${focusAnimating ? 'focus-ring' : ''}`}>
          <div className="absolute inset-3 rounded-full border border-white/40" />
          <div className="absolute inset-[38%] rounded-full bg-white/60" />
        </div>
      </motion.div>
    </div>
  );
}
