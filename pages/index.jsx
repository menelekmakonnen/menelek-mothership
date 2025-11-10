import { useEffect, useMemo, useRef, useState } from 'react';

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
  const [panelShuffle, setPanelShuffle] = useState(() => shuffleUniverse());

  const stageRef = useRef(null);
  const focusTimeoutRef = useRef(null);
  const flashTimeoutRef = useRef(null);
  const flashOverlayTimeoutRef = useRef(null);
  const lensRotationTimeoutRef = useRef(null);

  const hudLevel = HUD_LEVELS[hudLevelIndex];
  const lens = useMemo(() => LENSES.find((item) => item.id === lensId) || LENSES[2], [lensId]);

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
    const timeout = setTimeout(() => {
      setPanelShuffle(shuffleUniverse());
    }, 12000);
    return () => clearTimeout(timeout);
  }, [panelShuffle]);

  const handlePointerMove = (event) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setCursorPos({ x, y });
  };

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
        setActivePanel((prev) => Math.min(prev + 1, PANELS.length - 1));
      } else {
        setActivePanel((prev) => Math.max(prev - 1, 0));
      }
    } else {
      if (deltaY < 0) {
        setActivePanel((prev) => Math.min(prev + 1, PANELS.length - 1));
      } else {
        setActivePanel((prev) => Math.max(prev - 1, 0));
      }
    }
  };

  const cycleHudLevel = () => {
    setHudLevelIndex((prev) => (prev + 1) % HUD_LEVELS.length);
  };

  const toggleCameraMode = () => {
    setCameraMode((prev) => (prev === 'mirrorless' ? 'dslr' : 'mirrorless'));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const adjustExposure = (key, delta) => {
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
  };

  const handleLensChange = (id) => {
    if (id === lensId || isLensTransitioning) return;
    setIsLensTransitioning(true);
    setLensId(id);
    clearTimeout(lensRotationTimeoutRef.current || undefined);
    lensRotationTimeoutRef.current = setTimeout(() => setIsLensTransitioning(false), 620);
  };

  const triggerFlash = () => {
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
  };

  const temperatureTint = useMemo(() => {
    const ratio = (exposure.whiteBalance - 2500) / (9000 - 2500);
    const warm = clamp(ratio, 0, 1);
    const cool = 1 - warm;
    return {
      warm,
      cool,
    };
  }, [exposure.whiteBalance]);

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
        { label: 'Meter', value: calculateMeter(exposure, theme) },
      ];
    }
    return [];
  }, [exposure, hudLevel, lens.name, cameraMode, theme]);

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
      >
        <LensOverlay vignette={vignetteStrength} distortion={distortion} fov={lens.fov} />
        <PanelRail
          panels={panelShuffle}
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
        <FlashOverlay active={flashActive} focusPoint={focusPoint} theme={theme} />
        <Hud
          hudReadouts={hudReadouts}
          hudLevel={hudLevel}
          showFlashReady={showFlashReady}
          flashReady={!flashActive && showFlashReady}
          theme={theme}
          cameraMode={cameraMode}
          activePanel={panelShuffle[activePanel]?.title ?? ''}
        />
        <ControlCluster
          exposure={exposure}
          lens={lens}
          theme={theme}
          hudLevel={hudLevel}
          cameraMode={cameraMode}
          onAdjust={adjustExposure}
          onFlash={triggerFlash}
          onCycleHud={cycleHudLevel}
          onToggleTheme={toggleTheme}
          onToggleCameraMode={toggleCameraMode}
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
          background: var(--bg, #05060a);
          color: #f8f9fb;
          font-family: 'Inter', sans-serif;
        }
        .viewport.light {
          --bg: #f7f8fa;
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
          transition: background 0.4s ease;
        }
        .stage::before {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(
            circle at 50% 50%,
            rgba(255, 236, 210, ${warmOverlay}),
            rgba(190, 215, 255, ${coolOverlay}) 42%,
            transparent 70%
          );
          pointer-events: none;
          mix-blend-mode: screen;
          opacity: ${theme === 'dark' ? 0.35 : 0.15};
        }
        .stage-dark {
          background: radial-gradient(circle at 50% 0%, rgba(18, 24, 36, 0.9), #030309 80%);
        }
        .stage-light {
          background: linear-gradient(160deg, #fcfcff, #cfd8ff 80%);
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
          gap: 6rem;
          transform: translate(-50%, -50%);
          transition: transform 0.6s cubic-bezier(0.4, 0.01, 0.2, 1);
        }
        .panel {
          width: min(72vw, 1080px);
          min-height: 70vh;
          border-radius: 32px;
          padding: 3rem;
          box-shadow: 0 24px 60px rgba(0, 0, 0, ${theme === 'dark' ? 0.42 : 0.16});
          background: rgba(${theme === 'dark' ? '10, 12, 22, 0.78' : '250, 250, 255, 0.85'});
          backdrop-filter: blur(28px) saturate(120%);
          display: grid;
          grid-template-rows: auto 1fr;
          overflow: hidden;
          transition: box-shadow 0.35s ease, transform 0.35s ease, filter 0.45s ease;
        }
        .panel-active {
          transform: translateY(-12px) scale(1.02);
          box-shadow: 0 28px 80px rgba(0, 0, 0, ${theme === 'dark' ? 0.55 : 0.18});
        }
        .panel-defocus {
          filter: blur(${apertureBlur.toFixed(2)}px) brightness(0.6) saturate(0.8) !important;
        }
        .panel-deemphasized {
          opacity: 0.78;
        }
        @media (max-width: 960px) {
          .rail {
            gap: 3rem;
          }
          .panel {
            width: 86vw;
            min-height: 68vh;
            padding: 2rem;
            border-radius: 24px;
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
        <h1>
          {panel.title}{' '}
          <span className="hero-word">{word}</span>
        </h1>
        <p>
          Menelek Makonnen crafts cinematic worlds across film, photography, AI experiences, and immersive
          storytelling. Glide through the camera-inspired interface to discover the full body of work.
        </p>
        <style jsx>{`
          .panel-hero {
            display: flex;
            flex-direction: column;
            justify-content: center;
            gap: 2.5rem;
          }
          h1 {
            font-size: clamp(2.6rem, 4vw, 4.6rem);
            line-height: 1.05;
            font-weight: 700;
          }
          .hero-word {
            color: ${theme === 'dark' ? '#86f4ff' : '#4158ff'};
            text-shadow: 0 0 24px ${theme === 'dark' ? 'rgba(0, 255, 240, 0.35)' : 'rgba(65, 88, 255, 0.35)'};
          }
          p {
            max-width: 34ch;
            font-size: 1.12rem;
            line-height: 1.7;
            opacity: 0.82;
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
                {item.label}
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
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 1.2rem;
          }
          li a {
            display: block;
            padding: 1.1rem 1.2rem;
            border-radius: 16px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02));
            color: inherit;
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.02em;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
          }
          li a:hover {
            transform: translateY(-6px);
            box-shadow: 0 16px 30px rgba(0, 0, 0, 0.2);
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
          {panel.items.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
              <a href={item.url} target="_blank" rel="noreferrer">
                View
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
            grid-auto-columns: minmax(220px, 1fr);
            gap: 1.6rem;
            overflow: hidden;
          }
          article {
            padding: 1.5rem;
            border-radius: 20px;
            background: rgba(20, 24, 38, 0.4);
            backdrop-filter: blur(18px);
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }
          a {
            align-self: flex-start;
            padding: 0.6rem 1.2rem;
            border-radius: 999px;
            background: ${theme === 'dark' ? '#86f4ff33' : '#4058ff22'};
            color: inherit;
            text-decoration: none;
            font-weight: 600;
            letter-spacing: 0.02em;
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
            <span key={`${item}-${index}`}>{item}</span>
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
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1.2rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          .belt span {
            padding: 1rem 1.4rem;
            border-radius: 18px;
            border: 1px solid rgba(255, 255, 255, 0.16);
            background: rgba(255, 255, 255, ${theme === 'dark' ? 0.04 : 0.26});
            backdrop-filter: blur(10px);
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
              <h3>{item.label}</h3>
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
            padding: 1.4rem;
            border-radius: 20px;
            background: rgba(255, 255, 255, ${theme === 'dark' ? 0.05 : 0.6});
            backdrop-filter: blur(10px);
          }
          h3 {
            font-size: 1.5rem;
            margin-bottom: 0.7rem;
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
            <li key={`${item}-${index}`}>{item}</li>
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
            gap: 1.2rem;
            font-size: 1.1rem;
            line-height: 1.7;
            opacity: 0.85;
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
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 1.6rem;
          }
          .album {
            border-radius: 24px;
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.14);
            background: rgba(10, 12, 26, 0.45);
            display: flex;
            flex-direction: column;
            min-height: 220px;
          }
          .album-header {
            padding: 0.8rem 1.2rem;
            font-size: 0.85rem;
            text-transform: uppercase;
            letter-spacing: 0.12em;
            background: rgba(255, 255, 255, 0.1);
          }
          .album-body {
            flex: 1;
            padding: 1.4rem 1.3rem 1.6rem;
            display: flex;
            flex-direction: column;
            gap: 0.7rem;
          }
          h3 {
            font-size: 1.5rem;
          }
          p {
            font-size: 1rem;
            line-height: 1.6;
            opacity: 0.8;
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
          {panel.items.map((item) => (
            <article key={item.label}>
              <h3>{item.label}</h3>
              <p>{item.description}</p>
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
            gap: 1.6rem;
          }
          article {
            padding: 1.6rem;
            border-radius: 20px;
            background: rgba(255, 255, 255, ${theme === 'dark' ? 0.05 : 0.6});
            backdrop-filter: blur(14px);
          }
          h3 {
            margin-bottom: 0.6rem;
            font-size: 1.4rem;
          }
          p {
            opacity: 0.82;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

function Hud({ hudReadouts, hudLevel, showFlashReady, flashReady, theme, cameraMode, activePanel }) {
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
      </div>
      <style jsx>{`
        .hud {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: min(90vw, 1180px);
          padding: 1.2rem 1.8rem;
          border-radius: 22px 22px 0 0;
          background: rgba(${theme === 'dark' ? '6, 8, 16, 0.85' : '240, 242, 255, 0.92'});
          backdrop-filter: blur(24px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1.2rem;
          letter-spacing: 0.08em;
          font-size: 0.8rem;
        }
        .hud-left,
        .hud-right {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
          text-transform: uppercase;
        }
        .hud-panel {
          font-size: 0.75rem;
          opacity: 0.7;
          max-width: 16ch;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .hud-center {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.4rem;
        }
        .hud-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.2rem;
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
          border: 1px solid rgba(255, 255, 255, 0.2);
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
        <button className="flash" onClick={onFlash} aria-label="Trigger flash">
          Flash
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
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          width: min(90vw, 1200px);
          display: flex;
          justify-content: space-between;
          align-items: center;
          pointer-events: none;
        }
        .cluster {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          pointer-events: auto;
          background: rgba(${theme === 'dark' ? '6, 8, 16, 0.72' : '238, 240, 255, 0.85'});
          padding: 0.8rem 1rem;
          border-radius: 999px;
          backdrop-filter: blur(20px);
        }
        .cluster.center {
          gap: 0.9rem;
        }
        button {
          border: none;
          border-radius: 999px;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          background: rgba(255, 255, 255, ${theme === 'dark' ? 0.08 : 0.18});
          color: inherit;
          cursor: pointer;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        button:hover {
          transform: translateY(-3px);
          background: rgba(255, 255, 255, ${theme === 'dark' ? 0.16 : 0.26});
        }
        .flash {
          background: linear-gradient(135deg, #ffe45b, #ff8c00);
          color: #1a1406;
          font-weight: 700;
        }
        .readout {
          font-weight: 600;
          letter-spacing: 0.04em;
        }
        .dial {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .dial input {
          width: 120px;
        }
        .lens-meta {
          display: flex;
          flex-direction: column;
          gap: 0.1rem;
          text-align: right;
        }
        @media (max-width: 960px) {
          .controls {
            flex-direction: column;
            gap: 1rem;
            top: 12px;
          }
          .cluster {
            width: 100%;
            justify-content: center;
            flex-wrap: wrap;
          }
          .cluster.right {
            flex-direction: column;
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
          gap: 1rem;
          padding: 1.2rem 1rem;
          border-radius: 24px;
          background: rgba(0, 0, 0, 0.32);
          backdrop-filter: blur(18px);
        }
        button {
          border: none;
          border-radius: 14px;
          padding: 0.6rem 1rem;
          background: rgba(255, 255, 255, 0.12);
          color: #fefefe;
          cursor: pointer;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-size: 0.75rem;
          transition: transform 0.25s ease, background 0.25s ease;
        }
        button.active {
          background: #86f4ff;
          color: #0a0d19;
          transform: translateX(-6px);
          font-weight: 700;
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

function FlashOverlay({ active, focusPoint, theme }) {
  return (
    <div
      className={`flash-overlay ${active ? 'active' : ''}`}
      style={{
        background: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, ${
          theme === 'dark' ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.6)'
        }, transparent 55%)`,
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

function LensOverlay({ vignette, distortion, fov }) {
  return (
    <div className="lens-overlay">
      <div className="vignette" />
      <div className="hud-top">Flash</div>
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

function calculateMeter(exposure, theme) {
  const target = theme === 'dark' ? 0.3 : 0.6;
  const exposureValue = Math.log2((exposure.aperture ** 2) / exposure.shutter) - Math.log2(exposure.iso / 100);
  const normalized = (exposureValue + 5) / 14;
  const diff = normalized - target;
  if (diff > 0.15) return '+';
  if (diff < -0.15) return '-';
  return '0';
}

function shuffleUniverse() {
  const panel = PANELS.find((item) => item.id === 'loremaker');
  if (!panel) return PANELS;
  const shuffled = [...panel.items].sort(() => Math.random() - 0.5);
  const updated = PANELS.map((item) => {
    if (item.id === 'loremaker') {
      return { ...item, items: shuffled.slice(0, 12) };
    }
    return item;
  });
  return updated;
}
