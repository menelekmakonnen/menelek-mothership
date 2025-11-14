import { useEffect, useMemo, useRef, useState } from 'react';
import Head from 'next/head';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Aperture,
  Camera,
  CloudSun,
  Cloudy,
  Flashlight,
  Gauge,
  Moon,
  Play,
  Sun,
  ToggleRight,
  Upload,
  Vibrate,
  Video,
  Wand2,
} from 'lucide-react';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

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
    baseFov: 1,
    minFocal: 50,
    maxFocal: 50,
    defaultFocal: 50,
    referenceFocal: 50,
    bokehFactor: 1.05,
    maxAperture: 1.8,
    minAperture: 22,
    description: 'Balanced classic with cinematic compression and creamy falloff.',
    category: 'Standard Prime',
  },
  {
    id: '35-14',
    name: '35mm f/1.4 Prime',
    subtitle: 'Everyday auteur',
    vignette: 0.12,
    baseFov: 1.22,
    minFocal: 35,
    maxFocal: 35,
    defaultFocal: 35,
    referenceFocal: 35,
    bokehFactor: 0.9,
    maxAperture: 1.4,
    minAperture: 22,
    description: 'Natural perspective ideal for narrative coverage and reportage.',
    category: 'Wide Prime',
  },
  {
    id: '85-14',
    name: '85mm f/1.4 Prime',
    subtitle: 'Intimate focus',
    vignette: 0.08,
    baseFov: 0.72,
    minFocal: 85,
    maxFocal: 85,
    defaultFocal: 85,
    referenceFocal: 85,
    bokehFactor: 1.4,
    maxAperture: 1.4,
    minAperture: 22,
    description: 'Elegant compression and flattering depth for character-driven work.',
    category: 'Portrait Prime',
  },
  {
    id: '135-2',
    name: '135mm f/2 Prime',
    subtitle: 'Sculpted telephoto',
    vignette: 0.06,
    baseFov: 0.55,
    minFocal: 135,
    maxFocal: 135,
    defaultFocal: 135,
    referenceFocal: 135,
    bokehFactor: 1.6,
    maxAperture: 2,
    minAperture: 22,
    description: 'Iconic portrait tele with dramatic compression and lush bokeh.',
    category: 'Tele Prime',
  },
  {
    id: '24-70',
    name: '24-70mm f/2.8 Zoom',
    subtitle: 'Workhorse versatility',
    vignette: 0.14,
    baseFov: 1.32,
    minFocal: 24,
    maxFocal: 70,
    defaultFocal: 35,
    referenceFocal: 35,
    bokehFactor: 1,
    maxAperture: 2.8,
    minAperture: 22,
    description: 'From establishing frames to intimate close-ups without swapping glass.',
    category: 'Standard Zoom',
  },
  {
    id: '70-200',
    name: '70-200mm f/2.8 Zoom',
    subtitle: 'Ceremony staple',
    vignette: 0.1,
    baseFov: 0.7,
    minFocal: 70,
    maxFocal: 200,
    defaultFocal: 135,
    referenceFocal: 135,
    bokehFactor: 1.45,
    maxAperture: 2.8,
    minAperture: 22,
    description: 'Compression king for weddings, fashion runways, and sports drama.',
    category: 'Tele Zoom',
  },
  {
    id: '16-35',
    name: '16-35mm f/2.8 Zoom',
    subtitle: 'Immersive explorer',
    vignette: 0.2,
    baseFov: 1.6,
    minFocal: 16,
    maxFocal: 35,
    defaultFocal: 24,
    referenceFocal: 24,
    bokehFactor: 0.65,
    maxAperture: 2.8,
    minAperture: 22,
    description: 'Pulls you into the scene with wide vistas and architectural drama.',
    category: 'Ultra Wide',
  },
  {
    id: '100-400',
    name: '100-400mm f/4.5-5.6 Zoom',
    subtitle: 'Expedition reach',
    vignette: 0.08,
    baseFov: 0.42,
    minFocal: 100,
    maxFocal: 400,
    defaultFocal: 220,
    referenceFocal: 220,
    bokehFactor: 1.55,
    maxAperture: 4.5,
    minAperture: 32,
    description: 'Wildlife and sports tele zoom that collapses distance and isolates action.',
    category: 'Super Tele',
  },
  {
    id: '100-macro',
    name: '100mm f/2.8 Macro',
    subtitle: 'Detail alchemist',
    vignette: 0.09,
    baseFov: 0.68,
    minFocal: 100,
    maxFocal: 100,
    defaultFocal: 100,
    referenceFocal: 100,
    bokehFactor: 1.5,
    maxAperture: 2.8,
    minAperture: 32,
    description: 'True 1:1 reproduction with razor-thin focus planes for texture studies.',
    category: 'Macro',
  },
  {
    id: '24-105',
    name: '24-105mm f/4 Zoom',
    subtitle: 'Travel documentarian',
    vignette: 0.15,
    baseFov: 1.22,
    minFocal: 24,
    maxFocal: 105,
    defaultFocal: 45,
    referenceFocal: 45,
    bokehFactor: 0.95,
    maxAperture: 4,
    minAperture: 22,
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

const apertureStopsBase = [1.2, 1.4, 1.8, 2, 2.8, 4, 5.6, 8, 11, 16, 22, 32];
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
  { id: 'all', label: 'All Controls' },
  { id: 'essential', label: 'Essential' },
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
      'Lifestyle, editorial, and commercial commissions with a signature speculative aesthetic.',
    cta: { label: 'Open Gallery', href: '#photo', icon: Camera },
  },
  {
    id: 'books',
    badge: 'Literature & Worldbuilding',
    title: 'Novels & Lore',
    description:
      'LoreMaker Universe volumes, speculative fiction, and non-fiction explorations on creativity and futurism.',
    cta: { label: 'Read the Library', href: '#books', icon: Wand2 },
  },
  {
    id: 'education',
    badge: 'Education',
    title: 'AI Starterclass',
    description:
      'Hybrid class guiding creators through AI-assisted storytelling, production, and post workflows.',
    cta: { label: 'Join the Class', href: '#ai-class', icon: CloudSun },
  },
  {
    id: 'contact',
    badge: 'Collaborations',
    title: 'Connect & Collaborate',
    description:
      'Bookings, speaking, and bespoke creative systems for brands, studios, and storytellers.',
    cta: { label: 'Contact Studio', href: '#contact', icon: Cloudy },
  },
];

const luxuryGradient =
  'radial-gradient(circle at top, rgba(6, 10, 24, 0.9), rgba(4, 8, 18, 0.88) 40%, rgba(3, 4, 10, 0.95) 90%)';
const defaultBackdrop =
  "url('https://images.unsplash.com/photo-1520350094750-9a9b7e0f2267?auto=format&fit=crop&w=1920&q=80')";


export default function CameraPage() {
  const [brandIndex, setBrandIndex] = useState(0);
  const [modelIndex, setModelIndex] = useState(0);
  const [lensIndex, setLensIndex] = useState(0);
  const [isoIndex, setIsoIndex] = useState(0);
  const [apertureIndex, setApertureIndex] = useState(0);
  const [shutterIndex, setShutterIndex] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState(5600);
  const [exposureComp, setExposureComp] = useState(0);
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [focusLocked, setFocusLocked] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [showFlashBurst, setShowFlashBurst] = useState(false);
  const [hudMode, setHudMode] = useState('full');
  const [hudStyle, setHudStyle] = useState('literal');
  const [controlMode, setControlMode] = useState('all');
  const [hudExpanded, setHudExpanded] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [exposurePreviewEnabled, setExposurePreviewEnabled] = useState(true);
  const [shutterMode, setShutterMode] = useState('electronic');
  const [zebraEnabled, setZebraEnabled] = useState(false);
  const [waveformEnabled, setWaveformEnabled] = useState(false);
  const [filmSimulation, setFilmSimulation] = useState('Provia');
  const [ambientLux, setAmbientLux] = useState(4);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const [cursorPoint, setCursorPoint] = useState({ x: 50, y: 50 });
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });
  const [focusDepth, setFocusDepth] = useState(0.5);
  const [userImage, setUserImage] = useState(null);
  const [focalLength, setFocalLength] = useState(lenses[0].defaultFocal);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isBlackout, setIsBlackout] = useState(false);

  const cursorTargetRef = useRef({ x: 50, y: 50 });
  const focusTimeoutRef = useRef(null);
  const viewfinderRef = useRef(null);
  const fileInputRef = useRef(null);

  const currentBrand = cameraSystems[brandIndex];
  const currentCamera = currentBrand.models[modelIndex] ?? currentBrand.models[0];
  const lens = lenses[lensIndex];
  const isZoomLens = lens.minFocal !== lens.maxFocal;
  const lensRange = lens.maxFocal - lens.minFocal;
  const referenceFocal = lens.referenceFocal ?? lens.defaultFocal ?? lens.minFocal ?? lens.maxFocal ?? 50;
  const focalRatio = lensRange > 0 ? (focalLength - lens.minFocal) / lensRange : 0;

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

  const effectiveFov = Math.max(
    0.36,
    Math.min(1.75, ((lens.baseFov ?? 1) * (referenceFocal / focalLength)) / sensorCrop),
  );
  const viewScale = 1 / effectiveFov;
  const contrastValue = (1.05 + (focalLength / referenceFocal) * 0.08) * filmContrast;
  const saturationValue = (1 + (whiteBalance - 5600) / 9000) * (filmSaturation || 1);
  const zoomPerspective = lens.perspective + (focalRatio - 0.5) * 18;
  const ambientZoomScale = 1 + focalRatio * 0.45;
  const activeFps =
    shutterMode === 'electronic'
      ? currentCamera.fps.electronic || currentCamera.fps.mechanical
      : currentCamera.fps.mechanical || currentCamera.fps.electronic;

useEffect(() => {
  cursorTargetRef.current = cursorPoint;
}, []);

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
  setFocalLength(lens.defaultFocal ?? lens.referenceFocal ?? lens.minFocal ?? lens.maxFocal);
  setFocusDepth(0.5);
}, [lens]);

useEffect(() => {
  const baseDrain = currentCamera.type === 'mirrorless' ? 0.45 : 0.18;
  const interval = setInterval(() => {
    setBatteryLevel((level) => {
      if (level <= 0) return 0;
      const previewDrain = exposurePreviewEnabled ? 0.12 : 0;
      const monitorDrain = (waveformEnabled ? 0.08 : 0) + (zebraEnabled ? 0.06 : 0);
      const zoomDrain = isZoomLens ? 0.05 * (focalRatio + 0.2) : 0;
      const drain = baseDrain + previewDrain + monitorDrain + zoomDrain;
      return Math.max(0, level - drain);
    });
  }, 15000);
  return () => clearInterval(interval);
}, [currentCamera, exposurePreviewEnabled, waveformEnabled, zebraEnabled, isZoomLens, focalRatio]);

useEffect(() => {
  const timer = setInterval(() => {
    setAmbientLux((prev) => {
      const delta = (Math.random() - 0.5) * 0.4;
      return Math.max(0, Math.min(10, prev + delta));
    });
  }, 4000);
  return () => clearInterval(timer);
}, []);

useEffect(() => {
  let animationFrame;
  const animate = () => {
    setCursorPoint((prev) => {
      const target = cursorTargetRef.current;
      const dx = target.x - prev.x;
      const dy = target.y - prev.y;
      if (Math.abs(dx) < 0.05 && Math.abs(dy) < 0.05) {
        return prev;
      }
      return { x: prev.x + dx * 0.18, y: prev.y + dy * 0.18 };
    });
    animationFrame = requestAnimationFrame(animate);
  };
  animationFrame = requestAnimationFrame(animate);
  return () => cancelAnimationFrame(animationFrame);
}, []);

useEffect(() => {
  const handleWheel = (event) => {
    if (!viewfinderRef.current) return;
    if (!viewfinderRef.current.contains(event.target)) return;
    event.preventDefault();
    const delta = event.deltaY * 0.0009;
    setFocusDepth((depth) => clamp(depth + delta, 0, 1));
    setIsFocusing(true);
    setFocusLocked(false);
    if (focusTimeoutRef.current) {
      clearTimeout(focusTimeoutRef.current);
    }
    focusTimeoutRef.current = setTimeout(() => {
      setIsFocusing(false);
      setFocusLocked(true);
    }, 380);
  };
  window.addEventListener('wheel', handleWheel, { passive: false });
  return () => window.removeEventListener('wheel', handleWheel);
}, []);

useEffect(() => {
  document.body.style.background = darkMode
    ? 'radial-gradient(circle at top, rgba(9, 12, 25, 0.96), #03050a 58%)'
    : 'radial-gradient(circle at bottom, rgba(255, 255, 255, 0.92), #f7f3eb 60%)';
  document.body.style.color = darkMode ? '#ffffff' : '#050505';
  document.body.style.overflow = 'hidden';
  document.documentElement.style.overflow = 'hidden';
  return () => {
    document.body.style.background = '';
    document.body.style.color = '';
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  };
}, [darkMode]);

useEffect(() => () => focusTimeoutRef.current && clearTimeout(focusTimeoutRef.current), []);

const handleViewfinderMove = (event) => {
  if (!viewfinderRef.current) return;
  const rect = viewfinderRef.current.getBoundingClientRect();
  const x = ((event.clientX - rect.left) / rect.width) * 100;
  const y = ((event.clientY - rect.top) / rect.height) * 100;
  const coords = { x, y };
  cursorTargetRef.current = coords;
  if (!autoFocus) {
    setFocusPoint(coords);
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

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (loadEvent) => {
    const result = loadEvent.target?.result;
    if (typeof result === 'string') {
      setUserImage(`url('${result}')`);
    }
  };
  reader.readAsDataURL(file);
};

const openUploadDialog = () => {
  fileInputRef.current?.click();
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
  const zoomInfluence = Math.pow(focalLength / referenceFocal, 0.82);
  const depthInfluence = 0.7 + Math.abs(focusDepth - 0.5) * 1.9;
  return open * 14 * lens.bokehFactor * sensorInfluence * zoomInfluence * depthInfluence;
}, [aperture, lens.bokehFactor, sensorCrop, focalLength, referenceFocal, focusDepth]);

const focusRadius = useMemo(() => {
  const base = aperture <= lens.maxAperture + 0.2 ? 9 : 14;
  const depthAdjust = focusDepth * 22;
  const zoomAdjust = lensRange > 0 ? focalRatio * 8 : 3;
  return base + depthAdjust + zoomAdjust;
}, [aperture, lens.maxAperture, focusDepth, focalRatio, lensRange]);

const focusFeather = useMemo(() => 18 + Math.abs(focusDepth - 0.5) * 28, [focusDepth]);

const hudIsVisible = hudMode !== 'off';
const minimalHud = hudMode === 'minimal';
const isCinematicHud = hudStyle === 'cinematic';
const controlsVisible = controlMode !== 'off';
const essentialsOnly = controlMode === 'essential';

const focusIndicatorOpacity = useMemo(() => {
  if (batteryLevel <= 1) return 0.2;
  if (isFocusing) return 0.9;
  if (!focusLocked) return 0.6;
  return 0.35;
}, [batteryLevel, isFocusing, focusLocked]);

return (
  <>
    <Head>
      <title>Menelek Makonnen — Immersive Camera Portfolio</title>
      <meta
        name="description"
        content="An interactive cinematic experience exploring Menelek Makonnen's film, photography, writing, and immersive universes."
      />
    </Head>
    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
    <div className={`relative h-screen w-screen overflow-hidden ${darkMode ? 'text-white' : 'text-slate-900'} transition-colors duration-700`}>
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: luxuryGradient,
          opacity: darkMode ? 0.52 : 0.28,
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

      <main className="relative z-10 h-full w-full">
        <div
          ref={viewfinderRef}
          className={`relative flex h-full w-full flex-col overflow-hidden bg-black/50 ${batteryLevel <= 1 ? 'cursor-not-allowed' : 'cursor-none'}`}
          style={{
            transition: 'transform 0.7s ease',
            transform: isFlipped ? 'rotate(180deg)' : 'none',
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
            className="absolute inset-0"
            style={{
              background: `linear-gradient(135deg, rgba(25, 36, 69, ${darkMode ? 0.72 : 0.32}), transparent 30%), linear-gradient(120deg, rgba(${160 + whiteBalanceTint.warm / 2}, ${120 + whiteBalanceTint.cool / 4}, ${200 + whiteBalanceTint.cool}, ${darkMode ? 0.14 : 0.28}), rgba(0, 0, 0, 0))`,
            }}
          />

          <div className="absolute inset-0 overflow-hidden">
            <div
              className="absolute inset-0 scale-105"
              style={{
                backgroundImage: userImage ?? defaultBackdrop,
                backgroundSize: `${ambientZoomScale * 110}% auto`,
                backgroundPosition: 'center',
                filter: `contrast(${filmContrast * 1.04}) saturate(${saturationValue})`,
                transform: `scale(${1 + focalRatio * 0.38}) translateZ(0)`,
                transition: 'transform 0.5s ease, filter 0.4s ease',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(${45 + zoomPerspective}deg, rgba(0,0,0,${darkMode ? 0.38 : 0.2}), transparent 48%)`,
              }}
            />

            <div
              className="relative z-10 flex h-full w-full flex-col justify-center px-12 py-14 text-white"
              style={{
                transform: `scale(${viewScale})`,
                transformOrigin: '50% 48%',
              }}
            >
              <div className="flex flex-col gap-6 pb-4">
                <p className={`text-xs uppercase tracking-[0.35em] ${hudAccent}`}>Immersive Portfolio Mode</p>
                <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                      Menelek Makonnen — Director · Photographer · Author
                    </h1>
                    <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/80 md:text-base">
                      Navigate this portfolio through a responsive cinema camera. Dial settings, swap optics, and feel how exposure, depth,
                      and colour science reshape every reel, book, commission, and collaboration.
                    </p>
                  </div>
                  <div className="flex flex-wrap justify-end gap-2 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
                    <span className={`${accentClass} font-medium`}>{currentBrand.brand}</span>
                    <span>{currentCamera.name}</span>
                    <span>{currentCamera.sensor.label}</span>
                    <span>{lens.name}</span>
                    <span>{shutterMode === 'electronic' ? 'Electronic' : 'Mechanical'} · {activeFps || '—'} fps</span>
                  </div>
                </div>
              </div>

              <div className="grid gap-6 pb-6 md:grid-cols-2 xl:grid-cols-3">
                {contentSections.map((section, index) => {
                  const Icon = section.cta.icon;
                  const delay = index * 0.05;
                  return (
                    <motion.article
                      key={section.id}
                      className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/10 p-6 shadow-[0_24px_80px_-40px_rgba(0,0,0,0.9)] backdrop-blur-2xl transition hover:border-white/30 hover:bg-white/20"
                      initial={{ opacity: 0, y: 18 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay, duration: 0.5 }}
                    >
                      <span className="text-[0.6rem] uppercase tracking-[0.28em] text-amber-200/70">{section.badge}</span>
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
          </div>

  {waveformEnabled && (
    <div className="pointer-events-none absolute bottom-8 left-8 z-40 h-24 w-44 rounded-xl border border-white/20 bg-black/60 p-3 backdrop-blur-md">
      <div className="flex h-full items-end gap-[3px]">
        {waveformValues.map((value, index) => (
          <div key={index} className="w-full rounded-sm bg-emerald-300/80" style={{ height: `${value}%` }} />
        ))}
      </div>
      <p className="mt-2 text-[0.55rem] uppercase tracking-[0.3em] text-white/50">Waveform</p>
    </div>
  )}

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

  {isCinematicHud && (
    <div className="pointer-events-none absolute inset-0 z-20">
      <div className="absolute inset-x-[12%] top-1/2 h-px bg-white/25" />
      <div className="absolute inset-y-[18%] left-1/2 w-px bg-white/20" />
      <div className="absolute inset-x-[18%] bottom-[12%] h-12 border border-white/20" />
    </div>
  )}

  <div
    className="pointer-events-none absolute inset-0"
    style={{
      backdropFilter: `blur(${blurStrength}px)`,
      WebkitBackdropFilter: `blur(${blurStrength}px)`,
      maskImage: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, transparent ${focusRadius}%, rgba(0,0,0,0.8) ${focusRadius + focusFeather}%)`,
      WebkitMaskImage: `radial-gradient(circle at ${focusPoint.x}% ${focusPoint.y}%, transparent ${focusRadius}%, rgba(0,0,0,0.8) ${focusRadius + focusFeather}%)`,
      opacity: aperture <= 2.8 ? 0.85 : 0.65,
      transition: 'mask-image 0.3s ease, opacity 0.3s ease',
    }}
  />

  <div
    className="pointer-events-none absolute"
    style={{
      left: `${cursorPoint.x}%`,
      top: `${cursorPoint.y}%`,
      transform: 'translate(-50%, -50%)',
    }}
  >
    <div
      className="h-16 w-16 rounded-full border border-white/70"
      style={{
        opacity: focusIndicatorOpacity,
        boxShadow: focusLocked
          ? '0 0 24px rgba(255,255,255,0.25)'
          : '0 0 20px rgba(80,255,200,0.3)',
        transition: 'opacity 0.2s ease, box-shadow 0.3s ease',
      }}
    />
    <div className="absolute inset-0 flex items-center justify-center">
      <div
        className={`h-6 w-6 rounded-full border-2 ${focusLocked ? 'border-emerald-300/80' : 'border-white/80'}`}
        style={{ opacity: focusIndicatorOpacity + 0.1 }}
      />
    </div>
  </div>

  {hudIsVisible && hudExpanded && (
    <motion.div
      className="pointer-events-none absolute inset-x-1/2 bottom-7 z-40 w-[min(90%,720px)] -translate-x-1/2 rounded-3xl border border-white/10 bg-black/60 px-6 py-4 text-[0.65rem] uppercase tracking-[0.35em] text-white/80 backdrop-blur-xl"
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

{controlsVisible && (
  <>
    <div className="pointer-events-auto absolute left-8 top-8 flex w-[min(22rem,90vw)] flex-col gap-4">
      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-xs uppercase tracking-[0.28em] text-white/70 backdrop-blur-2xl">
        <p className="text-[0.58rem] text-white/50">Camera Brand</p>
        <div className="mt-2 flex flex-wrap gap-2 text-[0.55rem]">
          {cameraSystems.map((brand, index) => (
            <button
              key={brand.brand}
              onClick={() => setBrandIndex(index)}
              className={`rounded-full border px-3 py-1 transition ${
                brandIndex === index
                  ? 'border-white/80 bg-white/15 text-white'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              {brand.brand}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/80 backdrop-blur-2xl">
        <div className="flex items-center justify-between">
          <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/50">Camera Body</p>
          <span className="text-[0.55rem] uppercase tracking-[0.28em] text-white/40">{currentCamera.sensor.label}</span>
        </div>
        <div className="mt-3 grid gap-2 text-left">
          {currentBrand.models.map((model, index) => (
            <button
              key={model.id}
              onClick={() => setModelIndex(index)}
              className={`flex flex-col rounded-2xl border px-3 py-2 text-left text-[0.68rem] transition ${
                modelIndex === index
                  ? 'border-amber-300/80 bg-amber-300/15 text-amber-100'
                  : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              <span className="text-sm font-medium">{model.name}</span>
              <span className="text-[0.5rem] uppercase tracking-[0.3em] text-white/40">{model.notes}</span>
            </button>
          ))}
        </div>
      </div>
    </div>

    <div className="pointer-events-auto absolute right-8 top-8 flex w-[min(23rem,90vw)] flex-col gap-4">
      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 backdrop-blur-2xl">
        <div className="flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.28em] text-white/70">
          <button
            onClick={() => setFlashEnabled((flash) => !flash)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
              flashEnabled
                ? 'border-amber-300/80 bg-amber-300/15 text-amber-200'
                : 'border-white/20 bg-white/5 hover:border-white/50 hover:text-white'
            }`}
          >
            <Flashlight size={14} />
            {flashEnabled ? 'Flash Ready' : 'Flash Off'}
          </button>
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/50 hover:text-white"
          >
            {darkMode ? <Sun size={14} /> : <Moon size={14} />} {darkMode ? 'Bright' : 'Dark'}
          </button>
          <button
            onClick={() => setAutoFocus((value) => !value)}
            className={`flex items-center gap-2 rounded-full border px-3 py-1 transition ${
              autoFocus
                ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-200'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/50 hover:text-white'
            }`}
          >
            <ToggleRight size={14} /> {autoFocus ? 'AF Servo' : 'Manual'}
          </button>
          <button
            onClick={() => setExposurePreviewEnabled(true)}
            disabled={currentCamera.type === 'dslr'}
            className={`rounded-full border px-3 py-1 transition ${
              exposurePreviewEnabled
                ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/50 hover:text-white'
            } ${currentCamera.type === 'dslr' ? 'cursor-not-allowed opacity-40' : ''}`}
          >
            Preview
          </button>
          <button
            onClick={() => setExposurePreviewEnabled(false)}
            className={`rounded-full border px-3 py-1 transition ${
              !exposurePreviewEnabled
                ? 'border-white/70 bg-white/15 text-white'
                : 'border-white/20 bg-white/5 text-white/70 hover:border-white/50 hover:text-white'
            }`}
          >
            OVF
          </button>
          {currentCamera.shutter.hasElectronic && (
            <button
              onClick={() =>
                setShutterMode((mode) =>
                  mode === 'electronic' && !currentCamera.shutter.mechanicalDisabled ? 'mechanical' : 'electronic',
                )
              }
              className="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/50 hover:text-white"
            >
              {shutterMode === 'electronic' ? 'Electronic' : 'Mechanical'} Shutter
            </button>
          )}
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.28em] text-white/60">
          {hudModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setHudMode(mode.id)}
              className={`rounded-full border px-3 py-1 transition ${
                hudMode === mode.id
                  ? 'border-amber-300/80 bg-amber-300/15 text-amber-200'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              {mode.label}
            </button>
          ))}
          {hudStyles.map((style) => (
            <button
              key={style.id}
              onClick={() => setHudStyle(style.id)}
              className={`rounded-full border px-3 py-1 transition ${
                hudStyle === style.id
                  ? 'border-white/60 bg-white/15 text-white'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              {style.label}
            </button>
          ))}
          {controlModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setControlMode(mode.id)}
              className={`rounded-full border px-3 py-1 transition ${
                controlMode === mode.id
                  ? 'border-white/60 bg-white/10 text-white'
                  : 'border-white/15 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              {mode.label}
            </button>
          ))}
          <button
            onClick={() => setHudExpanded((value) => !value)}
            className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-white/60 transition hover:border-white/50 hover:text-white"
          >
            {hudExpanded ? 'Hide HUD Strip' : 'Show HUD Strip'}
          </button>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-xs uppercase tracking-[0.28em] text-white/60 backdrop-blur-2xl">
        <div className="flex items-center justify-between text-[0.6rem]">
          <span>Battery</span>
          <span className={batteryLevel < 15 ? 'text-rose-300' : 'text-white/70'}>
            {Math.max(0, Math.round(batteryLevel))}%
          </span>
        </div>
        <div className="mt-2 h-3 w-full rounded-full border border-white/30">
          <div
            className={`h-full rounded-full ${batteryLevel < 15 ? 'bg-rose-400' : 'bg-amber-200'}`}
            style={{ width: `${Math.max(0, Math.min(100, batteryLevel))}%` }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-[0.55rem] text-white/50">
          <span>{currentCamera.battery.mode}</span>
          <span>{activeFps || '—'} fps</span>
        </div>
      </div>
    </div>

    <div className="pointer-events-auto absolute left-8 bottom-10 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.28em]">
          <span>Lens Cabinet</span>
          <span className="text-white/40">{lens.category}</span>
        </div>
        <div className="mt-3 grid max-h-60 gap-2 pr-1 text-left">
          {lenses.map((entry, index) => (
            <button
              key={entry.id}
              onClick={() => handleLensChange(index)}
              className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-left text-[0.7rem] transition ${
                lensIndex === index
                  ? 'border-amber-300/80 bg-amber-300/20 text-amber-50 shadow-[0_16px_40px_-24px_rgba(255,191,105,0.6)]'
                  : 'border-white/15 bg-white/5 text-white/70 hover:border-white/40 hover:text-white'
              }`}
            >
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-[0.5rem] uppercase tracking-[0.3em] text-white/40">{entry.subtitle}</p>
              </div>
              <span className="text-[0.55rem] uppercase tracking-[0.3em]">{entry.minFocal === entry.maxFocal ? `${entry.minFocal}mm` : `${entry.minFocal}-${entry.maxFocal}mm`}</span>
            </button>
          ))}
        </div>
      </div>

      {isZoomLens && (
        <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/70 backdrop-blur-2xl">
          <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.28em]">
            <span>Zoom</span>
            <span>{Math.round(focalLength)}mm</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <span className="text-[0.5rem] uppercase tracking-[0.28em] text-white/50">{lens.minFocal}mm</span>
            <input
              type="range"
              min={lens.minFocal}
              max={lens.maxFocal}
              step={1}
              value={focalLength}
              onChange={(event) => setFocalLength(Number(event.target.value))}
              className="h-2 w-48 accent-amber-200"
            />
            <span className="text-[0.5rem] uppercase tracking-[0.28em] text-white/50">{lens.maxFocal}mm</span>
          </div>
        </div>
      )}
    </div>

    <div className="pointer-events-auto absolute right-8 bottom-10 flex flex-col gap-4">
      <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/70 backdrop-blur-2xl">
        <div className="flex items-center justify-between text-[0.58rem] uppercase tracking-[0.28em]">
          <span>White Balance</span>
          <span>{whiteBalance}K</span>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-[0.5rem] uppercase tracking-[0.28em] text-white/50">Warm</span>
          <input
            type="range"
            min={3000}
            max={7500}
            step={100}
            value={whiteBalance}
            onChange={(event) => setWhiteBalance(Number(event.target.value))}
            className="h-2 w-48 accent-sky-200"
          />
          <span className="text-[0.5rem] uppercase tracking-[0.28em] text-white/50">Cool</span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.28em] text-white/60">
          {whiteBalancePresets.map((preset) => (
            <button
              key={preset.label}
              onClick={() => setWhiteBalance(preset.value)}
              className={`rounded-full border px-3 py-1 transition ${
                whiteBalance === preset.value
                  ? 'border-amber-300/80 bg-amber-300/20 text-amber-100'
                  : 'border-white/20 bg-white/5 hover:border-white/50 hover:text-white'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {currentBrand.brand === 'Fujifilm' && (
        <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/70 backdrop-blur-2xl">
          <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/50">Film Simulation</p>
          <div className="mt-3 grid gap-2 text-[0.55rem] uppercase tracking-[0.28em]">
            {Object.entries(filmSimulationPresets).map(([id, preset]) => (
              <button
                key={id}
                onClick={() => setFilmSimulation(id)}
                className={`rounded-full border px-3 py-1 transition ${
                  filmSimulation === id
                    ? 'border-emerald-300/80 bg-emerald-300/15 text-emerald-100'
                    : 'border-white/20 bg-white/5 text-white/60 hover:border-white/50 hover:text-white'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {!essentialsOnly && (
        <div className="rounded-3xl border border-white/15 bg-black/55 p-4 text-white/70 backdrop-blur-2xl">
          <p className="text-[0.58rem] uppercase tracking-[0.28em] text-white/50">Monitoring</p>
          <div className="mt-3 flex flex-wrap gap-2 text-[0.55rem] uppercase tracking-[0.28em]">
            <button
              onClick={() => setZebraEnabled((value) => !value)}
              className={`rounded-full border px-3 py-1 transition ${
                zebraEnabled
                  ? 'border-amber-300/80 bg-amber-300/15 text-amber-100'
                  : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              Zebra
            </button>
            <button
              onClick={() => setWaveformEnabled((value) => !value)}
              className={`rounded-full border px-3 py-1 transition ${
                waveformEnabled
                  ? 'border-emerald-300/70 bg-emerald-300/15 text-emerald-100'
                  : 'border-white/20 bg-white/5 text-white/60 hover:border-white/40 hover:text-white/90'
              }`}
            >
              Waveform
            </button>
            <button
              onClick={openUploadDialog}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1 text-white/70 transition hover:border-white/50 hover:text-white"
            >
              <Upload size={14} /> Upload Scene
            </button>
          </div>
        </div>
      )}
    </div>

    <div className="pointer-events-auto absolute left-1/2 bottom-10 flex -translate-x-1/2 flex-col items-center gap-4">
      <div className="flex items-end gap-4">
        <ExposureDial
          icon={Aperture}
          label="Aperture"
          value={`ƒ/${aperture.toFixed(1)}`}
          minLabel={`ƒ/${lens.maxAperture.toFixed(1)}`}
          maxLabel={`ƒ/${lens.minAperture.toFixed(1)}`}
          min={0}
          max={apertureStops.length - 1}
          step={1}
          sliderValue={apertureIndex}
          onChange={(value) => setApertureIndex(Number(value))}
        />
        <ExposureDial
          icon={Vibrate}
          label="Shutter"
          value={shutter.label}
          minLabel={shutterStops[0]?.label || '1/8000'}
          maxLabel={shutterStops[shutterStops.length - 1]?.label || '30"'}
          min={0}
          max={shutterStops.length - 1}
          step={1}
          sliderValue={shutterIndex}
          onChange={(value) => setShutterIndex(Number(value))}
        />
        <ExposureDial
          icon={Gauge}
          label="ISO"
          value={`ISO ${iso}`}
          minLabel={`${isoStops[0]}`}
          maxLabel={`${isoStops[isoStops.length - 1]}`}
          min={0}
          max={isoStops.length - 1}
          step={1}
          sliderValue={isoIndex}
          onChange={(value) => setIsoIndex(Number(value))}
        />
      </div>
      <div className="flex items-center gap-3 text-[0.6rem] uppercase tracking-[0.3em] text-white/60">
        <button
          onClick={() => setExposureComp((value) => clamp(value - 0.3, -3, 3))}
          className="rounded-full border border-white/20 bg-white/5 px-3 py-1 transition hover:border-white/50 hover:text-white"
        >
          – EC
        </button>
        <span className="text-white/70">{exposureComp.toFixed(1)} EV</span>
        <button
          onClick={() => setExposureComp((value) => clamp(value + 0.3, -3, 3))}
          className="rounded-full border border-white/20 bg-white/5 px-3 py-1 transition hover:border-white/50 hover:text-white"
        >
          + EC
        </button>
        <button
          onClick={handleCapture}
          className="group flex items-center gap-3 rounded-full border border-white/30 bg-white/10 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white transition hover:border-white/80 hover:bg-white/20"
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
            setShutterMode(cameraSystems[0].models[0].type === 'dslr' ? 'mechanical' : 'electronic');
            setZebraEnabled(false);
            setWaveformEnabled(false);
            setFilmSimulation('Provia');
            setAmbientLux(4);
            setBatteryLevel(100);
            setUserImage(null);
          }}
          className="rounded-full border border-white/15 bg-white/5 px-6 py-2 text-xs uppercase tracking-[0.3em] text-white/70 transition hover:border-white/50 hover:text-white"
        >
          Reset Rig
        </button>
      </div>
    </div>

    <div className="pointer-events-none absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-center gap-3 text-[0.55rem] uppercase tracking-[0.3em] text-white/60 md:flex">
      <span>Focus Depth</span>
      <div className="h-48 w-1 rounded-full bg-white/10">
        <div
          className="w-full rounded-full bg-emerald-300/70"
          style={{ height: `${focusDepth * 100}%`, transition: 'height 0.3s ease' }}
        />
      </div>
      <span>{(focusDepth * 100).toFixed(0)}%</span>
    </div>
  </>
)}

        </main>
      </div>
    </>
  );
}

function ExposureDial({ icon: Icon, label, value, minLabel, maxLabel, min, max, step, sliderValue, onChange }) {
  return (
    <div className="rounded-3xl border border-white/15 bg-black/55 px-5 py-4 text-white/70 backdrop-blur-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {Icon && <Icon size={18} className="text-amber-200/80" />}
          <div>
            <p className="text-[0.55rem] uppercase tracking-[0.28em] text-white/50">{label}</p>
            <p className="text-sm font-semibold text-white">{value}</p>
          </div>
        </div>
        <div className="text-[0.5rem] uppercase tracking-[0.28em] text-white/40 flex flex-col items-end">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 h-2 w-56 accent-amber-200"
      />
    </div>
  );
}
