import { useMemo } from 'react';
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

  if (hudVisibility === 'none') return null;

  const getBatteryIcon = () => {
    if (batteryLevel > 60) return BatteryFull;
    if (batteryLevel > 30) return BatteryMedium;
    return BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();

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
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="camera-hud"
      style={{ zIndex: 'var(--z-hud, 2000)' }}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <div className="hud-element cursor-default min-w-[150px]">
            <div className="flex items-center justify-between w-full">
              <div>
                <div className="hud-label text-[11px] uppercase tracking-[0.18em]">Body</div>
                <div className="hud-reading">{cameraMode === 'dslr' ? 'DSLR' : 'Mirrorless'}</div>
              </div>
              <button
                onClick={() => setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr')}
                className="pill-btn px-3 py-1 text-[11px]"
              >
                <Repeat size={14} />
              </button>
            </div>
            <div className="hud-label text-xs mt-1 text-white/70">{currentLens.name}</div>
          </div>

          <button onClick={() => changeLens(nextLens)} className="hud-element">
            <Shuffle size={16} />
            <div>
              <div className="hud-reading">{nextLens.name}</div>
              <div className="hud-label text-xs">Swap lens</div>
            </div>
          </button>
        </div>

        {/* Center Section - Camera Readings */}
        {(hudVisibility === 'standard' || hudVisibility === 'full') && (
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <div className="hud-element slim">
              <div className="flex items-center gap-2">
                <Gauge size={16} />
                <span className="hud-label text-[11px]">ISO</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adjustIso(-100)} className="pill-btn">-</button>
                <div className="hud-reading">{iso}</div>
                <button onClick={() => adjustIso(100)} className="pill-btn">+</button>
              </div>
            </div>

            <div className="hud-element slim">
              <div className="flex items-center gap-2">
                <Aperture size={16} />
                <span className="hud-label text-[11px]">Aperture</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adjustAperture(-0.2)} className="pill-btn">-</button>
                <div className="hud-reading">f/{aperture.toFixed(1)}</div>
                <button onClick={() => adjustAperture(0.2)} className="pill-btn">+</button>
              </div>
            </div>

            <div className="hud-element slim">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span className="hud-label text-[11px]">Shutter</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => adjustShutter(-1)} className="pill-btn">-</button>
                <div className="hud-reading">{formatShutterSpeed(shutterSpeed)}</div>
                <button onClick={() => adjustShutter(1)} className="pill-btn">+</button>
              </div>
            </div>
          </div>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistogram(!showHistogram)}
            className={`hud-element slim ${showHistogram ? 'border-accent' : ''}`}
          >
            <BarChart3 size={16} />
            <div className="hud-reading">{showHistogram ? 'Histogram' : 'Graph'}</div>
          </button>

          <div className="hud-element slim cursor-default">
            <BatteryIcon
              size={16}
              className={batteryLevel < 20 ? 'text-red-500' : ''}
            />
            <div className="hud-reading">{batteryLevel}%</div>
          </div>

          <button
            onClick={openGalleria}
            className="hud-element icon-only"
            title="Home"
          >
            <Home size={16} />
          </button>

          <button
            onClick={powerOff}
            className="hud-element icon-only"
            title="Power"
          >
            <Power size={16} />
          </button>

          <button
            onClick={() => {
              const modes = ['none', 'minimal', 'standard', 'full'];
              const currentIndex = modes.indexOf(hudVisibility);
              const nextIndex = (currentIndex + 1) % modes.length;
              setHudVisibility(modes[nextIndex]);
            }}
            className="hud-element icon-only"
            title="HUD Modes"
          >
            {hudVisibility === 'full' ? <Eye size={16} /> : <EyeOff size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showHistogram && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="w-full mt-2"
          >
            <div className="inline-flex items-end gap-1 glass-strong px-4 py-2 rounded-xl border border-accent/50 shadow-lg">
              {[18, 36, 62, 78, 64, 52, 68, 82, 58, 34].map((value, idx) => (
                <div
                  key={`hist-${idx}`}
                  style={{ height: `${value}%` }}
                  className="w-2 rounded-md bg-gradient-to-t from-accent/70 via-white/70 to-white/95 shadow-[0_10px_30px_-12px_var(--accent-glow)]"
                />
              ))}
              <div className="ml-4 text-[11px] uppercase tracking-[0.2em] text-white/70">
                Live exposure graph
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
