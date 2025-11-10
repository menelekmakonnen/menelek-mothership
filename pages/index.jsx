import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const LENSES = [
  {
    id: '24mm',
    name: '24mm Wide Prime',
    fov: 84,
    minAperture: 1.4,
    maxAperture: 16,
    vignette: 0.25,
    distortion: 0.2,
  },
  {
    id: '35mm',
    name: '35mm Street Prime',
    fov: 63,
    minAperture: 1.4,
    maxAperture: 16,
    vignette: 0.18,
    distortion: 0.12,
  },
  {
    id: '50mm',
    name: '50mm Prime',
    fov: 47,
    minAperture: 1.2,
    maxAperture: 22,
    vignette: 0.12,
    distortion: 0.05,
  },
  {
    id: '85mm',
    name: '85mm Portrait',
    fov: 28,
    minAperture: 1.4,
    maxAperture: 22,
    vignette: 0.08,
    distortion: 0.03,
  },
  {
    id: '70-200mm',
    name: '70-200mm Telephoto',
    fov: 20,
    minAperture: 2.8,
    maxAperture: 32,
    vignette: 0.05,
    distortion: 0.02,
  },
];

const HUD_LEVELS = ['none', 'few', 'most', 'all'];
const FLASH_MODES = ['auto', 'on', 'off'];

const PANELS = [
  {
    id: 'intro',
    title: 'Worldbuilder, AI Supernerd and',
    dynamicWords: [
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
    ],
    layout: 'hero',
  },
  {
    id: 'links',
    title: 'All My Links',
    layout: 'links',
    items: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/in/menelekmakonnen' },
      { label: 'Instagram', url: 'https://www.instagram.com/menelekmakonnen' },
      { label: 'YouTube', url: 'https://www.youtube.com/@menelekmakonnen' },
      { label: 'TikTok', url: 'https://www.tiktok.com/@menelekmakonnen' },
    ],
  },
  {
    id: 'films',
    title: 'Films & Music Videos',
    layout: 'carousel',
    items: [
      { label: 'Latest Film', url: 'https://youtube.com', description: 'Watch on YouTube' },
      { label: 'Music Video Reel', url: 'https://youtube.com', description: 'High energy edits' },
      { label: 'Behind The Scenes', url: 'https://youtube.com', description: 'On set moments' },
    ],
  },
  {
    id: 'loremaker',
    title: 'Explore My Loremaker Universe',
    layout: 'grid',
    items: [
      'Aetherial Nomad',
      'Chrono Scribe',
      'Nebula Archivist',
      'Solar Weaver',
      'Quantum Bard',
      'Prism Sentinel',
      'Velvet Cartographer',
      'Aurora Whisperer',
      'Obsidian Keeper',
      'Riftwalker',
      'Glyph Alchemist',
      'Echo Scribe',
      'Skyway Pilot',
      'Pulse Druid',
      'Celestial Maven',
    ],
  },
  {
    id: 'ai-projects',
    title: 'AI Projects',
    layout: 'columns',
    items: [
      { label: 'Starterclass', description: 'Immersive AI learning journeys and workshops.' },
      { label: 'Scholarships', description: 'Supporting the next wave of innovators with AI resources.' },
      { label: 'Consultancy', description: 'Bespoke AI strategy and creative technology solutions.' },
    ],
  },
  {
    id: 'video-edits',
    title: 'Epic Video Edits',
    layout: 'stack',
    items: [
      'Kinetic montage reels crafted for story-first experiences.',
      'Cinematic grade transitions and colour narratives.',
      'Collaborations with directors and agencies worldwide.',
    ],
  },
  {
    id: 'photography',
    title: 'Photography Albums',
    layout: 'albums',
    items: [
      { label: 'City Noir', folder: 'Google Drive Album', description: 'Moody night walks with neon drenched scenes.' },
      { label: 'Golden Hour Faces', folder: 'Google Drive Album', description: 'Portraits with soulful warmth and depth.' },
      { label: 'Architectural Silence', folder: 'Google Drive Album', description: 'Minimalist structures captured in bold compositions.' },
    ],
  },
  {
    id: 'ai-albums',
    title: 'AI Albums',
    layout: 'albums',
    items: [
      { label: 'Mythic Futures', folder: 'Drive Showcase', description: 'Speculative worlds rendered through machine imagination.' },
      { label: 'Synesthetic Portraits', folder: 'Drive Showcase', description: 'Faces dreamed in colour, texture, and feeling.' },
      { label: 'Impossible Landscapes', folder: 'Drive Showcase', description: 'New geologies emerging from code and vision.' },
    ],
  },
  {
    id: 'blog',
    title: 'Blog',
    layout: 'blog',
    items: [
      {
        label: 'On Crafting Cinematic Interfaces',
        description: 'A manifesto on blending tactile camera controls with web design.',
      },
      {
        label: 'AI + Storytelling',
        description: 'Thoughts on co-creating worlds with neural collaborators.',
      },
      {
        label: 'Field Notes',
        description: 'Travel logs, lens tests, and creative experiments.',
      },
    ],
  },
];

const INITIAL_EXPOSURE = {
  iso: 200,
  shutter: 1 / 125,
  aperture: 1.8,
  whiteBalance: 5200,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function Home() {
  const [activePanel, setActivePanel] = useState(0);
  const [hudLevelIndex, setHudLevelIndex] = useState(3);
  const [cameraMode, setCameraMode] = useState('mirrorless');
  const [theme, setTheme] = useState('dark');
  const [lensId, setLensId] = useState('50mm');
  const [exposure, setExposure] = useState(INITIAL_EXPOSURE);
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [cursorPos, setCursorPos] = useState({ x: 50, y: 50 });
  const [flashActive, setFlashActive] = useState(false);
  const [showFlashReady, setShowFlashReady] = useState(true);
  const [isLensTransitioning, setIsLensTransitioning] = useState(false);
  const [dynamicWordIndex, setDynamicWordIndex] = useState(0);
  const [flashMode, setFlashMode] = useState('auto');
  const [loremakerItems, setLoremakerItems] = useState(() => shuffleUniverseItems());

  const stageRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const flashOverlayTimeoutRef = useRef(null);
  const lensRotationTimeoutRef = useRef(null);
  const pointerFrameRef = useRef(null);

  const hudLevel = HUD_LEVELS[hudLevelIndex];
  const lens = useMemo(() => LENSES.find((item) => item.id === lensId) || LENSES[2], [lensId]);

  const panels = useMemo(() => {
    return PANELS.map((panel) =>
      panel.id === 'loremaker' ? { ...panel, items: loremakerItems } : panel,
    );
  }, [loremakerItems]);

  const apertureBlur = useMemo(() => {
    const ratio = 1 - (exposure.aperture - lens.minAperture) / (lens.maxAperture - lens.minAperture || 1);
    return clamp(ratio * 12, 0, 14);
  }, [exposure.aperture, lens.minAperture, lens.maxAperture]);

  useEffect(() => {
    const words = PANELS[0].dynamicWords;
    const interval = setInterval(() => {
      setDynamicWordIndex((prev) => (prev + 1) % words.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }
    return undefined;
  }, []);

  useEffect(() => {
    return () => {
      clearTimeout(focusTimeoutRef.current || undefined);
      clearTimeout(flashTimeoutRef.current || undefined);
      clearTimeout(flashOverlayTimeoutRef.current || undefined);
      clearTimeout(lensRotationTimeoutRef.current || undefined);
      if (pointerFrameRef.current !== null) {
        cancelAnimationFrame(pointerFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (hudLevel === 'none') {
      setShowFlashReady(false);
    } else {
      setShowFlashReady(true);
    }
  }, [hudLevel]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoremakerItems(shuffleUniverseItems());
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  const handlePointerMove = useCallback((event) => {
    if (pointerFrameRef.current !== null) return;
    const { clientX, clientY } = event;
    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = null;
      const rect = stageRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      setCursorPos({ x, y });
    });
  }, []);

  const handleFocus = (event) => {
    event.preventDefault();
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setFocusPoint({ x, y });
    setIsFocusing(true);
    clearTimeout(focusTimeoutRef.current || undefined);
    focusTimeoutRef.current = setTimeout(() => setIsFocusing(false), 420);
  };

  const swipeState = useRef({ startX: 0, startY: 0, active: false });

  const handlePointerDown = (event) => {
    swipeState.current = {
      startX: event.clientX,
      startY: event.clientY,
      active: true,
    };
  };

  const handlePointerUp = (event) => {
    if (!swipeState.current.active) return;
    const deltaX = event.clientX - swipeState.current.startX;
    const deltaY = event.clientY - swipeState.current.startY;
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);
    swipeState.current.active = false;

    if (Math.max(absX, absY) < 40) {
      handleFocus(event);
      return;
    }

    if (absX > absY) {
      if (deltaX < 0) {
        setActivePanel((prev) => Math.min(prev + 1, panels.length - 1));
      } else {
        setActivePanel((prev) => Math.max(prev - 1, 0));
      }
    } else {
      if (deltaY < 0) {
        setActivePanel((prev) => Math.min(prev + 1, panels.length - 1));
      } else {
        setActivePanel((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const cycleHudLevel = useCallback(() => {
    setHudLevelIndex((prev) => (prev + 1) % HUD_LEVELS.length);
  }, []);

  const toggleCameraMode = useCallback(() => {
    setCameraMode((prev) => (prev === 'mirrorless' ? 'dslr' : 'mirrorless'));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const adjustExposure = useCallback((key, delta) => {
    setExposure((prev) => {
      if (key === 'iso') {
        const nextIso = clamp(prev.iso + delta, 100, 6400);
        return { ...prev, iso: nextIso };
      }
      if (key === 'aperture') {
        const nextAperture = clamp(
          parseFloat((prev.aperture + delta).toFixed(1)),
          lens.minAperture,
          lens.maxAperture,
        );
        return { ...prev, aperture: nextAperture };
      }
      if (key === 'whiteBalance') {
        const nextWB = clamp(prev.whiteBalance + delta, 2500, 9000);
        return { ...prev, whiteBalance: nextWB };
      }
      if (key === 'shutter') {
        const next = clamp(prev.shutter + delta, 1 / 8000, 1 / 4);
        return { ...prev, shutter: next };
      }
      return prev;
    });
  }, [lens.minAperture, lens.maxAperture]);

  const handleLensChange = useCallback(
    (id) => {
      if (id === lensId || isLensTransitioning) return;
      setIsLensTransitioning(true);
      setLensId(id);
      clearTimeout(lensRotationTimeoutRef.current || undefined);
      lensRotationTimeoutRef.current = setTimeout(() => setIsLensTransitioning(false), 620);
    },
    [isLensTransitioning, lensId],
  );

  const cycleFlashMode = useCallback(() => {
    setFlashMode((prev) => {
      const index = FLASH_MODES.indexOf(prev);
      const nextIndex = index === -1 ? 0 : (index + 1) % FLASH_MODES.length;
      return FLASH_MODES[nextIndex];
    });
  }, []);

  const temperatureTint = useMemo(() => {
    const ratio = (exposure.whiteBalance - 2500) / (9000 - 2500);
    const warm = clamp(ratio, 0, 1);
    const cool = 1 - warm;
    return {
      warm,
      cool,
    };
  }, [exposure.whiteBalance]);

  const exposureLook = useMemo(() => calculateExposureLook(exposure, theme), [exposure, theme]);
  const {
    brightness: exposureBrightness,
    contrast: exposureContrast,
    grain: grainStrength,
    shutterSmear,
    sceneLuminance,
  } = exposureLook;

  const triggerFlash = useCallback(
    (force = false) => {
      if (flashActive) return;
      if (flashMode === 'off') return;
      if (!force && flashMode === 'auto' && sceneLuminance > 0.62) return;
      setFlashActive(true);
      setShowFlashReady(false);
      clearTimeout(flashOverlayTimeoutRef.current || undefined);
      flashOverlayTimeoutRef.current = setTimeout(() => {
        setFlashActive(false);
      }, 260);
      clearTimeout(flashTimeoutRef.current || undefined);
      flashTimeoutRef.current = setTimeout(() => {
        setShowFlashReady(true);
      }, 900);
    },
    [flashActive, flashMode, sceneLuminance],
  );

  const handleFlashPress = useCallback(() => {
    triggerFlash(true);
  }, [triggerFlash]);

  const vignetteStrength = useMemo(() => {
    return lens.vignette * (cameraMode === 'dslr' ? 1.1 : 0.9);
  }, [lens.vignette, cameraMode]);

  const distortion = useMemo(() => {
    return lens.distortion * (lens.id === '24mm' ? 1.2 : 1);
  }, [lens]);

  const warmOverlay = 0.12 + temperatureTint.warm * 0.18;
  const coolOverlay = 0.08 + temperatureTint.cool * 0.14;

  const hudReadouts = useMemo(() => {
    const base = [
      { label: 'ISO', value: exposure.iso },
      { label: 'F', value: exposure.aperture.toFixed(1) },
      { label: 'S', value: `1/${Math.round(1 / exposure.shutter)}` },
      { label: 'WB', value: `${exposure.whiteBalance}K` },
    ];

    if (hudLevel === 'few') return base.slice(0, 2);
    if (hudLevel === 'most') return [...base, { label: 'Lens', value: lens.name }];
    if (hudLevel === 'all') {
      return [
        ...base,
        { label: 'Lens', value: lens.name },
        { label: 'Mode', value: cameraMode.toUpperCase() },
        { label: 'Meter', value: calculateMeter(exposure, theme, sceneLuminance) },
        { label: 'Flash', value: flashMode.toUpperCase() },
      ];
    }
    return [];
  }, [exposure, hudLevel, lens.name, cameraMode, theme, sceneLuminance, flashMode]);

  const stageStyle = useMemo(
    () => ({
      '--exposure-brightness': exposureBrightness,
      '--exposure-contrast': exposureContrast,
      '--warm-overlay': warmOverlay,
      '--cool-overlay': coolOverlay,
      '--grain-strength': grainStrength,
      '--shutter-strength': shutterSmear,
    }),
    [exposureBrightness, exposureContrast, warmOverlay, coolOverlay, grainStrength, shutterSmear],
  );

  const stageClassNames = [
    'stage',
    theme === 'dark' ? 'stage-dark' : 'stage-light',
    cameraMode === 'dslr' ? 'stage-dslr' : 'stage-mirrorless',
    isFocusing ? 'stage-focusing' : '',
    flashActive ? 'stage-flash' : '',
    isLensTransitioning ? 'stage-rotating' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const transformStyle = {
    transform: `translate(-50%, -50%) translateX(${activePanel * -100}%)`,
  };

  return (
    <div className={`viewport ${theme}`}>
      <main
        ref={stageRef}
        className={stageClassNames}
        onPointerMove={handlePointerMove}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        style={stageStyle}
      >
        <LensOverlay
          vignette={vignetteStrength}
          distortion={distortion}
          fov={lens.fov}
          flashMode={flashMode}
        />
        <ExposureEffects grain={grainStrength} shutter={shutterSmear} />
        <PanelRail
          panels={panels}
          activePanel={activePanel}
          style={transformStyle}
          apertureBlur={apertureBlur}
          exposure={exposure}
          theme={theme}
          focusPoint={focusPoint}
          isFocusing={isFocusing}
          dynamicWordIndex={dynamicWordIndex}
        />
        <FocusCursor position={cursorPos} focusing={isFocusing} />
        <FlashOverlay active={flashActive} focusPoint={focusPoint} theme={theme} mode={flashMode} />
        <FlashToggle mode={flashMode} onCycle={cycleFlashMode} theme={theme} />
        <Hud
          hudReadouts={hudReadouts}
          hudLevel={hudLevel}
          showFlashReady={showFlashReady}
          flashReady={!flashActive && showFlashReady}
          theme={theme}
          cameraMode={cameraMode}
          activePanel={panels[activePanel]?.title ?? ''}
          flashMode={flashMode}
        />
        <ControlCluster
          exposure={exposure}
          lens={lens}
          theme={theme}
          hudLevel={hudLevel}
          cameraMode={cameraMode}
          onAdjust={adjustExposure}
          onFlash={handleFlashPress}
          onCycleHud={cycleHudLevel}
          onToggleTheme={toggleTheme}
          onToggleCameraMode={toggleCameraMode}
          flashMode={flashMode}
        />
        <LensSelector
          lenses={LENSES}
          activeLensId={lensId}
          onSelect={handleLensChange}
        />
      </main>
      <style jsx>{`
        .viewport {
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: var(--bg, #02030a);
          color: #f8f9fb;
          font-family: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
          font-kerning: normal;
        }
        .viewport.light {
          --bg: #f5f7fb;
          color: #10121a;
        }
        .stage {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          transition: background 0.4s ease, filter 0.4s ease;
          filter: brightness(var(--exposure-brightness, 1)) contrast(var(--exposure-contrast, 1));
          background: radial-gradient(circle at 20% 15%, rgba(72, 109, 255, 0.22), transparent 45%),
            radial-gradient(circle at 80% 10%, rgba(255, 193, 122, 0.18), transparent 48%),
            radial-gradient(circle at 50% 100%, rgba(77, 214, 189, 0.18), transparent 58%),
            var(--stage-bg, #050510);
        }
        .stage::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.06), transparent 45%),
            radial-gradient(
              circle at 50% 50%,
              rgba(255, 236, 210, calc(var(--warm-overlay, 0.2) * 0.8)),
              transparent 65%
            );
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: ${theme === 'dark' ? 0.5 : 0.28};
        }
        .stage::after {
          content: '';
          position: absolute;
          inset: -40%;
          background-image: radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 0);
          background-size: 260px 260px;
          opacity: 0.22;
          transform: rotate(2deg);
          pointer-events: none;
        }
        .stage-dark {
          --stage-bg: radial-gradient(circle at 50% 0%, rgba(7, 9, 21, 0.92), #050510 78%);
        }
        .stage-light {
          --stage-bg: linear-gradient(150deg, #fafafe 10%, #dce5ff 90%);
        }
        .stage-dslr.stage-focusing .rail {
          animation: mirrorFlip 0.4s ease;
        }
        .stage-flash::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, rgba(255, 255, 255, ${
            theme === 'dark' ? 0.75 : 0.45
          }), transparent 60%);
          mix-blend-mode: screen;
          pointer-events: none;
        }
        .stage-rotating {
          animation: lensSwap 0.6s ease;
        }
        @keyframes lensSwap {
          0% {
            transform: rotate(0deg);
          }
          49% {
            transform: rotate(180deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        @keyframes mirrorFlip {
          0% {
            opacity: 1;
          }
          40% {
            opacity: 0.2;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
      <style jsx global>{`
        *, *::before, *::after {
          box-sizing: border-box;
        }
        body {
          margin: 0;
          background: #02030a;
          color: inherit;
          font-family: 'Manrope', 'Inter', 'Helvetica Neue', sans-serif;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
        ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        button {
          font-family: inherit;
        }
      `}</style>
    </div>
  );
}

function PanelRail({
  panels,
  activePanel,
  style,
  apertureBlur,
  exposure,
  theme,
  focusPoint,
  isFocusing,
  dynamicWordIndex,
}) {
  return (
    <div className="rail" style={style}>
      {panels.map((panel, index) => (
        <section
          key={panel.id}
          className={`panel ${panel.layout} ${activePanel === index ? 'panel-active' : ''} ${
            isFocusing && activePanel !== index && exposure.aperture <= 1.6 ? 'panel-defocus' : ''
          } ${activePanel !== index ? 'panel-deemphasized' : ''}`}
          style={{
            filter:
              activePanel === index
                ? 'none'
                : `blur(${(apertureBlur * 0.7).toFixed(2)}px) brightness(${exposure.aperture < 2 ? 0.9 : 0.75})`,
          }}
        >
          <PanelContent
            panel={panel}
            focusPoint={focusPoint}
            theme={theme}
            dynamicWordIndex={dynamicWordIndex}
          />
        </section>
      ))}
      <style jsx>{`
        .rail {
          position: absolute;
          top: 50%;
          left: 50%;
          display: flex;
          gap: 4.5rem;
          transform: translate(-50%, -50%);
          transition: transform 0.6s cubic-bezier(0.4, 0.01, 0.2, 1);
        }
        .panel {
          position: relative;
          width: min(66vw, 1040px);
          min-height: 68vh;
          border-radius: 34px;
          padding: 3.25rem;
          background: linear-gradient(
              140deg,
              rgba(${theme === 'dark' ? '20, 26, 45, 0.72' : '244, 246, 255, 0.82'}),
              rgba(${theme === 'dark' ? '13, 17, 34, 0.92' : '231, 236, 255, 0.88'})
            ),
            radial-gradient(circle at 0% 0%, rgba(134, 244, 255, 0.25), transparent 58%);
          border: 1px solid rgba(${theme === 'dark' ? '162, 174, 255, 0.14' : '34, 52, 120, 0.18'});
          box-shadow: 0 32px 80px rgba(${theme === 'dark' ? '3, 6, 18, 0.55' : '46, 55, 120, 0.18'});
          backdrop-filter: blur(30px) saturate(120%);
          display: grid;
          grid-template-rows: auto 1fr;
          overflow: hidden;
          transition: box-shadow 0.4s ease, transform 0.4s ease, filter 0.5s ease, border 0.4s ease;
        }
        .panel::before {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 32px;
          background: linear-gradient(160deg, rgba(255, 255, 255, 0.04), transparent 60%);
          pointer-events: none;
        }
        .panel-active {
          transform: translateY(-18px) scale(1.025);
          border-color: rgba(${theme === 'dark' ? '205, 235, 255, 0.5' : '32, 62, 150, 0.4'});
          box-shadow: 0 48px 110px rgba(${theme === 'dark' ? '0, 12, 60, 0.65' : '34, 52, 120, 0.28'});
        }
        .panel-defocus {
          filter: blur(${apertureBlur.toFixed(2)}px) brightness(0.65) saturate(0.85) !important;
        }
        .panel-deemphasized {
          opacity: 0.7;
        }
        @media (max-width: 960px) {
          .rail {
            gap: 2.4rem;
          }
          .panel {
            width: 88vw;
            min-height: 64vh;
            padding: 2.2rem;
            border-radius: 28px;
          }
          .panel::before {
            border-radius: 26px;
          }
        }
      `}</style>
    </div>
  );
}

function PanelContent({ panel, focusPoint, theme, dynamicWordIndex }) {
  const { layout } = panel;

  if (layout === 'hero') {
    const word = panel.dynamicWords[dynamicWordIndex % panel.dynamicWords.length];
    return (
      <div className="panel-hero">
        <div className="hero-meta">
          <span className="hero-pill">Menelek Makonnen</span>
          <span className="hero-pill tone">Luxury Creative Operating System</span>
        </div>
        <h1>
          {panel.title}{' '}
          <span className="hero-word">{word}</span>
        </h1>
        <p>
          Film director, photographer, and AI storyteller translating the poetry of light into digital worlds.
          Navigate the interface as you would a flagship camera and step into each crafted universe.
        </p>
        <div className="hero-cta">
          <span className="cta-label">Swipe to explore</span>
          <span className="cta-line" />
          <span className="cta-detail">Lens shifts, HUD states, and flash all react in real time.</span>
        </div>
        <style jsx>{`
          .panel-hero {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2.4rem;
          }
          .hero-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.8rem;
          }
          .hero-pill {
            padding: 0.45rem 1.2rem;
            border-radius: 999px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0));
            border: 1px solid rgba(255, 255, 255, 0.16);
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-size: 0.72rem;
            font-weight: 600;
          }
          .hero-pill.tone {
            background: linear-gradient(135deg, rgba(134, 244, 255, 0.25), rgba(121, 141, 255, 0.18));
            color: ${theme === 'dark' ? '#f4fbff' : '#13204d'};
          }
          h1 {
            font-size: clamp(2.9rem, 4.6vw, 5.1rem);
            line-height: 1.04;
            font-weight: 700;
            letter-spacing: -0.01em;
          }
          .hero-word {
            color: ${theme === 'dark' ? '#9df6ff' : '#2a3fde'};
            text-shadow: 0 0 36px ${theme === 'dark' ? 'rgba(54, 214, 255, 0.6)' : 'rgba(42, 63, 222, 0.4)'};
          }
          p {
            max-width: 38ch;
            font-size: 1.08rem;
            line-height: 1.8;
            opacity: 0.85;
          }
          .hero-cta {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            gap: 1.2rem;
            font-size: 0.85rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            color: rgba(255, 255, 255, 0.72);
          }
          .cta-line {
            flex: 1 1 120px;
            height: 1px;
            background: linear-gradient(90deg, rgba(255, 255, 255, 0.4), transparent);
          }
          .cta-detail {
            font-size: 0.75rem;
            letter-spacing: 0.08em;
            opacity: 0.65;
          }
          @media (max-width: 960px) {
            .hero-cta {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.6rem;
            }
            .cta-line {
              display: none;
            }
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'links') {
    return (
      <div className="panel-links">
        <h2>{panel.title}</h2>
        <ul>
          {panel.items.map((item) => (
            <li key={item.label}>
              <a href={item.url} target="_blank" rel="noreferrer">
                <span className="link-label">{item.label}</span>
                <span className="link-arrow">↗</span>
              </a>
            </li>
          ))}
        </ul>
        <style jsx>{`
          .panel-links {
            display: flex;
            flex-direction: column;
            gap: 1.6rem;
          }
          h2 {
            font-size: clamp(2.2rem, 3vw, 3.2rem);
          }
          ul {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1.4rem;
          }
          li a {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 1.15rem 1.4rem;
            border-radius: 18px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), rgba(255, 255, 255, 0.02));
            border: 1px solid rgba(255, 255, 255, 0.16);
            color: inherit;
            font-weight: 600;
            letter-spacing: 0.06em;
            text-transform: uppercase;
            transition: transform 0.35s ease, border 0.35s ease, box-shadow 0.35s ease;
          }
          li a:hover {
            transform: translateY(-8px);
            border-color: rgba(134, 244, 255, 0.65);
            box-shadow: 0 26px 40px rgba(0, 0, 0, 0.35);
          }
          .link-arrow {
            font-size: 1rem;
            opacity: 0.8;
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'carousel') {
    return (
      <div className="panel-carousel">
        <h2>{panel.title}</h2>
        <div className="reel">
          {panel.items.map((item, index) => (
            <article key={item.label}>
              <span className="reel-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="reel-body">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
              <a href={item.url} target="_blank" rel="noreferrer">
                Play on YouTube ↗
              </a>
            </article>
          ))}
        </div>
        <style jsx>{`
          .panel-carousel {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.1rem);
          }
          .reel {
            display: grid;
            grid-auto-flow: column;
            grid-auto-columns: minmax(240px, 1fr);
            gap: 1.8rem;
            overflow: hidden;
          }
          article {
            padding: 1.8rem;
            border-radius: 22px;
            background: linear-gradient(140deg, rgba(17, 20, 38, 0.68), rgba(22, 24, 48, 0.92));
            border: 1px solid rgba(134, 244, 255, 0.18);
            backdrop-filter: blur(22px);
            display: grid;
            grid-template-rows: auto 1fr auto;
            gap: 1.2rem;
            position: relative;
            overflow: hidden;
          }
          article::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 20% 0%, rgba(255, 255, 255, 0.12), transparent 55%);
            opacity: 0.7;
            pointer-events: none;
          }
          .reel-index {
            font-size: 1.6rem;
            font-weight: 700;
            letter-spacing: 0.16em;
            color: rgba(134, 244, 255, 0.8);
          }
          .reel-body {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;
          }
          a {
            align-self: flex-start;
            padding: 0.65rem 1.3rem;
            border-radius: 999px;
            background: ${theme === 'dark' ? 'rgba(134, 244, 255, 0.18)' : 'rgba(64, 88, 255, 0.22)'};
            color: inherit;
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          a:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px rgba(0, 0, 0, 0.25);
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'grid') {
    return (
      <div className="panel-grid">
        <h2>{panel.title}</h2>
        <div className="belt">
          {panel.items.map((item, index) => (
            <span key={`${item}-${index}`}>
              <em>{String.fromCharCode(0x41 + ((index * 7) % 26))}</em>
              {item}
            </span>
          ))}
        </div>
        <style jsx>{`
          .panel-grid {
            display: flex;
            flex-direction: column;
            gap: 1.8rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.4rem);
          }
          .belt {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.4rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .belt span {
            position: relative;
            padding: 1.05rem 1.5rem 1.2rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: linear-gradient(140deg, rgba(255, 255, 255, 0.08), rgba(134, 244, 255, 0.1));
            backdrop-filter: blur(14px);
            box-shadow: 0 20px 34px rgba(0, 0, 0, 0.25);
            display: flex;
            flex-direction: column;
            gap: 0.6rem;
            overflow: hidden;
            color: rgba(255, 255, 255, 0.92);
            font-weight: 600;
            z-index: 1;
          }
          .belt span::after {
            content: '';
            position: absolute;
            inset: 0;
            background: linear-gradient(160deg, rgba(255, 255, 255, 0.24), transparent 60%);
            opacity: 0.35;
            pointer-events: none;
          }
          .belt span em {
            font-style: normal;
            font-size: 0.8rem;
            letter-spacing: 0.28em;
            color: rgba(134, 244, 255, 0.75);
            z-index: 1;
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'columns') {
    return (
      <div className="panel-columns">
        <h2>{panel.title}</h2>
        <div className="columns">
          {panel.items.map((item) => (
            <div className="column" key={item.label}>
              <div className="column-top">
                <span className="column-glyph" aria-hidden="true">◎</span>
                <h3>{item.label}</h3>
              </div>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
        <style jsx>{`
          .panel-columns {
            display: flex;
            flex-direction: column;
            gap: 2.2rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.3rem);
          }
          .columns {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.6rem;
          }
          .column {
            padding: 1.6rem 1.8rem;
            border-radius: 24px;
            background: linear-gradient(140deg, rgba(17, 20, 36, 0.75), rgba(38, 44, 70, 0.65));
            border: 1px solid rgba(134, 244, 255, 0.18);
            backdrop-filter: blur(18px);
            display: grid;
            gap: 1rem;
            box-shadow: 0 28px 42px rgba(0, 0, 0, 0.26);
          }
          .column-top {
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          .column-glyph {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(134, 244, 255, 0.16);
            font-size: 1.1rem;
            letter-spacing: 0.2em;
          }
          h3 {
            font-size: 1.45rem;
            margin: 0;
          }
          p {
            font-size: 0.98rem;
            line-height: 1.7;
            opacity: 0.85;
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'stack') {
    return (
      <div className="panel-stack">
        <h2>{panel.title}</h2>
        <ul>
          {panel.items.map((item, index) => (
            <li key={`${item}-${index}`}>
              <span className="stack-index">{String(index + 1).padStart(2, '0')}</span>
              <p>{item}</p>
            </li>
          ))}
        </ul>
        <style jsx>{`
          .panel-stack {
            display: flex;
            flex-direction: column;
            gap: 1.8rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.3rem);
          }
          ul {
            display: flex;
            flex-direction: column;
            gap: 1.1rem;
          }
          li {
            display: flex;
            align-items: center;
            gap: 1.4rem;
            padding: 1.1rem 1.4rem;
            border-radius: 20px;
            background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), rgba(134, 244, 255, 0.06));
            border: 1px solid rgba(255, 255, 255, 0.14);
            backdrop-filter: blur(14px);
            box-shadow: 0 18px 32px rgba(0, 0, 0, 0.22);
          }
          .stack-index {
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 0.28em;
            color: rgba(134, 244, 255, 0.85);
          }
          p {
            margin: 0;
            font-size: 1.02rem;
            line-height: 1.7;
            opacity: 0.86;
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'albums') {
    return (
      <div className="panel-albums">
        <h2>{panel.title}</h2>
        <div className="albums">
          {panel.items.map((item) => (
            <div className="album" key={item.label}>
              <div className="album-header">
                <span>{item.folder}</span>
              </div>
              <div className="album-body">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
        <style jsx>{`
          .panel-albums {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.3rem);
          }
          .albums {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 1.8rem;
          }
          .album {
            position: relative;
            border-radius: 26px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.18);
            background: linear-gradient(160deg, rgba(14, 16, 32, 0.82), rgba(31, 36, 62, 0.9));
            display: flex;
            flex-direction: column;
            min-height: 240px;
            box-shadow: 0 32px 54px rgba(0, 0, 0, 0.3);
          }
          .album::after {
            content: '';
            position: absolute;
            inset: 0;
            background: radial-gradient(circle at 80% 0%, rgba(134, 244, 255, 0.24), transparent 60%);
            mix-blend-mode: screen;
            pointer-events: none;
          }
          .album-header {
            padding: 1rem 1.5rem;
            font-size: 0.74rem;
            text-transform: uppercase;
            letter-spacing: 0.32em;
            background: rgba(255, 255, 255, 0.06);
            display: flex;
            align-items: center;
            gap: 0.6rem;
            z-index: 1;
          }
          .album-header::before {
            content: '';
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: rgba(134, 244, 255, 0.8);
          }
          .album-body {
            flex: 1;
            padding: 1.6rem 1.8rem 2rem;
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
            position: relative;
            z-index: 1;
          }
          h3 {
            font-size: 1.45rem;
            margin: 0;
          }
          p {
            font-size: 1.02rem;
            line-height: 1.7;
            opacity: 0.84;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  if (layout === 'blog') {
    return (
      <div className="panel-blog">
        <h2>{panel.title}</h2>
        <div className="posts">
          {panel.items.map((item, index) => (
            <article key={item.label}>
              <span className="post-index">{String(index + 1).padStart(2, '0')}</span>
              <div className="post-body">
                <h3>{item.label}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <style jsx>{`
          .panel-blog {
            display: flex;
            flex-direction: column;
            gap: 2rem;
          }
          h2 {
            font-size: clamp(2.1rem, 3vw, 3.3rem);
          }
          .posts {
            display: grid;
            gap: 1.4rem;
            position: relative;
          }
          .posts::before {
            content: '';
            position: absolute;
            left: 26px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(180deg, rgba(134, 244, 255, 0.5), transparent);
          }
          article {
            position: relative;
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1.4rem;
            padding: 1.4rem 1.6rem;
            border-radius: 22px;
            background: linear-gradient(130deg, rgba(255, 255, 255, 0.08), rgba(134, 244, 255, 0.08));
            border: 1px solid rgba(255, 255, 255, 0.16);
            backdrop-filter: blur(16px);
            box-shadow: 0 24px 40px rgba(0, 0, 0, 0.24);
          }
          .post-index {
            width: 52px;
            height: 52px;
            border-radius: 50%;
            display: grid;
            place-items: center;
            background: rgba(134, 244, 255, 0.16);
            font-weight: 700;
            letter-spacing: 0.24em;
          }
          h3 {
            margin: 0 0 0.6rem;
            font-size: 1.36rem;
          }
          p {
            opacity: 0.84;
            line-height: 1.7;
            margin: 0;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

function Hud({
  hudReadouts,
  hudLevel,
  showFlashReady,
  flashReady,
  theme,
  cameraMode,
  activePanel,
  flashMode,
}) {
  return (
    <div className={`hud hud-${hudLevel}`}>
      <div className="hud-left">
        <span>{cameraMode === 'dslr' ? 'OVF MODE' : 'EVF LIVE'}</span>
        <span className="hud-panel">{activePanel}</span>
      </div>
      <div className="hud-center">
        {hudReadouts.map((item) => (
          <div key={item.label} className="hud-item">
            <span className="label">{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="hud-right">
        {showFlashReady && (
          <span className={`flash-ready ${flashReady ? 'ready' : 'charging'}`}>
            {flashReady ? 'FLASH READY' : 'FLASH CHARGING'}
          </span>
        )}
        <span className="flash-mode">MODE: {flashMode.toUpperCase()}</span>
      </div>
      <style jsx>{`
        .hud {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(90vw, 1180px);
          padding: 1.3rem 2rem;
          border-radius: 26px 26px 0 0;
          background: rgba(${theme === 'dark' ? '6, 8, 18, 0.85' : '240, 242, 255, 0.92'});
          backdrop-filter: blur(28px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.4rem;
          letter-spacing: 0.08em;
          font-size: 0.8rem;
          border: 1px solid rgba(${theme === 'dark' ? '162, 174, 255, 0.2' : '34, 52, 120, 0.26'});
          box-shadow: 0 -18px 36px rgba(0, 0, 0, 0.32);
        }
        .hud-left,
        .hud-right {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-transform: uppercase;
          font-size: 0.72rem;
          opacity: 0.8;
        }
        .hud-panel {
          font-size: 0.75rem;
          opacity: 0.7;
          max-width: 16ch;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .flash-mode {
          font-size: 0.72rem;
          opacity: 0.65;
          letter-spacing: 0.12em;
        }
        .hud-center {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.6rem;
        }
        .hud-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
          padding: 0.4rem 0.6rem;
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.04);
        }
        .label {
          font-size: 0.7rem;
          opacity: 0.6;
        }
        .value {
          font-size: 1rem;
          font-weight: 700;
        }
        .flash-ready {
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.22);
          background: rgba(255, 255, 255, 0.06);
        }
        .flash-ready.ready {
          color: ${theme === 'dark' ? '#86f4ff' : '#3044ff'};
        }
        .flash-ready.charging {
          color: #ffb347;
        }
        @media (max-width: 768px) {
          .hud {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            padding: 1rem 1.2rem 1.3rem;
          }
          .hud-center {
            width: 100%;
            justify-content: space-between;
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  );
}

function ControlCluster({
  exposure,
  lens,
  theme,
  hudLevel,
  cameraMode,
  onAdjust,
  onFlash,
  onCycleHud,
  onToggleTheme,
  onToggleCameraMode,
  flashMode,
}) {
  const shutterLabel = `1/${Math.round(1 / exposure.shutter)}`;
  return (
    <div className="controls">
      <div className="cluster left">
        <button onClick={() => onAdjust('iso', -100)} aria-label="Decrease ISO">
          ISO-
        </button>
        <span className="readout">ISO {exposure.iso}</span>
        <button onClick={() => onAdjust('iso', 100)} aria-label="Increase ISO">
          ISO+
        </button>
        <div className="dial">
          <span>WB</span>
          <input
            type="range"
            min={2500}
            max={9000}
            step={100}
            value={exposure.whiteBalance}
            onChange={(event) => onAdjust('whiteBalance', parseInt(event.target.value, 10) - exposure.whiteBalance)}
          />
        </div>
        <button onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'dark' ? 'Bright Mode' : 'Dark Mode'}
        </button>
      </div>
      <div className="cluster center">
        <button onClick={() => onAdjust('aperture', -0.2)} aria-label="Open aperture">
          F-
        </button>
        <span className="readout">ƒ/{exposure.aperture.toFixed(1)}</span>
        <button onClick={() => onAdjust('aperture', 0.2)} aria-label="Close aperture">
          F+
        </button>
        <button
          className={`flash ${flashMode}`}
          onClick={onFlash}
          aria-label="Trigger flash"
          disabled={flashMode === 'off'}
        >
          Flash {flashMode === 'auto' ? 'Auto' : flashMode === 'on' ? 'On' : 'Off'}
        </button>
        <button onClick={() => onAdjust('shutter', -1 / 1250)} aria-label="Faster shutter">
          S+
        </button>
        <span className="readout">{shutterLabel}</span>
        <button onClick={() => onAdjust('shutter', 1 / 1250)} aria-label="Slower shutter">
          S-
        </button>
      </div>
      <div className="cluster right">
        <button onClick={onToggleCameraMode} aria-label="Toggle camera type">
          {cameraMode === 'dslr' ? 'Mirrorless' : 'DSLR'}
        </button>
        <button onClick={onCycleHud} aria-label="Cycle HUD level">
          HUD: {hudLevel.toUpperCase()}
        </button>
        <div className="lens-meta">
          <span>{lens.name}</span>
          <span>{lens.fov.toFixed(0)}° FOV</span>
        </div>
      </div>
      <style jsx>{`
        .controls {
          position: absolute;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          width: min(92vw, 1260px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          pointer-events: none;
        }
        .cluster {
          display: flex;
          align-items: center;
          gap: 1rem;
          pointer-events: auto;
          background: rgba(${theme === 'dark' ? '6, 8, 18, 0.72' : '235, 238, 255, 0.88'});
          padding: 1rem 1.2rem;
          border-radius: 28px;
          backdrop-filter: blur(24px);
          box-shadow: 0 18px 34px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(${theme === 'dark' ? '162, 174, 255, 0.22' : '34, 52, 120, 0.26'});
        }
        .cluster.center {
          gap: 1.1rem;
        }
        button {
          border: none;
          border-radius: 999px;
          padding: 0.55rem 1.2rem;
          font-size: 0.82rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), rgba(255, 255, 255, 0.02));
          color: inherit;
          cursor: pointer;
          transition: transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
        }
        button:hover {
          transform: translateY(-3px);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.22), rgba(134, 244, 255, 0.22));
          box-shadow: 0 18px 28px rgba(0, 0, 0, 0.25);
        }
        button:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          transform: none;
          box-shadow: none;
        }
        .flash {
          background: linear-gradient(135deg, #ffe45b, #ff8c00);
          color: #1a1406;
          font-weight: 700;
          box-shadow: 0 16px 32px rgba(255, 162, 0, 0.32);
        }
        .flash.off {
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.18), rgba(255, 255, 255, 0.04));
          color: inherit;
          font-weight: 600;
          box-shadow: none;
        }
        .readout {
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .dial {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          padding-left: 0.4rem;
          border-left: 1px solid rgba(255, 255, 255, 0.12);
        }
        .dial input {
          width: 140px;
        }
        .lens-meta {
          display: flex;
          flex-direction: column;
          gap: 0.2rem;
          text-align: right;
          font-size: 0.78rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        @media (max-width: 960px) {
          .controls {
            flex-direction: column;
            gap: 1rem;
            top: 16px;
          }
          .cluster {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          .cluster.right {
            flex-direction: column;
            text-align: center;
          }
          .lens-meta {
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}

function LensSelector({ lenses, activeLensId, onSelect }) {
  return (
    <div className="lens-selector">
      {lenses.map((item) => (
        <button
          key={item.id}
          className={item.id === activeLensId ? 'active' : ''}
          onClick={() => onSelect(item.id)}
        >
          {item.id}
        </button>
      ))}
      <style jsx>{`
        .lens-selector {
          position: absolute;
          right: 32px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          padding: 1.4rem 1.1rem;
          border-radius: 28px;
          background: rgba(6, 8, 18, 0.6);
          backdrop-filter: blur(22px);
          box-shadow: 0 28px 46px rgba(0, 0, 0, 0.32);
          border: 1px solid rgba(162, 174, 255, 0.22);
        }
        button {
          border: none;
          border-radius: 16px;
          padding: 0.65rem 1.1rem;
          background: rgba(255, 255, 255, 0.12);
          color: #fefefe;
          cursor: pointer;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.74rem;
          transition: transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
        }
        button.active {
          background: linear-gradient(135deg, rgba(134, 244, 255, 0.9), rgba(118, 140, 255, 0.9));
          color: #030510;
          transform: translateX(-6px);
          font-weight: 700;
          box-shadow: 0 18px 32px rgba(83, 208, 255, 0.45);
        }
        button:hover {
          transform: translateX(-4px);
        }
        @media (max-width: 768px) {
          .lens-selector {
            flex-direction: row;
            bottom: 24px;
            top: auto;
            right: 50%;
            transform: translate(50%, 0);
          }
          button.active {
            transform: translateY(-4px);
          }
        }
      `}</style>
    </div>
  );
}

function FocusCursor({ position, focusing }) {
  return (
    <div
      className={`focus-cursor ${focusing ? 'focusing' : ''}`}
      style={{ left: `${position.x}%`, top: `${position.y}%` }}
    >
      <div className="ring" />
      <div className="ring second" />
      <style jsx>{`
        .focus-cursor {
          position: absolute;
          pointer-events: none;
          width: 120px;
          height: 120px;
          margin-left: -60px;
          margin-top: -60px;
          display: grid;
          place-items: center;
          mix-blend-mode: screen;
          transition: transform 0.2s ease;
        }
        .focus-cursor.focusing {
          animation: focusPulse 0.42s ease;
        }
        .ring {
          width: 80px;
          height: 80px;
          border-radius: 28px;
          border: 2px solid rgba(134, 244, 255, 0.8);
          backdrop-filter: blur(2px);
        }
        .ring.second {
          width: 56px;
          height: 56px;
          border-color: rgba(134, 244, 255, 0.45);
        }
        @keyframes focusPulse {
          0% {
            transform: scale(1.2);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

function FlashOverlay({ active, focusPoint, theme, mode }) {
  const intensity = mode === 'on' ? 1 : mode === 'auto' ? 0.85 : 0.65;
  const baseAlpha = theme === 'dark' ? 0.85 : 0.6;
  const alpha = clamp(baseAlpha * intensity, 0, 1);
  return (
    <div
      className={`flash-overlay ${active ? 'active' : ''}`}
      style={{
        background: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, rgba(255,255,255, ${alpha}), transparent 55%)`,
      }}
    >
      <style jsx>{`
        .flash-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.18s ease;
          mix-blend-mode: screen;
        }
        .flash-overlay.active {
          opacity: 1;
        }
      `}</style>
    </div>
  );
}

function FlashToggle({ mode, onCycle, theme }) {
  const label = mode === 'auto' ? 'AUTO' : mode === 'on' ? 'ON' : 'OFF';
  return (
    <button className="flash-toggle" onClick={onCycle} aria-label="Cycle flash mode">
      Flash Toggle · {label}
      <style jsx>{`
        .flash-toggle {
          position: absolute;
          top: 26px;
          left: 32px;
          padding: 0.65rem 1.4rem;
          border-radius: 999px;
          border: 1px solid rgba(${theme === 'dark' ? '162, 174, 255, 0.26' : '34, 52, 120, 0.26'});
          background: rgba(${theme === 'dark' ? '8, 10, 18, 0.78' : '238, 240, 255, 0.9'});
          color: inherit;
          letter-spacing: 0.14em;
          font-size: 0.7rem;
          text-transform: uppercase;
          cursor: pointer;
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 30px rgba(0, 0, 0, 0.28);
          transition: transform 0.28s ease, background 0.28s ease, box-shadow 0.28s ease;
        }
        .flash-toggle:hover {
          transform: translateY(-3px);
          background: rgba(${theme === 'dark' ? '18, 22, 36, 0.9' : '224, 227, 255, 0.96'});
          box-shadow: 0 22px 34px rgba(0, 0, 0, 0.32);
        }
        @media (max-width: 768px) {
          .flash-toggle {
            left: 50%;
            transform: translateX(-50%);
            top: 18px;
          }
          .flash-toggle:hover {
            transform: translate(-50%, -3px);
          }
        }
      `}</style>
    </button>
  );
}

function ExposureEffects({ grain, shutter }) {
  return (
    <div className="exposure-effects" style={{ '--grain-strength': grain, '--shutter-strength': shutter }}>
      <div className="grain-layer" />
      <div className="shutter-layer" />
      <style jsx>{`
        .exposure-effects {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .grain-layer {
          position: absolute;
          inset: -120%;
          opacity: var(--grain-strength);
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.08) 0, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            radial-gradient(circle at 60% 40%, rgba(0, 0, 0, 0.24) 0, rgba(0, 0, 0, 0.24) 1px, transparent 1px),
            radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.05) 0, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
          background-size: 120px 120px, 180px 180px, 90px 90px;
          mix-blend-mode: soft-light;
          animation: grainShift 1.8s steps(3) infinite;
        }
        .shutter-layer {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.28), transparent 60%);
          filter: blur(calc(var(--shutter-strength) * 32px));
          opacity: calc(var(--shutter-strength) * 0.55);
          transition: opacity 0.45s ease, filter 0.45s ease;
          mix-blend-mode: screen;
        }
        @keyframes grainShift {
          0% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(-5%, 3%, 0);
          }
          100% {
            transform: translate3d(4%, -6%, 0);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .grain-layer {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function LensOverlay({ vignette, distortion, fov, flashMode }) {
  return (
    <div className="lens-overlay">
      <div className="vignette" />
      <div className="hud-top">Flash {flashMode.toUpperCase()}</div>
      <div className="hud-fov">{fov.toFixed(0)}°</div>
      <style jsx>{`
        .lens-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }
        .vignette {
          position: absolute;
          inset: -10%;
          border-radius: 50%;
          transform: scale(${1 + distortion + Math.max(0, (60 - fov) / 220)});
          box-shadow: inset 0 0 140px rgba(0, 0, 0, ${0.65 + vignette});
        }
        .hud-top {
          position: absolute;
          top: 22px;
          right: 24px;
          padding: 0.5rem 0.9rem;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.45);
          color: #f0f3ff;
          font-size: 0.75rem;
          letter-spacing: 0.18em;
        }
        .hud-fov {
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          padding: 0.4rem 0.8rem;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.45);
          color: #f0f3ff;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
        }
      `}</style>
    </div>
  );
}

function calculateExposureLook(exposure, theme) {
  const minShutter = 1 / 8000;
  const maxShutter = 1 / 4;
  const shutterSeconds = clamp(exposure.shutter, minShutter, maxShutter);
  const ev100 = Math.log2((exposure.aperture ** 2) / exposure.shutter);
  const ev = ev100 - Math.log2(exposure.iso / 100);
  const normalized = clamp((ev + 2) / 12, 0, 1);
  const brightness = clamp(0.65 + normalized * 0.9, 0.55, 1.6);
  const contrast = clamp(0.85 + (normalized - 0.5) * 0.4, 0.75, 1.25);
  const grain = clamp(0.08 + ((exposure.iso - 100) / (6400 - 100)) * 0.4, 0.08, 0.42);
  const shutterNormalized = clamp(
    (Math.log(shutterSeconds) - Math.log(minShutter)) / (Math.log(maxShutter) - Math.log(minShutter)),
    0,
    1,
  );
  const shutterSmear = 0.05 + shutterNormalized * 0.9;
  const themeBias = theme === 'dark' ? -0.05 : 0.08;
  const sceneLuminance = clamp(0.25 + normalized * 0.7 + themeBias, 0, 1);
  return { brightness, contrast, grain, shutterSmear, sceneLuminance };
}

function calculateMeter(exposure, theme, sceneLuminance) {
  const target = theme === 'dark' ? 0.45 : 0.62;
  const diff = sceneLuminance - target;
  if (diff > 0.12) return '+';
  if (diff < -0.12) return '-';
  const ev100 = Math.log2((exposure.aperture ** 2) / exposure.shutter);
  const ev = ev100 - Math.log2(exposure.iso / 100);
  const normalized = clamp((ev + 2) / 12, 0, 1);
  if (normalized > target + 0.18) return '+';
  if (normalized < target - 0.18) return '-';
  return '0';
}

function shuffleUniverseItems() {
  const panel = PANELS.find((item) => item.id === 'loremaker');
  if (!panel) {
    return [];
  }
  return [...panel.items].sort(() => Math.random() - 0.5).slice(0, 12);
}
