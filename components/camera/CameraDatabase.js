// Camera Database - Comprehensive specifications for top-tier cameras
export const CAMERA_DATABASE = {
  canon: {
    '1dx3': {
      name: 'EOS-1D X Mark III',
      brand: 'Canon',
      type: 'dslr',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 20.1,
      viewfinder: {
        type: 'optical',
        coverage: 100,
        magnification: 0.76,
        evfResolution: null,
        evfRefreshRate: null
      },
      iso: {
        native: { min: 100, max: 102400 },
        expanded: { min: 50, max: 819200 }
      },
      shutter: {
        mechanical: { min: 30, max: 1/8000 },
        electronic: { min: 30, max: 1/8000 }
      },
      fps: {
        mechanical: 16,
        electronic: 20
      },
      ibis: false,
      autofocus: {
        points: 191,
        coverage: 90,
        features: ['Face Detect iTR', 'Dual Pixel (LV)', 'Smart Controller']
      },
      battery: {
        model: 'LP-E19',
        cipa: { ovf: 2850, evf: null, liveView: 610 }
      },
      releaseYear: 2020,
      hasFlash: false,
      features: ['Mirror blackout reduced', 'Smart Controller', 'Dual Pixel AF']
    },
    'r3': {
      name: 'EOS R3',
      brand: 'Canon',
      type: 'mirrorless',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 24.1,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.76,
        evfResolution: 5.76,
        evfRefreshRate: 120
      },
      iso: {
        native: { min: 100, max: 102400 },
        expanded: { min: 50, max: 204800 }
      },
      shutter: {
        mechanical: { min: 30, max: 1/8000 },
        electronic: { min: 30, max: 1/64000 }
      },
      fps: {
        mechanical: 12,
        electronic: 30
      },
      ibis: true,
      ibisStops: 8,
      autofocus: {
        points: 1053,
        coverage: 100,
        features: ['Eye Control AF', 'Eye/Face/Animal/Vehicle', 'Tracking']
      },
      battery: {
        model: 'LP-E19',
        cipa: { ovf: null, evf: 620, liveView: 860 }
      },
      releaseYear: 2021,
      hasFlash: false,
      features: ['Blackout-free EVF', 'OVF Simulation Mode', 'Eye Control AF', '30fps burst']
    }
  },
  nikon: {
    'd6': {
      name: 'D6',
      brand: 'Nikon',
      type: 'dslr',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 20.8,
      viewfinder: {
        type: 'optical',
        coverage: 100,
        magnification: 0.72,
        evfResolution: null,
        evfRefreshRate: null
      },
      iso: {
        native: { min: 100, max: 102400 },
        expanded: { min: 50, max: 3280000 }
      },
      shutter: {
        mechanical: { min: 30, max: 1/8000 },
        electronic: { min: 30, max: 1/8000 }
      },
      fps: {
        mechanical: 14,
        electronic: 10.5
      },
      ibis: false,
      autofocus: {
        points: 105,
        coverage: 85,
        features: ['3D Tracking', 'Group AF', 'Face Detection']
      },
      battery: {
        model: 'EN-EL18d',
        cipa: { ovf: 3580, evf: null, liveView: 1260 }
      },
      releaseYear: 2020,
      hasFlash: false,
      features: ['Pro DSLR', '14fps continuous', 'Rugged build']
    },
    'z9': {
      name: 'Z9',
      brand: 'Nikon',
      type: 'mirrorless',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 45.7,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.80,
        evfResolution: 3.69,
        evfRefreshRate: 120
      },
      iso: {
        native: { min: 64, max: 25600 },
        expanded: { min: 32, max: 102400 }
      },
      shutter: {
        mechanical: null, // No mechanical shutter
        electronic: { min: 30, max: 1/32000 }
      },
      fps: {
        mechanical: 0,
        electronic: 20, // Up to 120fps in JPEG mode
        highSpeed: 120
      },
      ibis: true,
      ibisStops: 6,
      autofocus: {
        points: 493,
        coverage: 90,
        features: ['3D Tracking', 'Eye/Animal AF', 'Subject Detection']
      },
      battery: {
        model: 'EN-EL18d',
        cipa: { ovf: null, evf: 740, liveView: 740 }
      },
      releaseYear: 2021,
      hasFlash: false,
      features: ['No mechanical shutter', 'Blackout-free', '8K video', '120fps JPEG']
    }
  },
  sony: {
    'a1': {
      name: 'Alpha 1',
      brand: 'Sony',
      type: 'mirrorless',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 50.1,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.90,
        evfResolution: 9.44,
        evfRefreshRate: 240 // Can also do 120fps high quality
      },
      iso: {
        native: { min: 100, max: 32000 },
        expanded: { min: 50, max: 102400 }
      },
      shutter: {
        mechanical: { min: 30, max: 1/8000 },
        electronic: { min: 30, max: 1/32000 }
      },
      fps: {
        mechanical: 10,
        electronic: 30
      },
      ibis: true,
      ibisStops: 5.5,
      autofocus: {
        points: 759,
        coverage: 92,
        features: ['Real-time Eye AF', 'Animal Eye AF', 'Bird Eye AF', 'Tracking']
      },
      battery: {
        model: 'NP-FZ100',
        cipa: { ovf: null, evf: 530, liveView: 530 }
      },
      releaseYear: 2021,
      hasFlash: false,
      features: ['9.44M EVF', '30fps blackout-free', '8K video', 'Best EVF resolution']
    }
  },
  fujifilm: {
    'xh2s': {
      name: 'X-H2S',
      brand: 'Fujifilm',
      type: 'mirrorless',
      sensor: 'aps-c',
      sensorSize: { width: 23.5, height: 15.6, crop: 1.5 },
      megapixels: 26.1,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.80,
        evfResolution: 5.76,
        evfRefreshRate: 120
      },
      iso: {
        native: { min: 160, max: 12800 },
        expanded: { min: 80, max: 51200 }
      },
      shutter: {
        mechanical: { min: 15*60, max: 1/8000 }, // 15 minute bulb
        electronic: { min: 15*60, max: 1/32000 }
      },
      fps: {
        mechanical: 15,
        electronic: 40
      },
      ibis: true,
      ibisStops: 7,
      autofocus: {
        points: 425,
        coverage: 100,
        features: ['Face/Eye AF', 'Animal AF', 'Phase Detect']
      },
      battery: {
        model: 'NP-W235',
        cipa: { ovf: null, evf: 580, liveView: 580 }
      },
      releaseYear: 2022,
      hasFlash: false,
      filmSimulations: ['PROVIA', 'Velvia', 'ASTIA', 'Classic Chrome', 'Acros', 'Eterna'],
      features: ['Film Simulations', 'Stacked sensor', '40fps burst', '6.2K video']
    },
    'xt5': {
      name: 'X-T5',
      brand: 'Fujifilm',
      type: 'mirrorless',
      sensor: 'aps-c',
      sensorSize: { width: 23.5, height: 15.6, crop: 1.5 },
      megapixels: 40.2,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.80,
        evfResolution: 3.69,
        evfRefreshRate: 100
      },
      iso: {
        native: { min: 125, max: 12800 },
        expanded: { min: 64, max: 51200 }
      },
      shutter: {
        mechanical: { min: 15*60, max: 1/8000 },
        electronic: { min: 15*60, max: 1/180000 }
      },
      fps: {
        mechanical: 15,
        electronic: 20
      },
      ibis: true,
      ibisStops: 7,
      autofocus: {
        points: 425,
        coverage: 100,
        features: ['Face/Eye AF', 'Animal AF', 'Subject Detection']
      },
      battery: {
        model: 'NP-W235',
        cipa: { ovf: null, evf: 580, liveView: 580 }
      },
      releaseYear: 2022,
      hasFlash: false,
      hasRetroDialControls: true,
      filmSimulations: ['PROVIA', 'Velvia', 'ASTIA', 'Classic Chrome', 'Acros', 'Eterna', 'Classic Neg'],
      features: ['Retro dials', 'Film Simulations', '40MP resolution', 'Classic design']
    }
  },
  panasonic: {
    's1h': {
      name: 'Lumix S1H',
      brand: 'Panasonic',
      type: 'mirrorless',
      sensor: 'full-frame',
      sensorSize: { width: 36, height: 24, crop: 1.0 },
      megapixels: 24.2,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.78,
        evfResolution: 5.76,
        evfRefreshRate: 120
      },
      iso: {
        native: { min: 100, max: 51200 },
        expanded: { min: 50, max: 204800 }
      },
      shutter: {
        mechanical: { min: 60, max: 1/8000 },
        electronic: { min: 60, max: 1/8000 }
      },
      fps: {
        mechanical: 6,
        electronic: 9
      },
      ibis: true,
      ibisStops: 6.5,
      autofocus: {
        points: 225,
        coverage: 100,
        features: ['DFD Contrast AF', 'Face/Eye AF', 'Animal AF']
      },
      battery: {
        model: 'DMW-BLJ31',
        cipa: { ovf: null, evf: 400, liveView: 400 }
      },
      releaseYear: 2019,
      hasFlash: false,
      videoFocused: true,
      features: ['Unlimited recording', 'Active cooling', 'Waveform', 'V-Log', '6K video']
    },
    'gh6': {
      name: 'Lumix GH6',
      brand: 'Panasonic',
      type: 'mirrorless',
      sensor: 'mft',
      sensorSize: { width: 17.3, height: 13, crop: 2.0 },
      megapixels: 25.2,
      viewfinder: {
        type: 'evf-oled',
        coverage: 100,
        magnification: 0.76,
        evfResolution: 3.68,
        evfRefreshRate: 120
      },
      iso: {
        native: { min: 100, max: 12800 },
        expanded: { min: 50, max: 25600 }
      },
      shutter: {
        mechanical: { min: 60, max: 1/8000 },
        electronic: { min: 60, max: 1/8000 }
      },
      fps: {
        mechanical: 8,
        electronic: 14,
        highSpeed: 75 // Pre-burst mode
      },
      ibis: true,
      ibisStops: 7.5,
      autofocus: {
        points: 315,
        coverage: 100,
        features: ['Phase Detect', 'Face/Eye AF', 'Animal AF', 'Tracking']
      },
      battery: {
        model: 'DMW-BLK22',
        cipa: { ovf: null, evf: 360, liveView: 360 }
      },
      releaseYear: 2022,
      hasFlash: false,
      videoFocused: true,
      features: ['Unlimited recording', 'Phase detect AF', 'ProRes', '5.7K video', 'MFT sensor']
    }
  }
};

// Lens Database - Comprehensive specifications for popular lenses
export const LENS_DATABASE = {
  '50mm-f18': {
    name: '50mm f/1.8',
    nickname: 'Nifty Fifty',
    type: 'prime',
    category: 'standard',
    focalLength: { min: 50, max: 50 },
    aperture: { max: 1.8, min: 22 },
    stabilization: false,
    minFocusDistance: 0.35, // meters
    magnification: 0.15,
    filterThread: 49,
    format: 'full-frame',
    characteristics: {
      distortion: 0.01, // Minimal barrel
      vignetting: { f18: 0.8, f4: 0.05 }, // Stops of darkening
      bokehQuality: 'good',
      bokehShape: 'round'
    },
    fieldOfView: { fullFrame: 46.8, apsc: 31.7 }, // degrees
    usage: ['portrait', 'street', 'low-light', 'general'],
    notes: 'Very popular affordable prime, great shallow DOF'
  },
  '35mm-f14': {
    name: '35mm f/1.4',
    type: 'prime',
    category: 'wide',
    focalLength: { min: 35, max: 35 },
    aperture: { max: 1.4, min: 22 },
    stabilization: false,
    minFocusDistance: 0.28,
    magnification: 0.19,
    format: 'full-frame',
    characteristics: {
      distortion: 0.02, // Slight barrel
      vignetting: { f14: 1.2, f4: 0.1 },
      bokehQuality: 'excellent',
      bokehShape: 'round-center-cats-eye-edges'
    },
    fieldOfView: { fullFrame: 63.4, apsc: 43.6 },
    usage: ['street', 'landscape', 'events', 'environmental-portrait'],
    notes: 'Classic wide-ish lens, cinematic look'
  },
  '85mm-f14': {
    name: '85mm f/1.4',
    type: 'prime',
    category: 'portrait-tele',
    focalLength: { min: 85, max: 85 },
    aperture: { max: 1.4, min: 22 },
    stabilization: false,
    minFocusDistance: 0.85,
    magnification: 0.12,
    format: 'full-frame',
    characteristics: {
      distortion: 0.005, // Virtually none
      vignetting: { f14: 1.0, f4: 0.05 },
      bokehQuality: 'excellent',
      bokehShape: 'round-creamy'
    },
    fieldOfView: { fullFrame: 28.6, apsc: 19.5 },
    usage: ['portrait', 'headshots', 'detail'],
    notes: 'Legendary portrait lens, extreme subject isolation'
  },
  '24-70mm-f28': {
    name: '24-70mm f/2.8',
    nickname: 'The Workhorse',
    type: 'zoom',
    category: 'standard',
    focalLength: { min: 24, max: 70 },
    aperture: { max: 2.8, min: 22, constant: true },
    stabilization: false, // Some versions have IS
    minFocusDistance: 0.38,
    magnification: 0.21,
    format: 'full-frame',
    characteristics: {
      distortion: { 24: 0.03, 70: -0.01 }, // Barrel at wide, pincushion at tele
      vignetting: { f28: 0.6, f5_6: 0.1 },
      bokehQuality: 'good',
      bokehShape: 'round'
    },
    fieldOfView: {
      fullFrame: { 24: 84.1, 50: 46.8, 70: 34.3 },
      apsc: { 24: 61.0, 50: 31.7, 70: 22.9 }
    },
    usage: ['general', 'events', 'portrait', 'landscape', 'professional'],
    notes: 'Most popular pro zoom, incredibly versatile'
  },
  '70-200mm-f28': {
    name: '70-200mm f/2.8',
    type: 'zoom',
    category: 'telephoto',
    focalLength: { min: 70, max: 200 },
    aperture: { max: 2.8, min: 32, constant: true },
    stabilization: true,
    stabilizationStops: 4,
    minFocusDistance: 1.2,
    magnification: 0.21,
    format: 'full-frame',
    characteristics: {
      distortion: { 70: 0.005, 200: -0.01 },
      vignetting: { f28: 0.5, f5_6: 0.05 },
      bokehQuality: 'excellent',
      bokehShape: 'round-smooth',
      compression: 'strong'
    },
    fieldOfView: {
      fullFrame: { 70: 34.3, 200: 12.3 },
      apsc: { 70: 22.9, 200: 8.2 }
    },
    usage: ['sports', 'wildlife', 'portrait', 'weddings', 'events'],
    notes: 'Staple telephoto zoom, beautiful compression and bokeh'
  },
  '16-35mm-f28': {
    name: '16-35mm f/2.8',
    type: 'zoom',
    category: 'ultra-wide',
    focalLength: { min: 16, max: 35 },
    aperture: { max: 2.8, min: 22, constant: true },
    stabilization: false,
    minFocusDistance: 0.28,
    magnification: 0.25,
    format: 'full-frame',
    characteristics: {
      distortion: { 16: 0.05, 35: 0.01 }, // Noticeable barrel at 16mm
      vignetting: { f28: 1.2, f8: 0.1 },
      bokehQuality: 'moderate',
      bokehShape: 'round'
    },
    fieldOfView: {
      fullFrame: { 16: 107, 24: 84.1, 35: 63.4 },
      apsc: { 16: 83, 24: 61.0, 35: 43.6 }
    },
    usage: ['landscape', 'architecture', 'astrophotography', 'wide-shots'],
    notes: 'Ultra-wide pro zoom, huge field of view, deep DOF'
  },
  '100-400mm-f4556': {
    name: '100-400mm f/4.5-5.6',
    type: 'zoom',
    category: 'super-telephoto',
    focalLength: { min: 100, max: 400 },
    aperture: { max: { 100: 4.5, 400: 5.6 }, min: 32, constant: false },
    stabilization: true,
    stabilizationStops: 5,
    minFocusDistance: 0.98,
    magnification: 0.31,
    format: 'full-frame',
    characteristics: {
      distortion: { 100: 0.005, 400: -0.005 },
      vignetting: { wide: 0.7, stopped: 0.1 },
      bokehQuality: 'excellent',
      bokehShape: 'smooth-round',
      compression: 'extreme'
    },
    fieldOfView: {
      fullFrame: { 100: 24.4, 400: 6.2 },
      apsc: { 100: 16.4, 400: 4.1 }
    },
    usage: ['wildlife', 'sports', 'birding', 'distant-subjects'],
    notes: 'Popular telephoto zoom for reach, strong compression'
  },
  '100mm-f28-macro': {
    name: '100mm f/2.8 Macro',
    type: 'prime',
    category: 'macro',
    focalLength: { min: 100, max: 100 },
    aperture: { max: 2.8, min: 32 },
    stabilization: true,
    stabilizationStops: 4,
    minFocusDistance: 0.30, // 1:1 magnification
    magnification: 1.0, // 1:1 life-size
    format: 'full-frame',
    characteristics: {
      distortion: 0.001, // Virtually none
      vignetting: { f28: 0.3, f8: 0.05 },
      bokehQuality: 'excellent',
      bokehShape: 'round-smooth',
      focusBreathing: 'moderate'
    },
    fieldOfView: { fullFrame: 24.4, apsc: 16.4 },
    usage: ['macro', 'close-up', 'product', 'portrait', 'detail'],
    notes: 'Macro lens for extreme close-ups, 1:1 magnification, razor-thin DOF'
  },
  '24-105mm-f4': {
    name: '24-105mm f/4',
    type: 'zoom',
    category: 'all-purpose',
    focalLength: { min: 24, max: 105 },
    aperture: { max: 4, min: 22, constant: true },
    stabilization: true,
    stabilizationStops: 4,
    minFocusDistance: 0.45,
    magnification: 0.24,
    format: 'full-frame',
    characteristics: {
      distortion: { 24: 0.025, 105: -0.01 },
      vignetting: { f4: 0.8, f8: 0.1 },
      bokehQuality: 'good',
      bokehShape: 'round'
    },
    fieldOfView: {
      fullFrame: { 24: 84.1, 50: 46.8, 105: 23.3 },
      apsc: { 24: 61.0, 50: 31.7, 105: 15.6 }
    },
    usage: ['general', 'travel', 'events', 'all-purpose'],
    notes: 'Versatile all-purpose zoom, f/4 requires more light than f/2.8'
  },
  '135mm-f2': {
    name: '135mm f/2',
    nickname: 'Portrait Dream Lens',
    type: 'prime',
    category: 'portrait-tele',
    focalLength: { min: 135, max: 135 },
    aperture: { max: 2, min: 22 },
    stabilization: false,
    minFocusDistance: 0.87,
    magnification: 0.25,
    format: 'full-frame',
    characteristics: {
      distortion: 0.002,
      vignetting: { f2: 0.9, f4: 0.1 },
      bokehQuality: 'legendary',
      bokehShape: 'round-creamy-smooth'
    },
    fieldOfView: { fullFrame: 18.2, apsc: 12.2 },
    usage: ['portrait', 'headshots', 'detail', 'compression'],
    notes: 'Legendary portrait lens, extreme compression and bokeh at f/2'
  }
};

export default { CAMERA_DATABASE, LENS_DATABASE };
