import { useState, useEffect, useRef } from 'react';
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
  Grid3x3,
  BarChart3,
  Square,
  Power,
  Zap,
} from 'lucide-react';
import { useCameraContext } from '@/context/CameraContext';

// Histogram Component
function Histogram() {
  const canvasRef = useRef(null);
  const { iso, aperture } = useCameraContext();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Generate dynamic histogram data based on camera settings
    const generateHistogramData = () => {
      const data = [];
      const peak1 = 30 + (iso / 100) * 2; // Shadows
      const peak2 = 128; // Midtones
      const peak3 = 200 - (aperture * 5); // Highlights

      for (let i = 0; i < 256; i++) {
        const shadow = Math.exp(-Math.pow(i - peak1, 2) / 800) * 60;
        const midtone = Math.exp(-Math.pow(i - peak2, 2) / 1200) * 80;
        const highlight = Math.exp(-Math.pow(i - peak3, 2) / 600) * 50;
        data.push(shadow + midtone + highlight + Math.random() * 10);
      }
      return data;
    };

    const histogramData = generateHistogramData();
    const maxValue = Math.max(...histogramData);

    // Draw RGB histograms with slight offsets
    const colors = [
      { color: 'rgba(255, 50, 50, 0.5)', offset: 0 },
      { color: 'rgba(50, 255, 50, 0.5)', offset: 1 },
      { color: 'rgba(50, 150, 255, 0.5)', offset: 2 },
    ];

    colors.forEach(({ color, offset }) => {
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;

      for (let i = 0; i < 256; i++) {
        const x = (i / 256) * width;
        const normalizedHeight = (histogramData[i] / maxValue) * height * 0.85;
        const y = height - normalizedHeight - offset;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // Draw grid lines
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.15)';
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
      const y = (height / 4) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [iso, aperture]);

  return (
    <div className="relative w-64 h-24 bg-black/60 border border-hud-border rounded-lg p-2">
      <canvas
        ref={canvasRef}
        width={240}
        height={80}
        className="w-full h-full"
      />
      <div className="absolute top-1 left-2 text-[10px] font-mono text-hud-text opacity-70">
        RGB
      </div>
    </div>
  );
}

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
    ruleOfThirds,
    setRuleOfThirds,
    showHistogram,
    setShowHistogram,
    powerState,
    powerOn,
    powerOff,
    flashMode,
    setFlashMode,
  } = useCameraContext();

  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

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
    <>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="camera-hud"
        style={{ zIndex: 'var(--z-hud, 2000)' }}
      >
        {/* Left Section - Camera Mode & Power */}
        <div className="flex items-center gap-3">
          {/* Power Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => powerState === 'on' ? powerOff() : powerOn()}
            className={`hud-element ${powerState === 'on' ? 'bg-hud-element border-hud-border' : 'bg-red-900/20 border-red-500/30'}`}
          >
            <Power
              size={16}
              className={powerState === 'on' ? 'text-hud-text' : 'text-red-500'}
            />
          </motion.button>

          {/* Camera Mode & Lens */}
          <div className="hud-element cursor-default">
            <Settings size={16} />
            <div>
              <div className="hud-reading">{cameraMode.toUpperCase()}</div>
              <div className="hud-label text-xs">{currentLens.name}</div>
            </div>
          </div>

          {/* Flash/Theme Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const modes = ['auto', 'on', 'off'];
              const currentIndex = modes.indexOf(flashMode);
              const nextIndex = (currentIndex + 1) % modes.length;
              setFlashMode(modes[nextIndex]);
            }}
            className="hud-element"
            title={`Flash: ${flashMode}`}
          >
            <Zap size={16} className={flashMode === 'on' ? 'text-yellow-400' : ''} />
            <div className="hud-reading text-xs">{flashMode.toUpperCase()}</div>
          </motion.button>
        </div>

        {/* Center Section - Camera Readings */}
        {(hudVisibility === 'standard' || hudVisibility === 'full') && (
          <div className="flex items-center gap-6">
            {/* ISO */}
            <div className="hud-element cursor-default">
              <Gauge size={16} />
              <div className="hud-reading">ISO {iso}</div>
            </div>

            {/* Aperture */}
            <div className="hud-element cursor-default">
              <Aperture size={16} />
              <div className="hud-reading">f/{aperture}</div>
            </div>

            {/* Shutter Speed */}
            <div className="hud-element cursor-default">
              <Clock size={16} />
              <div className="hud-reading">{formatShutterSpeed(shutterSpeed)}</div>
            </div>

            {/* Exposure Compensation */}
            {exposureComp !== 0 && (
              <div className="hud-element cursor-default">
                <div className="hud-reading">
                  {exposureComp > 0 ? '+' : ''}{exposureComp} EV
                </div>
              </div>
            )}
          </div>
        )}

        {/* Right Section - Tools & Battery */}
        <div className="flex items-center gap-3">
          {/* Histogram Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowHistogram(!showHistogram)}
            className={`hud-element ${showHistogram ? 'bg-hud-element border-accent' : ''}`}
            title="Toggle Histogram"
          >
            <BarChart3 size={16} className={showHistogram ? 'text-accent' : ''} />
          </motion.button>

          {/* Rule of Thirds Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setRuleOfThirds(!ruleOfThirds)}
            className={`hud-element ${ruleOfThirds ? 'bg-hud-element border-accent' : ''}`}
            title="Toggle Rule of Thirds"
          >
            <Grid3x3 size={16} className={ruleOfThirds ? 'text-accent' : ''} />
          </motion.button>

          {/* Frame Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdvancedControls(!showAdvancedControls)}
            className={`hud-element ${showAdvancedControls ? 'bg-hud-element border-accent' : ''}`}
            title="Toggle Frame"
          >
            <Square size={16} className={showAdvancedControls ? 'text-accent' : ''} />
          </motion.button>

          {/* Battery */}
          <div className="hud-element cursor-default">
            <BatteryIcon
              size={16}
              className={batteryLevel < 20 ? 'text-red-500' : batteryLevel < 40 ? 'text-yellow-500' : 'text-hud-text'}
            />
            <div className="hud-reading">{batteryLevel}%</div>
          </div>

          {/* HUD Visibility Toggle */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const modes = ['none', 'minimal', 'standard', 'full'];
              const currentIndex = modes.indexOf(hudVisibility);
              const nextIndex = (currentIndex + 1) % modes.length;
              setHudVisibility(modes[nextIndex]);
            }}
            className="hud-element"
            title="Toggle HUD"
          >
            {hudVisibility === 'full' ? <Eye size={16} /> : <EyeOff size={16} />}
          </motion.button>
        </div>
      </motion.div>

      {/* Histogram Display - Floating Above HUD */}
      <AnimatePresence>
        {showHistogram && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-8 z-[2001]"
          >
            <Histogram />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rule of Thirds Grid Overlay */}
      <AnimatePresence>
        {ruleOfThirds && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 pointer-events-none z-[1500]"
          >
            {/* Vertical Lines */}
            <div className="absolute left-1/3 top-0 bottom-0 w-[1px] bg-hud-text/30" />
            <div className="absolute left-2/3 top-0 bottom-0 w-[1px] bg-hud-text/30" />

            {/* Horizontal Lines */}
            <div className="absolute top-1/3 left-0 right-0 h-[1px] bg-hud-text/30" />
            <div className="absolute top-2/3 left-0 right-0 h-[1px] bg-hud-text/30" />

            {/* Center Point */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-hud-text/50" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Frame Overlay */}
      <AnimatePresence>
        {showAdvancedControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 pointer-events-none z-[1500]"
          >
            {/* Corner Brackets */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-accent/60" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-accent/60" />
            <div className="absolute bottom-24 left-8 w-16 h-16 border-l-2 border-b-2 border-accent/60" />
            <div className="absolute bottom-24 right-8 w-16 h-16 border-r-2 border-b-2 border-accent/60" />

            {/* Aspect Ratio Info */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 glass-strong px-3 py-1 rounded-lg">
              <p className="text-xs font-mono text-hud-text">16:9 • {currentLens.name}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
