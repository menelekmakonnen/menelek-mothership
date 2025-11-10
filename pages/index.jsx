import { useEffect, useMemo, useRef, useState } from 'react';

const LENSES = [
  {
    id: '24mm',
    name: '24mm Signature Prime',
    description: 'Sweeping cinematic width with gentle curvature.',
    minAperture: 1.4,
    maxAperture: 16,
    depthResponse: 0.22,
    zoomMultiplier: 0.92,
  },
  {
    id: '35mm',
    name: '35mm Street Prime',
    description: 'Balanced view for documentaries and lifestyle.',
    minAperture: 1.4,
    maxAperture: 18,
    depthResponse: 0.28,
    zoomMultiplier: 0.97,
  },
  {
    id: '50mm',
    name: '50mm Master Prime',
    description: 'Natural perspective, silky depth falloff.',
    minAperture: 1.2,
    maxAperture: 22,
    depthResponse: 0.34,
    zoomMultiplier: 1,
  },
  {
    id: '85mm',
    name: '85mm Portrait Prime',
    description: 'Compression-rich intimacy for human stories.',
    minAperture: 1.4,
    maxAperture: 22,
    depthResponse: 0.4,
    zoomMultiplier: 1.04,
  },
  {
    id: '70-200mm',
    name: '70-200mm Royale Zoom',
    description: 'Full telephoto sweep from detail to panorama.',
    minAperture: 2.8,
    maxAperture: 32,
    depthResponse: 0.52,
    zoomMultiplier: 1.08,
  },
];

const FLASH_MODES = ['auto', 'bright', 'dark'];
const HUD_LEVELS = ['none', 'few', 'most', 'all'];

const PANELS = [
  {
    id: 'intro',
    type: 'hero',
    luminance: 0.48,
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
  },
  {
    id: 'links',
    type: 'links',
    luminance: 0.62,
    title: 'All My Links',
    cards: [
      {
        title: 'LinkedIn',
        subtitle: 'Professional network + collaborations',
        url: 'https://www.linkedin.com/in/menelekmakonnen',
      },
      {
        title: 'Instagram',
        subtitle: 'Daily frames + behind the scenes',
        url: 'https://www.instagram.com/menelekmakonnen',
      },
      {
        title: 'YouTube',
        subtitle: 'Films, music videos, and breakdowns',
        url: 'https://www.youtube.com/@menelekmakonnen',
      },
      {
        title: 'TikTok',
        subtitle: 'Short-form experiments and vibes',
        url: 'https://www.tiktok.com/@menelekmakonnen',
      },
    ],
  },
  {
    id: 'films',
    type: 'reel',
    luminance: 0.38,
    title: 'Films & Music Videos',
    cards: [
      {
        title: 'The Skyline Thesis',
        description: 'A short film exploring futurist Lagos and diasporan memory.',
        url: 'https://www.youtube.com/watch?v=Q0j0w0rld',
      },
      {
        title: 'Neon Dust',
        description: 'Music video with kinetic choreography and LED light rigs.',
        url: 'https://www.youtube.com/watch?v=F0cusBeats',
      },
      {
        title: 'Afterlight',
        description: 'Documenting cross-continental creatives forging new cinema.',
        url: 'https://www.youtube.com/watch?v=AfterLight',
      },
    ],
  },
  {
    id: 'loremaker',
    type: 'loremaker',
    luminance: 0.44,
    title: 'Explore My Loremaker Universe',
    characters: [
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
      'Flux Luthier',
    ],
  },
  {
    id: 'ai-projects',
    type: 'columns',
    luminance: 0.58,
    title: 'AI Projects',
    cards: [
      {
        title: 'Starterclass',
        description: 'Immersive learning modules guiding creatives into AI artistry.',
      },
      {
        title: 'Scholarships',
        description: 'Funding programs that elevate underrepresented dreamers.',
      },
      {
        title: 'Consultancy',
        description: 'Bespoke AI roadmaps for studios, agencies, and storytellers.',
      },
    ],
  },
  {
    id: 'video-edits',
    type: 'stack',
    luminance: 0.42,
    title: 'Epic Video Edits',
    bullets: [
      'Kinetic montage reels engineered for emotion-rich storytelling.',
      'Colour scripts that sculpt atmosphere from the first frame.',
      'Global collaborations merging art direction and advanced VFX.',
    ],
  },
  {
    id: 'photography',
    type: 'gallery',
    luminance: 0.36,
    title: 'Photography Albums',
    groupSizes: [8, 16],
    albums: [
      {
        title: 'City Noir',
        description: 'Moody night walks with neon drenched reflections.',
        images: [
          { src: 'https://images.unsplash.com/photo-1544194215-541c2d3561a4?auto=format&fit=crop&w=1200&q=80', alt: 'Neon skyline framed between rainy high-rises' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80', alt: 'Silhouette walking through a misty alley with neon signage' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=1200&q=80', alt: 'Taxi headlights blurring into colourful streaks' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', alt: 'Metropolis skyline at midnight with cyan glow' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt: 'Man under umbrella in cinematic rain' },
          { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1200&q=80', alt: 'Soft focus streetlights forming bokeh orbs' },
          { src: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=1200&q=80', alt: 'Glass architecture reflecting a pink dusk sky' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80', alt: 'Portrait with city lights creating bokeh background' },
          { src: 'https://images.unsplash.com/photo-1486591978090-71d41e64e1c2?auto=format&fit=crop&w=1200&q=80', alt: 'Street crossing with dynamic light trails' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'Night view of futuristic skyline in teal hues' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Fashion portrait with moody neon fill light' },
          { src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80', alt: 'Motorbike speeding through rainy street' },
          { src: 'https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&w=900&q=80', alt: 'Architecture with shimmering reflections at night' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80', alt: 'Close-up portrait with dramatic rim light' },
          { src: 'https://images.unsplash.com/photo-1486591978090-71d41e64e1c2?auto=format&fit=crop&w=900&q=80', alt: 'Birds-eye perspective of neon intersection' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80', alt: 'Reflective puddles under city lights' },
        ],
      },
      {
        title: 'Golden Hour Faces',
        description: 'Portraits flooded with honeyed sunlight and gentle wind.',
        images: [
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt: 'Golden hour portrait with glowing backlight' },
          { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80', alt: 'Laughing friends bathed in sunset light' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=1200&q=80', alt: 'Windswept hair catching the sun flare' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80', alt: 'Close portrait with warm tones and shallow depth' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Model looking toward the sun with soft expression' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80', alt: 'Hands catching sunlight in wheat field' },
          { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80', alt: 'Group hug during a golden sunset' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80', alt: 'Profile portrait with flare halo' },
        ],
      },
      {
        title: 'Architectural Silence',
        description: 'Minimalist structures captured in bold compositions.',
        images: [
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80', alt: 'Modern tower with teal reflections' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80', alt: 'Angular staircase with contrasting lights' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt: 'Symmetrical building facade at dusk' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=1200&q=80', alt: 'Abstract architecture with sweeping curves' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'Minimalist skyscraper with gradient sky' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80', alt: 'Concrete atrium with soft light' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Architectural detail with repeating patterns' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=900&q=80', alt: 'Curved roofline against twilight' },
        ],
      },
    ],
  },
  {
    id: 'ai-albums',
    type: 'gallery',
    luminance: 0.46,
    title: 'AI Albums',
    groupSizes: [8, 16],
    albums: [
      {
        title: 'Mythic Futures',
        description: 'Speculative cities grown from neural imaginations.',
        images: [
          { src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80', alt: 'AI rendered floating city of lights' },
          { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', alt: 'Surreal desert metropolis at dusk' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Synthwave skyline above ocean' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80', alt: 'Cybernetic tower with glowing windows' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=900&q=80', alt: 'Floating transit bridge through clouds' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'City with spiralling skyscrapers' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80', alt: 'Aerial view of luminous AI-generated labyrinth' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80', alt: 'Futuristic canal with neon reflections' },
        ],
      },
      {
        title: 'Synesthetic Portraits',
        description: 'Faces dreamed in colour, texture, and feeling.',
        images: [
          { src: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80', alt: 'AI portrait swirling with pastel paint' },
          { src: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80', alt: 'Vibrant face with geometric overlays' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'Dual-tone portrait shimmering with data streams' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80', alt: 'Abstract human figure with neon outlines' },
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80', alt: 'Chromatic portrait dissolving into light' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=900&q=80', alt: 'Face formed by shimmering shards' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80', alt: 'Neural portrait woven with metallic threads' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80', alt: 'Multi-exposure head with holographic aura' },
        ],
      },
      {
        title: 'Impossible Landscapes',
        description: 'New geologies co-written with algorithms.',
        images: [
          { src: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80', alt: 'Futuristic canyon bathed in violet light' },
          { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80', alt: 'Mountains rising into a spiral sky' },
          { src: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=900&q=80', alt: 'Floating rock arch glowing at sunrise' },
          { src: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=900&q=80', alt: 'Luminescent ice formations' },
          { src: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=900&q=80', alt: 'Waterfall cascading through alien jungle' },
          { src: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=900&q=80', alt: 'Bioluminescent river under stars' },
          { src: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80', alt: 'Crystalline desert with aurora' },
          { src: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=900&q=80', alt: 'Abstract cliff edges dissolving into mist' },
        ],
      },
    ],
  },
  {
    id: 'blog',
    type: 'blog',
    luminance: 0.52,
    title: 'Blog',
    posts: [
      {
        title: 'On Crafting Cinematic Interfaces',
        excerpt: 'A manifesto on blending tactile camera controls with future web rituals.',
      },
      {
        title: 'AI + Storytelling',
        excerpt: 'How machine collaborators extend the lore worlds I build.',
      },
      {
        title: 'Field Notes',
        excerpt: 'Lens tests, colour scripts, and practical insights from set.',
      },
    ],
  },
];

const INITIAL_EXPOSURE = {
  iso: 200,
  shutter: 1 / 120,
  aperture: 2.2,
  whiteBalance: 5200,
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
const formatShutter = (value) => {
  if (value >= 1) return `${value.toFixed(0)}s`;
  const denominator = Math.round(1 / value);
  return `1/${denominator}`;
};

const calculateExposureLook = (exposure, luminance, lens, focusDepth) => {
  const lensInfluence = lens.depthResponse * 1.8;
  const apertureFactor = clamp((lens.maxAperture - exposure.aperture) / (lens.maxAperture - lens.minAperture + 0.0001), 0, 1);
  const shutterFactor = clamp(Math.log10(1 / exposure.shutter) / 4, 0, 1);
  const isoFactor = clamp((exposure.iso - 100) / 6000, 0, 1);

  const brightness = clamp(luminance + isoFactor * 0.25 + apertureFactor * 0.18 - shutterFactor * 0.12, 0.2, 1.1);
  const contrast = clamp(0.8 + apertureFactor * 0.2 + (1 - focusDepth) * 0.1, 0.85, 1.2);
  const grain = clamp(isoFactor * 0.8 + shutterFactor * 0.2, 0, 1);
  const smear = clamp((1 - shutterFactor) * 0.3, 0, 0.28);
  const depthBlur = clamp((1 - focusDepth) * (0.5 + lensInfluence), 0.05, 1.2);

  return { brightness, contrast, grain, smear, depthBlur };
};

const getTodayKey = () => {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
};

export default function Home() {
  const stageRef = useRef(null);
  const lastFocusTargetRef = useRef(null);
  const lastBackdropClickRef = useRef(0);
  const swipeStateRef = useRef({ startX: 0, startY: 0, active: false });
  const [activePanel, setActivePanel] = useState(0);
  const [dynamicWordIndex, setDynamicWordIndex] = useState(0);
  const [hudLevelIndex, setHudLevelIndex] = useState(3);
  const [cameraMode, setCameraMode] = useState('mirrorless');
  const [lensId, setLensId] = useState('50mm');
  const [flashMode, setFlashMode] = useState('auto');
  const [exposure, setExposure] = useState(INITIAL_EXPOSURE);
  const [focusDepth, setFocusDepth] = useState(0.52);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [layers, setLayers] = useState([]);
  const [galleryState, setGalleryState] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [lensTransition, setLensTransition] = useState(null);
  const hudLevel = HUD_LEVELS[hudLevelIndex];
  const lens = useMemo(() => LENSES.find((item) => item.id === lensId) || LENSES[2], [lensId]);

  const [systemTheme, setSystemTheme] = useState('dark');
  const resolvedTheme = flashMode === 'bright' ? 'light' : flashMode === 'dark' ? 'dark' : systemTheme;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => setSystemTheme(query.matches ? 'dark' : 'light');
    update();
    query.addEventListener('change', update);
    return () => query.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const words = PANELS[0].dynamicWords;
    const interval = setInterval(() => {
      setDynamicWordIndex((prev) => (prev + 1) % words.length);
    }, 2400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const todayKey = getTodayKey();
    const runBoot = () => {
      setBooting(true);
      const timer = setTimeout(() => setBooting(false), 2200);
      return () => clearTimeout(timer);
    };

    if (typeof window === 'undefined') {
      runBoot();
      return undefined;
    }

    const stored = window.localStorage.getItem('mm-camera-boot');
    if (stored !== todayKey) {
      window.localStorage.setItem('mm-camera-boot', todayKey);
      return runBoot();
    }
    const timer = setTimeout(() => setBooting(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const updateBattery = () => {
      const now = new Date();
      const minutes = now.getHours() * 60 + now.getMinutes();
      const fullDrainMinutes = 23 * 60 + 11;
      const ratio = clamp(1 - minutes / fullDrainMinutes, 0, 1);
      setBatteryLevel(ratio);
    };
    updateBattery();
    const interval = setInterval(updateBattery, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  const openLayer = (layer) => {
    setLayers((prev) => {
      const next = [...prev.slice(-9), { ...layer, id: layer.id || `layer-${Date.now()}-${Math.random()}` }];
      return next;
    });
  };

  const closeTopLayer = () => {
    setLayers((prev) => prev.slice(0, -1));
  };

  useEffect(() => {
    if (!layers.length) {
      setGalleryState(null);
    }
  }, [layers.length]);

  const handleLayerBackdropClick = (event) => {
    const now = Date.now();
    if (now - lastBackdropClickRef.current < 400) {
      closeTopLayer();
    } else {
      focusAtPointer(event, 'backdrop');
    }
    lastBackdropClickRef.current = now;
  };

  const focusAtPointer = (event, targetId) => {
    if (!stageRef.current) return;
    if (targetId && lastFocusTargetRef.current === targetId) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = clamp(((event.clientX - rect.left) / rect.width) * 100, 0, 100);
    const y = clamp(((event.clientY - rect.top) / rect.height) * 100, 0, 100);
    setFocusPoint({ x, y });
    lastFocusTargetRef.current = targetId || null;
  };

  const handleScrollFocus = (event) => {
    event.preventDefault();
    const delta = event.deltaY * -0.0006;
    setFocusDepth((prev) => clamp(prev + delta, 0.1, 0.95));
  };

  const handlePointerDown = (event) => {
    swipeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      active: true,
    };
  };

  const handlePointerUp = (event) => {
    if (!swipeStateRef.current.active) return;
    const { startX, startY } = swipeStateRef.current;
    swipeStateRef.current.active = false;
    const deltaX = event.clientX - startX;
    const deltaY = event.clientY - startY;
    if (Math.abs(deltaX) < 24 && Math.abs(deltaY) < 24) {
      focusAtPointer(event, 'stage');
      return;
    }
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handlePanelChange('next');
      } else {
        handlePanelChange('prev');
      }
    }
  };

  const handlePanelChange = (direction) => {
    setActivePanel((prev) => {
      if (direction === 'next') {
        return clamp(prev + 1, 0, PANELS.length - 1);
      }
      return clamp(prev - 1, 0, PANELS.length - 1);
    });
  };

  const handleLensChange = (id) => {
    if (id === lensId) return;
    setLensId(id);
    setLensTransition({ lens: LENSES.find((item) => item.id === id), timestamp: Date.now() });
    setTimeout(() => {
      setLensTransition(null);
    }, 680);
  };

  const cycleHudLevel = () => {
    setHudLevelIndex((prev) => (prev + 1) % HUD_LEVELS.length);
  };

  const toggleCameraMode = () => {
    setCameraMode((prev) => (prev === 'mirrorless' ? 'dslr' : 'mirrorless'));
  };

  const cycleFlashMode = () => {
    setFlashMode((prev) => {
      const index = FLASH_MODES.indexOf(prev);
      return FLASH_MODES[(index + 1) % FLASH_MODES.length];
    });
  };

  const handleExposureChange = (key) => (value) => {
    setExposure((prev) => {
      if (key === 'iso') {
        return { ...prev, iso: Math.round(value / 10) * 10 };
      }
      if (key === 'aperture') {
        const step = Math.round(value * 10) / 10;
        return { ...prev, aperture: clamp(step, lens.minAperture, lens.maxAperture) };
      }
      if (key === 'shutter') {
        return { ...prev, shutter: clamp(value, 1 / 8000, 2) };
      }
      if (key === 'whiteBalance') {
        return { ...prev, whiteBalance: Math.round(value / 10) * 10 };
      }
      return prev;
    });
  };

  const openGallery = (panelId, album, event) => {
    if (event) {
      focusAtPointer(event, `${panelId}-${album.title}`);
    }
    setGalleryState({ panelId, album, groupSize: PANELS.find((p) => p.id === panelId)?.groupSizes?.[0] || 8, page: 0 });
    openLayer({
      id: `${panelId}-${album.title}`,
      title: `${album.title} Gallery`,
      type: 'gallery',
    });
  };

  const exposureLook = useMemo(() => {
    const luminance = PANELS[activePanel]?.luminance ?? 0.5;
    return calculateExposureLook(exposure, luminance, lens, focusDepth);
  }, [activePanel, exposure, lens, focusDepth]);

  const hudReadouts = useMemo(() => {
    const base = [
      { label: 'ISO', value: exposure.iso },
      { label: 'F', value: exposure.aperture.toFixed(1) },
      { label: 'S', value: formatShutter(exposure.shutter) },
      { label: 'WB', value: `${exposure.whiteBalance}K` },
    ];
    if (hudLevel === 'none') return [];
    if (hudLevel === 'few') return base.slice(0, 2);
    if (hudLevel === 'most') return [...base, { label: 'Lens', value: lens.name }];
    return [
      ...base,
      { label: 'Lens', value: lens.name },
      { label: 'Mode', value: cameraMode.toUpperCase() },
      { label: 'HUD', value: hudLevel.toUpperCase() },
      { label: 'Flash', value: flashMode.toUpperCase() },
      { label: 'Battery', value: `${Math.round(batteryLevel * 100)}%` },
    ];
  }, [cameraMode, exposure, flashMode, hudLevel, lens.name, batteryLevel]);

  const histogramData = useMemo(() => {
    const luminance = PANELS[activePanel]?.luminance ?? 0.5;
    const highlight = clamp(luminance + focusDepth * 0.25, 0, 1);
    return [
      clamp(0.4 - highlight * 0.4 + (1 - focusDepth) * 0.3, 0.05, 0.8),
      clamp(0.6 - highlight * 0.2 + exposure.iso / 6400, 0.1, 0.8),
      clamp(0.7 + highlight * 0.3 - exposure.shutter * 0.1, 0.15, 0.9),
      clamp(0.5 + focusDepth * 0.4, 0.2, 0.9),
      clamp(0.3 + highlight * 0.5, 0.15, 0.95),
    ];
  }, [activePanel, exposure.iso, exposure.shutter, focusDepth]);

  const resolvedBrightness = exposureLook.brightness;
  const stageClass = `viewport theme-${resolvedTheme} mode-${cameraMode}`;
  const showOffScreen = !isCameraOn && !booting;

  return (
    <div className={stageClass}>
      <main
        ref={stageRef}
        className="stage"
        onWheel={handleScrollFocus}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        <LensCapTransition transition={lensTransition} />
        <RuleOfThirdsOverlay visible={hudLevel !== 'none'} />
        <HistogramOverlay visible={hudLevel === 'most' || hudLevel === 'all'} data={histogramData} />
        <PanelDeck
          activePanel={activePanel}
          panels={PANELS}
          openLayer={openLayer}
          openGallery={(panelId, album, event) => openGallery(panelId, album, event)}
          focusAtPointer={focusAtPointer}
          focusDepth={focusDepth}
          exposureLook={exposureLook}
          resolvedTheme={resolvedTheme}
          dynamicWordIndex={dynamicWordIndex}
        />
        <LayerStack
          layers={layers}
          onBackdropClick={handleLayerBackdropClick}
          closeTopLayer={closeTopLayer}
          galleryState={galleryState}
          setGalleryState={setGalleryState}
        />
        <Hud
          hudLevel={hudLevel}
          readouts={hudReadouts}
          batteryLevel={batteryLevel}
          focusDepth={focusDepth}
          cycleHudLevel={cycleHudLevel}
          toggleCameraMode={toggleCameraMode}
          cameraMode={cameraMode}
          flashMode={flashMode}
          cycleFlashMode={cycleFlashMode}
          setIsCameraOn={setIsCameraOn}
        />
        <ControlDock
          lens={lens}
          exposure={exposure}
          focusDepth={focusDepth}
          onFocusDepthChange={setFocusDepth}
          onExposureChange={handleExposureChange}
          onLensChange={handleLensChange}
          lenses={LENSES}
          cameraMode={cameraMode}
        />
        <PanelNavigation onNavigate={handlePanelChange} />
        <FocusCursor position={focusPoint} />
        {booting && <BootOverlay batteryLevel={batteryLevel} />}
        {showOffScreen && (
          <CameraOffScreen
            onPower={() => {
              setIsCameraOn(true);
              setBooting(true);
              setTimeout(() => setBooting(false), 1800);
            }}
          />
        )}
      </main>
      <style jsx>{`
        .stage {
          position: relative;
          height: 100vh;
          width: 100vw;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(circle at 20% 20%, rgba(90, 130, 255, 0.18), transparent 52%),
            radial-gradient(circle at 80% 80%, rgba(255, 200, 120, 0.24), transparent 60%),
            ${resolvedTheme === 'dark'
            ? 'linear-gradient(140deg, #040612 0%, #121726 55%, #030409 100%)'
            : 'linear-gradient(140deg, #f2f5ff 0%, #ffffff 55%, #e9efff 100%)'};
          filter: brightness(${resolvedBrightness}) contrast(${exposureLook.contrast});
        }
        .viewport {
          font-family: 'Montserrat', 'Inter', sans-serif;
          color: ${resolvedTheme === 'dark' ? '#f4f7ff' : '#0b1633'};
        }
        .viewport :global(*) {
          user-select: none;
        }
        .viewport :global(button) {
          cursor: pointer;
        }
        .viewport.theme-light {
          background-color: #f5f7ff;
        }
        .viewport.theme-dark {
          background-color: #050611;
        }
        @media (max-width: 960px) {
          .stage {
            padding: 0 1.2rem;
          }
        }
      `}</style>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
          background: #04070f;
          font-size: 16px;
        }
        body {
          overflow: hidden;
        }
        *, *::before, *::after {
          box-sizing: border-box;
        }
        a {
          color: inherit;
          text-decoration: none;
        }
      `}</style>
    </div>
  );
}

function PanelDeck({ activePanel, panels, openLayer, openGallery, focusAtPointer, focusDepth, exposureLook, resolvedTheme, dynamicWordIndex }) {
  return (
    <div className="panel-deck" style={{ transform: `translateX(calc(${activePanel} * -100%))` }}>
      {panels.map((panel) => (
        <PanelSection
          key={panel.id}
          panel={panel}
          focusDepth={focusDepth}
          openLayer={openLayer}
          openGallery={openGallery}
          resolvedTheme={resolvedTheme}
          exposureLook={exposureLook}
          focusAtPointer={focusAtPointer}
          dynamicWordIndex={dynamicWordIndex}
        />
      ))}
      <style jsx>{`
        .panel-deck {
          position: relative;
          display: flex;
          gap: clamp(2.4rem, 4vw, 4.4rem);
          transition: transform 0.64s cubic-bezier(0.22, 1, 0.36, 1);
          will-change: transform;
        }
        @media (max-width: 960px) {
          .panel-deck {
            gap: 1.6rem;
          }
        }
      `}</style>
    </div>
  );
}

function PanelSection({ panel, focusDepth, openLayer, openGallery, resolvedTheme, exposureLook, focusAtPointer, dynamicWordIndex }) {
  const { id, title, type } = panel;
  const depthBlur = exposureLook.depthBlur * (1 - focusDepth + 0.2);

  const handleCardClick = (event, payload) => {
    const targetId = `${id}-${payload?.title || payload?.url || 'card'}`;
    focusAtPointer(event, targetId);
    if (type === 'gallery' && payload?.album) {
      openGallery(id, payload.album, event);
      return;
    }
    if (payload?.url) {
      window.open(payload.url, '_blank', 'noopener');
      return;
    }
    openLayer({
      title: payload?.title || title,
      type: 'content',
      body: payload?.description || payload?.excerpt || payload?.subtitle,
    });
  };

  return (
    <section className="panel-section" style={{ filter: `blur(${depthBlur}px)` }}>
      <header>
        <span className="panel-label">{String(id).toUpperCase()}</span>
        <h2>{title}</h2>
      </header>
      <div className={`panel-body type-${type}`}>
        <SectionContent
          panel={panel}
          onCardClick={handleCardClick}
          resolvedTheme={resolvedTheme}
          focusAtPointer={focusAtPointer}
          dynamicWordIndex={dynamicWordIndex}
        />
      </div>
      <style jsx>{`
        .panel-section {
          min-width: min(74vw, 980px);
          max-width: min(74vw, 980px);
          min-height: min(72vh, 680px);
          border-radius: 34px;
          padding: clamp(1.8rem, 3vw, 3rem);
          background: linear-gradient(145deg, rgba(${resolvedTheme === 'dark' ? '14, 18, 34, 0.84' : '244, 247, 255, 0.92'}), rgba(${resolvedTheme === 'dark' ? '6, 8, 18, 0.94' : '232, 238, 255, 0.86'}));
          border: 1px solid rgba(${resolvedTheme === 'dark' ? '132, 164, 255, 0.18' : '34, 58, 144, 0.16'});
          box-shadow: 0 32px 80px rgba(${resolvedTheme === 'dark' ? '0, 8, 32, 0.64' : '32, 60, 140, 0.28'});
          backdrop-filter: blur(24px) saturate(118%);
          transition: transform 0.6s ease, box-shadow 0.6s ease, filter 0.4s ease;
          display: grid;
          grid-template-rows: auto 1fr;
          overflow: hidden;
        }
        header {
          display: flex;
          flex-direction: column;
          gap: 0.6rem;
          margin-bottom: 1.4rem;
        }
        .panel-label {
          letter-spacing: 0.34em;
          font-size: 0.62rem;
          font-weight: 600;
          text-transform: uppercase;
          opacity: 0.72;
        }
        h2 {
          margin: 0;
          font-size: clamp(2.1rem, 3.6vw, 3.4rem);
          letter-spacing: -0.01em;
        }
        .panel-body {
          position: relative;
          display: flex;
        }
        @media (max-width: 960px) {
          .panel-section {
            min-width: 88vw;
            max-width: 88vw;
            padding: 1.8rem;
          }
        }
      `}</style>
    </section>
  );
}

function SectionContent({ panel, onCardClick, resolvedTheme, focusAtPointer, dynamicWordIndex }) {
  const { type } = panel;
  if (type === 'hero') {
    const word = panel.dynamicWords ? panel.dynamicWords[dynamicWordIndex % panel.dynamicWords.length] : '';
    return (
      <div className="hero">
        <div className="hero-meta">
          <span className="hero-pill">Menelek Makonnen</span>
          <span className="hero-pill tone">Luxury Creative Operating System</span>
        </div>
        <h1>
          {panel.title}{' '}
          <span className="hero-word">{word}</span>
        </h1>
        <p>
          Film director, photographer, and AI storyteller translating the poetry of light into digital worlds. Navigate the
          interface as you would a flagship camera and step into each crafted universe.
        </p>
        <div className="hero-actions">
          <button
            type="button"
            className="hero-button"
            onClick={(event) => onCardClick(event, { title: 'Latest Showcase', description: 'Explore the newest launch films and immersive work.' })}
          >
            Enter showcase
          </button>
          <div className="hero-hint">
            <span className="dot" /> Swipe or use the lens wheel to move between universes.
          </div>
        </div>
        <style jsx>{`
          .hero {
            display: flex;
            flex-direction: column;
            gap: 1.8rem;
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
            color: ${resolvedTheme === 'dark' ? '#f4fbff' : '#13204d'};
          }
          h1 {
            font-size: clamp(2.9rem, 4.6vw, 5.1rem);
            line-height: 1.04;
            font-weight: 700;
            letter-spacing: -0.01em;
            margin: 0;
          }
          .hero-word {
            color: ${resolvedTheme === 'dark' ? '#9df6ff' : '#2a3fde'};
            text-shadow: 0 0 36px ${resolvedTheme === 'dark' ? 'rgba(54, 214, 255, 0.6)' : 'rgba(42, 63, 222, 0.4)'};
          }
          p {
            max-width: 38ch;
            font-size: 1.08rem;
            line-height: 1.8;
            opacity: 0.88;
            margin: 0;
          }
          .hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 1.2rem;
            align-items: center;
          }
          .hero-button {
            padding: 0.9rem 1.8rem;
            border-radius: 999px;
            border: none;
            background: linear-gradient(120deg, #78f8ff, #637bff);
            color: #040714;
            font-weight: 700;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            box-shadow: 0 16px 30px rgba(80, 140, 255, 0.32);
          }
          .hero-hint {
            font-size: 0.78rem;
            letter-spacing: 0.12em;
            text-transform: uppercase;
            opacity: 0.7;
            display: flex;
            align-items: center;
            gap: 0.6rem;
          }
          .dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: #78f8ff;
          }
          @media (max-width: 960px) {
            .hero {
              gap: 1.2rem;
            }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'links') {
    return (
      <div className="links-grid">
        {panel.cards.map((card) => (
          <button type="button" key={card.title} className="link-card" onClick={(event) => onCardClick(event, card)}>
            <div className="card-top">
              <span className="card-title">{card.title}</span>
              <span className="card-arrow">↗</span>
            </div>
            <p>{card.subtitle}</p>
          </button>
        ))}
        <style jsx>{`
          .links-grid {
            display: grid;
            width: 100%;
            gap: 1.2rem;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .link-card {
            display: grid;
            gap: 0.8rem;
            padding: 1.2rem 1.5rem;
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, ${resolvedTheme === 'dark' ? 0.18 : 0.2});
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
            text-align: left;
            box-shadow: 0 20px 36px rgba(0, 0, 0, 0.24);
          }
          .card-top {
            display: flex;
            align-items: center;
            justify-content: space-between;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-size: 0.74rem;
            opacity: 0.72;
          }
          .card-title {
            font-weight: 600;
          }
          .card-arrow {
            font-size: 0.9rem;
          }
          p {
            margin: 0;
            font-size: 0.95rem;
            line-height: 1.6;
            opacity: 0.82;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'reel') {
    return (
      <div className="reel-list">
        {panel.cards.map((card) => (
          <button type="button" key={card.title} className="reel-card" onClick={(event) => onCardClick(event, card)}>
            <div className="reel-header">
              <span>{card.title}</span>
              <span className="glyph">⟲</span>
            </div>
            <p>{card.description}</p>
          </button>
        ))}
        <style jsx>{`
          .reel-list {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .reel-card {
            padding: 1.4rem 1.6rem;
            border-radius: 26px;
            border: none;
            background: linear-gradient(120deg, rgba(134, 244, 255, 0.16), rgba(255, 255, 255, 0.05));
            text-align: left;
            display: grid;
            gap: 0.8rem;
            box-shadow: 0 18px 36px rgba(0, 0, 0, 0.28);
          }
          .reel-header {
            display: flex;
            justify-content: space-between;
            font-size: 1.08rem;
            font-weight: 600;
            letter-spacing: 0.04em;
          }
          .glyph {
            font-size: 1.4rem;
            opacity: 0.4;
          }
          p {
            margin: 0;
            opacity: 0.78;
            line-height: 1.7;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'loremaker') {
    return (
      <div className="loremaker">
        <div className="belt">
          {panel.characters.map((character) => (
            <span key={character}>{character}</span>
          ))}
        </div>
        <div className="belt belt-alt">
          {panel.characters.slice().reverse().map((character) => (
            <span key={`${character}-alt`}>{character}</span>
          ))}
        </div>
        <style jsx>{`
          .loremaker {
            display: grid;
            gap: 1rem;
            width: 100%;
          }
          .belt {
            display: grid;
            grid-auto-flow: column;
            gap: 2.2rem;
            animation: marquee 36s linear infinite;
            font-size: 1.18rem;
            letter-spacing: 0.08em;
          }
          .belt span {
            padding: 0.6rem 1.2rem;
            border-radius: 18px;
            background: rgba(134, 244, 255, 0.12);
            border: 1px solid rgba(134, 244, 255, 0.22);
            box-shadow: 0 14px 24px rgba(0, 0, 0, 0.22);
          }
          .belt-alt {
            animation-direction: reverse;
          }
          @keyframes marquee {
            from {
              transform: translateX(0);
            }
            to {
              transform: translateX(-50%);
            }
          }
        `}</style>
      </div>
    );
  }

  if (type === 'columns') {
    return (
      <div className="columns">
        {panel.cards.map((card) => (
          <button type="button" key={card.title} className="column-card" onClick={(event) => onCardClick(event, card)}>
            <span className="glyph">◎</span>
            <div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </div>
          </button>
        ))}
        <style jsx>{`
          .columns {
            display: grid;
            width: 100%;
            gap: 1.2rem;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          }
          .column-card {
            display: grid;
            grid-template-columns: auto 1fr;
            align-items: start;
            gap: 1rem;
            padding: 1.4rem 1.6rem;
            border-radius: 24px;
            border: none;
            background: linear-gradient(140deg, rgba(17, 20, 36, 0.75), rgba(38, 44, 70, 0.65));
            color: inherit;
            text-align: left;
            box-shadow: 0 24px 40px rgba(0, 0, 0, 0.26);
          }
          .glyph {
            font-size: 1.6rem;
            opacity: 0.5;
          }
          h3 {
            margin: 0 0 0.6rem;
          }
          p {
            margin: 0;
            opacity: 0.8;
            line-height: 1.7;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'stack') {
    return (
      <div className="stack">
        {panel.bullets.map((item, index) => (
          <button
            type="button"
            key={item}
            className="stack-card"
            onClick={(event) => onCardClick(event, { title: `Epic Edit ${index + 1}`, description: item })}
          >
            <span className="index">{String(index + 1).padStart(2, '0')}</span>
            <p>{item}</p>
          </button>
        ))}
        <style jsx>{`
          .stack {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .stack-card {
            display: grid;
            grid-template-columns: auto 1fr;
            gap: 1.4rem;
            padding: 1.2rem 1.5rem;
            border-radius: 22px;
            border: none;
            background: linear-gradient(120deg, rgba(255, 255, 255, 0.08), rgba(134, 244, 255, 0.06));
            text-align: left;
            box-shadow: 0 18px 32px rgba(0, 0, 0, 0.22);
          }
          .index {
            font-size: 1.2rem;
            font-weight: 700;
            letter-spacing: 0.28em;
            color: rgba(134, 244, 255, 0.85);
          }
          p {
            margin: 0;
            line-height: 1.7;
            opacity: 0.82;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'gallery') {
    return (
      <div className="gallery">
        {panel.albums.map((album) => (
          <button
            type="button"
            key={album.title}
            className="gallery-card"
            onClick={(event) => onCardClick(event, { album, title: album.title, description: album.description })}
          >
            <div className="gallery-preview">
              {album.images.slice(0, 3).map((image) => (
                <img key={image.src} src={image.src} alt={image.alt} />
              ))}
            </div>
            <div className="gallery-text">
              <h3>{album.title}</h3>
              <p>{album.description}</p>
            </div>
          </button>
        ))}
        <style jsx>{`
          .gallery {
            display: grid;
            width: 100%;
            gap: 1.1rem;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          }
          .gallery-card {
            display: grid;
            gap: 0.9rem;
            padding: 1.3rem;
            border-radius: 26px;
            border: none;
            background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.02));
            text-align: left;
            box-shadow: 0 18px 32px rgba(0, 0, 0, 0.24);
          }
          .gallery-preview {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 0.6rem;
          }
          .gallery-preview img {
            width: 100%;
            height: 100%;
            border-radius: 12px;
            object-fit: cover;
          }
          h3 {
            margin: 0 0 0.4rem;
          }
          p {
            margin: 0;
            opacity: 0.78;
            line-height: 1.6;
          }
        `}</style>
      </div>
    );
  }

  if (type === 'blog') {
    return (
      <div className="blog">
        {panel.posts.map((post) => (
          <button type="button" key={post.title} className="blog-card" onClick={(event) => onCardClick(event, post)}>
            <span className="blog-title">{post.title}</span>
            <p>{post.excerpt}</p>
          </button>
        ))}
        <style jsx>{`
          .blog {
            display: flex;
            flex-direction: column;
            gap: 1rem;
            width: 100%;
          }
          .blog-card {
            padding: 1.3rem 1.5rem;
            border-radius: 22px;
            border: none;
            background: linear-gradient(135deg, rgba(121, 140, 255, 0.16), rgba(255, 255, 255, 0.06));
            text-align: left;
            display: grid;
            gap: 0.6rem;
            box-shadow: 0 16px 28px rgba(0, 0, 0, 0.24);
          }
          .blog-title {
            font-size: 1.18rem;
            font-weight: 600;
          }
          p {
            margin: 0;
            opacity: 0.8;
            line-height: 1.7;
          }
        `}</style>
      </div>
    );
  }

  return null;
}

function PanelNavigation({ onNavigate }) {
  return (
    <div className="panel-nav">
      <button type="button" onClick={() => onNavigate('prev')} aria-label="Previous panel">
        ←
      </button>
      <button type="button" onClick={() => onNavigate('next')} aria-label="Next panel">
        →
      </button>
      <style jsx>{`
        .panel-nav {
          position: absolute;
          bottom: clamp(1.6rem, 4vh, 3rem);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 1rem;
        }
        button {
          width: 3rem;
          height: 3rem;
          border-radius: 50%;
          border: none;
          background: rgba(255, 255, 255, 0.12);
          color: inherit;
          font-size: 1.4rem;
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.26);
        }
      `}</style>
    </div>
  );
}

function FocusCursor({ position }) {
  return (
    <div className="focus-cursor" style={{ left: `${position.x}%`, top: `${position.y}%` }}>
      <div className="ring" />
      <div className="ring inner" />
      <style jsx>{`
        .focus-cursor {
          position: absolute;
          width: 80px;
          height: 80px;
          margin-left: -40px;
          margin-top: -40px;
          pointer-events: none;
          transition: transform 0.18s ease;
        }
        .ring {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          border: 2px solid rgba(134, 244, 255, 0.6);
        }
        .ring.inner {
          inset: 18px;
          border-color: rgba(134, 244, 255, 0.8);
        }
      `}</style>
    </div>
  );
}

function RuleOfThirdsOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="grid-overlay" aria-hidden="true">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`v-${index}`} className="grid-line vertical" style={{ left: `${(index + 1) * 25}%` }} />
      ))}
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={`h-${index}`} className="grid-line horizontal" style={{ top: `${(index + 1) * 25}%` }} />
      ))}
      <style jsx>{`
        .grid-overlay {
          position: absolute;
          inset: 4rem clamp(2rem, 8vw, 6rem) clamp(6rem, 8vh, 7rem) clamp(2rem, 8vw, 6rem);
          pointer-events: none;
        }
        .grid-line {
          position: absolute;
          background: rgba(134, 244, 255, 0.18);
        }
        .grid-line.vertical {
          width: 1px;
          top: 0;
          bottom: 0;
        }
        .grid-line.horizontal {
          height: 1px;
          left: 0;
          right: 0;
        }
      `}</style>
    </div>
  );
}

function HistogramOverlay({ visible, data }) {
  if (!visible) return null;
  return (
    <div className="histogram" aria-hidden="true">
      {data.map((value, index) => (
        <div key={index} className="bar" style={{ height: `${value * 100}%` }} />
      ))}
      <style jsx>{`
        .histogram {
          position: absolute;
          right: clamp(2rem, 6vw, 5rem);
          bottom: clamp(6rem, 8vh, 7rem);
          width: 120px;
          height: 60px;
          display: grid;
          grid-template-columns: repeat(${data.length}, 1fr);
          gap: 6px;
          align-items: end;
          background: rgba(4, 8, 18, 0.46);
          border-radius: 14px;
          padding: 0.6rem;
          border: 1px solid rgba(134, 244, 255, 0.16);
          backdrop-filter: blur(12px);
        }
        .bar {
          background: linear-gradient(180deg, rgba(134, 244, 255, 0.8), rgba(134, 244, 255, 0.2));
          border-radius: 6px 6px 2px 2px;
        }
      `}</style>
    </div>
  );
}

function Hud({ hudLevel, readouts, batteryLevel, focusDepth, cycleHudLevel, toggleCameraMode, cameraMode, flashMode, cycleFlashMode, setIsCameraOn }) {
  return (
    <div className={`hud hud-${hudLevel}`}>
      <div className="hud-left">
        <button type="button" onClick={cycleHudLevel} aria-label="Cycle HUD density">
          HUD {hudLevel.toUpperCase()}
        </button>
        <button type="button" onClick={toggleCameraMode} aria-label="Toggle camera mode">
          {cameraMode === 'mirrorless' ? 'Mirrorless' : 'DSLR'}
        </button>
      </div>
      <div className="hud-center">
        {readouts.map((item) => (
          <div key={item.label} className="readout">
            <span className="label">{item.label}</span>
            <span className="value">{item.value}</span>
          </div>
        ))}
      </div>
      <div className="hud-right">
        <button type="button" onClick={cycleFlashMode} aria-label="Cycle flash mode">
          Flash {flashMode.toUpperCase()}
        </button>
        <button type="button" onClick={() => setIsCameraOn(false)} aria-label="Power off camera">
          Power
        </button>
      </div>
      <div className="battery">
        <span className="battery-label">Battery</span>
        <div className="battery-shell">
          <div className="battery-level" style={{ width: `${batteryLevel * 100}%` }} />
        </div>
        <span className="battery-value">{Math.round(batteryLevel * 100)}%</span>
      </div>
      <div className="focus-depth">Focus Depth {Math.round(focusDepth * 100)}%</div>
      <style jsx>{`
        .hud {
          position: absolute;
          bottom: clamp(1.6rem, 4vh, 3.2rem);
          left: 50%;
          transform: translateX(-50%);
          display: grid;
          grid-template-columns: auto auto auto;
          align-items: center;
          gap: clamp(1rem, 4vw, 2.6rem);
          padding: 1rem 1.8rem;
          border-radius: 999px;
          background: rgba(6, 10, 24, 0.58);
          border: 1px solid rgba(134, 244, 255, 0.18);
          backdrop-filter: blur(18px);
          color: rgba(235, 244, 255, 0.95);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        }
        .hud button {
          background: none;
          border: 1px solid rgba(134, 244, 255, 0.3);
          border-radius: 999px;
          padding: 0.4rem 0.9rem;
          color: inherit;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hud-center {
          display: grid;
          grid-auto-flow: column;
          gap: 1.4rem;
        }
        .readout {
          display: grid;
          gap: 0.2rem;
          text-align: center;
        }
        .label {
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .value {
          font-size: 1.04rem;
          font-weight: 600;
          letter-spacing: 0.08em;
        }
        .battery {
          position: absolute;
          top: -3.6rem;
          right: 0;
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .battery-shell {
          width: 120px;
          height: 12px;
          border-radius: 999px;
          border: 1px solid rgba(134, 244, 255, 0.4);
          overflow: hidden;
          background: rgba(255, 255, 255, 0.08);
        }
        .battery-level {
          height: 100%;
          background: linear-gradient(90deg, #78f8ff, #60d1ff, #4ca8ff);
        }
        .focus-depth {
          position: absolute;
          top: -3.6rem;
          left: 0;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        @media (max-width: 960px) {
          .hud {
            grid-template-columns: 1fr;
            row-gap: 0.8rem;
            padding: 0.9rem 1.2rem 2.6rem;
          }
          .hud-center {
            grid-auto-flow: row;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .battery, .focus-depth {
            position: static;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}

function ControlDock({ lens, exposure, focusDepth, onFocusDepthChange, onExposureChange, onLensChange, lenses, cameraMode }) {
  const [exposureOpen, setExposureOpen] = useState(true);
  const [lensOpen, setLensOpen] = useState(false);
  const [assistOpen, setAssistOpen] = useState(false);

  return (
    <aside className="control-dock">
      <div className={`cluster ${exposureOpen ? 'open' : ''}`}>
        <button type="button" className="cluster-toggle" onClick={() => setExposureOpen((prev) => !prev)}>
          Exposure
        </button>
        {exposureOpen && (
          <div className="cluster-body">
            <SliderControl
              label="Aperture"
              min={lens.minAperture}
              max={lens.maxAperture}
              step={0.1}
              value={exposure.aperture}
              onChange={(value) => onExposureChange('aperture')(value)}
            />
            <SliderControl
              label="Shutter"
              min={1 / 8000}
              max={2}
              step={0.0005}
              value={exposure.shutter}
              displayValue={formatShutter}
              onChange={(value) => onExposureChange('shutter')(value)}
            />
            <SliderControl
              label="ISO"
              min={100}
              max={6400}
              step={10}
              value={exposure.iso}
              onChange={(value) => onExposureChange('iso')(value)}
            />
            <SliderControl
              label="White Balance"
              min={2500}
              max={9000}
              step={50}
              value={exposure.whiteBalance}
              onChange={(value) => onExposureChange('whiteBalance')(value)}
            />
            <SliderControl
              label="Focus Depth"
              min={0.1}
              max={0.95}
              step={0.01}
              value={focusDepth}
              onChange={onFocusDepthChange}
              displayValue={(value) => `${Math.round(value * 100)}%`}
            />
          </div>
        )}
      </div>
      <div className={`cluster ${lensOpen ? 'open' : ''}`}>
        <button type="button" className="cluster-toggle" onClick={() => setLensOpen((prev) => !prev)}>
          Lenses
        </button>
        {lensOpen && (
          <div className="cluster-body lens-list">
            {lenses.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`lens-item ${lens.id === item.id ? 'active' : ''}`}
                onClick={() => onLensChange(item.id)}
              >
                <span className="lens-title">{item.name}</span>
                <span className="lens-info">f/{item.minAperture} - f/{item.maxAperture}</span>
              </button>
            ))}
          </div>
        )}
      </div>
      <div className={`cluster ${assistOpen ? 'open' : ''}`}>
        <button type="button" className="cluster-toggle" onClick={() => setAssistOpen((prev) => !prev)}>
          Assist
        </button>
        {assistOpen && (
          <div className="cluster-body">
            <div className="assist-item">Mode: {cameraMode === 'mirrorless' ? 'Electronic Viewfinder' : 'Optical Viewfinder'}</div>
            <div className="assist-item">Lens: {lens.name}</div>
            <div className="assist-item">Depth Response: {(lens.depthResponse * 100).toFixed(0)}%</div>
          </div>
        )}
      </div>
      <style jsx>{`
        .control-dock {
          position: absolute;
          top: clamp(1.8rem, 6vh, 3.4rem);
          right: clamp(2rem, 6vw, 5rem);
          display: grid;
          gap: 1rem;
          width: clamp(240px, 22vw, 320px);
        }
        .cluster {
          background: rgba(6, 10, 24, 0.6);
          border: 1px solid rgba(134, 244, 255, 0.18);
          border-radius: 20px;
          backdrop-filter: blur(18px);
          overflow: hidden;
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
          transition: transform 0.4s ease;
        }
        .cluster.open {
          transform: translateY(-4px);
        }
        .cluster-toggle {
          width: 100%;
          padding: 0.9rem 1.2rem;
          border: none;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(235, 244, 255, 0.9);
          font-weight: 600;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        .cluster-body {
          display: grid;
          gap: 0.8rem;
          padding: 1rem 1.4rem 1.2rem;
        }
        .lens-list {
          gap: 0.4rem;
        }
        .lens-item {
          display: grid;
          gap: 0.2rem;
          border: 1px solid rgba(134, 244, 255, 0.16);
          border-radius: 14px;
          padding: 0.8rem 1rem;
          background: rgba(255, 255, 255, 0.04);
          color: inherit;
          text-align: left;
        }
        .lens-item.active {
          border-color: rgba(134, 244, 255, 0.42);
          background: rgba(134, 244, 255, 0.12);
        }
        .lens-title {
          font-size: 0.92rem;
          font-weight: 600;
        }
        .lens-info {
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .assist-item {
          font-size: 0.82rem;
          opacity: 0.78;
          line-height: 1.5;
        }
        @media (max-width: 960px) {
          .control-dock {
            position: fixed;
            bottom: 1rem;
            right: 1rem;
            width: min(90vw, 320px);
          }
        }
      `}</style>
    </aside>
  );
}

function SliderControl({ label, min, max, step, value, onChange, displayValue }) {
  return (
    <label className="slider">
      <span className="slider-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(parseFloat(event.target.value))}
      />
      <span className="slider-value">{displayValue ? displayValue(value) : Math.round(value)}</span>
      <style jsx>{`
        .slider {
          display: grid;
          gap: 0.4rem;
        }
        .slider-label {
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.72;
        }
        input[type='range'] {
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 999px;
          background: linear-gradient(90deg, rgba(134, 244, 255, 0.6), rgba(255, 255, 255, 0.15));
        }
        input[type='range']::-webkit-slider-thumb {
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #78f8ff;
          box-shadow: 0 6px 16px rgba(120, 248, 255, 0.4);
        }
        .slider-value {
          font-size: 0.78rem;
          letter-spacing: 0.1em;
          opacity: 0.8;
        }
      `}</style>
    </label>
  );
}

function BootOverlay({ batteryLevel }) {
  return (
    <div className="boot" aria-live="polite">
      <div className="boot-inner">
        <span className="brand">Menelek Makonnen</span>
        <span className="status">Booting flagship camera OS...</span>
        <div className="boot-bar">
          <div className="boot-progress" />
        </div>
        <span className="boot-battery">Battery {Math.round(batteryLevel * 100)}%</span>
      </div>
      <style jsx>{`
        .boot {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 50%, rgba(4, 8, 18, 0.9), rgba(4, 8, 18, 0.98));
          z-index: 20;
        }
        .boot-inner {
          display: grid;
          gap: 1rem;
          text-align: center;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(134, 244, 255, 0.92);
        }
        .brand {
          font-size: 1.2rem;
          font-weight: 700;
        }
        .status {
          font-size: 0.72rem;
        }
        .boot-bar {
          width: 220px;
          height: 6px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.1);
          overflow: hidden;
        }
        .boot-progress {
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, #78f8ff, #637bff);
          animation: boot 1.8s ease forwards;
        }
        .boot-battery {
          font-size: 0.68rem;
          opacity: 0.7;
        }
        @keyframes boot {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}

function CameraOffScreen({ onPower }) {
  return (
    <div className="camera-off">
      <div className="off-inner">
        <div className="off-icons">
          <a href="https://www.linkedin.com/in/menelekmakonnen" target="_blank" rel="noreferrer" aria-label="LinkedIn">in</a>
          <a href="https://www.instagram.com/menelekmakonnen" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
          <a href="https://www.youtube.com/@menelekmakonnen" target="_blank" rel="noreferrer" aria-label="YouTube">YT</a>
          <a href="https://www.tiktok.com/@menelekmakonnen" target="_blank" rel="noreferrer" aria-label="TikTok">TT</a>
        </div>
        <button type="button" onClick={onPower} className="power-button">
          Turn On
        </button>
      </div>
      <style jsx>{`
        .camera-off {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 50%, rgba(3, 6, 12, 0.94), rgba(3, 6, 12, 0.98));
          z-index: 19;
        }
        .off-inner {
          display: grid;
          gap: 1.6rem;
          justify-items: center;
        }
        .off-icons {
          display: flex;
          gap: 1rem;
        }
        .off-icons a {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          border: 1px solid rgba(134, 244, 255, 0.26);
          display: grid;
          place-items: center;
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .power-button {
          padding: 0.9rem 2.8rem;
          border-radius: 999px;
          border: none;
          background: linear-gradient(130deg, #78f8ff, #637bff);
          color: #040612;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}

function LensCapTransition({ transition }) {
  if (!transition) return null;
  return (
    <div className="lens-transition" aria-hidden="true">
      <div className="cap">{transition.lens?.name}</div>
      <style jsx>{`
        .lens-transition {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(2, 4, 10, 0.9);
          z-index: 18;
          animation: fadeOut 0.68s ease forwards;
        }
        .cap {
          width: clamp(120px, 30vw, 240px);
          height: clamp(120px, 30vw, 240px);
          border-radius: 50%;
          border: 6px solid rgba(134, 244, 255, 0.4);
          display: grid;
          place-items: center;
          font-size: 0.78rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(134, 244, 255, 0.9);
          animation: spinCap 0.68s ease forwards;
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          80% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }
        @keyframes spinCap {
          from {
            transform: rotate(0deg) scale(1.1);
          }
          to {
            transform: rotate(-180deg) scale(0.4);
          }
        }
      `}</style>
    </div>
  );
}

function LayerStack({ layers, onBackdropClick, closeTopLayer, galleryState, setGalleryState }) {
  if (!layers.length) return null;
  return (
    <div className="layer-stack" onClick={onBackdropClick} role="presentation">
      {layers.map((layer, index) => (
        <div
          key={layer.id}
          className="layer"
          style={{
            zIndex: 30 + index,
            transform: `translateY(${index * 6}px) scale(${1 - index * 0.03})`,
            filter: `blur(${index * 1.2}px)`
          }}
          onClick={(event) => event.stopPropagation()}
          role="presentation"
        >
          <header>
            <h3>{layer.title}</h3>
            <button type="button" onClick={closeTopLayer} aria-label="Close layer">
              ✕
            </button>
          </header>
          <div className="layer-content">
            {layer.type === 'gallery' && galleryState ? (
              <GalleryOverlay state={galleryState} setState={setGalleryState} />
            ) : (
              <p>{layer.body}</p>
            )}
          </div>
        </div>
      ))}
      <style jsx>{`
        .layer-stack {
          position: absolute;
          inset: 0;
          background: rgba(4, 8, 18, 0.46);
          backdrop-filter: blur(6px);
          display: grid;
          place-items: center;
          padding: 4rem;
          z-index: 25;
        }
        .layer {
          width: min(640px, 90vw);
          max-height: 80vh;
          border-radius: 26px;
          background: rgba(8, 12, 26, 0.92);
          border: 1px solid rgba(134, 244, 255, 0.22);
          backdrop-filter: blur(18px);
          box-shadow: 0 28px 80px rgba(0, 0, 0, 0.5);
          display: grid;
          grid-template-rows: auto 1fr;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.6rem;
          border-bottom: 1px solid rgba(134, 244, 255, 0.16);
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.74rem;
        }
        header h3 {
          margin: 0;
          font-size: 0.78rem;
        }
        header button {
          border: none;
          background: rgba(255, 255, 255, 0.08);
          border-radius: 50%;
          width: 32px;
          height: 32px;
          color: inherit;
        }
        .layer-content {
          padding: 1.6rem;
          overflow-y: auto;
        }
        .layer-content p {
          line-height: 1.7;
          opacity: 0.82;
        }
        @media (max-width: 960px) {
          .layer-stack {
            padding: 2rem;
          }
        }
      `}</style>
    </div>
  );
}

function GalleryOverlay({ state, setState }) {
  const { album, groupSize, page } = state;
  const totalPages = Math.ceil(album.images.length / groupSize);
  const images = album.images.slice(page * groupSize, page * groupSize + groupSize);
  const handleGroupChange = (event) => {
    const nextGroup = parseInt(event.target.value, 10);
    setState((prev) => ({ ...prev, groupSize: nextGroup, page: 0 }));
  };
  return (
    <div className="gallery-overlay">
      <div className="gallery-toolbar">
        <label>
          Group Size
          <select value={groupSize} onChange={handleGroupChange}>
            {[8, 16].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="gallery-nav">
          <button type="button" disabled={page === 0} onClick={() => setState((prev) => ({ ...prev, page: Math.max(prev.page - 1, 0) }))}>
            Prev
          </button>
          <span>
            {page + 1}/{totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages - 1}
            onClick={() => setState((prev) => ({ ...prev, page: Math.min(prev.page + 1, totalPages - 1) }))}
          >
            Next
          </button>
        </div>
      </div>
      <div className="gallery-grid">
        {images.map((image) => (
          <figure key={image.src}>
            <img src={image.src} alt={image.alt} />
            <figcaption>{image.alt}</figcaption>
          </figure>
        ))}
      </div>
      <style jsx>{`
        .gallery-overlay {
          display: grid;
          gap: 1.2rem;
        }
        .gallery-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        label {
          display: flex;
          gap: 0.6rem;
          align-items: center;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        select {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(134, 244, 255, 0.2);
          color: inherit;
          padding: 0.3rem 0.6rem;
        }
        .gallery-nav {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          font-size: 0.78rem;
          letter-spacing: 0.18em;
        }
        .gallery-nav button {
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(134, 244, 255, 0.18);
          color: inherit;
          padding: 0.4rem 0.9rem;
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 1rem;
        }
        figure {
          margin: 0;
          display: grid;
          gap: 0.4rem;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          object-fit: cover;
        }
        figcaption {
          font-size: 0.7rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
}

