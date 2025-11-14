import { useCameraContext } from '@/context/CameraContext';
import { useEffect, useState } from 'react';
import BatteryIndicator from './BatteryIndicator';
import { Grid3x3, BarChart3, Focus, Camera } from 'lucide-react';

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
  });
  const [audioLevels, setAudioLevels] = useState([30, 55, 40]);

  // Analyze page content for real-time readings
  useEffect(() => {
    const analyzeContent = () => {
      if (typeof document === 'undefined') return;

      try {
        // Get average brightness from page content
        const images = document.querySelectorAll('img');
        // Simplified brightness calculation
        const brightness = Math.min(100, Math.max(0, 40 + iso / 100));

        setRealTimeData({
          avgBrightness: Math.round(brightness),
          avgColor: `rgb(${128 + iso / 50}, 128, ${128 - iso / 50})`,
        });
      } catch (error) {
        console.error('Error analyzing content:', error);
      }
    };

    analyzeContent();
    const interval = setInterval(analyzeContent, 2000);

    return () => clearInterval(interval);
  }, [iso]);

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
