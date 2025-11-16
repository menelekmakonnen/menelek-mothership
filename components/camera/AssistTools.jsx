import { useCameraContext } from '@/context/CameraContext';
import { Grid3x3, BarChart3 } from 'lucide-react';

export default function AssistTools({ variant = 'panel' }) {
  const { ruleOfThirds, setRuleOfThirds, showHistogram, setShowHistogram } = useCameraContext();

  const gridLevels = [
    { id: 'off', label: 'Off', desc: 'Hide framing guides.' },
    { id: 'classic', label: 'Classic', desc: 'Standard 3x3 guidance.' },
    { id: 'precision', label: 'Precision', desc: 'Adds horizon splits and diagonals.' },
    { id: 'golden', label: 'Cinematic', desc: 'Dense grid with golden ratio highlights.' },
  ];

  const histogramButton = (
    <button
      onClick={() => setShowHistogram(!showHistogram)}
      className={`flex items-center gap-2 rounded-xl border px-4 py-3 transition-all ${
        showHistogram ? 'border-green-400/60 bg-green-500/15 text-green-200' : 'border-white/12 bg-white/5'
      }`}
    >
      <BarChart3 className="w-4 h-4" />
      <span className="tracking-[0.25em] uppercase text-[10px]">Histogram</span>
    </button>
  );

  const gridPicker = (
    <div>
      <div className="flex items-center justify-between mb-2 uppercase tracking-[0.25em] text-[10px] opacity-70">
        <span className="flex items-center gap-2">
          <Grid3x3 className="w-4 h-4" /> Framing
        </span>
        <span>{gridLevels.find((level) => level.id === ruleOfThirds)?.label}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {gridLevels.map((level) => (
          <button
            key={level.id}
            onClick={() => setRuleOfThirds(level.id)}
            className={`px-3 py-2 rounded-xl border transition-all ${
              ruleOfThirds === level.id
                ? 'border-green-400/60 bg-green-500/15 text-green-200 shadow-lg'
                : 'border-white/12 bg-white/5 hover:border-white/30'
            }`}
          >
            <div className="font-semibold text-[11px] uppercase tracking-[0.2em]">{level.label}</div>
            <div className="text-[10px] opacity-60 leading-tight">{level.desc}</div>
          </button>
        ))}
      </div>
    </div>
  );

  if (variant === 'inline') {
    return (
      <div className="flex flex-col gap-4 mono text-[11px]">
        {gridPicker}
        {histogramButton}
      </div>
    );
  }

  return (
    <div className="space-y-4 mono text-xs">
      <div>
        <div className="flex items-center gap-2 justify-between mb-2">
          <div className="flex items-center gap-2">
            <Grid3x3 className="w-4 h-4" />
            <span className="uppercase tracking-wide text-[11px]">Framing Grid</span>
          </div>
          <span className="text-[10px] opacity-60 uppercase">{gridLevels.find((level) => level.id === ruleOfThirds)?.label}</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {gridLevels.map((level) => (
            <button
              key={level.id}
              onClick={() => setRuleOfThirds(level.id)}
              className={`px-3 py-2 rounded text-left transition-all ${
                ruleOfThirds === level.id
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50 shadow-lg'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              <div className="font-bold text-xs uppercase">{level.label}</div>
              <div className="text-[9px] opacity-60 mt-1 leading-relaxed">{level.desc}</div>
            </button>
          ))}
        </div>
      </div>

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
    </div>
  );
}
