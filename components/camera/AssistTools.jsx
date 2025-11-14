import { useCameraContext } from '@/context/CameraContext';
import { Grid3x3, BarChart3, Focus } from 'lucide-react';

export default function AssistTools() {
  const {
    ruleOfThirds,
    setRuleOfThirds,
    showHistogram,
    setShowHistogram,
    focusMode,
    setFocusMode,
    hudVisibility,
    setHudVisibility,
    applyCameraPreset,
    activePreset,
  } = useCameraContext();

  const focusModes = [
    { id: 'single', label: 'AF-S (Single)', desc: 'Single autofocus' },
    { id: 'continuous', label: 'AF-C (Continuous)', desc: 'Continuous AF' },
    { id: 'manual', label: 'MF (Manual)', desc: 'Manual focus' },
  ];

  const hudModes = [
    { id: 'none', label: 'None' },
    { id: 'minimal', label: 'Minimal' },
    { id: 'standard', label: 'Standard' },
    { id: 'full', label: 'Full' },
  ];

  const presets = [
    { id: 'modern', label: 'Modern Hybrid', description: 'Balanced mirrorless layout with adaptive flash.' },
    { id: 'retro', label: 'Retro HUD', description: 'Warm tungsten palette with manual focus bias.' },
    { id: 'cinema', label: 'Cinema Rig', description: 'Film-centric HUD with flash disabled and EV guard.' },
  ];

  return (
    <div className="space-y-4 mono text-xs">
      {/* Rule of Thirds Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4" />
          <span>Rule of Thirds</span>
        </div>
        <button
          onClick={() => setRuleOfThirds(!ruleOfThirds)}
          className={`px-3 py-1 rounded transition-all ${
            ruleOfThirds
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {ruleOfThirds ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Histogram Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4" />
          <span>Histogram</span>
        </div>
        <button
          onClick={() => setShowHistogram(!showHistogram)}
          className={`px-3 py-1 rounded transition-all ${
            showHistogram
              ? 'bg-green-500/20 text-green-400 border border-green-500/50'
              : 'bg-white/5 border border-white/10'
          }`}
        >
          {showHistogram ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Focus Mode Selector */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-2">
          <Focus className="w-4 h-4" />
          <span className="text-[10px] opacity-75 tracking-wider">FOCUS MODE</span>
        </div>
        <div className="space-y-1">
          {focusModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setFocusMode(mode.id)}
              className={`w-full px-3 py-2 rounded text-left transition-all ${
                focusMode === mode.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              <div className="font-bold">{mode.label}</div>
              <div className="text-[9px] opacity-60">{mode.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* HUD Visibility */}
      <div className="space-y-2">
        <div className="text-[10px] opacity-75 tracking-wider">HUD DISPLAY</div>
        <div className="grid grid-cols-2 gap-2">
          {hudModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setHudVisibility(mode.id)}
              className={`px-3 py-2 rounded transition-all ${
                hudVisibility === mode.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Camera presets */}
      <div className="space-y-2">
        <div className="text-[10px] opacity-75 tracking-wider">CAMERA PRESETS</div>
        <div className="space-y-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => applyCameraPreset(preset.id)}
              className={`w-full px-3 py-3 rounded text-left transition-all ${
                activePreset === preset.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              <div className="font-bold text-xs uppercase">{preset.label}</div>
              <div className="text-[9px] opacity-60 mt-1">{preset.description}</div>
            </button>
          ))}
          <button
            onClick={() => applyCameraPreset(null)}
            className={`w-full px-3 py-2 rounded text-left transition-all text-[11px] mono uppercase ${
              !activePreset ? 'bg-green-500/10 text-green-400 border border-green-400/50' : 'bg-white/5 border border-white/10 hover:border-white/30'
            }`}
          >
            Manual Setup
          </button>
        </div>
      </div>
    </div>
  );
}
