import { useCameraContext } from '@/context/CameraContext';
import { useEffect, useState } from 'react';
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
    batteryLevel,
    cameraMode,
    interfaceModules,
  } = useCameraContext();

  const [realTimeData, setRealTimeData] = useState({
    avgBrightness: 50,
    avgColor: 'rgb(128, 128, 128)',
    highlightWarning: false,
    shadowWarning: false,
  });
  const [audioLevels, setAudioLevels] = useState([30, 55, 40]);

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

    const getEffectiveBackground = (node) => {
      let current = node;
      while (current && current !== document.documentElement) {
        const style = window.getComputedStyle(current);
        const bg = parseColor(style.backgroundColor);
        if (bg && bg.a > 0) {
          return bg;
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
        const avgColor = {
          r: totals.r / samples,
          g: totals.g / samples,
          b: totals.b / samples,
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

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', analyzeContent);
    };
  }, [iso, aperture, shutterSpeed, whiteBalance, currentLens, interfaceModules]);

  useEffect(() => {
    if (!interfaceModules.audioMeters) return;
    const interval = setInterval(() => {
      setAudioLevels((prev) => prev.map(() => 20 + Math.random() * 60));
    }, 500);
    return () => clearInterval(interval);
  }, [interfaceModules.audioMeters]);

  if (hudVisibility === 'none') return null;

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `${speed}"`;
    return `1/${speed}`;
  };

  const formatAperture = (ap) => `f/${ap.toFixed(1)}`;

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
              <div className="mono text-[9px] uppercase tracking-[0.3em] text-white/60 mb-1">Meter</div>
              <div className="relative w-24 h-12 rounded-b-full border border-green-400/40 bg-black/40 overflow-hidden">
                <div className="absolute inset-x-4 bottom-2 h-1 bg-gradient-to-r from-green-500 via-green-200 to-green-500/80 opacity-60" />
                <div
                  className="absolute left-1/2 bottom-0 w-0.5 h-10 bg-green-300 origin-bottom"
                  style={{ transform: `translateX(-50%) rotate(${analogNeedle}deg)` }}
                />
              </div>
            </div>
          )}
          {/* ISO */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60">ISO</div>
            <div className="font-bold">{iso}</div>
          </div>

          {/* Aperture */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60">APERTURE</div>
            <div className="font-bold">{formatAperture(aperture)}</div>
          </div>

          {/* Shutter Speed */}
          <div className="flex flex-col items-center">
            <div className="text-[9px] opacity-60">SHUTTER</div>
            <div className="font-bold">{formatShutterSpeed(shutterSpeed)}</div>
          </div>

          {(hudVisibility === 'standard' || hudVisibility === 'full') && (
            <>
              {/* Exposure Compensation */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60">EV</div>
                <div className="font-bold">
                  {exposureComp > 0 ? '+' : ''}{exposureComp.toFixed(1)}
                </div>
              </div>

              {/* White Balance */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60">WB</div>
                <div className="font-bold uppercase text-[10px]">
                  {whiteBalance.slice(0, 3)}
                </div>
              </div>
            </>
          )}

          {hudVisibility === 'full' && (
            <>
              {/* Focus Mode */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60">FOCUS</div>
                <div className="font-bold uppercase text-[10px]">
                  {focusMode === 'single' ? 'AF-S' : focusMode === 'continuous' ? 'AF-C' : 'MF'}
                </div>
              </div>

              {/* Brightness reading */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60">LUX</div>
                <div className="font-bold">{realTimeData.avgBrightness}</div>
              </div>

              {/* Scene analyser */}
              <div className="flex flex-col items-center">
                <div className="text-[9px] opacity-60">SCENE</div>
                <div className="flex items-center gap-1">
                  <span
                    className="w-3 h-3 rounded-full border border-white/40"
                    style={{ backgroundColor: realTimeData.avgColor }}
                    aria-label={`Scene color ${realTimeData.avgColor}`}
                  />
                  <div className="text-[10px] font-semibold flex gap-1">
                    {realTimeData.highlightWarning && <span className="text-red-400">HL</span>}
                    {realTimeData.shadowWarning && <span className="text-sky-300">SH</span>}
                    {!realTimeData.highlightWarning && !realTimeData.shadowWarning && (
                      <span className="text-green-300/80">OK</span>
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
              <div className="text-[9px] opacity-60">BATTERY</div>
              <div className="font-bold">{batteryLevel}%</div>
            </div>
          )}

          <BatteryIndicator />

          {interfaceModules.audioMeters && (
            <div className="flex items-end gap-1 h-10">
              {audioLevels.map((level, idx) => (
                <div
                  key={idx}
                  className="w-2 rounded bg-gradient-to-t from-green-500/40 via-green-400/70 to-green-200/90"
                  style={{ height: `${Math.min(100, Math.max(15, level))}%` }}
                />
              ))}
              <span className="mono text-[9px] uppercase tracking-[0.3em] text-white/60 ml-2">dB</span>
            </div>
          )}

          {hudVisibility === 'full' && (
            <div className="text-[10px] opacity-75">
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
