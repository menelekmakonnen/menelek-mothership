import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

const CameraContext = createContext();

export const useCameraContext = () => {
  const context = useContext(CameraContext);
  if (!context) {
    throw new Error('useCameraContext must be used within CameraProvider');
  }
  return context;
};

const LENSES = [
  {
    id: 'standard',
    name: '50mm f/1.4 Prime',
    focalLength: 50,
    maxAperture: 1.4,
    zoom: 1.0,
  },
  {
    id: 'zoom',
    name: '24-70mm f/2.8',
    focalLength: 24,
    maxAperture: 2.8,
    zoom: 0.85,
  },
  {
    id: 'telephoto',
    name: '70-200mm f/2.8',
    focalLength: 70,
    maxAperture: 2.8,
    zoom: 1.5,
  },
  {
    id: 'portrait',
    name: '85mm f/1.4 Portrait',
    focalLength: 85,
    maxAperture: 1.4,
    zoom: 1.2,
  },
  {
    id: 'wide',
    name: '16-35mm f/2.8 Wide',
    focalLength: 16,
    maxAperture: 2.8,
    zoom: 0.7,
  },
];

export const CameraProvider = ({ children }) => {
  // Power & Boot State - auto-boot straight into the galleria experience
  const [powerState, setPowerState] = useState('booting'); // 'off' | 'booting' | 'on' | 'standby'
  const [hasBooted, setHasBooted] = useState(false);
  const [batteryLevel, setBatteryLevel] = useState(100);
  const initialBootTriggered = useRef(false);

  // Camera Settings
  const [iso, setIso] = useState(400);
  const [aperture, setAperture] = useState(2.8);
  const [shutterSpeed, setShutterSpeed] = useState(250); // 1/250
  const [exposureComp, setExposureComp] = useState(0);
  const [whiteBalance, setWhiteBalance] = useState('daylight');
  const [flashMode, setFlashMode] = useState('auto'); // 'auto' | 'on' | 'off'

  // Lens System
  const [currentLens, setCurrentLens] = useState(LENSES[0]);
  const [isChangingLens, setIsChangingLens] = useState(false);
  const [availableLenses] = useState(LENSES);

  // HUD & Display
  const [hudVisibility, setHudVisibility] = useState('standard'); // 'none' | 'minimal' | 'standard' | 'full'
  const [cameraMode, setCameraMode] = useState('dslr'); // 'dslr' | 'mirrorless'

  // Assist Tools
  const [ruleOfThirds, setRuleOfThirds] = useState(false);
  const [showHistogram, setShowHistogram] = useState(false);
  const [focusMode, setFocusMode] = useState('continuous'); // 'single' | 'continuous' | 'manual'

  // Control Interface
  const [openDials, setOpenDials] = useState([]);

  // Theme (based on flash mode)
  const [theme, setTheme] = useState('dark');

  // Initialize theme on mount
  useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      // Default to dark mode for first-time visitors
      setTheme('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }, []);

  // Update theme based on flash mode
  useEffect(() => {
    let newTheme;
    if (flashMode === 'on') {
      newTheme = 'light';
    } else if (flashMode === 'off') {
      newTheme = 'dark';
    } else {
      // Auto - use system preference
      newTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  }, [flashMode]);

  // Battery level (time-based)
  useEffect(() => {
    const updateBattery = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const totalMinutes = hours * 60 + minutes;
      const maxMinutes = 23 * 60 + 59; // 11:59 PM
      const percentage = Math.max(0, Math.min(100, 100 - (totalMinutes / maxMinutes) * 100));
      setBatteryLevel(Math.round(percentage));
    };

    updateBattery();
    const interval = setInterval(updateBattery, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  // Power Management Functions
  const powerOn = useCallback(() => {
    setPowerState('booting');
    setTimeout(() => {
      setPowerState('on');
      setHasBooted(true);
      localStorage.setItem('lastBootDate', new Date().toDateString());
    }, 2500); // Slightly shorter boot time
  }, []);

  const powerOff = useCallback(() => {
    setPowerState('off');
  }, []);

  const setStandby = useCallback(() => {
    setPowerState('standby');
  }, []);

  // Lens Change Function
  const changeLens = useCallback((lens) => {
    setIsChangingLens(true);
    setTimeout(() => {
      setCurrentLens(lens);
      setIsChangingLens(false);
    }, 600); // Match iris transition duration
  }, []);

  // Toggle Dial Function
  const toggleDial = useCallback((dialId) => {
    setOpenDials((prev) => {
      if (prev.includes(dialId)) {
        return prev.filter((id) => id !== dialId);
      } else {
        // Max 2 dials open at once
        if (prev.length >= 2) {
          return [prev[1], dialId];
        }
        return [...prev, dialId];
      }
    });
  }, []);

  // Utility Functions
  const getIsoNoise = useCallback(() => {
    if (iso < 800) return 0;
    if (iso < 1600) return 0.05;
    if (iso < 3200) return 0.1;
    return 0.15;
  }, [iso]);

  const getWhiteBalanceFilter = useCallback(() => {
    const filters = {
      daylight: 'none',
      cloudy: 'sepia(0.1) saturate(1.1)',
      tungsten: 'sepia(0.2) hue-rotate(-10deg)',
      fluorescent: 'hue-rotate(10deg) saturate(0.9)',
      custom: 'contrast(1.1) saturate(1.2)',
    };
    return filters[whiteBalance] || 'none';
  }, [whiteBalance]);

  // Auto boot on first mount so the galleria shows immediately
  useEffect(() => {
    if (!initialBootTriggered.current) {
      initialBootTriggered.current = true;
      powerOn();
    }
  }, [powerOn]);

  const value = {
    // Power & Boot
    powerState,
    hasBooted,
    batteryLevel,
    powerOn,
    powerOff,
    setStandby,

    // Camera Settings
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
    flashMode,
    setFlashMode,

    // Lens System
    currentLens,
    changeLens,
    isChangingLens,
    availableLenses,

    // HUD & Display
    hudVisibility,
    setHudVisibility,
    cameraMode,
    setCameraMode,
    theme,

    // Assist Tools
    ruleOfThirds,
    setRuleOfThirds,
    showHistogram,
    setShowHistogram,
    focusMode,
    setFocusMode,

    // Control Interface
    openDials,
    toggleDial,

    // Utility Functions
    getIsoNoise,
    getWhiteBalanceFilter,
  };

  return <CameraContext.Provider value={value}>{children}</CameraContext.Provider>;
};
