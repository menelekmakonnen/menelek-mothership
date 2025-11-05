import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import CameraViewfinder from '../components/camera/CameraViewfinder';
import CameraHUD from '../components/camera/CameraHUD';
import CameraControls from '../components/camera/CameraControls';
import CameraContext from '../components/camera/CameraContext';
import FlashOverlay from '../components/camera/FlashOverlay';
import AFCursor from '../components/camera/AFCursor';

export default function MyCameraPage() {
  const [cameraSettings, setCameraSettings] = useState({
    type: 'mirrorless', // 'dslr' or 'mirrorless'
    brand: 'nikon', // 'nikon', 'sony', 'canon', 'fujifilm', 'panasonic'
    lens: '50mm', // '24-70mm', '50mm', '85mm', '35mm', '70-200mm'
    iso: 400,
    aperture: 5.6,
    shutterSpeed: 1/250,
    whiteBalance: 5500, // Kelvin
    whiteBalanceMode: 'auto',
    flashEnabled: false,
    hudMode: 2, // 0: none, 1: minimal, 2: standard, 3: full
    focusDepth: 3, // Current focus depth (1-10 scale)
    focusLocked: false,
    exposureCompensation: 0
  });

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
    // Fire shutter
    setShutterFiring(true);

    // Fire flash if enabled
    if (cameraSettings.flashEnabled) {
      setFlashFiring(true);
      setTimeout(() => setFlashFiring(false), 120);
    }

    // Shutter animation duration
    const duration = cameraSettings.type === 'dslr' ? 100 : 80;
    setTimeout(() => {
      setShutterFiring(false);
      // Unlock focus after shot
      setCameraSettings(prev => ({ ...prev, focusLocked: false }));
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
    setCameraSettings(prev => ({
      ...prev,
      hudMode: (prev.hudMode + 1) % 4
    }));
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

      <CameraContext.Provider value={{ cameraSettings, updateSetting, changeLens }}>
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
