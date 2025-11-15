import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useMemo } from 'react';

const CameraContext = createContext();

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within CameraProvider');
  }
  return context;
};

// Lenses ordered from widest (most zoomed out) to most zoomed in
const LENSES = [
  { id: '16-35mm', name: '16-35mm f/2.8 Wide', focalLength: 25, maxAperture: 2.8, zoom: 0.7 },
  { id: '24-70mm', name: '24-70mm f/2.8', focalLength: 47, maxAperture: 2.8, zoom: 0.85 },
  { id: '35mm', name: '35mm f/1.8 Prime', focalLength: 35, maxAperture: 1.8, zoom: 0.9 }, // Human eye equivalent - DEFAULT
  { id: '50mm', name: '50mm f/1.4 Prime', focalLength: 50, maxAperture: 1.4, zoom: 1 },
  { id: '85mm', name: '85mm f/1.4 Portrait', focalLength: 85, maxAperture: 1.4, zoom: 1.2 },
  { id: '70-200mm', name: '70-200mm f/2.8', focalLength: 135, maxAperture: 2.8, zoom: 1.5 },
];

const WHITE_BALANCE_MODES = {
  daylight: { name: 'Daylight', temp: 5500, tint: 0 },
  cloudy: { name: 'Cloudy', temp: 6500, tint: 10 },
  tungsten: { name: 'Tungsten', temp: 3200, tint: 0 },
  fluorescent: { name: 'Fluorescent', temp: 4000, tint: -10 },
  custom: { name: 'Custom', temp: 5500, tint: 0 },
};

export const CameraProvider = ({ children }) => {
  // Power states
  const [powerState, setPowerState] = useState('off'); // 'off', 'booting', 'on', 'standby'
  const [hasBooted, setHasBooted] = useState(false);

  // Camera type
  const [cameraMode, _setCameraMode] = useState('dslr'); // 'dslr' or 'mirrorless'

  // Battery system
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Camera settings
  const [iso, setIso] = useState(400);
  const [aperture, setAperture] = useState(2.8);
  const [shutterSpeed, setShutterSpeed] = useState(125); // 1/125
  const [exposureComp, setExposureComp] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState('daylight');

  // Lens system - Default to 35mm (human eye equivalent)
  const [currentLens, setCurrentLens] = useState(LENSES[2]); // 35mm lens
  const [lensLayout, setLensLayout] = useState('normal');
  const [isChangingLens, setIsChangingLens] = useState(false);

  // Flash mode
  const [flashMode, setFlashMode] = useState('auto'); // 'auto', 'on', 'off'

  // HUD settings
  const [hudVisibility, setHudVisibility] = useState('standard'); // 'none', 'minimal', 'standard', 'full'

  // Assist tools
  const [ruleOfThirds, setRuleOfThirds] = useState('off');
  const [showHistogram, setShowHistogram] = useState(false);
  const [focusMode, setFocusMode] = useState('single'); // 'single', 'continuous', 'manual'

  // Control boxes state
  const [openBoxes, setOpenBoxes] = useState([]); // Can have max 2 open, start with none

  // Focus system
  const [focusedLayer, setFocusedLayerState] = useState(null);
  const [focusedLayerId, setFocusedLayerId] = useState(null);
  const layerRegistryRef = useRef({});
  const [layerRegistryVersion, setLayerRegistryVersion] = useState(0);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });

  // Section navigation
  const [currentSection, setCurrentSection] = useState(0);

  // Bottom menu visibility
  const [isBottomMenuOpen, setIsBottomMenuOpen] = useState(false);

  // Track if any settings have been changed (for showing reset button)
  const [hasModifiedSettings, setHasModifiedSettings] = useState(false);
  const [resetStage, setResetStage] = useState(0);

  // Lock gestures when secondary layers are active
  const [gestureLockMap, setGestureLockMap] = useState({});

  // Immersive mobile layout
  const [mobileImmersiveMode, setMobileImmersiveMode] = useState(false);

  // Camera skin / presets
  const [activePreset, setActivePreset] = useState(null);
  const manualSettingsRef = useRef(null);

  const baseInterfaceProfiles = useRef({
    dslr: {
      focusPeaking: false,
      zebraHighlight: false,
      waveformMonitor: false,
      horizonLevel: false,
      analogMeter: true,
      cinemaScope: false,
      audioMeters: false,
      filmMatte: false,
    },
    mirrorless: {
      focusPeaking: true,
      zebraHighlight: false,
      waveformMonitor: true,
      horizonLevel: true,
      analogMeter: false,
      cinemaScope: false,
      audioMeters: false,
      filmMatte: false,
    },
  }).current;

  const presetInterfaceProfiles = useRef({
    modern: {
      focusPeaking: true,
      zebraHighlight: true,
      waveformMonitor: true,
      horizonLevel: true,
      analogMeter: false,
      cinemaScope: false,
      audioMeters: false,
      filmMatte: false,
    },
    retro: {
      focusPeaking: false,
      zebraHighlight: false,
      waveformMonitor: false,
      horizonLevel: false,
      analogMeter: true,
      cinemaScope: false,
      audioMeters: false,
      filmMatte: true,
    },
    cinema: {
      focusPeaking: false,
      zebraHighlight: true,
      waveformMonitor: true,
      horizonLevel: true,
      analogMeter: false,
      cinemaScope: true,
      audioMeters: true,
      filmMatte: false,
    },
  }).current;

  const [interfaceModules, setInterfaceModules] = useState({ ...baseInterfaceProfiles.dslr });

  const applyInterfaceProfile = useCallback((profile) => {
    if (!profile) return;
    setInterfaceModules({ ...profile });
  }, []);

  const gestureLock = useMemo(() => Object.keys(gestureLockMap).length > 0, [gestureLockMap]);

  const setGestureLock = useCallback((value) => {
    setGestureLockMap((prev) => {
      if (value) {
        if (prev.manual) return prev;
        return { ...prev, manual: true };
      }
      if (!prev.manual) return prev;
      const { manual, ...rest } = prev;
      return rest;
    });
  }, []);

  const engageGestureLock = useCallback((source) => {
    if (!source) return;
    setGestureLockMap((prev) => {
      if (prev[source]) return prev;
      return { ...prev, [source]: true };
    });
  }, []);

  const releaseGestureLock = useCallback((source) => {
    if (!source) return;
    setGestureLockMap((prev) => {
      if (!prev[source]) return prev;
      const { [source]: _removed, ...rest } = prev;
      return rest;
    });
  }, []);

  const dslrSettingsRef = useRef(null);
  const mirrorlessSettingsRef = useRef(null);

  // Calculate battery based on time of day
  useEffect(() => {
    const updateBattery = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const minutesInDay = 24 * 60 - 1; // 1439 (23:59)
      const clampedMinutes = Math.min(totalMinutes, minutesInDay);
      let batteryPercent = 100 - (clampedMinutes / minutesInDay) * 100;

      if (clampedMinutes < minutesInDay) {
        batteryPercent = Math.max(1, batteryPercent);
      } else {
        batteryPercent = 0;
      }

      setBatteryLevel(Math.round(batteryPercent));

      // Auto reboot at midnight
      if (hours === 0 && minutes === 0 && powerState === 'on') {
        setPowerState('booting');
        setHasBooted(false);
      }
    };

    updateBattery();
    const interval = setInterval(updateBattery, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [powerState]);

  // Check if boot sequence should show (only first load of the day)
  useEffect(() => {
    const lastBoot = localStorage.getItem('lastBootDate');
    const hasBootedThisSession = sessionStorage.getItem('hasBootedThisSession');
    const today = new Date().toDateString();

    if (lastBoot !== today && !hasBootedThisSession) {
      setHasBooted(false);
      localStorage.setItem('lastBootDate', today);
    } else {
      setHasBooted(true);
      setPowerState('on'); // Start powered on if already booted today
    }
  }, []);

  // Power management
  const powerOn = useCallback(() => {
    const needsBoot = !sessionStorage.getItem('hasBootedThisSession');

    if (needsBoot) {
      setPowerState('booting');
      setTimeout(() => {
        setPowerState('on');
        setHasBooted(true);
        sessionStorage.setItem('hasBootedThisSession', 'true');
      }, 3000); // Boot sequence duration
    } else {
      setPowerState('on');
    }
  }, []);

  const powerOff = useCallback(() => {
    setPowerState('off');
    // Clear session boot flag so next power on triggers boot
    sessionStorage.removeItem('hasBootedThisSession');
  }, []);

  const setStandby = useCallback(() => {
    setPowerState('standby');
  }, []);

  // Reset all camera settings to defaults
  const performFullReset = useCallback(() => {
    setIso(400);
    setAperture(2.8);
    setShutterSpeed(125);
    setExposureComp(0);
    setWhiteBalance('daylight');
    setCurrentLens(LENSES[2]); // 35mm default
    setFlashMode('auto');
    setHudVisibility('standard');
    setRuleOfThirds('off');
    setShowHistogram(false);
    setFocusMode('single');
    setOpenBoxes([]);
    _setCameraMode('dslr');
    setActivePreset(null);
    applyInterfaceProfile(baseInterfaceProfiles.dslr);
    manualSettingsRef.current = null;
    setGestureLockMap({});
    setMobileImmersiveMode(false);
    setHasModifiedSettings(false);
    setFocusedLayerId(null);
    setFocusedLayerState(null);
    setResetStage(0);
  }, [applyInterfaceProfile, baseInterfaceProfiles]);

  const partialReset = useCallback(() => {
    setOpenBoxes([]);
    setRuleOfThirds('off');
    setShowHistogram(false);
    setHasModifiedSettings(true);
  }, []);

  const resetCamera = useCallback(() => {
    if (resetStage === 0) {
      partialReset();
      setResetStage(1);
    } else {
      performFullReset();
    }
  }, [partialReset, performFullReset, resetStage]);

  const ensurePartialReset = useCallback(() => {
    partialReset();
    setResetStage((stage) => (stage === 0 ? 1 : stage));
  }, [partialReset]);

  useEffect(() => {
    if (!hasModifiedSettings && resetStage !== 0) {
      setResetStage(0);
    }
  }, [hasModifiedSettings, resetStage]);

  // Control boxes management (max 2 open)
  const toggleBox = useCallback((boxId) => {
    setOpenBoxes(prev => {
      if (prev.includes(boxId)) {
        return prev.filter(id => id !== boxId);
      } else {
        if (prev.length >= 2) {
          return [...prev.slice(1), boxId]; // Remove first, add new
        }
        return [...prev, boxId];
      }
    });
  }, []);

  const layerRegistry = useMemo(() => layerRegistryRef.current, [layerRegistryVersion]);

  const orderedLayers = useMemo(() => {
    return Object.values(layerRegistry).sort((a, b) => a.depth - b.depth);
  }, [layerRegistry]);

  const hasInteractiveLayer = useMemo(
    () => orderedLayers.some((layer) => layer.type === 'interactive'),
    [orderedLayers]
  );

  const registerLayer = useCallback(({ id, depth, type = 'content', ref, onClose }) => {
    if (!id || typeof depth !== 'number') return;
    layerRegistryRef.current = {
      ...layerRegistryRef.current,
      [id]: { id, depth, type, ref, onClose },
    };
    setLayerRegistryVersion((v) => v + 1);
  }, []);

  const unregisterLayer = useCallback((id) => {
    if (!id || !layerRegistryRef.current[id]) return;
    const { [id]: removed, ...rest } = layerRegistryRef.current;
    layerRegistryRef.current = rest;
    setLayerRegistryVersion((v) => v + 1);
    if (focusedLayerId === id) {
      setFocusedLayerId(null);
      setFocusedLayerState(null);
    }
    if (removed && removed.type === 'interactive') {
      releaseGestureLock(id);
    }
  }, [focusedLayerId, releaseGestureLock]);

  const focusLayer = useCallback((layerIdOrDepth) => {
    if (typeof layerIdOrDepth === 'string') {
      const layer = layerRegistryRef.current[layerIdOrDepth];
      if (!layer) return;
      setFocusedLayerId(layer.id);
      setFocusedLayerState(layer.depth);
      return;
    }

    if (typeof layerIdOrDepth === 'number') {
      setFocusedLayerId(null);
      setFocusedLayerState(layerIdOrDepth);
    }
  }, []);

  const setFocusedLayer = useCallback((depth) => {
    if (typeof depth !== 'number') return;
    setFocusedLayerId(null);
    setFocusedLayerState(depth);
  }, []);

  const closeTopLayer = useCallback(() => {
    const interactiveLayers = Object.values(layerRegistryRef.current)
      .filter((layer) => layer.type === 'interactive')
      .sort((a, b) => a.depth - b.depth);

    const topLayer = interactiveLayers[interactiveLayers.length - 1];
    if (topLayer && typeof topLayer.onClose === 'function') {
      topLayer.onClose();
      return true;
    }
    return false;
  }, []);

  // Lens change with iris transition
  const changeLens = useCallback((lens) => {
    if (lens.id === currentLens.id) return;

    setIsChangingLens(true);
    setTimeout(() => {
      setCurrentLens(lens);
      setTimeout(() => {
        setIsChangingLens(false);
      }, 600); // Half of transition
    }, 600); // Half of transition
  }, [currentLens]);

  // Cycle through lenses
  const cycleLens = useCallback(() => {
    setHasModifiedSettings(true);
    const currentIndex = LENSES.findIndex(l => l.id === currentLens.id);
    const nextIndex = (currentIndex + 1) % LENSES.length;
    changeLens(LENSES[nextIndex]);
  }, [currentLens, changeLens]);

  useEffect(() => {
    const zoomFactor = currentLens?.zoom ?? 1;
    const layout = zoomFactor >= 1.25 ? 'tele' : zoomFactor <= 0.8 ? 'wide' : 'normal';
    setLensLayout(layout);

    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.style.setProperty('--lens-zoom-factor', zoomFactor.toFixed(2));
      root.setAttribute('data-lens-layout', layout);
    }
  }, [currentLens]);

  // Change camera mode with immersive adjustments
  const setCameraMode = useCallback((mode) => {
    setHasModifiedSettings(true);

    if (mode === cameraMode) return;

    if (mode === 'mirrorless') {
      dslrSettingsRef.current = {
        hudVisibility,
        focusMode,
        showHistogram,
        ruleOfThirds,
        interfaceModules: { ...interfaceModules },
      };

      _setCameraMode('mirrorless');
      setHudVisibility('minimal');
      setFocusMode('continuous');
      setShowHistogram(true);
      applyInterfaceProfile(baseInterfaceProfiles.mirrorless);
    } else {
      mirrorlessSettingsRef.current = {
        hudVisibility,
        focusMode,
        showHistogram,
        ruleOfThirds,
        interfaceModules: { ...interfaceModules },
      };

      _setCameraMode('dslr');

      if (dslrSettingsRef.current) {
        setHudVisibility(dslrSettingsRef.current.hudVisibility);
        setFocusMode(dslrSettingsRef.current.focusMode);
        setShowHistogram(dslrSettingsRef.current.showHistogram);
        applyInterfaceProfile(dslrSettingsRef.current.interfaceModules || baseInterfaceProfiles.dslr);
      } else {
        setHudVisibility('standard');
        setFocusMode('single');
        setShowHistogram(false);
        applyInterfaceProfile(baseInterfaceProfiles.dslr);
      }
    }
  }, [applyInterfaceProfile, baseInterfaceProfiles, cameraMode, focusMode, hudVisibility, interfaceModules, setFocusMode, setHasModifiedSettings, setHudVisibility, setShowHistogram, showHistogram]);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.setAttribute('data-camera-skin', cameraMode);
    document.documentElement.setAttribute('data-camera-mode', cameraMode);
    document.documentElement.setAttribute('data-camera-preset', activePreset || 'manual');
  }, [activePreset, cameraMode]);

  useEffect(() => {
    if (focusedLayer !== null || orderedLayers.length === 0) return;
    const baseLayer = orderedLayers.find((layer) => layer.type === 'content');
    if (baseLayer) {
      focusLayer(baseLayer.id);
    }
  }, [orderedLayers, focusedLayer, focusLayer]);

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const handleClick = (event) => {
      const target = event.target?.closest?.('[data-depth-layer]');
      if (!target) return;
      const layerId = target.getAttribute('data-depth-layer');
      if (!layerId) return;
      focusLayer(layerId);
    };

    const closeTopInteractiveLayer = (target) => {
      const interactiveLayers = Object.values(layerRegistryRef.current)
        .filter((layer) => layer.type === 'interactive')
        .sort((a, b) => a.depth - b.depth);

      const topLayer = interactiveLayers[interactiveLayers.length - 1];
      if (!topLayer) return;

      const topElement = topLayer.ref?.current;
      if (topElement && target && topElement.contains(target)) {
        return;
      }

      if (typeof topLayer.onClose === 'function') {
        topLayer.onClose();
      }
    };

    const handleDoubleClick = (event) => {
      closeTopInteractiveLayer(event.target);
    };

    let lastTouchTime = 0;
    const handleTouchEnd = (event) => {
      const now = Date.now();
      if (now - lastTouchTime < 350) {
        closeTopInteractiveLayer(event.target);
        lastTouchTime = 0;
        return;
      }
      lastTouchTime = now;
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('dblclick', handleDoubleClick);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('dblclick', handleDoubleClick);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [focusLayer]);

  const applyCameraPreset = useCallback((presetId) => {
    setHasModifiedSettings(true);

    if (!presetId) {
      setActivePreset(null);
      if (manualSettingsRef.current) {
        const settings = manualSettingsRef.current;
        if (settings.cameraMode !== cameraMode) {
          setCameraMode(settings.cameraMode);
        }
        setIso(settings.iso);
        setAperture(settings.aperture);
        setShutterSpeed(settings.shutterSpeed);
        setExposureComp(settings.exposureComp);
        setWhiteBalance(settings.whiteBalance);
        setHudVisibility(settings.hudVisibility);
        setFocusMode(settings.focusMode);
        setShowHistogram(settings.showHistogram);
        setFlashMode(settings.flashMode);
        applyInterfaceProfile(settings.interfaceModules || baseInterfaceProfiles[cameraMode]);
      } else {
        applyInterfaceProfile(baseInterfaceProfiles[cameraMode]);
      }
      manualSettingsRef.current = null;
      setActivePreset(null);
      return;
    }

    if (!activePreset && !manualSettingsRef.current) {
      manualSettingsRef.current = {
        iso,
        aperture,
        shutterSpeed,
        exposureComp,
        whiteBalance,
        hudVisibility,
        focusMode,
        showHistogram,
        flashMode,
        cameraMode,
        interfaceModules: { ...interfaceModules },
      };
    }

    setActivePreset(presetId);

    switch (presetId) {
      case 'modern':
        setCameraMode('mirrorless');
        setHudVisibility('minimal');
        setFlashMode('auto');
        setWhiteBalance('daylight');
        setFocusMode('continuous');
        setExposureComp(0);
        setIso(400);
        setShutterSpeed(250);
        setAperture(2.8);
        setShowHistogram(true);
        applyInterfaceProfile(presetInterfaceProfiles.modern);
        break;
      case 'retro':
        setCameraMode('dslr');
        setHudVisibility('full');
        setFlashMode('off');
        setWhiteBalance('tungsten');
        setFocusMode('manual');
        setExposureComp(0.5);
        setIso(800);
        setShutterSpeed(60);
        setAperture(1.8);
        setShowHistogram(false);
        applyInterfaceProfile(presetInterfaceProfiles.retro);
        break;
      case 'cinema':
        setCameraMode('mirrorless');
        setHudVisibility('full');
        setFlashMode('off');
        setWhiteBalance('cloudy');
        setFocusMode('manual');
        setExposureComp(-0.7);
        setIso(640);
        setShutterSpeed(50);
        setAperture(4);
        setShowHistogram(true);
        applyInterfaceProfile(presetInterfaceProfiles.cinema);
        break;
      default:
        setActivePreset(null);
        break;
    }
  }, [activePreset, applyInterfaceProfile, aperture, baseInterfaceProfiles, cameraMode, exposureComp, flashMode, focusMode, hudVisibility, interfaceModules, iso, presetInterfaceProfiles, setAperture, setCameraMode, setExposureComp, setFlashMode, setFocusMode, setHudVisibility, setIso, setShutterSpeed, setShowHistogram, setWhiteBalance, shutterSpeed, whiteBalance]);

  // Theme based on flash mode
  const getTheme = useCallback(() => {
    if (flashMode === 'on') return 'light';
    if (flashMode === 'off') return 'dark';
    // Auto mode - check system preference
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  }, [flashMode]);

  const theme = getTheme();

  // Calculate blur amount for depth of field
  const calculateBlur = useCallback((layerDepth, focusedDepth) => {
    if (focusedDepth === null || typeof focusedDepth === 'undefined') return 0;
    if (layerDepth === focusedDepth) return 0;

    const depthSteps = Math.min(10, Math.abs(layerDepth - focusedDepth) / 100);
    const apertureRange = 22 - 1.4;
    const apertureWeight = (22 - aperture) / apertureRange; // 0 when stopped down, 1 when wide open
    const blurAmount = apertureWeight * depthSteps * 18;

    return Number(Math.min(36, blurAmount).toFixed(2));
  }, [aperture]);

  // ISO noise effect
  const getIsoNoise = useCallback(() => {
    if (iso < 800) return 0;
    if (iso < 1600) return 0.05;
    if (iso < 3200) return 0.1;
    return 0.15;
  }, [iso]);

  // White balance color temperature
  const getWhiteBalanceFilter = useCallback(() => {
    const wb = WHITE_BALANCE_MODES[whiteBalance];
    if (!wb) return {};

    const tempDiff = wb.temp - 5500;
    const warmth = tempDiff / 2500; // Normalized

    if (warmth > 0) {
      // Warmer (orange)
      return {
        filter: `sepia(${warmth * 0.3}) saturate(${1 + warmth * 0.2})`,
      };
    } else {
      // Cooler (blue)
      return {
        filter: `hue-rotate(${warmth * 10}deg) saturate(${1 - Math.abs(warmth) * 0.1})`,
      };
    }
  }, [whiteBalance]);

  const getContentFilter = useCallback(() => {
    const wbFilter = getWhiteBalanceFilter();
    const filters = [];

    if (wbFilter.filter) {
      filters.push(wbFilter.filter);
    }

    const normalize = (value, min, max) => {
      const clamped = Math.max(min, Math.min(max, value));
      return (clamped - min) / (max - min);
    };

    const shutterNormalized = normalize(shutterSpeed, 30, 8000);
    const slowRatio = 1 - Math.pow(shutterNormalized, 0.35);
    const fastRatio = Math.pow(shutterNormalized, 0.35);

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const brightness = clamp(1 + exposureComp * 0.25 + slowRatio * 0.32 - fastRatio * 0.2, 0.6, 1.8);
    const contrast = clamp(1 + fastRatio * 0.24 - slowRatio * 0.18 + exposureComp * 0.1, 0.75, 1.6);
    const saturation = clamp(1 + exposureComp * 0.14 + (aperture < 3.2 ? 0.16 : aperture > 11 ? -0.12 : 0), 0.6, 1.6);
    const warmthShift = clamp((exposureComp + (aperture < 2 ? 0.6 : -0.2)) * 6, -12, 12);

    filters.push(
      `brightness(${brightness}) contrast(${contrast}) saturate(${saturation}) hue-rotate(${warmthShift}deg)`
    );

    return { filter: filters.join(' ') };
  }, [aperture, exposureComp, getWhiteBalanceFilter, shutterSpeed]);

  const value = {
    // Power
    powerState,
    powerOn,
    powerOff,
    setStandby,
    resetCamera,
    ensurePartialReset,
    resetStage,
    hasBooted,

    // Camera mode
    cameraMode,
    setCameraMode,

    // Battery
    batteryLevel,

    // Camera settings
    iso,
    setIso,
    aperture,
    setAperture,
    shutterSpeed,
    setShutterSpeed,
    exposureComp,
    setExposureComp,
    whiteBalance,
    setWhiteBalance,

    // Lens
    currentLens,
    changeLens,
    cycleLens,
    isChangingLens,
    availableLenses: LENSES,

    // Flash
    flashMode,
    setFlashMode,
    theme,

    // HUD
    hudVisibility,
    setHudVisibility,

    // Assist
    ruleOfThirds,
    setRuleOfThirds,
    showHistogram,
    setShowHistogram,
    focusMode,
    setFocusMode,

    // Control boxes
    openBoxes,
    toggleBox,

    // Focus
    focusedLayer,
    focusedLayerId,
    setFocusedLayer,
    focusLayer,
    registerLayer,
    unregisterLayer,
    closeTopLayer,
    focusPoint,
    setFocusPoint,

    // Section navigation
    currentSection,
    setCurrentSection,

    // Bottom menu
    isBottomMenuOpen,
    setIsBottomMenuOpen,

    // Settings state
    hasModifiedSettings,
    setHasModifiedSettings,

    // Helpers
    calculateBlur,
    getIsoNoise,
    getWhiteBalanceFilter,
    getContentFilter,
    whiteBalanceModes: WHITE_BALANCE_MODES,
    gestureLock,
    setGestureLock,
    engageGestureLock,
    releaseGestureLock,
    mobileImmersiveMode,
    setMobileImmersiveMode,
    activePreset,
    applyCameraPreset,
    interfaceModules,
    hasInteractiveLayer,
    performFullReset,
    lensLayout,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
};
