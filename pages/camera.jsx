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
  ToggleRight,
  Video,
  Vibrate,
  Wand2,
  ZoomIn,
} from 'lucide-react';

const cameraSystems = [
  {
    brand: 'Canon',
    accent: 'text-red-200',
    hudAccent: 'text-red-200/80',
    models: [
      {
        id: 'canon-1dx3',
        name: 'EOS-1D X Mark III',
        type: 'dslr',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 100, max: 102400, expandedMax: 819200, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 8000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 16, electronic: 20 },
        blackoutMs: 160,
        exposurePreview: false,
        battery: { rating: 2850, mode: 'OVF' },
        notes: 'Flagship DSLR OVF with Smart Controller AF and deep buffer.',
      },
      {
        id: 'canon-r3',
        name: 'EOS R3',
        type: 'mirrorless',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 100, max: 102400, expandedMax: 204800, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 64000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 12, electronic: 30 },
        blackoutMs: 40,
        exposurePreview: true,
        battery: { rating: 620, mode: 'EVF' },
        notes: 'Stacked sensor mirrorless with Eye Control AF and blackout-free EVF.',
      },
    ],
  },
  {
    brand: 'Nikon',
    accent: 'text-yellow-200',
    hudAccent: 'text-yellow-200/80',
    models: [
      {
        id: 'nikon-d6',
        name: 'Nikon D6',
        type: 'dslr',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 100, max: 102400, expandedMax: 3280000, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 8000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 14, electronic: 10 },
        blackoutMs: 180,
        exposurePreview: false,
        battery: { rating: 3580, mode: 'OVF' },
        notes: 'Pro DSLR with 105 cross-type AF points and rugged body.',
      },
      {
        id: 'nikon-z9',
        name: 'Nikon Z9',
        type: 'mirrorless',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 64, max: 25600, expandedMax: 102400, expandedMin: 32 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 32000, slowest: 30 },
          hasElectronic: true,
          mechanicalDisabled: true,
        },
        fps: { mechanical: 0, electronic: 20 },
        blackoutMs: 10,
        exposurePreview: true,
        battery: { rating: 740, mode: 'EVF' },
        notes: 'Mirrorless flagship with electronic-only shutter and 120fps burst.',
      },
    ],
  },
  {
    brand: 'Sony',
    accent: 'text-orange-200',
    hudAccent: 'text-orange-200/80',
    models: [
      {
        id: 'sony-a1',
        name: 'Sony Alpha 1',
        type: 'mirrorless',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 100, max: 32000, expandedMax: 102400, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 32000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 10, electronic: 30 },
        blackoutMs: 12,
        exposurePreview: true,
        battery: { rating: 530, mode: 'EVF' },
        notes: '9.44M-dot EVF with 240fps refresh and 30fps electronic shutter.',
      },
    ],
  },
  {
    brand: 'Fujifilm',
    accent: 'text-emerald-200',
    hudAccent: 'text-emerald-200/80',
    models: [
      {
        id: 'fuji-xh2s',
        name: 'Fujifilm X-H2S',
        type: 'mirrorless',
        sensor: { label: 'APS-C', cropFactor: 1.5 },
        iso: { base: 160, max: 12800, expandedMax: 51200, expandedMin: 80 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 32000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 15, electronic: 40 },
        blackoutMs: 20,
        exposurePreview: true,
        battery: { rating: 720, mode: 'EVF' },
        notes: 'Stacked APS-C body with film simulations and 40fps bursts.',
      },
      {
        id: 'fuji-xt5',
        name: 'Fujifilm X-T5',
        type: 'mirrorless',
        sensor: { label: 'APS-C', cropFactor: 1.5 },
        iso: { base: 125, max: 12800, expandedMax: 51200, expandedMin: 64 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 15 },
          electronic: { fastest: 32000, slowest: 15 },
          hasElectronic: true,
        },
        fps: { mechanical: 15, electronic: 20 },
        blackoutMs: 22,
        exposurePreview: true,
        battery: { rating: 580, mode: 'EVF' },
        notes: 'Dial-based hybrid stills body with classic Fuji ergonomics.',
      },
    ],
  },
  {
    brand: 'Panasonic',
    accent: 'text-sky-200',
    hudAccent: 'text-sky-200/80',
    models: [
      {
        id: 'panasonic-s1h',
        name: 'Lumix S1H',
        type: 'mirrorless',
        sensor: { label: 'Full Frame', cropFactor: 1 },
        iso: { base: 100, max: 51200, expandedMax: 204800, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 16000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 9, electronic: 20 },
        blackoutMs: 18,
        exposurePreview: true,
        battery: { rating: 400, mode: 'EVF' },
        notes: 'Cinema-focused L-Mount body with waveform and unlimited recording.',
      },
      {
        id: 'panasonic-gh6',
        name: 'Lumix GH6',
        type: 'mirrorless',
        sensor: { label: 'Micro Four Thirds', cropFactor: 2 },
        iso: { base: 100, max: 12800, expandedMax: 25600, expandedMin: 50 },
        shutter: {
          mechanical: { fastest: 8000, slowest: 30 },
          electronic: { fastest: 32000, slowest: 30 },
          hasElectronic: true,
        },
        fps: { mechanical: 12, electronic: 75 },
        blackoutMs: 16,
        exposurePreview: true,
        battery: { rating: 380, mode: 'EVF' },
        notes: 'Video-centric micro 4/3 body with advanced waveform monitoring.',
      },
    ],
  },
];

const lenses = [
  {
    id: '50-18',
    name: '50mm f/1.8 Prime',
    subtitle: 'The storyteller',
    vignette: 0.1,
    zoom: 1,
    perspective: 0,
    bokehFactor: 1.05,
    maxAperture: 1.8,
    minAperture: 22,
    fov: 1,
    description: 'Balanced classic with cinematic compression and creamy falloff.',
    category: 'Standard Prime',
  },
  {
    id: '35-14',
    name: '35mm f/1.4 Prime',
    subtitle: 'Everyday auteur',
    vignette: 0.12,
    zoom: 0.95,
    perspective: 6,
    bokehFactor: 0.9,
    maxAperture: 1.4,
    minAperture: 22,
    fov: 1.2,
    description: 'Natural perspective ideal for narrative coverage and reportage.',
    category: 'Wide Prime',
  },
  {
    id: '85-14',
    name: '85mm f/1.4 Prime',
    subtitle: 'Intimate focus',
    vignette: 0.08,
    zoom: 1.25,
    perspective: -10,
    bokehFactor: 1.4,
    maxAperture: 1.4,
    minAperture: 22,
    fov: 0.72,
    description: 'Elegant compression and flattering depth for character-driven work.',
    category: 'Portrait Prime',
  },
  {
    id: '135-2',
    name: '135mm f/2 Prime',
    subtitle: 'Sculpted telephoto',
    vignette: 0.06,
    zoom: 1.35,
    perspective: -14,
    bokehFactor: 1.6,
    maxAperture: 2,
    minAperture: 22,
    fov: 0.55,
    description: 'Iconic portrait tele with dramatic compression and lush bokeh.',
    category: 'Tele Prime',
  },
  {
    id: '24-70',
    name: '24-70mm f/2.8 Zoom',
    subtitle: 'Workhorse versatility',
    vignette: 0.14,
    zoom: 0.9,
    perspective: 4,
    bokehFactor: 1,
    maxAperture: 2.8,
    minAperture: 22,
    fov: 1.15,
    description: 'From establishing frames to intimate close-ups without swapping glass.',
    category: 'Standard Zoom',
  },
  {
    id: '70-200',
    name: '70-200mm f/2.8 Zoom',
    subtitle: 'Ceremony staple',
    vignette: 0.1,
    zoom: 1.3,
    perspective: -12,
    bokehFactor: 1.45,
    maxAperture: 2.8,
    minAperture: 22,
    fov: 0.65,
    description: 'Compression king for weddings, fashion runways, and sports drama.',
    category: 'Tele Zoom',
  },
  {
    id: '16-35',
    name: '16-35mm f/2.8 Zoom',
    subtitle: 'Immersive explorer',
    vignette: 0.2,
    zoom: 0.78,
    perspective: 16,
    bokehFactor: 0.65,
    maxAperture: 2.8,
    minAperture: 22,
    fov: 1.45,
    description: 'Pulls you into the scene with wide vistas and architectural drama.',
    category: 'Ultra Wide',
  },
  {
    id: '100-400',
    name: '100-400mm f/4.5-5.6 Zoom',
    subtitle: 'Expedition reach',
    vignette: 0.08,
    zoom: 1.4,
    perspective: -18,
    bokehFactor: 1.55,
    maxAperture: 4.5,
    minAperture: 32,
    fov: 0.4,
    description: 'Wildlife and sports tele zoom that collapses distance and isolates action.',
    category: 'Super Tele',
  },
  {
    id: '100-macro',
    name: '100mm f/2.8 Macro',
    subtitle: 'Detail alchemist',
    vignette: 0.09,
    zoom: 1.15,
    perspective: -6,
    bokehFactor: 1.5,
    maxAperture: 2.8,
    minAperture: 32,
    fov: 0.68,
    description: 'True 1:1 reproduction with razor-thin focus planes for texture studies.',
    category: 'Macro',
  },
  {
    id: '24-105',
    name: '24-105mm f/4 Zoom',
    subtitle: 'Travel documentarian',
    vignette: 0.15,
    zoom: 0.92,
    perspective: 2,
    bokehFactor: 0.95,
    maxAperture: 4,
    minAperture: 22,
    fov: 1.05,
    description: 'A single-lens solution with stabilization and effortless framing.',
    category: 'All-Rounder',
  },
];

const allShutterStops = [
  { label: '1/64000', value: 1 / 64000 },
  { label: '1/32000', value: 1 / 32000 },
  { label: '1/16000', value: 1 / 16000 },
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
  { label: '2"', value: 2 },
  { label: '4"', value: 4 },
  { label: '8"', value: 8 },
  { label: '15"', value: 15 },
  { label: '30"', value: 30 },
];

const apertureStopsBase = [1.2, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22, 32];
const isoStopsBase = [32, 50, 64, 80, 100, 125, 160, 200, 320, 400, 640, 800, 1250, 1600, 2500, 3200, 5000, 6400, 8000, 10000, 12800, 25600, 51200, 102400, 204800, 409600, 819200, 3280000];

const whiteBalancePresets = [
  { label: 'Auto', value: 5600 },
  { label: 'Tungsten', value: 3200 },
  { label: 'Fluorescent', value: 4200 },
  { label: 'Daylight', value: 5600 },
  { label: 'Cloudy', value: 6500 },
  { label: 'Shade', value: 7000 },
];

const filmSimulationPresets = {
  Provia: { label: 'Provia / Std', saturation: 1, contrast: 1, tint: 0, grain: 0 },
  Velvia: { label: 'Velvia / Vivid', saturation: 1.18, contrast: 1.12, tint: 6, grain: 0.05 },
  Astia: { label: 'Astia / Soft', saturation: 0.92, contrast: 0.95, tint: -4, grain: 0 },
  Acros: { label: 'Acros Mono', saturation: 0, contrast: 1.08, tint: 0, grain: 0.12 },
};

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

const hudStyles = [
  { id: 'literal', label: 'Camera HUD' },
  { id: 'cinematic', label: 'Cinematic HUD' },
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
  const [brandIndex, setBrandIndex] = useState(0);
  const [modelIndex, setModelIndex] = useState(0);
  const [lensIndex, setLensIndex] = useState(0);
  const [isoIndex, setIsoIndex] = useState(0);
  const [apertureIndex, setApertureIndex] = useState(0);
  const [shutterIndex, setShutterIndex] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState(5600);
  const [hudMode, setHudMode] = useState('full');
  const [hudStyle, setHudStyle] = useState('literal');
  const [controlMode, setControlMode] = useState('all');
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showFlashBurst, setShowFlashBurst] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [cursorPoint, setCursorPoint] = useState({ x: 50, y: 50 });
  const [isFocusing, setIsFocusing] = useState(false);
  const [focusLocked, setFocusLocked] = useState(false);
  const [exposureComp, setExposureComp] = useState(0);
  const [hudExpanded, setHudExpanded] = useState(true);
  const [ambientLux, setAmbientLux] = useState(4);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [exposurePreviewEnabled, setExposurePreviewEnabled] = useState(
    cameraSystems[0].models[0].exposurePreview,
  );
  const [shutterMode, setShutterMode] = useState(
    cameraSystems[0].models[0].type === 'dslr' ? 'mechanical' : 'electronic',
  );
  const [waveformEnabled, setWaveformEnabled] = useState(false);
  const [zebraEnabled, setZebraEnabled] = useState(false);
  const [filmSimulation, setFilmSimulation] = useState('Provia');

  const viewfinderRef = useRef(null);

  const currentBrand = cameraSystems[brandIndex];
  const currentCamera = currentBrand.models[modelIndex] ?? currentBrand.models[0];
  const lens = lenses[lensIndex];

  const availableIsoStops = useMemo(() => {
    const { iso } = currentCamera;
    const minIso = iso.expandedMin ?? iso.base;
    const maxIso = iso.expandedMax ?? iso.max;
    return isoStopsBase.filter((value) => value >= minIso && value <= maxIso);
  }, [currentCamera]);

  const isoStops = availableIsoStops;
  const iso =
    isoStops.length > 0
      ? isoStops[Math.min(isoIndex, isoStops.length - 1)]
      : currentCamera.iso.base;

  const apertureStops = useMemo(() => {
    const stops = apertureStopsBase
      .concat([lens.maxAperture, lens.minAperture])
      .filter((value) => value >= lens.maxAperture && value <= lens.minAperture);
    const unique = Array.from(new Set(stops));
    return unique.sort((a, b) => a - b);
  }, [lens]);

  const aperture =
    apertureStops[Math.min(apertureIndex, apertureStops.length - 1)] ?? apertureStops[0] ?? lens.maxAperture;

  const shutterProfile = useMemo(() => {
    if (shutterMode === 'electronic' && currentCamera.shutter.hasElectronic) {
      return currentCamera.shutter.electronic;
    }
    return currentCamera.shutter.mechanical;
  }, [currentCamera, shutterMode]);

  const shutterStops = useMemo(() => {
    const fastest = 1 / shutterProfile.fastest;
    const slowest = shutterProfile.slowest;
    return allShutterStops.filter((stop) => stop.value >= fastest && stop.value <= slowest);
  }, [shutterProfile]);

  const shutter =
    shutterStops.length > 0
      ? shutterStops[Math.min(shutterIndex, shutterStops.length - 1)]
      : allShutterStops[6];

  const accentClass = currentBrand.accent;
  const hudAccent = currentBrand.hudAccent;
  const sensorCrop = currentCamera.sensor.cropFactor ?? 1;
  const exposurePreviewActive =
    exposurePreviewEnabled && (currentCamera.type !== 'dslr' || shutterMode === 'electronic');
  const filmProfile =
    currentBrand.brand === 'Fujifilm'
      ? filmSimulationPresets[filmSimulation] ?? filmSimulationPresets.Provia
      : filmSimulationPresets.Provia;
  const filmContrast = filmProfile?.contrast ?? 1;
  const filmSaturation = filmProfile?.saturation ?? 1;
  const filmIsMonochrome = filmSaturation === 0;
  const effectiveFov = Math.max(0.45, Math.min(1.6, lens.fov / sensorCrop));
  const viewScale = 1 / effectiveFov;
  const contrastValue = (1.05 + lens.zoom * 0.12) * filmContrast;
  const saturationValue = (1 + (whiteBalance - 5600) / 9000) * (filmSaturation || 1);
  const activeFps =
    shutterMode === 'electronic'
      ? currentCamera.fps.electronic || currentCamera.fps.mechanical
      : currentCamera.fps.mechanical || currentCamera.fps.electronic;

  useEffect(() => {
    setModelIndex(0);
  }, [brandIndex]);

  useEffect(() => {
    setExposurePreviewEnabled(currentCamera.exposurePreview);
    setShutterMode(
      currentCamera.shutter.mechanicalDisabled
        ? 'electronic'
        : currentCamera.type === 'dslr'
        ? 'mechanical'
        : 'electronic',
    );
    setBatteryLevel(100);
    if (currentBrand.brand !== 'Fujifilm') {
      setFilmSimulation('Provia');
    }
    setZebraEnabled(false);
    setWaveformEnabled(false);
  }, [currentCamera, currentBrand.brand]);

  useEffect(() => {
    if (!isoStops.length) return;
    const baseIndex = isoStops.findIndex((value) => value >= currentCamera.iso.base);
    setIsoIndex(baseIndex >= 0 ? baseIndex : isoStops.length - 1);
  }, [currentCamera, isoStops]);

  useEffect(() => {
    if (!apertureStops.length) return;
    const defaultIndex = apertureStops.findIndex((value) => Math.abs(value - lens.maxAperture) < 0.01);
    setApertureIndex(defaultIndex >= 0 ? defaultIndex : 0);
  }, [lens, apertureStops]);

  useEffect(() => {
    if (!shutterStops.length) return;
    const target = 1 / 125;
    let closestIndex = 0;
    shutterStops.forEach((stop, index) => {
      if (Math.abs(stop.value - target) < Math.abs(shutterStops[closestIndex].value - target)) {
        closestIndex = index;
      }
    });
    setShutterIndex(closestIndex);
  }, [currentCamera, shutterMode, shutterStops]);

  useEffect(() => {
    const baseDrain = currentCamera.type === 'mirrorless' ? 0.45 : 0.18;
    const interval = setInterval(() => {
      setBatteryLevel((level) => {
        if (level <= 0) return 0;
        const previewDrain = exposurePreviewEnabled ? 0.12 : 0;
        const monitorDrain = (waveformEnabled ? 0.08 : 0) + (zebraEnabled ? 0.06 : 0);
        const drain = baseDrain + previewDrain + monitorDrain;
        return Math.max(0, level - drain);
      });
    }, 15000);
    return () => clearInterval(interval);
  }, [currentCamera, exposurePreviewEnabled, waveformEnabled, zebraEnabled]);

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
      setFocusLocked(false);
    }, 220);
    setTimeout(() => {
      setIsFlipped(false);
    }, 820);
  };

  const handleCapture = () => {
    if (batteryLevel <= 1) return;
    setFocusLocked((locked) => locked || !autoFocus);
    if (currentCamera.type === 'dslr') {
      setIsBlackout(true);
      setTimeout(() => setIsBlackout(false), currentCamera.blackoutMs);
    }
    const drain = flashEnabled ? 2.4 : 1.2;
    setBatteryLevel((level) => Math.max(0, level - drain));
    if (flashEnabled) {
      setShowFlashBurst(true);
      setAmbientLux((lux) => Math.min(10, lux + 0.6));
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
    const tintOffset = (filmProfile?.tint ?? 0) / 100;
    const cool = Math.max(0, 0.5 - normalized - tintOffset) * 240;
    const warm = Math.max(0, normalized + tintOffset - 0.5) * 200;
    return { cool, warm };
  }, [whiteBalance, filmProfile]);

  const isoBrightness = useMemo(() => {
    if (!exposurePreviewActive) {
      return 1;
    }
    const baseIso = currentCamera.iso.base || 100;
    const isoFactor = iso / baseIso;
    const baseShutter = 1 / 125;
    const shutterFactor = shutter.value > 0 ? baseShutter / shutter.value : 1;
    const apertureFactor = (2.8 / aperture) * (2.8 / aperture);
    const exposureLog = Math.log2(Math.max(isoFactor * shutterFactor * apertureFactor, 0.01));
    const luxComp = (ambientLux - 5) * 0.04;
    const compensation = exposureComp * 0.1;
    const brightness = 1 + exposureLog * 0.12 + compensation - luxComp;
    return Math.min(1.4, Math.max(0.5, brightness));
  }, [
    exposurePreviewActive,
    currentCamera.iso.base,
    iso,
    shutter.value,
    aperture,
    ambientLux,
    exposureComp,
  ]);

  const waveformValues = useMemo(
    () =>
      Array.from({ length: 28 }, (_, index) => {
        const base = isoBrightness * 70 + exposureComp * 8;
        const oscillation = Math.sin(index * 0.42 + ambientLux) * 12;
        return Math.max(4, Math.min(100, base + oscillation));
      }),
    [isoBrightness, ambientLux, exposureComp],
  );

  const grainStrength = useMemo(() => {
    const baseIso = currentCamera.iso.base || 100;
    const isoRatio = Math.max(1, iso / baseIso);
    const grainBase = Math.min(0.5, 0.08 + Math.log2(isoRatio) * 0.12);
    return grainBase + (filmProfile?.grain ?? 0);
  }, [iso, currentCamera.iso.base, filmProfile]);

  const blurStrength = useMemo(() => {
    const open = Math.max(0.2, 3 - Math.log(aperture));
    const sensorInfluence = 1 / sensorCrop;
    return open * 14 * lens.bokehFactor * sensorInfluence;
  }, [aperture, lens.bokehFactor, sensorCrop]);

  const focusRadius = useMemo(() => {
    const base = aperture <= lens.maxAperture + 0.2 ? 9 : 14;
    if (aperture <= 1.4) return base;
    if (aperture <= 1.8) return base + 5;
    if (aperture <= 2.8) return base + 11;
    if (aperture <= 4) return base + 17;
    return base + 26;
  }, [aperture, lens.maxAperture]);

  const hudIsVisible = hudMode !== 'off';
  const minimalHud = hudMode === 'minimal';
  const isCinematicHud = hudStyle === 'cinematic';
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
        <AnimatePresence>
          {isBlackout && (
            <motion.div
              className="pointer-events-none absolute inset-0 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.08 }}
              style={{ background: 'rgba(0,0,0,0.85)' }}
            />
          )}
        </AnimatePresence>

        <main className="relative z-10 flex min-h-screen flex-col">
          <header className="flex flex-col gap-6 px-8 pb-4 pt-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className={`text-xs uppercase tracking-[0.35em] ${hudAccent}`}>Immersive Portfolio Mode</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                Menelek Makonnen — Director · Photographer · Author
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/70 md:text-base">
                Move through this portfolio as if you were behind the lens. Dial settings, swap lenses, and feel how
                exposure, depth of field, and color science reshape the stories, reels, books, and experiences that live
                here.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/50">
                <span className={`${accentClass} font-medium`}>{currentBrand.brand} · {currentCamera.name}</span>
                <span>{currentCamera.sensor.label}</span>
                <span>{lens.name}</span>
                <span>{shutterMode === 'electronic' ? 'Electronic' : 'Mechanical'} · {activeFps || '—'} fps</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-4">
              <div className="flex flex-wrap items-center justify-end gap-3">
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
                <button
                  onClick={() => setAutoFocus((value) => !value)}
                  className={`group flex items-center gap-3 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                    autoFocus
                      ? 'border-emerald-300/70 bg-emerald-300/10 text-emerald-200'
                      : 'border-white/20 bg-white/5 hover:border-white/50 hover:bg-white/10'
                  }`}
                >
                  <ToggleRight size={16} /> {autoFocus ? 'AF Servo' : 'Manual Focus'}
                </button>
              </div>
              <div className="flex items-center gap-3 text-xs uppercase tracking-[0.3em] text-white/60">
                <span>Battery</span>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-20 rounded-full border border-white/30">
                    <div
                      className={`h-full rounded-full ${batteryLevel < 15 ? 'bg-rose-400' : 'bg-amber-200'}`}
                      style={{ width: `${Math.max(0, Math.min(100, batteryLevel))}%` }}
                    />
                  </div>
                  <span className={batteryLevel < 15 ? 'text-rose-300' : 'text-white/70'}>
                    {Math.max(0, Math.round(batteryLevel))}%
                  </span>
                </div>
                <span className="hidden md:inline text-white/40">HUD · {hudStyle === 'cinematic' ? 'Cinematic' : 'Literal'}</span>
              </div>
            </div>
          </header>

          <section className="relative flex flex-1 flex-col pb-36">
            <div
              ref={viewfinderRef}
              className={`relative mx-auto flex w-full max-w-6xl flex-1 flex-col overflow-hidden rounded-[32px] border border-white/10 bg-black/30 shadow-[0_40px_120px_-40px_rgba(0,0,0,0.8)] backdrop-blur-3xl transition-transform duration-700 ${
                isFlipped ? 'rotate-180' : ''
              }`}
              style={{
                cursor: batteryLevel <= 1 ? 'not-allowed' : 'none',
                filter: `${filmIsMonochrome ? 'grayscale(1) ' : ''}contrast(${contrastValue}) brightness(${isoBrightness}) saturate(${saturationValue})`,
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

              {zebraEnabled && (
                <div
                  className="pointer-events-none absolute inset-0 z-30"
                  style={{
                    opacity: Math.min(0.35, Math.max(0, isoBrightness - 0.9)),
                    backgroundImage:
                      'repeating-linear-gradient(135deg, rgba(255,255,255,0.35) 0, rgba(255,255,255,0.35) 6px, transparent 6px, transparent 12px)',
                    mixBlendMode: 'screen',
                  }}
                />
              )}

              {waveformEnabled && (
                <div className="pointer-events-none absolute bottom-6 left-6 z-40 h-24 w-44 rounded-xl border border-white/20 bg-black/60 p-3 backdrop-blur-md">
                  <div className="flex h-full items-end gap-[3px]">
                    {waveformValues.map((value, index) => (
                      <div
                        key={index}
                        className="w-full rounded-sm bg-emerald-300/80"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                  <p className="mt-2 text-[0.55rem] uppercase tracking-[0.3em] text-white/50">Waveform</p>
                </div>
              )}

              {isCinematicHud && (
                <div className="pointer-events-none absolute inset-0 z-20">
                  <div className="absolute inset-x-[12%] top-1/2 h-px bg-white/25" />
                  <div className="absolute inset-y-[18%] left-1/2 w-px bg-white/20" />
                  <div className="absolute inset-x-[18%] bottom-[12%] h-12 border border-white/20" />
                </div>
              )}

              <div
                className="relative z-10 flex flex-1 flex-col overflow-auto px-10 py-12 text-white"
                style={{
                  transform: `scale(${viewScale})`,
                  transformOrigin: '50% 48%',
                }}
              >
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
                  animate={{ opacity: minimalHud ? 0.35 : isCinematicHud ? 0.65 : 0.8 }}
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
                    {isCinematicHud ? (
                      <>
                        <div className="h-16 w-16 border border-emerald-200/60" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="h-px w-16 bg-emerald-200/40" />
                          <span className="absolute h-16 w-px bg-emerald-200/40" />
                        </div>
                        <div className="absolute -bottom-6 text-[0.55rem] tracking-[0.35em] text-emerald-200/70">
                          {isFocusing ? 'CALIBRATING' : 'LOCKED'}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="h-16 w-16 rounded-full border-2 border-amber-200/80 shadow-[0_0_40px_rgba(255,191,105,0.25)]" />
                        <div className="absolute inset-1 rounded-full border border-amber-200/30" />
                        <div className="absolute inset-1 flex items-center justify-center text-[0.55rem] font-medium tracking-[0.4em] text-amber-100/80">
                          {isFocusing ? 'AF' : 'LOCK'}
                        </div>
                      </>
                    )}
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
                  animate={{ opacity: minimalHud ? 0.45 : isCinematicHud ? 0.7 : 0.95, y: 0 }}
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

              {batteryLevel <= 2 && (
                <div className="pointer-events-none absolute inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
                  <div className="rounded-3xl border border-rose-400/60 bg-black/80 px-8 py-6 text-center text-xs uppercase tracking-[0.35em] text-rose-200">
                    Battery depleted · swap pack to keep shooting
                  </div>
                </div>
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
                  {hudStyles.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setHudStyle(style.id)}
                      className={`rounded-full border px-4 py-2 transition ${
                        hudStyle === style.id
                          ? 'border-white/60 bg-white/15 text-white'
                          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/50 hover:text-white/90'
                      }`}
                    >
                      {style.label}
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
                  title="Camera Brand"
                  icon={Camera}
                  value={currentBrand.brand}
                  subtitle="Switch camera ecosystem"
                >
                  <div className="mt-3 flex flex-wrap gap-2">
                    {cameraSystems.map((brand, index) => (
                      <button
                        key={brand.brand}
                        onClick={() => setBrandIndex(index)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                          brandIndex === index
                            ? 'border-white/70 bg-white/15 text-white'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                        }`}
                      >
                        {brand.brand}
                      </button>
                    ))}
                  </div>
                </ControlCard>

                <ControlCard
                  title="Camera Body"
                  icon={Settings2}
                  value={currentCamera.name}
                  subtitle={currentCamera.notes}
                >
                  <div className="mt-3 grid gap-2">
                    {currentBrand.models.map((model, index) => (
                      <button
                        key={model.id}
                        onClick={() => setModelIndex(index)}
                        className={`flex flex-col rounded-2xl border px-4 py-3 text-left transition ${
                          modelIndex === index
                            ? 'border-amber-300/80 bg-amber-300/15 text-amber-100'
                            : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
                        }`}
                      >
                        <span className="text-sm font-medium">{model.name}</span>
                        <span className="text-[0.55rem] uppercase tracking-[0.3em] text-white/40">{model.sensor.label}</span>
                      </button>
                    ))}
                  </div>
                </ControlCard>

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
                  title="Viewfinder Mode"
                  icon={Cloudy}
                  value={
                    exposurePreviewActive
                      ? 'Exposure Preview'
                      : currentCamera.type === 'dslr'
                      ? 'Optical Finder'
                      : 'OVF Simulation'
                  }
                  subtitle="Toggle EVF exposure simulation and shutter type"
                >
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      onClick={() => setExposurePreviewEnabled(true)}
                      disabled={currentCamera.type === 'dslr'}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                        exposurePreviewEnabled
                          ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                      } ${currentCamera.type === 'dslr' ? 'cursor-not-allowed opacity-40' : ''}`}
                    >
                      Exposure Preview
                    </button>
                    <button
                      onClick={() => setExposurePreviewEnabled(false)}
                      className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                        !exposurePreviewEnabled
                          ? 'border-white/60 bg-white/15 text-white'
                          : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                      }`}
                    >
                      OVF Style
                    </button>
                  </div>
                  {currentCamera.shutter.hasElectronic && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        onClick={() => setShutterMode('mechanical')}
                        disabled={currentCamera.shutter.mechanicalDisabled}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                          shutterMode === 'mechanical'
                            ? 'border-amber-300/80 bg-amber-300/15 text-amber-100'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                        } ${currentCamera.shutter.mechanicalDisabled ? 'cursor-not-allowed opacity-40' : ''}`}
                      >
                        Mechanical
                      </button>
                      <button
                        onClick={() => setShutterMode('electronic')}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                          shutterMode === 'electronic'
                            ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                        }`}
                      >
                        Electronic
                      </button>
                    </div>
                  )}
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

                {currentBrand.brand === 'Fujifilm' && (
                  <ControlCard
                    title="Film Simulation"
                    icon={Wand2}
                    value={filmSimulationPresets[filmSimulation]?.label ?? filmSimulation}
                    subtitle="Colour science & tonal response"
                  >
                    <div className="mt-3 flex flex-wrap gap-2">
                      {Object.entries(filmSimulationPresets).map(([id, preset]) => (
                        <button
                          key={id}
                          onClick={() => setFilmSimulation(id)}
                          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                            filmSimulation === id
                              ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                              : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </ControlCard>
                )}

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

                {!essentialsOnly && (
                  <ControlCard
                    title="Assist Tools"
                    icon={Droplets}
                    value={`${zebraEnabled ? 'Zebra ' : ''}${waveformEnabled ? 'Waveform' : !zebraEnabled ? 'Off' : ''}`.trim() || 'Off'}
                    subtitle="Expose with zebras & waveform"
                  >
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button
                        onClick={() => setZebraEnabled((value) => !value)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                          zebraEnabled
                            ? 'border-amber-300/80 bg-amber-300/15 text-amber-100'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                        }`}
                      >
                        Zebra
                      </button>
                      <button
                        onClick={() => setWaveformEnabled((value) => !value)}
                        className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.25em] transition ${
                          waveformEnabled
                            ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                            : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
                        }`}
                      >
                        Waveform
                      </button>
                    </div>
                  </ControlCard>
                )}

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
                      setBrandIndex(0);
                      setModelIndex(0);
                      setLensIndex(0);
                      setIsoIndex(0);
                      setApertureIndex(0);
                      setShutterIndex(0);
                      setWhiteBalance(5600);
                      setExposureComp(0);
                      setAutoFocus(true);
                      setFocusLocked(false);
                      setHudMode('full');
                      setHudStyle('literal');
                      setControlMode('all');
                      setHudExpanded(true);
                      setFlashEnabled(false);
                      setDarkMode(true);
                      setExposurePreviewEnabled(cameraSystems[0].models[0].exposurePreview);
                      setShutterMode(
                        cameraSystems[0].models[0].type === 'dslr' ? 'mechanical' : 'electronic',
                      );
                      setZebraEnabled(false);
                      setWaveformEnabled(false);
                      setFilmSimulation('Provia');
                      setAmbientLux(4);
                      setBatteryLevel(100);
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
