import { forwardRef, useEffect, useState } from 'react';
import { CAMERA_DATABASE, LENS_DATABASE } from './CameraDatabase';

const CameraViewfinder = forwardRef(({ settings, changingLens, shutterFiring }, ref) => {
  const [filters, setFilters] = useState({});
  const [lensEffects, setLensEffects] = useState({ vignetting: 0, distortion: 0 });

  useEffect(() => {
    calculateFilters();
  }, [settings.iso, settings.aperture, settings.shutterSpeed, settings.whiteBalance, settings.exposureCompensation, settings.filmSimulation, settings.brand, settings.model, settings.exposurePreview]);

  useEffect(() => {
    calculateLensEffects();
  }, [settings.lens, settings.aperture, settings.zoomLevel]);

  const calculateFilters = () => {
    // Get camera type from database
    const currentCamera = CAMERA_DATABASE[settings.brand]?.[settings.model];
    const cameraType = currentCamera?.type || 'mirrorless';

    // Calculate exposure brightness
    let brightness;

    if (cameraType === 'dslr' && !settings.exposurePreview) {
      // DSLR with OVF: Always bright regardless of settings (optical view)
      brightness = 1.0; // Constant brightness
    } else {
      // Mirrorless EVF or DSLR with exposure preview enabled
      // Full exposure simulation based on exposure triangle
      const isoMultiplier = settings.iso / 100;
      const apertureMultiplier = 1 / (settings.aperture * settings.aperture); // Aperture affects light quadratically

      // Parse shutter speed (handle both number and fraction formats)
      let shutterMultiplier = settings.shutterSpeed;
      if (typeof settings.shutterSpeed === 'string' && settings.shutterSpeed.includes('/')) {
        const [num, denom] = settings.shutterSpeed.split('/').map(Number);
        shutterMultiplier = num / denom;
      }

      // Combine all factors (normalized to look good at ISO 100, f/5.6, 1/125)
      const baseExposure = isoMultiplier * apertureMultiplier * shutterMultiplier * 3000;
      brightness = baseExposure * Math.pow(2, settings.exposureCompensation);

      // Clamp to reasonable values
      brightness = Math.max(0.1, Math.min(3, brightness));
    }

    // Grain effect at high ISO
    const grainOpacity = Math.max(0, Math.min(1, (settings.iso - 800) / 25600));

    // White balance color cast
    const wbFilter = calculateWhiteBalanceFilter(settings.whiteBalance);

    // Film simulation (Fujifilm only)
    const filmFilter = getFilmSimulationFilter();

    setFilters({
      brightness,
      grainOpacity,
      whiteBalance: wbFilter,
      filmSimulation: filmFilter
    });
  };

  const calculateLensEffects = () => {
    const currentLens = LENS_DATABASE[settings.lens];
    if (!currentLens?.characteristics) {
      setLensEffects({ vignetting: 0, distortion: 0 });
      return;
    }

    const chars = currentLens.characteristics;

    // Calculate vignetting based on aperture
    let vignetting = 0;
    if (chars.vignetting) {
      // Interpolate vignetting between wide open and stopped down
      const aperture = settings.aperture;
      const maxAperture = currentLens.aperture.max;

      // Get vignetting values from lens data (e.g., { f18: 0.8, f4: 0.05 })
      const wideOpenKey = Object.keys(chars.vignetting)[0];
      const stoppedDownKey = Object.keys(chars.vignetting)[1] || wideOpenKey;
      const wideOpenVignetting = chars.vignetting[wideOpenKey] || 0;
      const stoppedDownVignetting = chars.vignetting[stoppedDownKey] || 0;

      // Linear interpolation between wide open and f/4
      if (aperture <= maxAperture) {
        vignetting = wideOpenVignetting;
      } else if (aperture >= 4) {
        vignetting = stoppedDownVignetting;
      } else {
        const t = (aperture - maxAperture) / (4 - maxAperture);
        vignetting = wideOpenVignetting + t * (stoppedDownVignetting - wideOpenVignetting);
      }
    }

    // Calculate distortion
    let distortion = 0;
    if (typeof chars.distortion === 'number') {
      distortion = chars.distortion;
    } else if (typeof chars.distortion === 'object') {
      // For zoom lenses, interpolate based on zoom level
      const keys = Object.keys(chars.distortion);
      if (keys.length === 2) {
        const min = parseInt(keys[0]);
        const max = parseInt(keys[1]);
        const minDist = chars.distortion[min];
        const maxDist = chars.distortion[max];
        const t = settings.zoomLevel / 100;
        distortion = minDist + t * (maxDist - minDist);
      }
    }

    setLensEffects({ vignetting, distortion });
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

  const getFilmSimulationFilter = () => {
    // Only Fujifilm cameras have film simulation
    if (settings.brand !== 'fujifilm') return 'none';

    const sim = settings.filmSimulation || 'PROVIA';

    const filmSims = {
      'PROVIA': 'none', // Standard, neutral
      'Velvia': 'saturate(1.4) contrast(1.1)', // Vivid, punchy colors
      'ASTIA': 'saturate(0.9) brightness(1.05)', // Soft, muted
      'Classic Chrome': 'sepia(0.15) saturate(0.85) contrast(1.05)', // Muted, cinematic
      'Acros': 'grayscale(1) contrast(1.1)', // B&W, high contrast
      'Acros+Ye': 'grayscale(1) contrast(1.1) sepia(0.05)', // B&W with yellow filter
      'Acros+R': 'grayscale(1) contrast(1.15)', // B&W with red filter
      'Eterna': 'saturate(0.7) contrast(0.95) brightness(1.03)', // Flat, cinematic
      'Classic Neg': 'sepia(0.1) saturate(1.2) hue-rotate(-5deg)', // Classic negative film
      'PRO Neg Std': 'saturate(0.9) hue-rotate(5deg)', // Professional negative standard
      'PRO Neg Hi': 'saturate(1.1) hue-rotate(8deg)' // Professional negative high
    };

    return filmSims[sim] || 'none';
  };

  const calculateBlur = (layerDepth) => {
    // Get camera crop factor from database
    const currentCamera = CAMERA_DATABASE[settings.brand]?.[settings.model];
    const cropFactor = currentCamera?.sensorSize?.crop || 1.0;

    // Calculate depth difference from focus point
    const depthDiff = Math.abs(layerDepth - settings.focusDepth);
    const maxBlur = 50;

    // Aperture effect on blur (wider aperture = more blur)
    const apertureEffect = 1.2 / settings.aperture;

    // Crop factor effect: larger crop = deeper DOF = less blur
    // Full-frame (1.0): full blur
    // APS-C (1.5): 2/3 of the blur
    // M4/3 (2.0): 1/2 of the blur
    const cropAdjustedBlur = (maxBlur * apertureEffect * (depthDiff / 5)) / cropFactor;
    const blur = Math.min(cropAdjustedBlur, maxBlur / cropFactor);

    return blur;
  };

  const getFocalLengthScale = () => {
    const lens = settings.lens;

    // Check if it's a zoom lens and use zoomLevel
    if (lens === '24-70mm-f28') {
      // Map zoom level (0-100) to focal length (24-70mm)
      const focalLength = 24 + (settings.zoomLevel / 100) * (70 - 24);
      // Map focal length to scale (24mm = 0.5, 70mm = 1.4)
      return 0.5 + (focalLength - 24) / (70 - 24) * (1.4 - 0.5);
    }

    if (lens === '70-200mm-f28') {
      // Map zoom level (0-100) to focal length (70-200mm)
      const focalLength = 70 + (settings.zoomLevel / 100) * (200 - 70);
      // Map focal length to scale (70mm = 1.4, 200mm = 4.0)
      return 1.4 + (focalLength - 70) / (200 - 70) * (4.0 - 1.4);
    }

    if (lens === '16-35mm-f28') {
      const focalLength = 16 + (settings.zoomLevel / 100) * (35 - 16);
      // Map 16mm = 0.35, 35mm = 0.7
      return 0.35 + (focalLength - 16) / (35 - 16) * (0.7 - 0.35);
    }

    if (lens === '100-400mm-f4556') {
      const focalLength = 100 + (settings.zoomLevel / 100) * (400 - 100);
      // Map 100mm = 2.0, 400mm = 8.0
      return 2.0 + (focalLength - 100) / (400 - 100) * (8.0 - 2.0);
    }

    if (lens === '24-105mm-f4') {
      const focalLength = 24 + (settings.zoomLevel / 100) * (105 - 24);
      // Map 24mm = 0.5, 105mm = 2.1
      return 0.5 + (focalLength - 24) / (105 - 24) * (2.1 - 0.5);
    }

    // Fixed focal length lenses
    const scales = {
      '35mm-f14': 0.7,
      '50mm-f18': 1.0,
      '85mm-f14': 1.7,
      '100mm-f28-macro': 2.0,
      '135mm-f2': 2.7
    };

    return scales[lens] || 1.0;
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
          filter: `brightness(${filters.brightness}) ${filters.whiteBalance} ${filters.filmSimulation}`,
          transform: `scale(${scale})`
        }}
      >
        {/* User Image or Far Background Layer (depth: 10) */}
        <div
          className="layer layer-background"
          data-depth="10"
          style={{
            filter: `blur(${calculateBlur(10)}px)`,
            opacity: 1 - (calculateBlur(10) / 50) * 0.3
          }}
        >
          {settings.userImage ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${settings.userImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            />
          ) : (
            <div className="bg-gradient-to-b from-blue-900/40 to-purple-900/40 h-screen flex items-center justify-center">
              <div className="text-6xl font-bold text-white/20">BACKGROUND</div>
            </div>
          )}
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

      {/* Vignetting Overlay (Lens Optical Effect) */}
      {lensEffects.vignetting > 0 && (
        <div
          className="vignetting-overlay"
          style={{
            opacity: Math.min(lensEffects.vignetting, 1),
            background: `radial-gradient(circle at center, transparent 0%, transparent 40%, rgba(0,0,0,${lensEffects.vignetting * 0.3}) 70%, rgba(0,0,0,${lensEffects.vignetting * 0.6}) 100%)`
          }}
        />
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

        .vignetting-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 9998;
          transition: opacity 0.3s ease-out;
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
