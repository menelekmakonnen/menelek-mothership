import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
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
} from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

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
  } = useCameraContext();

  if (hudVisibility === 'none') return null;

  const getBatteryIcon = () => {
    if (batteryLevel > 60) return BatteryFull;
    if (batteryLevel > 30) return BatteryMedium;
    return BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `${speed}"`;
    return `1/${speed}`;
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
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Camera Mode & Lens */}
        <div className="hud-element cursor-default">
          <Settings size={16} />
          <div>
            <div className="hud-reading">{cameraMode.toUpperCase()}</div>
            <div className="hud-label text-xs">{currentLens.name}</div>
          </div>
        </div>

        <button
          onClick={() => setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr')}
          className="hud-element"
        >
          <Repeat size={16} />
          <div>
            <div className="hud-reading">{cameraMode === 'dslr' ? 'DSLR' : 'Mirrorless'}</div>
            <div className="hud-label text-xs">Toggle body</div>
          </div>
        </button>

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
        <div className="flex items-center gap-6">
          {/* ISO */}
          <div className="hud-element">
            <Gauge size={16} />
            <div className="hud-reading">ISO {iso}</div>
          </div>

          {/* Aperture */}
          <div className="hud-element">
            <Aperture size={16} />
            <div className="hud-reading">f/{aperture}</div>
          </div>

          {/* Shutter Speed */}
          <div className="hud-element">
            <Clock size={16} />
            <div className="hud-reading">{formatShutterSpeed(shutterSpeed)}</div>
          </div>

          {/* Exposure Compensation */}
          {exposureComp !== 0 && (
            <div className="hud-element">
              <div className="hud-reading">
                {exposureComp > 0 ? '+' : ''}{exposureComp} EV
              </div>
            </div>
          )}
        </div>
      )}

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {/* Histogram Toggle */}
        <button
          onClick={() => setShowHistogram(!showHistogram)}
          className={`hud-element ${showHistogram ? 'border-accent' : ''}`}
        >
          <BarChart3 size={16} />
          <div className="hud-reading">{showHistogram ? 'Histogram On' : 'Histogram Off'}</div>
        </button>

        {/* Battery */}
        <div className="hud-element cursor-default">
          <BatteryIcon
            size={16}
            className={batteryLevel < 20 ? 'text-red-500' : ''}
          />
          <div className="hud-reading">{batteryLevel}%</div>
        </div>

        {/* HUD Visibility Toggle */}
        <button
          onClick={() => {
            const modes = ['none', 'minimal', 'standard', 'full'];
            const currentIndex = modes.indexOf(hudVisibility);
            const nextIndex = (currentIndex + 1) % modes.length;
            setHudVisibility(modes[nextIndex]);
          }}
          className="hud-element"
        >
          {hudVisibility === 'full' ? <Eye size={16} /> : <EyeOff size={16} />}
        </button>
      </div>

      <AnimatePresence>
        {showHistogram && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute left-1/2 -translate-x-1/2 -top-20 glass-strong px-4 py-3 rounded-xl"
          >
            <div className="flex gap-1 h-16 w-64 items-end">
              {[10, 30, 50, 80, 60, 40, 70, 90, 65, 35].map((value, idx) => (
                <div
                  key={`hist-${idx}`}
                  style={{ height: `${value}%` }}
                  className="flex-1 bg-gradient-to-t from-accent/60 via-accent/40 to-white/30 rounded-sm"
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
