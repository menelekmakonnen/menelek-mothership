import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const CameraContext = createContext();

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within CameraProvider');
  }
  return context;
};

const LENSES = [
  { id: '50mm', name: '50mm f/1.4 Prime', focalLength: 50, maxAperture: 1.4, zoom: 1 },
  { id: '24-70mm', name: '24-70mm f/2.8', focalLength: 47, maxAperture: 2.8, zoom: 0.85 },
  { id: '70-200mm', name: '70-200mm f/2.8', focalLength: 135, maxAperture: 2.8, zoom: 1.5 },
  { id: '85mm', name: '85mm f/1.4 Portrait', focalLength: 85, maxAperture: 1.4, zoom: 1.2 },
  { id: '16-35mm', name: '16-35mm f/2.8 Wide', focalLength: 25, maxAperture: 2.8, zoom: 0.7 },
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
  const [cameraMode, setCameraMode] = useState('dslr'); // 'dslr' or 'mirrorless'

  // Battery system
  const [batteryLevel, setBatteryLevel] = useState(100);

  // Camera settings
  const [iso, setIso] = useState(400);
  const [aperture, setAperture] = useState(2.8);
  const [shutterSpeed, setShutterSpeed] = useState(125); // 1/125
  const [exposureComp, setExposureComp] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState('daylight');

  // Lens system
  const [currentLens, setCurrentLens] = useState(LENSES[0]);
  const [isChangingLens, setIsChangingLens] = useState(false);

  // Flash mode
  const [flashMode, setFlashMode] = useState('auto'); // 'auto', 'on', 'off'

  // HUD settings
  const [hudVisibility, setHudVisibility] = useState('standard'); // 'none', 'minimal', 'standard', 'full'

  // Assist tools
  const [ruleOfThirds, setRuleOfThirds] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [focusMode, setFocusMode] = useState('single'); // 'single', 'continuous', 'manual'

  // Control boxes state
  const [openBoxes, setOpenBoxes] = useState([]); // Can have max 2 open, start with none

  // Focus system
  const [focusedLayer, setFocusedLayer] = useState(null);
  const [focusPoint, setFocusPoint] = useState({ x: 50, y: 50 });

  // Section navigation
  const [currentSection, setCurrentSection] = useState(0);

  // Calculate battery based on time of day
  useEffect(() => {
    const updateBattery = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const midnightMinutes = 23 * 60 + 11; // 23:11
      const batteryPercent = Math.max(0, 100 - (totalMinutes / midnightMinutes) * 100);
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
    if (!focusedDepth || layerDepth === focusedDepth) return 0;

    const depthDiff = Math.abs(layerDepth - focusedDepth);
    const apertureEffect = 1 / aperture;
    const blurAmount = apertureEffect * depthDiff * 2;

    return Math.min(blurAmount, 20); // Cap at 20px
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

  const value = {
    // Power
    powerState,
    powerOn,
    powerOff,
    setStandby,
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
    setFocusedLayer,
    focusPoint,
    setFocusPoint,

    // Section navigation
    currentSection,
    setCurrentSection,

    // Helpers
    calculateBlur,
    getIsoNoise,
    getWhiteBalanceFilter,
    whiteBalanceModes: WHITE_BALANCE_MODES,
  };

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
};
