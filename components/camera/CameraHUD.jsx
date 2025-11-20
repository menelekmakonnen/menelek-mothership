import { useState } from 'react';
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
  Power
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
    batteryLevel,
    cameraMode,
    powerState,
    setPowerState,
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
        {/* Battery */}
        <div className="hud-element cursor-default">
          <BatteryIcon
            size={16}
            className={batteryLevel < 20 ? 'text-red-500' : ''}
          />
          <div className="hud-reading">{batteryLevel}%</div>
        </div>

        {/* Power Button */}
        <button
          onClick={() => setPowerState(powerState === 'on' ? 'off' : 'on')}
          className="hud-element"
          title={powerState === 'on' ? 'Power Off' : 'Power On'}
        >
          <Power
            size={16}
            className={powerState === 'on' ? 'text-green-400' : 'text-red-400'}
          />
        </button>

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
    </motion.div>
  );
}
