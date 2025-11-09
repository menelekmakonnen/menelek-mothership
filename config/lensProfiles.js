export const lensProfiles = [
  {
    id: 'cine-24',
    label: 'Cine Prime 24mm',
    fov: 84,
    minAperture: 1.4,
    maxAperture: 8,
    defaultAperture: 2.8,
    vignetteIntensity: 0.45,
    distortion: 'barrel',
    distortionAmount: 0.22,
    radialBlurStrength: 0.6,
    hudAccent: '#8be9fd'
  },
  {
    id: 'vintage-50',
    label: 'Vintage 50mm',
    fov: 47,
    minAperture: 1.2,
    maxAperture: 16,
    defaultAperture: 2.4,
    vignetteIntensity: 0.65,
    distortion: 'pincushion',
    distortionAmount: -0.18,
    radialBlurStrength: 0.4,
    hudAccent: '#ffb86c'
  },
  {
    id: 'anamorphic-35',
    label: 'Anamorphic 35mm',
    fov: 100,
    minAperture: 2,
    maxAperture: 11,
    defaultAperture: 4,
    vignetteIntensity: 0.35,
    distortion: 'barrel',
    distortionAmount: 0.12,
    radialBlurStrength: 0.5,
    hudAccent: '#ff79c6'
  }
];
