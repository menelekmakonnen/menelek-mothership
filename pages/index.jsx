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

const COVER_SLIDES = [
  {
    id: 'intro',
    label: 'Meet Menelek',
    description: 'Worldbuilder, AI supernerd, and cinematic storyteller crafting immersive universes.',
  },
  {
    id: 'links',
    label: 'All My Links',
    description: 'Every channel where collaborations, premieres, and conversations unfold.',
  },
  {
    id: 'films',
    label: 'Films & Music Videos',
    description: 'Direction, production, and edit suites showcased with cinematic flair.',
  },
  {
    id: 'loremaker',
    label: 'Loremaker Universe',
    description: 'Characters, lore, and worlds expanding the Menelek mythos.',
  },
  {
    id: 'ai-projects',
    label: 'AI Projects',
    description: 'Starterclass, scholarships, and consultancy shaping the future of creativity.',
  },
  {
    id: 'video-edits',
    label: 'Epic Video Edits',
    description: 'High-energy, prestige-grade edits engineered for impact.',
  },
  {
    id: 'photography',
    label: 'Photography Albums',
    description: 'Luxury stills, bokeh-rich portraits, and architectural studies.',
  },
  {
    id: 'ai-albums',
    label: 'AI Albums',
    description: 'Neural dreamscapes rendered with cinematic direction.',
  },
  {
    id: 'blog',
    label: 'Blog',
    description: 'Field notes, philosophies, and creative manifestos.',
  },
];

const PANELS = [
  {
    id: 'cover',
    type: 'cover',
    luminance: 0.58,
    title: 'Navigate the Menelek Makonnen Camera',
    slides: COVER_SLIDES,
  },
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
      {
        name: 'Aetherial Nomad',
        image: 'https://images.unsplash.com/photo-1522199992905-8c19aa1b45a4?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Chrono Scribe',
        image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Nebula Archivist',
        image: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Solar Weaver',
        image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Quantum Bard',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Prism Sentinel',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Velvet Cartographer',
        image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Aurora Whisperer',
        image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Obsidian Keeper',
        image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Riftwalker',
        image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Glyph Alchemist',
        image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Echo Scribe',
        image: 'https://images.unsplash.com/photo-1486591978090-71d41e64e1c2?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Skyway Pilot',
        image: 'https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Pulse Druid',
        image: 'https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Celestial Maven',
        image: 'https://images.unsplash.com/photo-1526481280695-3c469fd10c04?auto=format&fit=crop&w=600&q=80',
      },
      {
        name: 'Flux Luthier',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80',
      },
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
  const [previousPanel, setPreviousPanel] = useState(0);
  const [slideDirection, setSlideDirection] = useState('next');
  const [dynamicWordIndex, setDynamicWordIndex] = useState(0);
  const [hudLevelIndex, setHudLevelIndex] = useState(3);
  const [cameraMode, setCameraMode] = useState('mirrorless');
  const [lensId, setLensId] = useState('50mm');
  const [flashMode, setFlashMode] = useState('auto');
  const [exposure, setExposure] = useState(INITIAL_EXPOSURE);
  const [focusDepth, setFocusDepth] = useState(0.78);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [layers, setLayers] = useState([]);
  const [galleryState, setGalleryState] = useState(null);
  const [booting, setBooting] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isStandby, setIsStandby] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(1);
  const [lensTransition, setLensTransition] = useState(null);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const hudLevel = HUD_LEVELS[hudLevelIndex];
  const lens = useMemo(() => LENSES.find((item) => item.id === lensId) || LENSES[2], [lensId]);
  const panelCount = PANELS.length;
  const heroPanel = useMemo(() => PANELS.find((panel) => panel.id === 'intro'), []);

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
    if (!heroPanel?.dynamicWords?.length) return undefined;
    const interval = setInterval(() => {
      setDynamicWordIndex((prev) => (prev + 1) % heroPanel.dynamicWords.length);
    }, 2400);
    return () => clearInterval(interval);
  }, [heroPanel]);

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
      if (expandedPanelId) {
        setExpandedPanelId(null);
        return;
      }
      if (deltaX < 0) {
        handlePanelChange('next');
      } else {
        handlePanelChange('prev');
      }
    }
  };

  const handlePanelChange = (direction) => {
    if (!panelCount) return;
    setExpandedPanelId(null);
    setSlideDirection(direction);
    setPreviousPanel(activePanel);
    setActivePanel((prev) => {
      if (direction === 'next') {
        return (prev + 1) % panelCount;
      }
      return (prev - 1 + panelCount) % panelCount;
    });
  };

  const jumpToPanel = (panelId) => {
    const targetIndex = PANELS.findIndex((panel) => panel.id === panelId);
    if (targetIndex === -1 || targetIndex === activePanel) return;
    const forwardDistance = (targetIndex - activePanel + panelCount) % panelCount;
    const backwardDistance = (activePanel - targetIndex + panelCount) % panelCount;
    setSlideDirection(forwardDistance <= backwardDistance ? 'next' : 'prev');
    setPreviousPanel(activePanel);
    setExpandedPanelId(null);
    setActivePanel(targetIndex);
  };

  const togglePanelExpansion = (panelId) => {
    setExpandedPanelId((prev) => (prev === panelId ? null : panelId));
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

  const activePanelId = PANELS[activePanel]?.id || null;

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
    ];
  }, [cameraMode, exposure, flashMode, hudLevel, lens.name]);

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

  const resolvedBrightness = resolvedTheme === 'light'
    ? Math.min(Math.max(exposureLook.brightness, 0.68), 0.95)
    : Math.min(Math.max(exposureLook.brightness, 0.72), 1.04);
  const stageClass = `viewport theme-${resolvedTheme} mode-${cameraMode} ${!isCameraOn ? 'camera-idle' : ''}`;
  const showOffScreen = !isCameraOn && !booting && !isStandby;
  const showStandby = isStandby && !booting;

  return (
    <div className={stageClass}>
      <main
        ref={stageRef}
        className="stage"
        onWheel={handleScrollFocus}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          '--lens-scale': (1 + (lens.zoomMultiplier - 1) * 0.35).toFixed(3),
          '--lens-vignette': Math.min(lens.depthResponse * 1.35, 0.95).toFixed(3),
        }}
      >
        <LensCapTransition transition={lensTransition} />
        <RuleOfThirdsOverlay visible={hudLevel !== 'none'} />
        <HistogramOverlay visible={hudLevel === 'most' || hudLevel === 'all'} data={histogramData} />
        <div className="top-interface">
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
          <SectionMenu
            panels={PANELS}
            activePanelId={activePanelId}
            onSelect={jumpToPanel}
            expandedPanelId={expandedPanelId}
            onToggleExpand={() => activePanelId && togglePanelExpansion(activePanelId)}
          />
        </div>
        <PanelDeck
          activePanel={activePanel}
          previousPanel={previousPanel}
          slideDirection={slideDirection}
          panels={PANELS}
          expandedPanelId={expandedPanelId}
          onToggleExpand={togglePanelExpansion}
          openLayer={openLayer}
          openGallery={(panelId, album, event) => openGallery(panelId, album, event)}
          focusAtPointer={focusAtPointer}
          focusDepth={focusDepth}
          exposureLook={exposureLook}
          resolvedTheme={resolvedTheme}
          dynamicWordIndex={dynamicWordIndex}
          lens={lens}
          layersCount={layers.length}
          onJumpToPanel={jumpToPanel}
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
          onPowerOff={() => {
            setIsStandby(false);
            setIsCameraOn(false);
            setBooting(false);
          }}
          onStandby={() => {
            setIsStandby(true);
            setIsCameraOn(false);
          }}
        />
        <PanelNavigation onNavigate={handlePanelChange} />
        <FocusCursor position={focusPoint} />
        {booting && <BootOverlay batteryLevel={batteryLevel} />}
        {showStandby && (
          <CameraStandbyScreen
            onResume={() => {
              setIsStandby(false);
              setIsCameraOn(true);
            }}
          />
        )}
        {showOffScreen && (
          <CameraOffScreen
            onPower={() => {
              setIsCameraOn(true);
              setBooting(true);
              setIsStandby(false);
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
          isolation: isolate;
          background: radial-gradient(circle at 20% 20%, rgba(90, 130, 255, 0.18), transparent 52%),
            radial-gradient(circle at 80% 80%, rgba(255, 200, 120, 0.24), transparent 60%),
            ${resolvedTheme === 'dark'
            ? 'linear-gradient(140deg, #040612 0%, #121726 55%, #030409 100%)'
            : 'linear-gradient(140deg, #f2f5ff 0%, #ffffff 55%, #e9efff 100%)'};
          filter: brightness(${resolvedBrightness}) contrast(${exposureLook.contrast});
        }
        .stage::after {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(circle at 50% 50%, rgba(4, 8, 18, 0), rgba(4, 8, 18, 0.68));
          opacity: var(--lens-vignette, 0.4);
          mix-blend-mode: multiply;
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
        .top-interface {
          position: absolute;
          top: clamp(1.6rem, 5vh, 3.2rem);
          left: 50%;
          transform: translateX(-50%);
          width: min(92vw, 1180px);
          display: grid;
          gap: clamp(0.6rem, 1.6vw, 1rem);
          z-index: 6;
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
          .top-interface {
            top: 1rem;
            gap: 0.6rem;
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

function PanelDeck({
  activePanel,
  previousPanel,
  slideDirection,
  panels,
  expandedPanelId,
  onToggleExpand,
  openLayer,
  openGallery,
  focusAtPointer,
  focusDepth,
  exposureLook,
  resolvedTheme,
  dynamicWordIndex,
  lens,
  layersCount,
  onJumpToPanel,
}) {
  return (
    <div className="panel-deck">
      {panels.map((panel, index) => (
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
          isActive={index === activePanel}
          isPrevious={index === previousPanel && index !== activePanel}
          isExpanded={expandedPanelId === panel.id}
          slideDirection={slideDirection}
          onToggleExpand={() => onToggleExpand(panel.id)}
          lens={lens}
          layersCount={layersCount}
          onJumpToPanel={onJumpToPanel}
        />
      ))}
      <style jsx>{`
        .panel-deck {
          position: relative;
          width: 100%;
          height: min(74vh, 720px);
          display: grid;
          place-items: center;
          padding-top: clamp(12rem, 28vh, 18rem);
          z-index: 4;
        }
        @media (max-width: 960px) {
          .panel-deck {
            min-height: 70vh;
            padding-top: clamp(13rem, 32vh, 16rem);
          }
        }
      `}</style>
    </div>
  );
}

function PanelSection({
  panel,
  focusDepth,
  openLayer,
  openGallery,
  resolvedTheme,
  exposureLook,
  focusAtPointer,
  dynamicWordIndex,
  isActive,
  isPrevious,
  isExpanded,
  slideDirection,
  onToggleExpand,
  lens,
  layersCount,
  onJumpToPanel,
}) {
  const { id, title, type } = panel;
  const layerBoost = Math.min(layersCount * 1.4, 8);
  const baseBlur = Math.max(exposureLook.depthBlur * (1 - focusDepth + 0.12), 0);
  const blur = isActive
    ? Math.min(baseBlur * 0.35 + (isExpanded ? 0 : layerBoost * 0.12), 3.6)
    : Math.min(baseBlur * 0.92 + layerBoost * 0.8, 14);
  const translateInactive = slideDirection === 'next' ? -18 : 18;
  const translatePrevious = slideDirection === 'next' ? -26 : 26;
  const translateX = isActive ? 0 : isPrevious ? translatePrevious : translateInactive;
  const lensScale = isExpanded ? 1.04 : isActive ? 1 + (lens.zoomMultiplier - 1) * 0.35 : 0.92;
  const opacity = isActive ? 1 : 0;
  const pointerEvents = isActive ? 'auto' : 'none';

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
    <section
      className={`panel-section ${isActive ? 'is-active' : 'is-inactive'} ${isExpanded ? 'is-expanded' : ''}`}
      style={{
        filter: `blur(${blur}px)`,
        transform: `translateX(${translateX}%) scale(${lensScale})`,
        opacity,
        pointerEvents,
      }}
    >
      <div className="panel-shell">
        <header>
          <div className="panel-header-text">
            <span className="panel-label">{String(id).toUpperCase()}</span>
            <h2>{title}</h2>
          </div>
          <div className="panel-header-actions">
            <button type="button" className="panel-expand" onClick={onToggleExpand}>
              {isExpanded ? 'Shrink' : 'Expand'}
            </button>
          </div>
        </header>
        <div className={`panel-body type-${type} ${isExpanded ? 'expanded' : ''}`}>
          <SectionContent
            panel={panel}
            onCardClick={handleCardClick}
            resolvedTheme={resolvedTheme}
            focusAtPointer={focusAtPointer}
            dynamicWordIndex={dynamicWordIndex}
            onJumpToPanel={onJumpToPanel}
            isExpanded={isExpanded}
          />
        </div>
      </div>
      <style jsx>{`
        .panel-section {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: opacity 0.6s cubic-bezier(0.33, 1, 0.68, 1),
            transform 0.68s cubic-bezier(0.22, 1, 0.36, 1),
            filter 0.48s ease;
        }
        .panel-shell {
          min-width: min(74vw, 980px);
          max-width: min(74vw, 980px);
          min-height: min(72vh, 680px);
          border-radius: 34px;
          padding: clamp(1.8rem, 3vw, 3rem);
          background: linear-gradient(145deg, rgba(${resolvedTheme === 'dark' ? '14, 18, 34, 0.84' : '244, 247, 255, 0.94'}), rgba(${resolvedTheme === 'dark' ? '6, 8, 18, 0.96' : '232, 238, 255, 0.9'}));
          border: 1px solid rgba(${resolvedTheme === 'dark' ? '132, 164, 255, 0.2' : '34, 58, 144, 0.18'});
          box-shadow: 0 32px 80px rgba(${resolvedTheme === 'dark' ? '0, 8, 32, 0.6' : '32, 60, 140, 0.26'});
          backdrop-filter: blur(24px) saturate(118%);
          display: grid;
          grid-template-rows: auto 1fr;
          overflow: hidden;
        }
        header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 1rem;
          margin-bottom: 1.4rem;
        }
        .panel-header-text {
          display: grid;
          gap: 0.6rem;
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
        .panel-expand {
          border: 1px solid rgba(134, 244, 255, 0.4);
          background: rgba(134, 244, 255, 0.12);
          color: inherit;
          border-radius: 999px;
          padding: 0.45rem 1.2rem;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .panel-body {
          position: relative;
          display: flex;
        }
        .panel-section.is-expanded .panel-shell {
          max-width: min(92vw, 1180px);
          min-height: min(84vh, 760px);
        }
        .panel-body.expanded {
          padding-bottom: 0.4rem;
        }
        @media (max-width: 960px) {
          .panel-shell {
            min-width: 88vw;
            max-width: 88vw;
            padding: 1.6rem;
          }
          header {
            flex-direction: column;
            align-items: flex-start;
          }
        }
      `}</style>
    </section>
  );
}

function SectionContent({ panel, onCardClick, resolvedTheme, focusAtPointer, dynamicWordIndex, onJumpToPanel, isExpanded }) {
  const { type } = panel;
  if (type === 'cover') {
    return <CoverSection panel={panel} resolvedTheme={resolvedTheme} onJumpToPanel={onJumpToPanel} />;
  }
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
    return <LoremakerSection panel={panel} resolvedTheme={resolvedTheme} isExpanded={isExpanded} />;
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

function CoverSection({ panel, resolvedTheme, onJumpToPanel }) {
  const slides = panel.slides || [];
  const total = slides.length;
  const [index, setIndex] = useState(0);
  const current = slides[index] || slides[0] || null;

  const handleCycle = (step) => {
    if (!total) return;
    setIndex((prev) => (prev + step + total) % total);
  };

  return (
    <div className="cover">
      <div className="cover-hero">
        <span className="cover-kicker">{current?.label || 'Explore Menelek Makonnen'}</span>
        <p>{current?.description || 'Dive into each crafted universe using the controls above.'}</p>
        <div className="cover-actions">
          <button type="button" onClick={() => current && onJumpToPanel(current.id)}>
            Enter {current?.label || 'Section'}
          </button>
        </div>
      </div>
      <div className="cover-carousel">
        <button type="button" onClick={() => handleCycle(-1)} aria-label="Previous section">
          ←
        </button>
        <div className="cover-track">
          {slides.map((slide, idx) => (
            <button
              type="button"
              key={slide.id}
              className={`cover-card ${idx === index ? 'active' : ''}`}
              onClick={() => setIndex(idx)}
            >
              <span className="cover-title">{slide.label}</span>
              <p>{slide.description}</p>
            </button>
          ))}
        </div>
        <button type="button" onClick={() => handleCycle(1)} aria-label="Next section">
          →
        </button>
      </div>
      <div className="cover-dots">
        {slides.map((slide, idx) => (
          <button
            type="button"
            key={`${slide.id}-dot`}
            className={idx === index ? 'active' : ''}
            onClick={() => setIndex(idx)}
            aria-label={`View ${slide.label}`}
          />
        ))}
      </div>
      <style jsx>{`
        .cover {
          display: grid;
          gap: 1.6rem;
        }
        .cover-hero {
          display: grid;
          gap: 1rem;
          max-width: 38ch;
        }
        .cover-kicker {
          font-size: 0.78rem;
          letter-spacing: 0.32em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .cover-actions button {
          padding: 0.8rem 1.8rem;
          border-radius: 999px;
          border: none;
          background: linear-gradient(120deg, rgba(134, 244, 255, 0.9), rgba(121, 140, 255, 0.7));
          color: ${resolvedTheme === 'dark' ? '#04070f' : '#09163a'};
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          box-shadow: 0 18px 36px rgba(66, 120, 255, 0.26);
        }
        .cover-carousel {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 1rem;
        }
        .cover-carousel button {
          width: 42px;
          height: 42px;
          border-radius: 50%;
          border: 1px solid rgba(134, 244, 255, 0.26);
          background: rgba(134, 244, 255, 0.08);
          color: inherit;
        }
        .cover-track {
          display: grid;
          grid-auto-flow: column;
          gap: 1.2rem;
          overflow-x: auto;
          padding: 0.4rem;
          scroll-snap-type: x mandatory;
        }
        .cover-card {
          min-width: clamp(200px, 22vw, 260px);
          scroll-snap-align: center;
          padding: 1.2rem 1.4rem;
          border-radius: 20px;
          border: 1px solid rgba(134, 244, 255, 0.18);
          background: rgba(134, 244, 255, 0.08);
          display: grid;
          gap: 0.6rem;
          text-align: left;
          opacity: 0.58;
          transition: opacity 0.3s ease, transform 0.4s ease;
        }
        .cover-card.active {
          opacity: 1;
          transform: translateY(-6px);
          background: rgba(134, 244, 255, 0.16);
        }
        .cover-title {
          letter-spacing: 0.22em;
          font-size: 0.72rem;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .cover-dots {
          display: flex;
          gap: 0.6rem;
        }
        .cover-dots button {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          border: none;
          background: rgba(134, 244, 255, 0.2);
        }
        .cover-dots button.active {
          background: rgba(134, 244, 255, 0.8);
        }
        @media (max-width: 960px) {
          .cover-track {
            grid-auto-flow: row;
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .cover-card {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  );
}

function LoremakerSection({ panel, resolvedTheme, isExpanded }) {
  const selections = useMemo(() => {
    const pool = [...panel.characters];
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    return pool.slice(0, Math.min(pool.length, isExpanded ? 12 : 8));
  }, [panel.characters, isExpanded]);

  return (
    <div className="loremaker-grid">
      {selections.map((character) => (
        <figure key={character.name} className="character-card">
          <div className="character-frame">
            <img src={character.image} alt={character.name} />
          </div>
          <figcaption>{character.name}</figcaption>
        </figure>
      ))}
      <style jsx>{`
        .loremaker-grid {
          display: grid;
          gap: 1rem;
          grid-template-columns: repeat(auto-fit, minmax(${isExpanded ? '150px' : '180px'}, 1fr));
        }
        .character-card {
          margin: 0;
          display: grid;
          gap: 0.6rem;
          padding: 1rem;
          border-radius: 20px;
          background: rgba(134, 244, 255, 0.08);
          border: 1px solid rgba(134, 244, 255, 0.16);
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.22);
          text-align: center;
        }
        .character-frame {
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 16px;
          overflow: hidden;
          background: rgba(4, 8, 18, 0.4);
        }
        .character-frame img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        figcaption {
          font-size: 0.82rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          opacity: 0.8;
        }
        @media (max-width: 960px) {
          .loremaker-grid {
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          }
        }
      `}</style>
    </div>
  );
}

function SectionMenu({ panels, activePanelId, onSelect, expandedPanelId, onToggleExpand }) {
  return (
    <nav className="section-menu" aria-label="Section menu">
      <div className="menu-scroll">
        {panels.map((panel) => (
          <button
            type="button"
            key={panel.id}
            className={`menu-item ${panel.id === activePanelId ? 'active' : ''}`}
            onClick={() => onSelect(panel.id)}
          >
            <span className="menu-title">{panel.title}</span>
            <span className="menu-type">{panel.type}</span>
          </button>
        ))}
      </div>
      <button type="button" className="expand-toggle" onClick={onToggleExpand}>
        {expandedPanelId === activePanelId ? 'Shrink view' : 'Expand view'}
      </button>
      <style jsx>{`
        .section-menu {
          display: grid;
          gap: 0.8rem;
          padding: 0.8rem 1rem;
          border-radius: 20px;
          background: rgba(6, 10, 24, 0.6);
          border: 1px solid rgba(134, 244, 255, 0.18);
          backdrop-filter: blur(18px);
        }
        .menu-scroll {
          display: flex;
          gap: 0.6rem;
          overflow-x: auto;
          padding-bottom: 0.2rem;
          scrollbar-width: none;
        }
        .menu-scroll::-webkit-scrollbar {
          display: none;
        }
        .menu-item {
          flex: 0 0 auto;
          display: grid;
          gap: 0.2rem;
          padding: 0.7rem 1rem;
          border-radius: 16px;
          border: 1px solid rgba(134, 244, 255, 0.18);
          background: rgba(134, 244, 255, 0.08);
          text-align: left;
          min-width: clamp(140px, 14vw, 180px);
        }
        .menu-item.active {
          background: rgba(134, 244, 255, 0.18);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.24);
        }
        .menu-title {
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.06em;
        }
        .menu-type {
          font-size: 0.62rem;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .expand-toggle {
          justify-self: end;
          border: 1px solid rgba(134, 244, 255, 0.3);
          background: rgba(134, 244, 255, 0.12);
          color: inherit;
          border-radius: 999px;
          padding: 0.45rem 1.2rem;
          font-size: 0.7rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
        }
        @media (max-width: 960px) {
          .section-menu {
            padding: 0.6rem 0.8rem;
          }
          .menu-item {
            min-width: 140px;
          }
        }
      `}</style>
    </nav>
  );
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
      {[33.333, 66.666].map((position) => (
        <div key={`v-${position}`} className="grid-line vertical" style={{ left: `${position}%` }} />
      ))}
      {[33.333, 66.666].map((position) => (
        <div key={`h-${position}`} className="grid-line horizontal" style={{ top: `${position}%` }} />
      ))}
      <div className="grid-frame" />
      <style jsx>{`
        .grid-overlay {
          position: absolute;
          inset: clamp(3rem, 10vh, 6rem) clamp(2rem, 7vw, 5rem) clamp(7rem, 12vh, 9rem) clamp(2rem, 7vw, 5rem);
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
        .grid-frame {
          position: absolute;
          inset: 0;
          border: 1px solid rgba(134, 244, 255, 0.14);
          border-radius: 12px;
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

function Hud({ hudLevel, readouts, batteryLevel, focusDepth, cycleHudLevel, toggleCameraMode, cameraMode, flashMode, cycleFlashMode, onPowerOff, onStandby }) {
  return (
    <div className={`hud hud-${hudLevel}`}>
      <div className="hud-main">
        <div className="hud-group">
          <button type="button" onClick={cycleHudLevel} aria-label="Cycle HUD density">
            HUD {hudLevel.toUpperCase()}
          </button>
          <button type="button" onClick={toggleCameraMode} aria-label="Toggle camera mode">
            {cameraMode === 'mirrorless' ? 'Mirrorless' : 'DSLR'}
          </button>
        </div>
        <div className="hud-readouts">
          {readouts.map((item) => (
            <div key={item.label} className="readout">
              <span className="label">{item.label}</span>
              <span className="value">{item.value}</span>
            </div>
          ))}
        </div>
        <div className="hud-group hud-actions">
          <button type="button" onClick={cycleFlashMode} aria-label="Cycle flash mode">
            Flash {flashMode.toUpperCase()}
          </button>
          <button type="button" onClick={onStandby} aria-label="Standby">
            Standby
          </button>
          <button type="button" onClick={onPowerOff} aria-label="Power off camera">
            Power
          </button>
        </div>
      </div>
      <div className="hud-footer">
        <div className="battery" role="meter" aria-valuenow={Math.round(batteryLevel * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Battery level">
          <div className="battery-shell">
            <div className="battery-level" style={{ width: `${batteryLevel * 100}%` }} />
          </div>
        </div>
        <div className="focus-depth">Focus Depth {Math.round(focusDepth * 100)}%</div>
      </div>
      <style jsx>{`
        .hud {
          position: absolute;
          bottom: clamp(1.6rem, 4vh, 3.2rem);
          left: 50%;
          transform: translateX(-50%);
          display: grid;
          gap: 0.6rem;
          padding: 1rem 1.6rem;
          border-radius: 24px;
          background: rgba(6, 10, 24, 0.6);
          border: 1px solid rgba(134, 244, 255, 0.18);
          backdrop-filter: blur(18px);
          color: rgba(235, 244, 255, 0.95);
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
          width: min(92vw, 960px);
        }
        .hud-main {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: clamp(0.8rem, 2vw, 1.8rem);
          align-items: center;
        }
        .hud-group {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
        }
        .hud-group button {
          border: 1px solid rgba(134, 244, 255, 0.3);
          border-radius: 999px;
          background: rgba(134, 244, 255, 0.12);
          padding: 0.45rem 1.1rem;
          color: inherit;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
        }
        .hud-readouts {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: minmax(72px, auto);
          gap: clamp(0.6rem, 2vw, 1.4rem);
          justify-content: center;
        }
        .readout {
          display: grid;
          gap: 0.2rem;
          text-align: center;
          min-width: 72px;
        }
        .label {
          font-size: 0.62rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          opacity: 0.6;
          white-space: nowrap;
        }
        .value {
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.08em;
          white-space: nowrap;
        }
        .hud-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.8;
        }
        .battery {
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .battery-shell {
          width: 140px;
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
        @media (max-width: 960px) {
          .hud {
            width: 94vw;
            padding: 1rem;
          }
          .hud-main {
            grid-template-columns: 1fr;
            gap: 0.8rem;
          }
          .hud-readouts {
            grid-auto-flow: row;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            justify-items: center;
          }
          .hud-footer {
            flex-direction: column;
            gap: 0.4rem;
          }
        }
      `}</style>
    </div>
  );
}

function ControlDock({ lens, exposure, focusDepth, onFocusDepthChange, onExposureChange, onLensChange, lenses, cameraMode }) {
  const [openClusters, setOpenClusters] = useState(['exposure']);

  useEffect(() => {
    if (!openClusters.length) {
      setOpenClusters(['exposure']);
    }
  }, [openClusters]);

  const toggleCluster = (key) => {
    setOpenClusters((prev) => {
      if (prev.includes(key)) {
        const filtered = prev.filter((item) => item !== key);
        return filtered.length ? filtered : ['exposure'];
      }
      const next = [...prev, key];
      if (next.length > 2) {
        next.splice(0, next.length - 2);
      }
      return next;
    });
  };

  const isOpen = (key) => openClusters.includes(key);

  return (
    <aside className="control-dock">
      <div className={`cluster exposure ${isOpen('exposure') ? 'open' : 'collapsed'}`}>
        <div className="cluster-header">
          <button type="button" onClick={() => toggleCluster('exposure')} aria-expanded={isOpen('exposure')}>
            Exposure
          </button>
          <span className="cluster-sub">Aperture · Shutter · ISO · WB · Focus</span>
        </div>
        {isOpen('exposure') && (
          <div className="cluster-body exposure-grid">
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
      <div className={`cluster lenses ${isOpen('lenses') ? 'open' : 'collapsed'}`}>
        <div className="cluster-header">
          <button type="button" onClick={() => toggleCluster('lenses')} aria-expanded={isOpen('lenses')}>
            Lenses
          </button>
          <span className="cluster-sub">{lens.name}</span>
        </div>
        {isOpen('lenses') ? (
          <div className="cluster-body lens-list">
            {lenses.map((item) => (
              <button
                type="button"
                key={item.id}
                className={`lens-item ${lens.id === item.id ? 'active' : ''}`}
                onClick={() => onLensChange(item.id)}
              >
                <span className="lens-title">{item.name}</span>
                <span className="lens-info">f/{item.minAperture} – f/{item.maxAperture}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="cluster-summary">f/{lens.minAperture} – f/{lens.maxAperture}</div>
        )}
      </div>
      <div className={`cluster assist ${isOpen('assist') ? 'open' : 'collapsed'}`}>
        <div className="cluster-header">
          <button type="button" onClick={() => toggleCluster('assist')} aria-expanded={isOpen('assist')}>
            Assist
          </button>
          <span className="cluster-sub">Status console</span>
        </div>
        {isOpen('assist') ? (
          <div className="cluster-body assist-grid">
            <div className="assist-item">
              <span className="assist-label">Mode</span>
              <span>{cameraMode === 'mirrorless' ? 'Mirrorless EVF' : 'DSLR OVF'}</span>
            </div>
            <div className="assist-item">
              <span className="assist-label">Lens</span>
              <span>{lens.name}</span>
            </div>
            <div className="assist-item">
              <span className="assist-label">Depth</span>
              <span>{(lens.depthResponse * 100).toFixed(0)}%</span>
            </div>
          </div>
        ) : (
          <div className="cluster-summary">{cameraMode === 'mirrorless' ? 'EVF live' : 'OVF live'}</div>
        )}
      </div>
      <style jsx>{`
        .control-dock {
          display: grid;
          grid-template-columns: minmax(0, 1.4fr) minmax(0, 0.85fr) minmax(0, 0.85fr);
          gap: clamp(0.8rem, 2vw, 1.6rem);
          width: 100%;
        }
        .cluster {
          background: rgba(6, 10, 24, 0.58);
          border: 1px solid rgba(134, 244, 255, 0.18);
          border-radius: 22px;
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 40px rgba(0, 0, 0, 0.32);
          display: grid;
          gap: 0.6rem;
          padding: 0.9rem 1.1rem;
        }
        .cluster.collapsed {
          padding-bottom: 0.8rem;
        }
        .cluster-header {
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .cluster-header button {
          border: none;
          background: none;
          color: rgba(235, 244, 255, 0.92);
          font-weight: 600;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          text-align: left;
        }
        .cluster-sub {
          font-size: 0.68rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          opacity: 0.6;
        }
        .cluster-body {
          display: grid;
          gap: 0.8rem;
        }
        .cluster-summary {
          font-size: 0.74rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.65;
        }
        .exposure-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 0.9rem;
        }
        .lens-list {
          display: grid;
          gap: 0.6rem;
        }
        .lens-item {
          display: grid;
          gap: 0.25rem;
          border-radius: 16px;
          border: 1px solid rgba(134, 244, 255, 0.18);
          padding: 0.8rem 1rem;
          background: rgba(134, 244, 255, 0.06);
          text-align: left;
        }
        .lens-item.active {
          border-color: rgba(134, 244, 255, 0.42);
          background: rgba(134, 244, 255, 0.14);
        }
        .lens-title {
          font-size: 0.92rem;
          font-weight: 600;
        }
        .lens-info {
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          opacity: 0.7;
        }
        .assist-grid {
          display: grid;
          gap: 0.6rem;
        }
        .assist-item {
          display: flex;
          justify-content: space-between;
          font-size: 0.78rem;
          letter-spacing: 0.08em;
        }
        .assist-label {
          text-transform: uppercase;
          opacity: 0.6;
        }
        @media (max-width: 960px) {
          .control-dock {
            grid-template-columns: 1fr;
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
        <span className="status">Initializing Aetherial Imaging Engine…</span>
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

function CameraStandbyScreen({ onResume }) {
  return (
    <div className="camera-standby">
      <div className="standby-inner">
        <span className="standby-title">Standby Mode</span>
        <p>Resume to continue navigating the gallery where you left off.</p>
        <button type="button" onClick={onResume}>
          Resume
        </button>
      </div>
      <style jsx>{`
        .camera-standby {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: radial-gradient(circle at 50% 50%, rgba(4, 8, 18, 0.7), rgba(4, 8, 18, 0.84));
          z-index: 18;
        }
        .standby-inner {
          display: grid;
          gap: 1rem;
          text-align: center;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: rgba(134, 244, 255, 0.92);
        }
        .standby-title {
          font-size: 0.92rem;
          font-weight: 600;
        }
        p {
          margin: 0;
          font-size: 0.68rem;
          letter-spacing: 0.1em;
          text-transform: none;
          opacity: 0.75;
        }
        button {
          justify-self: center;
          padding: 0.7rem 2rem;
          border-radius: 999px;
          border: 1px solid rgba(134, 244, 255, 0.32);
          background: rgba(134, 244, 255, 0.18);
          color: #04101f;
          font-weight: 700;
          letter-spacing: 0.2em;
        }
      `}</style>
    </div>
  );
}

function LensCapTransition({ transition }) {
  if (!transition) return null;
  return (
    <div className="lens-transition" aria-hidden="true">
      <div className="iris">
        {Array.from({ length: 6 }).map((_, index) => (
          <span key={index} className="blade" style={{ '--index': index }} />
        ))}
        <span className="iris-label">{transition.lens?.name}</span>
      </div>
      <style jsx>{`
        .lens-transition {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: rgba(3, 5, 12, 0.85);
          z-index: 18;
          animation: fadeOut 0.72s ease forwards;
        }
        .iris {
          position: relative;
          width: clamp(160px, 40vw, 320px);
          height: clamp(160px, 40vw, 320px);
          border-radius: 50%;
          overflow: hidden;
          display: grid;
          place-items: center;
          background: radial-gradient(circle, rgba(6, 10, 24, 0.75), rgba(2, 4, 10, 0.95));
        }
        .blade {
          position: absolute;
          inset: -10%;
          background: linear-gradient(180deg, rgba(8, 14, 32, 0.9), rgba(3, 5, 16, 0.98));
          clip-path: polygon(50% 50%, 100% 0%, 100% 100%);
          transform-origin: 50% 50%;
          transform: rotate(calc(var(--index) * 60deg)) scale(1.3);
          animation: irisClose 0.72s cubic-bezier(0.33, 1, 0.68, 1) forwards;
        }
        .iris-label {
          position: relative;
          z-index: 2;
          font-size: 0.78rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: rgba(134, 244, 255, 0.9);
        }
        @keyframes irisClose {
          0% {
            transform: rotate(calc(var(--index) * 60deg)) scale(1.3);
          }
          70% {
            transform: rotate(calc(var(--index) * 60deg)) scale(0.05);
          }
          100% {
            transform: rotate(calc(var(--index) * 60deg)) scale(0);
          }
        }
        @keyframes fadeOut {
          0% {
            opacity: 1;
          }
          60% {
            opacity: 1;
          }
          100% {
            opacity: 0;
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

