import { useCameraContext } from '@/context/CameraContext';
import { useState } from 'react';
import { Camera, Aperture, Zap, Sun, Droplets, Focus, Grid3x3, BarChart3, Eye, RotateCcw } from 'lucide-react';

export default function DesktopControls() {
  const {
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
    currentLens,
    changeLens,
    availableLenses,
    ruleOfThirds,
    setRuleOfThirds,
    showHistogram,
    setShowHistogram,
    focusMode,
    setFocusMode,
    hudVisibility,
    setHudVisibility,
  } = useCameraContext();

  const [resetStage, setResetStage] = useState(0);

  const handleReset = () => {
    if (resetStage === 0) {
      // First click: Remove overlays
      setShowHistogram(false);
      setRuleOfThirds(false);
      setResetStage(1);
      setTimeout(() => setResetStage(0), 3000);
    } else if (resetStage === 1) {
      // Second click: Reset page
      window.location.reload();
    }
  };

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `${speed}"`;
    return `1/${speed}`;
  };

  return (
    <div className="hidden md:block fixed top-4 left-1/2 -translate-x-1/2 z-[1500] pointer-events-none">
      <div className="camera-hud rounded-lg p-4 pointer-events-auto">
        <div className="flex items-start gap-6">
          {/* Lens Selector */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75 mb-3">
              <Camera className="w-4 h-4" />
              <span className="mono tracking-wider">LENS</span>
            </div>
            <div className="flex gap-2">
              {availableLenses.map((lens) => (
                <button
                  key={lens.id}
                  onClick={() => changeLens(lens)}
                  className={`px-3 py-2 rounded text-xs mono transition-all ${
                    currentLens.id === lens.id
                      ? 'bg-green-500/20 border border-green-500/50 text-green-400'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                  title={lens.name}
                >
                  {lens.id}
                </button>
              ))}
            </div>
          </div>

          {/* ISO Dial */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <span className="mono tracking-wider">ISO</span>
              <span className="font-bold">{iso}</span>
            </div>
            <div className="flex gap-1">
              {[100, 200, 400, 800, 1600, 3200, 6400].map((value) => (
                <button
                  key={value}
                  onClick={() => setIso(value)}
                  className={`px-2 py-1 rounded text-xs mono transition-all ${
                    iso === value
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>

          {/* Aperture Dial */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Aperture className="w-4 h-4" />
              <span className="mono tracking-wider">f/{aperture.toFixed(1)}</span>
            </div>
            <div className="flex gap-1">
              {[1.4, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22].map((value) => (
                <button
                  key={value}
                  onClick={() => setAperture(value)}
                  className={`px-2 py-1 rounded text-xs mono transition-all ${
                    Math.abs(aperture - value) < 0.1
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-6 mt-4 pt-4 border-t border-white/10">
          {/* Shutter Speed Dial */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Zap className="w-4 h-4" />
              <span className="mono tracking-wider">{formatShutterSpeed(shutterSpeed)}</span>
            </div>
            <div className="flex gap-1">
              {[8000, 4000, 2000, 1000, 500, 250, 125, 60, 30].map((value) => (
                <button
                  key={value}
                  onClick={() => setShutterSpeed(value)}
                  className={`px-2 py-1 rounded text-xs mono transition-all ${
                    shutterSpeed === value
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  1/{value}
                </button>
              ))}
            </div>
          </div>

          {/* EV Compensation */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Sun className="w-4 h-4" />
              <span className="mono tracking-wider">
                {exposureComp > 0 ? '+' : ''}{exposureComp.toFixed(1)} EV
              </span>
            </div>
            <div className="flex gap-1">
              {[-3, -2, -1, 0, 1, 2, 3].map((value) => (
                <button
                  key={value}
                  onClick={() => setExposureComp(value)}
                  className={`px-2 py-1 rounded text-xs mono transition-all ${
                    Math.abs(exposureComp - value) < 0.1
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {value > 0 ? '+' : ''}{value}
                </button>
              ))}
            </div>
          </div>

          {/* White Balance */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Droplets className="w-4 h-4" />
              <span className="mono tracking-wider">WB: {whiteBalance.toUpperCase()}</span>
            </div>
            <div className="flex gap-1">
              {['daylight', 'cloudy', 'tungsten', 'fluorescent', 'custom'].map((value) => (
                <button
                  key={value}
                  onClick={() => setWhiteBalance(value)}
                  className={`px-2 py-1 rounded text-xs mono transition-all capitalize ${
                    whiteBalance === value
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {value.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10">
          {/* Focus Mode */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Focus className="w-4 h-4" />
              <span className="mono tracking-wider">FOCUS</span>
            </div>
            <div className="flex gap-1">
              {[
                { id: 'single', label: 'AF-S' },
                { id: 'continuous', label: 'AF-C' },
                { id: 'manual', label: 'MF' }
              ].map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setFocusMode(mode.id)}
                  className={`px-3 py-1 rounded text-xs mono transition-all ${
                    focusMode === mode.id
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Flash Mode */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Zap className="w-4 h-4" />
              <span className="mono tracking-wider">FLASH</span>
            </div>
            <div className="flex gap-1">
              {['auto', 'on', 'off'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setFlashMode(mode)}
                  className={`px-3 py-1 rounded text-xs mono transition-all capitalize ${
                    flashMode === mode
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* HUD Visibility */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs opacity-75">
              <Eye className="w-4 h-4" />
              <span className="mono tracking-wider">HUD</span>
            </div>
            <div className="flex gap-1">
              {['none', 'minimal', 'standard', 'full'].map((mode) => (
                <button
                  key={mode}
                  onClick={() => setHudVisibility(mode)}
                  className={`px-2 py-1 rounded text-xs mono transition-all capitalize ${
                    hudVisibility === mode
                      ? 'bg-green-500/20 border border-green-500/50'
                      : 'bg-white/5 border border-white/10 hover:border-white/30'
                  }`}
                >
                  {mode.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          {/* Assist Tools */}
          <div className="space-y-2">
            <div className="text-xs opacity-75 mono tracking-wider">ASSIST</div>
            <div className="flex gap-2">
              <button
                onClick={() => setRuleOfThirds(!ruleOfThirds)}
                className={`p-2 rounded transition-all ${
                  ruleOfThirds
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
                title="Rule of Thirds"
              >
                <Grid3x3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setShowHistogram(!showHistogram)}
                className={`p-2 rounded transition-all ${
                  showHistogram
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/30'
                }`}
                title="Histogram"
              >
                <BarChart3 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Reset Button */}
          <div className="space-y-2">
            <div className="text-xs opacity-75 mono tracking-wider">RESET</div>
            <button
              onClick={handleReset}
              className={`p-2 rounded transition-all ${
                resetStage === 1
                  ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 animate-pulse'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
              title={resetStage === 0 ? 'Clear overlays' : 'Reset page'}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
