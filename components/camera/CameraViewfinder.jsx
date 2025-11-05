import { forwardRef, useEffect, useState } from 'react';

const CameraViewfinder = forwardRef(({ settings, changingLens, shutterFiring }, ref) => {
  const [filters, setFilters] = useState({});

  useEffect(() => {
    calculateFilters();
  }, [settings.iso, settings.aperture, settings.whiteBalance, settings.exposureCompensation]);

  const calculateFilters = () => {
    // ISO - brightness and grain
    const brightnessMultiplier = settings.iso / 100;
    const brightness = brightnessMultiplier * Math.pow(2, settings.exposureCompensation);

    // Grain effect at high ISO
    const grainOpacity = Math.max(0, Math.min(1, (settings.iso - 800) / 25600));

    // White balance color cast
    const wbFilter = calculateWhiteBalanceFilter(settings.whiteBalance);

    setFilters({
      brightness,
      grainOpacity,
      whiteBalance: wbFilter
    });
  };

  const calculateWhiteBalanceFilter = (kelvin) => {
    if (kelvin < 4000) {
      // Warm (tungsten)
      return `sepia(0.4) saturate(1.3) hue-rotate(-15deg) brightness(1.05)`;
    } else if (kelvin > 7000) {
      // Cool (shade)
      return `sepia(0.2) saturate(0.9) hue-rotate(15deg) brightness(0.98)`;
    } else {
      // Neutral
      return 'none';
    }
  };

  const calculateBlur = (layerDepth) => {
    const depthDiff = Math.abs(layerDepth - settings.focusDepth);
    const maxBlur = 50;
    const apertureEffect = 1.2 / settings.aperture;
    const blur = Math.min(maxBlur * apertureEffect * (depthDiff / 5), maxBlur);

    return blur;
  };

  const getFocalLengthScale = () => {
    const scales = {
      '35mm': 0.7,
      '50mm': 1.0,
      '24-70mm': 0.85,
      '85mm': 1.7,
      '70-200mm': 3.0
    };

    return scales[settings.lens] || 1.0;
  };

  const scale = getFocalLengthScale();

  return (
    <div ref={ref} className="viewfinder-container">
      {/* DSLR Viewfinder Border */}
      {settings.type === 'dslr' && (
        <div className="dslr-border" />
      )}

      {/* Main Scene with Layers */}
      <div
        className={`scene ${changingLens ? 'changing-lens' : ''} ${shutterFiring ? 'shutter-firing' : ''}`}
        style={{
          filter: `brightness(${filters.brightness}) ${filters.whiteBalance}`,
          transform: `scale(${scale})`
        }}
      >
        {/* Far Background Layer (depth: 10) */}
        <div
          className="layer layer-background"
          data-depth="10"
          style={{
            filter: `blur(${calculateBlur(10)}px)`,
            opacity: 1 - (calculateBlur(10) / 50) * 0.3
          }}
        >
          <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 h-screen flex items-center justify-center">
            <div className="text-6xl font-bold text-white/20">BACKGROUND</div>
          </div>
        </div>

        {/* Mid-Background Layer (depth: 7) */}
        <div
          className="layer layer-mid-background"
          data-depth="7"
          style={{
            filter: `blur(${calculateBlur(7)}px)`,
            opacity: 1 - (calculateBlur(7) / 50) * 0.3
          }}
        >
          <div className="absolute inset-0 flex items-center justify-around p-20">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 opacity-60" />
            <div className="w-40 h-40 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 opacity-60" />
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-green-500 to-teal-500 opacity-60" />
          </div>
        </div>

        {/* Midground Layer (depth: 4) */}
        <div
          className="layer layer-midground"
          data-depth="4"
          style={{
            filter: `blur(${calculateBlur(4)}px)`,
            opacity: 1 - (calculateBlur(4) / 50) * 0.3
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-4xl font-bold text-white/40 tracking-wider">
              MIDGROUND
            </div>
          </div>
        </div>

        {/* Focus Layer (depth: 3) - Main Content */}
        <div
          className="layer layer-focus"
          data-depth="3"
          style={{
            filter: `blur(${calculateBlur(3)}px)`,
            opacity: 1 - (calculateBlur(3) / 50) * 0.3
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center flex-col gap-8">
            <h1 className="text-7xl font-bold text-white">
              MENELEK MAKONNEN
            </h1>
            <p className="text-2xl text-white/80">
              Interactive Camera Photography Experience
            </p>

            {/* Interactive Buttons */}
            <div className="flex gap-6 mt-8">
              <button
                data-depth="3"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
              >
                Explore
              </button>
              <button
                data-depth="3"
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-semibold hover:from-purple-500 hover:to-pink-500 transition-all"
              >
                Portfolio
              </button>
              <button
                data-depth="3"
                className="px-8 py-4 bg-white/10 backdrop-blur-md border-2 border-white/30 rounded-lg text-white font-semibold hover:bg-white/20 transition-all"
              >
                Contact
              </button>
            </div>
          </div>
        </div>

        {/* Near Foreground Layer (depth: 2) */}
        <div
          className="layer layer-near-foreground"
          data-depth="2"
          style={{
            filter: `blur(${calculateBlur(2)}px)`,
            opacity: 1 - (calculateBlur(2) / 50) * 0.3
          }}
        >
          <div className="absolute bottom-20 left-20 w-64 h-64 rounded-2xl bg-gradient-to-br from-blue-500/50 to-cyan-500/50 backdrop-blur-sm" />
          <div className="absolute top-32 right-32 w-48 h-48 rounded-full bg-gradient-to-br from-orange-500/50 to-red-500/50 backdrop-blur-sm" />
        </div>

        {/* Very Close Foreground Layer (depth: 1) */}
        <div
          className="layer layer-close-foreground"
          data-depth="1"
          style={{
            filter: `blur(${calculateBlur(1)}px)`,
            opacity: 1 - (calculateBlur(1) / 50) * 0.3
          }}
        >
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/20 backdrop-blur-xl rounded-full" />
          <div className="absolute bottom-32 right-20 w-40 h-40 bg-white/20 backdrop-blur-xl rounded-xl rotate-45" />
        </div>
      </div>

      {/* Film Grain Overlay */}
      {filters.grainOpacity > 0 && (
        <div className="grain-overlay" style={{ opacity: filters.grainOpacity }} />
      )}

      {/* Shutter Blackout (DSLR) */}
      {shutterFiring && settings.type === 'dslr' && (
        <div className="shutter-blackout" />
      )}

      {/* Electronic Shutter Flash (Mirrorless) */}
      {shutterFiring && settings.type === 'mirrorless' && (
        <div className="electronic-shutter-flash" />
      )}

      <style jsx>{`
        .viewfinder-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          overflow: hidden;
          background: #000;
        }

        .dslr-border {
          position: absolute;
          inset: 0;
          border: 20px solid rgba(0, 0, 0, 0.95);
          pointer-events: none;
          z-index: 100;
          box-shadow: inset 0 0 40px rgba(0, 0, 0, 0.8);
        }

        .scene {
          position: relative;
          width: 100%;
          height: 100%;
          transform-origin: center;
          transition: filter 0.3s ease-out, transform 0.3s ease-out;
        }

        .scene.changing-lens {
          animation: lens-change 0.8s ease-in-out;
        }

        @keyframes lens-change {
          0% {
            transform: rotateX(0deg) scale(1);
            filter: blur(0px);
          }
          50% {
            transform: rotateX(180deg) scale(0.8);
            filter: blur(15px);
            opacity: 0.3;
          }
          100% {
            transform: rotateX(360deg) scale(1);
            filter: blur(0px);
            opacity: 1;
          }
        }

        .layer {
          position: absolute;
          inset: 0;
          transition: filter 0.5s ease-out, opacity 0.5s ease-out;
          will-change: filter, opacity;
          transform: translateZ(0);
          backface-visibility: hidden;
        }

        .grain-overlay {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='4' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
          pointer-events: none;
          z-index: 9999;
          mix-blend-mode: overlay;
        }

        .shutter-blackout {
          position: absolute;
          inset: 0;
          background: #000;
          z-index: 9997;
          animation: blackout 100ms ease-out;
        }

        @keyframes blackout {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .electronic-shutter-flash {
          position: absolute;
          inset: 0;
          background: rgba(255, 255, 255, 0.2);
          z-index: 9997;
          animation: e-shutter 80ms ease-out;
        }

        @keyframes e-shutter {
          0% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            opacity: 0;
          }
        }

        .scene.shutter-firing {
          animation: capture-moment 0.1s ease-out;
        }

        @keyframes capture-moment {
          0% {
            filter: brightness(1);
          }
          50% {
            filter: brightness(1.2);
          }
          100% {
            filter: brightness(1);
          }
        }
      `}</style>
    </div>
  );
});

CameraViewfinder.displayName = 'CameraViewfinder';

export default CameraViewfinder;
