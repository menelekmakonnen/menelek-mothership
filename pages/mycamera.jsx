import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import CameraViewfinder from '../components/camera/CameraViewfinder';
import CameraHUD from '../components/camera/CameraHUD';
import CameraControls from '../components/camera/CameraControls';
import CameraContext from '../components/camera/CameraContext';
import FlashOverlay from '../components/camera/FlashOverlay';
import AFCursor from '../components/camera/AFCursor';
import { CAMERA_DATABASE, LENS_DATABASE } from '../components/camera/CameraDatabase';

export default function MyCameraPage() {
  const [cameraSettings, setCameraSettings] = useState({
    brand: 'nikon',
    model: 'z9', // Specific camera model
    lens: '50mm-f18',
    iso: 400,
    aperture: 5.6,
    shutterSpeed: 1/250,
    whiteBalance: 5500,
    whiteBalanceMode: 'auto',
    flashEnabled: false,
    hudMode: 2, // 0: none, 1: minimal, 2: standard, 3: full, 4: cinematic
    hudStyle: 'literal', // 'literal' or 'cinematic'
    focusDepth: 3,
    focusLocked: false,
    exposureCompensation: 0,
    exposurePreview: true, // EVF shows exposure changes, OVF doesn't
    battery: 100, // Battery percentage
    videoMode: false, // For Panasonic
    filmSimulation: 'PROVIA', // For Fujifilm
    shotCount: 0
  });

  // Get current camera data
  const getCurrentCamera = () => {
    return CAMERA_DATABASE[cameraSettings.brand]?.[cameraSettings.model];
  };

  // Get current lens data
  const getCurrentLens = () => {
    return LENS_DATABASE[cameraSettings.lens];
  };

  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [isHalfPressed, setIsHalfPressed] = useState(false);
  const [isFocusing, setIsFocusing] = useState(false);
  const [flashFiring, setFlashFiring] = useState(false);
  const [shutterFiring, setShutterFiring] = useState(false);
  const [changingLens, setChangingLens] = useState(false);

  const viewfinderRef = useRef(null);

  // Track cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Battery idle drain for mirrorless (EVF drains constantly)
  useEffect(() => {
    const camera = getCurrentCamera();
    if (!camera || camera.type === 'dslr') return; // DSLRs only drain on shot

    const drainInterval = setInterval(() => {
      setCameraSettings(prev => {
        if (prev.battery <= 0) return prev;
        // Mirrorless EVF drains ~0.05% every 10 seconds (slower than per-shot drain)
        return { ...prev, battery: Math.max(0, prev.battery - 0.05) };
      });
    }, 10000); // Every 10 seconds

    return () => clearInterval(drainInterval);
  }, [cameraSettings.brand, cameraSettings.model]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case ' ':
          e.preventDefault();
          if (!cameraSettings.focusLocked) {
            handleHalfPress();
          }
          break;
        case 'Enter':
          e.preventDefault();
          handleFullPress();
          break;
        case 'f':
        case 'F':
          toggleFlash();
          break;
        case 'h':
        case 'H':
          cycleHudMode();
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustAperture(-0.5);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustAperture(0.5);
          break;
        case '=':
        case '+':
          adjustISO(100);
          break;
        case '-':
          adjustISO(-100);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cameraSettings]);

  const handleMouseDown = () => {
    if (!cameraSettings.focusLocked) {
      setIsHalfPressed(true);
      handleHalfPress();
    }
  };

  const handleMouseUp = () => {
    if (isHalfPressed) {
      handleFullPress();
    }
    setIsHalfPressed(false);
  };

  const handleHalfPress = () => {
    // Initiate autofocus
    setIsFocusing(true);

    // Get element at cursor position
    const element = document.elementFromPoint(cursorPosition.x, cursorPosition.y);
    const depth = getElementDepth(element);

    // Simulate AF hunting (takes ~800ms)
    setTimeout(() => {
      setCameraSettings(prev => ({
        ...prev,
        focusDepth: depth,
        focusLocked: true
      }));
      setIsFocusing(false);
    }, 800);
  };

  const handleFullPress = () => {
    const camera = getCurrentCamera();
    if (!camera) return;

    // Check battery
    if (cameraSettings.battery <= 0) {
      alert('Battery empty! Replace battery to continue.');
      return;
    }

    // Fire shutter
    setShutterFiring(true);

    // Fire flash if enabled
    if (cameraSettings.flashEnabled) {
      setFlashFiring(true);
      setTimeout(() => setFlashFiring(false), 120);
    }

    // Shutter animation duration based on camera type
    const duration = camera.type === 'dslr' ? 100 : 80;

    // Battery drain (mirrorless drains faster)
    const batteryDrain = camera.type === 'dslr' ? 0.03 : 0.12;

    setTimeout(() => {
      setShutterFiring(false);
      // Unlock focus after shot, increment shot counter, drain battery
      setCameraSettings(prev => ({
        ...prev,
        focusLocked: false,
        shotCount: prev.shotCount + 1,
        battery: Math.max(0, prev.battery - batteryDrain)
      }));
    }, duration);
  };

  const getElementDepth = (element) => {
    if (!element) return 3;

    const layerEl = element.closest('[data-depth]');
    if (layerEl) {
      return parseFloat(layerEl.dataset.depth);
    }
    return 3; // Default mid-ground
  };

  const updateSetting = (key, value) => {
    setCameraSettings(prev => ({ ...prev, [key]: value }));
  };

  const toggleFlash = () => {
    setCameraSettings(prev => ({ ...prev, flashEnabled: !prev.flashEnabled }));
  };

  const cycleHudMode = () => {
    setCameraSettings(prev => {
      const nextMode = (prev.hudMode + 1) % 5; // 0-4 (including cinematic)
      // If entering mode 4, switch to cinematic style
      const newStyle = nextMode === 4 ? 'cinematic' : 'literal';
      return {
        ...prev,
        hudMode: nextMode,
        hudStyle: newStyle
      };
    });
  };

  const toggleHudStyle = () => {
    setCameraSettings(prev => ({
      ...prev,
      hudStyle: prev.hudStyle === 'literal' ? 'cinematic' : 'literal'
    }));
  };

  const changeCamera = (brand, model) => {
    const camera = CAMERA_DATABASE[brand]?.[model];
    if (!camera) return;

    // Reset battery when switching cameras
    setCameraSettings(prev => ({
      ...prev,
      brand,
      model,
      battery: 100,
      shotCount: 0,
      // Auto-adjust settings to camera limits
      iso: Math.min(prev.iso, camera.iso.native.max)
    }));
  };

  const rechargeBattery = () => {
    setCameraSettings(prev => ({ ...prev, battery: 100 }));
  };

  const adjustAperture = (change) => {
    setCameraSettings(prev => ({
      ...prev,
      aperture: Math.max(1.2, Math.min(22, prev.aperture + change))
    }));
  };

  const adjustISO = (change) => {
    const isoStops = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400];
    const currentIndex = isoStops.findIndex(iso => iso >= cameraSettings.iso);
    const newIndex = Math.max(0, Math.min(isoStops.length - 1, currentIndex + (change > 0 ? 1 : -1)));

    setCameraSettings(prev => ({
      ...prev,
      iso: isoStops[newIndex]
    }));
  };

  const changeLens = (newLens) => {
    setChangingLens(true);

    setTimeout(() => {
      setCameraSettings(prev => ({ ...prev, lens: newLens }));
      setTimeout(() => setChangingLens(false), 800);
    }, 400);
  };

  return (
    <>
      <Head>
        <title>Interactive Camera | Menelek Makonnen</title>
        <meta name="description" content="Experience photography through an interactive camera viewfinder" />
      </Head>

      <CameraContext.Provider value={{
        cameraSettings,
        updateSetting,
        changeLens,
        changeCamera,
        toggleHudStyle,
        rechargeBattery,
        currentCamera: getCurrentCamera(),
        currentLens: getCurrentLens()
      }}>
        <div
          className="camera-app"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          style={{ cursor: 'none' }}
        >
          {/* Custom AF Cursor */}
          <AFCursor
            position={cursorPosition}
            isFocusing={isFocusing}
            focusLocked={cameraSettings.focusLocked}
          />

          {/* Main Viewfinder Scene */}
          <CameraViewfinder
            ref={viewfinderRef}
            settings={cameraSettings}
            changingLens={changingLens}
            shutterFiring={shutterFiring}
          />

          {/* Camera HUD Overlay */}
          <CameraHUD settings={cameraSettings} />

          {/* Flash Overlay */}
          {flashFiring && (
            <FlashOverlay cursorPosition={cursorPosition} />
          )}

          {/* Camera Controls Panel */}
          <CameraControls
            settings={cameraSettings}
            updateSetting={updateSetting}
            toggleFlash={toggleFlash}
            cycleHudMode={cycleHudMode}
            changeLens={changeLens}
            onShoot={handleFullPress}
          />
        </div>
      </CameraContext.Provider>

      <style jsx global>{`
        .camera-app {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        body {
          overflow: hidden !important;
        }

        /* Hide default cursor */
        .camera-app * {
          cursor: none !important;
        }
      `}</style>
    </>
  );
}
