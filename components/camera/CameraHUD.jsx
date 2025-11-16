import { useCameraContext } from '@/context/CameraContext';
import { useEffect, useState, useMemo } from 'react';
import BatteryIndicator from './BatteryIndicator';
import { Camera } from 'lucide-react';

export default function CameraHUD() {
  const {
    iso,
    aperture,
    shutterSpeed,
    exposureComp,
    currentLens,
    whiteBalance,
    focusMode,
    hudVisibility,
    setHudVisibility,
    batteryLevel,
    cameraMode,
    interfaceModules,
    theme,
    currentSection,
  } = useCameraContext();

  const [accentColor, setAccentColor] = useState('#00ff88');
  const [accentRgb, setAccentRgb] = useState('0, 255, 136');
  const [realTimeData, setRealTimeData] = useState({
    avgBrightness: 50,
    avgColor: 'rgb(128, 128, 128)',
    highlightWarning: false,
    shadowWarning: false,
  });
  const [audioLevels, setAudioLevels] = useState([30, 55, 40]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const styles = getComputedStyle(document.documentElement);
    const accent = styles.getPropertyValue('--accent').trim() || '#00ff88';
    const accentChannel = styles.getPropertyValue('--accent-rgb').trim() || '0, 255, 136';
    setAccentColor(accent);
    setAccentRgb(accentChannel);
  }, [theme, cameraMode]);

  // Analyze page content for real-time readings
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const parseColor = (value) => {
      if (!value) return null;
      if (value.startsWith('#')) {
        const hex = value.replace('#', '');
        const bigint = parseInt(hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex, 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;
        return { r, g, b, a: 1 };
      }
      const match = value.match(/rgba?\(([^)]+)\)/i);
      if (!match) return null;
      const parts = match[1].split(',').map((part) => part.trim());
      const [r, g, b, a = '1'] = parts;
      return { r: Number(r), g: Number(g), b: Number(b), a: Number(a) };
    };

    const parseGradientColor = (value) => {
      if (!value || value === 'none') return null;
      const matches = value.match(/(rgba?\([^\)]+\)|#[0-9a-fA-F]{3,8})/gi);
      if (!matches || matches.length === 0) return null;
      for (const match of matches) {
        const parsed = parseColor(match.trim());
        if (parsed) {
          return parsed;
        }
      }
      return null;
    };

    const getEffectiveBackground = (node) => {
      let current = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const bg = parseColor(style.backgroundColor);
        if (bg && bg.a > 0) {
          return bg;
        }
        const gradientColor = parseGradientColor(style.backgroundImage);
        if (gradientColor) {
          return gradientColor;
        }
        const textColor = parseColor(style.color);
        if (textColor && textColor.a > 0.6) {
          return textColor;
        }
        current = current.parentElement;
      }
      const fallback = parseColor(window.getComputedStyle(document.body).backgroundColor);
      return fallback || { r: 10, g: 10, b: 10, a: 1 };
    };

    const computeBrightness = (color) => {
      if (!color) return 0;
      const { r, g, b } = color;
      const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
      return Math.max(0, Math.min(100, (luminance / 255) * 100));
    };

    const analyzeContent = () => {
      try {
        const points = [
          [0.25, 0.25],
          [0.5, 0.25],
          [0.75, 0.25],
          [0.25, 0.5],
          [0.5, 0.5],
          [0.75, 0.5],
          [0.25, 0.75],
          [0.5, 0.75],
          [0.75, 0.75],
        ];

        const totals = { r: 0, g: 0, b: 0 };
        let brightnessSum = 0;
        let samples = 0;
        let highlightCount = 0;
        let shadowCount = 0;

        const width = window.innerWidth;
        const height = window.innerHeight;

        points.forEach(([px, py]) => {
          const x = Math.round(width * px);
          const y = Math.round(height * py);
          let element = document.elementFromPoint(x, y);

          if (!element) return;

          const hudAncestor = element.closest?.('.camera-hud');
          if (hudAncestor) {
            element = hudAncestor.parentElement || element.parentElement;
          }

          if (!element) return;

          const color = getEffectiveBackground(element);
          const brightness = computeBrightness(color);

          totals.r += color.r;
          totals.g += color.g;
          totals.b += color.b;
          brightnessSum += brightness;
          samples += 1;

          if (brightness > 78) highlightCount += 1;
          if (brightness < 22) shadowCount += 1;
        });

        if (samples === 0) return;

        const avgBrightness = brightnessSum / samples;
        const clampChannel = (value) => Math.max(0, Math.min(255, value));
        const avgColor = {
          r: clampChannel(totals.r / samples),
          g: clampChannel(totals.g / samples),
          b: clampChannel(totals.b / samples),
        };

        setRealTimeData({
          avgBrightness: Math.round(avgBrightness),
          avgColor: `rgb(${Math.round(avgColor.r)}, ${Math.round(avgColor.g)}, ${Math.round(avgColor.b)})`,
          highlightWarning: highlightCount >= 3,
          shadowWarning: shadowCount >= 3,
        });
      } catch (error) {
        console.error('Error analyzing content:', error);
      }
    };

    analyzeContent();
    const interval = setInterval(analyzeContent, 1500);
    window.addEventListener('resize', analyzeContent);

    const attributeObserver = typeof MutationObserver !== 'undefined'
      ? new MutationObserver(() => analyzeContent())
      : null;
    attributeObserver?.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme', 'data-camera-skin', 'data-camera-preset'],
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', analyzeContent);
      attributeObserver?.disconnect();
    };
  }, [iso, aperture, shutterSpeed, whiteBalance, currentLens, interfaceModules, theme, currentSection]);

  useEffect(() => {
    if (!interfaceModules.audioMeters) return;
    const interval = setInterval(() => {
      setAudioLevels((prev) => prev.map(() => 20 + Math.random() * 60));
    }, 500);
    return () => clearInterval(interval);
  }, [interfaceModules.audioMeters]);

  if (hudVisibility === 'none') return null;

  const accentNeedle = useMemo(() => {
    const parseAccent = (value) => {
      if (!value) return { r: 0, g: 255, b: 136 };
      if (value.startsWith('#')) {
        const hex = value.replace('#', '');
        const fullHex = hex.length === 3 ? hex.split('').map((char) => char + char).join('') : hex;
        const int = parseInt(fullHex, 16);
        return {
          r: (int >> 16) & 255,
          g: (int >> 8) & 255,
          b: int & 255,
        };
      }
      const rgbMatch = value.match(/rgba?\(([^)]+)\)/i);
      if (rgbMatch) {
        const [r, g, b] = rgbMatch[1].split(',').slice(0, 3).map((part) => Number(part.trim()));
        return { r, g, b };
      }
      return { r: 0, g: 255, b: 136 };
    };

    const { r, g, b } = parseAccent(accentColor);
    return `rgba(${r}, ${g}, ${b}, 0.85)`;
  }, [accentColor]);

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `${speed}"`;
    return `1/${speed}`;
  };

  const formatAperture = (ap) => `f/${ap.toFixed(1)}`;

  const hudModes = [
    { id: 'none', label: 'Off' },
    { id: 'minimal', label: 'Min' },
    { id: 'standard', label: 'Std' },
    { id: 'full', label: 'Full' },
  ];

  const analogNeedle = (() => {
    const exposureBias = exposureComp * 30;
    const isoBias = (iso - 400) / 100;
    const apertureBias = (2.8 - aperture) * 10;
    const shutterBias = (125 - shutterSpeed) / 20;
    const total = exposureBias + isoBias + apertureBias + shutterBias;
    return Math.max(-60, Math.min(60, total));
  })();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[2500] pointer-events-none">
      <div className="camera-hud border-t px-4 py-3 flex items-center justify-between gap-4 mono text-xs pointer-events-auto">
        {/* Left section - Camera mode and lens */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Camera className="w-4 h-4" />
            <span className="uppercase tracking-wider">
              {cameraMode === 'dslr' ? 'DSLR' : 'Mirrorless'}
            </span>
          </div>
          {(hudVisibility === 'standard' || hudVisibility === 'full') && (
            <div className="text-[10px] opacity-75">
              {currentLens.name}
            </div>
          )}
        </div>

        {/* Center section - Main camera readings */}
        <div className="flex items-center gap-6">
          {interfaceModules.analogMeter && (
            <div className="hidden md:flex flex-col items-center mr-4">
              <div className="mono text-[9px] uppercase tracking-[0.3em] opacity-70 text-[color:var(--hud-text)] mb-1">Meter</div>
              <div
                className="relative w-24 h-12 rounded-b-full border overflow-hidden"
                style={{ borderColor: `rgba(${accentRgb}, 0.45)`, backgroundColor: `rgba(${accentRgb}, 0.1)` }}
              >
                <div className="absolute inset-x-4 bottom-2 h-1 hud-accent-gradient opacity-80" />
                <div
                  className="absolute left-1/2 bottom-0 w-0.5 h-10 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${analogNeedle}deg)`, backgroundColor: accentNeedle }}
                />
              </div>
            </div>
          )}
          {/* ISO */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">ISO</div>
            <div className="font-bold text-[color:var(--hud-text)]">{iso}</div>
          </div>

          {/* Aperture */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">APERTURE</div>
            <div className="font-bold text-[color:var(--hud-text)]">{formatAperture(aperture)}</div>
          </div>

          {/* Shutter Speed */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">SHUTTER</div>
            <div className="font-bold text-[color:var(--hud-text)]">{formatShutterSpeed(shutterSpeed)}</div>
          </div>

          {/* Focus Mode */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">FOCUS</div>
            <div className="font-bold uppercase text-[10px] text-[color:var(--hud-text)]">
              {focusMode === 'single' ? 'AF-S' : focusMode === 'continuous' ? 'AF-C' : 'MF'}
            </div>
          </div>

          {(hudVisibility === 'standard' || hudVisibility === 'full') && (
            <>
              {/* Exposure Compensation */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">EV</div>
                <div className="font-bold text-[color:var(--hud-text)]">
                  {exposureComp > 0 ? '+' : ''}{exposureComp.toFixed(1)}
                </div>
              </div>

              {/* White Balance */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">WB</div>
                <div className="font-bold uppercase text-[10px] text-[color:var(--hud-text)]">
                  {whiteBalance.slice(0, 3)}
                </div>
              </div>
            </>
          )}

          {hudVisibility === 'full' && (
            <>
              {/* Brightness reading */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">LUX</div>
                <div className="font-bold text-[color:var(--hud-text)]">{realTimeData.avgBrightness}</div>
              </div>

              {/* Scene analyser */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">SCENE</div>
                <div className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ backgroundColor: realTimeData.avgColor }}
                    aria-label={`Scene color ${realTimeData.avgColor}`}
                  />
                  <div className="text-[10px] font-semibold flex gap-1 text-[color:var(--hud-text)]">
                    {realTimeData.highlightWarning && <span className="text-red-400">HL</span>}
                    {realTimeData.shadowWarning && <span className="text-sky-300">SH</span>}
                    {!realTimeData.highlightWarning && !realTimeData.shadowWarning && (
                      <span style={{ color: `rgba(${accentRgb}, 0.85)` }}>OK</span>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right section - Battery and status indicators */}
        <div className="flex items-center gap-4">
          {(hudVisibility === 'standard' || hudVisibility === 'full') && (
            <div className="flex flex-col items-center">
              <div className="text-[9px] opacity-60 text-[color:var(--hud-text)]">BATTERY</div>
              <div className="font-bold text-[color:var(--hud-text)]">{batteryLevel}%</div>
            </div>
          )}

          <div className="flex flex-col items-center gap-1">
            <BatteryIndicator />
            <div className="flex gap-1">
              {hudModes.map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setHudVisibility(mode.id)}
                  className={`rounded-full px-2 py-0.5 text-[9px] uppercase tracking-[0.2em] border transition ${
                    hudVisibility === mode.id
                      ? 'border-green-400/70 text-green-300'
                      : 'border-white/15 text-white/50 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {interfaceModules.audioMeters && (
            <div className="flex items-end gap-1 h-10">
              {audioLevels.map((level, idx) => (
                <div
                  key={idx}
                  className="w-2 rounded"
                  style={{
                    height: `${Math.min(100, Math.max(15, level))}%`,
                    background: `linear-gradient(to top, rgba(${accentRgb}, 0.3), rgba(${accentRgb}, 0.8))`,
                  }}
                />
              ))}
              <span className="mono text-[9px] uppercase tracking-[0.3em] opacity-70 text-[color:var(--hud-text)] ml-2">dB</span>
            </div>
          )}

          {hudVisibility === 'full' && (
            <div className="text-[10px] opacity-75 text-[color:var(--hud-text)]">
              {new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
