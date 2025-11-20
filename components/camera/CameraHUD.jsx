import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Aperture,
  Gauge,
  Clock,
  Battery,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Eye,
  EyeOff,
  BarChart3,
  Shuffle,
  Repeat,
  Home,
  Power,
} from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';
import { useGalleriaContext } from '@/context/GalleriaContext';

const SHUTTER_STOPS = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625];

export default function CameraHUD() {
  const {
    hudVisibility,
    setHudVisibility,
    iso,
    aperture,
    shutterSpeed,
    exposureComp,
    currentLens,
    availableLenses,
    changeLens,
    batteryLevel,
    cameraMode,
    setCameraMode,
    showHistogram,
    setShowHistogram,
    setIso,
    setAperture,
    setShutterSpeed,
    powerOff,
  } = useCameraContext();
  const { openGalleria } = useGalleriaContext();
  const [openControl, setOpenControl] = useState(null);

  if (hudVisibility === 'none') return null;

  const getBatteryIcon = () => {
    if (batteryLevel > 60) return BatteryFull;
    if (batteryLevel > 30) return BatteryMedium;
    return BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();

  const toggleControl = (id) => {
    setOpenControl((prev) => (prev === id ? null : id));
  };

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `1/${Math.round(speed)}`;
    const seconds = speed;
    const label = seconds < 1 ? seconds.toFixed(2) : seconds.toFixed(1);
    return `${label.replace(/0+$/, '').replace(/\.$/, '')}"`;
  };

  const adjustIso = (delta) => {
    setIso((prev) => {
      const next = Math.min(12800, Math.max(100, prev + delta));
      return Math.round(next / 50) * 50;
    });
  };

  const adjustAperture = (delta) => {
    setAperture((prev) => {
      const next = Math.min(16, Math.max(currentLens.maxAperture, prev + delta));
      return Number(next.toFixed(1));
    });
  };

  const adjustShutter = (step) => {
    const currentIndex = SHUTTER_STOPS.findIndex((stop) => stop === shutterSpeed);
    const safeIndex = currentIndex === -1 ? SHUTTER_STOPS.indexOf(250) : currentIndex;
    const nextIndex = Math.min(Math.max(safeIndex + step, 0), SHUTTER_STOPS.length - 1);
    setShutterSpeed(SHUTTER_STOPS[nextIndex]);
  };

  const nextLens = useMemo(() => {
    const currentIndex = availableLenses.findIndex((lens) => lens.id === currentLens.id);
    return availableLenses[(currentIndex + 1) % availableLenses.length];
  }, [availableLenses, currentLens]);

  return (

    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="camera-hud"
      style={{ zIndex: 'var(--z-hud, 2000)' }}
    >
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <button onClick={openGalleria} className="hud-element icon-only" title="Home">
            <Home size={16} />
          </button>
          <button onClick={powerOff} className="hud-element icon-only" title="Power">
            <Power size={16} />
          </button>
          <button
            onClick={() => setShowHistogram(!showHistogram)}
            className={`hud-element slim ${showHistogram ? 'border-accent' : ''}`}
            title="Histogram"
          >
            <BarChart3 size={16} />
            <span className="hud-reading">Graph</span>
          </button>
          <div className="hud-element slim cursor-default" title="Battery">
            <BatteryIcon size={16} className={batteryLevel < 20 ? 'text-red-500' : ''} />
            <div className="hud-reading">{batteryLevel}%</div>
          </div>
        </div>

        <div className="flex items-center gap-2 relative">
          {hudVisibility !== 'minimal' && (
            <>
              <div className="relative">
                <button
                  onClick={() => toggleControl('iso')}
                  className={`hud-element slim ${openControl === 'iso' ? 'border-accent' : ''}`}
                >
                  <Gauge size={16} />
                  <span className="hud-reading">ISO {iso}</span>
                </button>
                <AnimatePresence>
                  {openControl === 'iso' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="hud-drawer"
                    >
                      <div className="drawer-row">
                        <button onClick={() => adjustIso(-100)} className="pill-btn">-</button>
                        <div className="hud-reading">{iso}</div>
                        <button onClick={() => adjustIso(100)} className="pill-btn">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleControl('aperture')}
                  className={`hud-element slim ${openControl === 'aperture' ? 'border-accent' : ''}`}
                >
                  <Aperture size={16} />
                  <span className="hud-reading">f/{aperture.toFixed(1)}</span>
                </button>
                <AnimatePresence>
                  {openControl === 'aperture' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="hud-drawer"
                    >
                      <div className="drawer-row">
                        <button onClick={() => adjustAperture(-0.2)} className="pill-btn">-</button>
                        <div className="hud-reading">f/{aperture.toFixed(1)}</div>
                        <button onClick={() => adjustAperture(0.2)} className="pill-btn">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleControl('shutter')}
                  className={`hud-element slim ${openControl === 'shutter' ? 'border-accent' : ''}`}
                >
                  <Clock size={16} />
                  <span className="hud-reading">{formatShutterSpeed(shutterSpeed)}</span>
                </button>
                <AnimatePresence>
                  {openControl === 'shutter' && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="hud-drawer"
                    >
                      <div className="drawer-row">
                        <button onClick={() => adjustShutter(-1)} className="pill-btn">-</button>
                        <div className="hud-reading">{formatShutterSpeed(shutterSpeed)}</div>
                        <button onClick={() => adjustShutter(1)} className="pill-btn">+</button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="hud-element slim cursor-default">
            <div>
              <div className="hud-label text-[10px]">Body</div>
              <div className="hud-reading">{cameraMode === 'dslr' ? 'DSLR' : 'Mirrorless'}</div>
            </div>
            <button
              onClick={() => setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr')}
              className="pill-btn"
              title="Switch body"
            >
              <Repeat size={14} />
            </button>
          </div>

          <button onClick={() => changeLens(nextLens)} className="hud-element slim" title="Swap lens">
            <Shuffle size={16} />
            <div className="text-left">
              <div className="hud-reading">{nextLens.name}</div>
              <div className="hud-label text-[10px]">Tap to swap</div>
            </div>
          </button>

          <button
            onClick={() => {
              const modes = ['minimal', 'standard'];
              const currentIndex = modes.indexOf(hudVisibility === 'none' ? 'minimal' : hudVisibility);
              const nextIndex = (currentIndex + 1) % modes.length;
              setHudVisibility(modes[nextIndex]);
              setOpenControl(null);
            }}
            className="hud-element icon-only"
            title="HUD Modes"
          >
            {hudVisibility === 'standard' ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHistogram && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="hud-inline-hist"
          >
            {[18, 36, 62, 78, 64, 52, 68, 82, 58, 34].map((value, idx) => (
              <div
                key={`hist-${idx}`}
                style={{ height: `${value}%` }}
                className="hist-bar"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
