import { create } from 'zustand';

export const zIndexLayers = Object.freeze({
  backgroundTexture: 0,
  contentPanels: 10,
  hudOverlay: 20,
  lensVignette: 30,
  cameraControls: 40,
});

const panelGrid = [
  [
    {
      id: 'overview',
      title: 'System Overview',
      description:
        'Navigate the mothership bridge and monitor the mission critical data feeds in real time.',
    },
    {
      id: 'lenses',
      title: 'Lens Selection',
      description:
        'Swap between precision optics to match each encounter and capture every detail.',
    },
  ],
  [
    {
      id: 'exposure',
      title: 'Exposure Matrix',
      description:
        'Fine-tune ISO, shutter, and aperture to adapt to dynamic lighting situations.',
    },
    {
      id: 'hud',
      title: 'HUD Overlay',
      description:
        'Calibrate how much telemetry is projected onto your visor at a glance.',
    },
  ],
];

const lensOptions = ['24mm', '35mm', '50mm', '85mm'];
const hudLevels = ['minimal', 'standard', 'full'];

export const useInterfaceStore = create((set) => ({
  zIndexLayers,
  panelGrid,
  activePanel: { row: 0, col: 0 },
  currentMode: 'DSLR',
  lens: lensOptions[2],
  hudLevel: hudLevels[1],
  exposure: {
    iso: 200,
    shutter: '1/250',
    aperture: 'f/2.0',
  },
  setActivePanel: (next) =>
    set((state) => {
      const clampedRow = Math.max(0, Math.min(state.panelGrid.length - 1, next.row));
      const clampedCol = Math.max(0, Math.min(state.panelGrid[clampedRow].length - 1, next.col));
      return { activePanel: { row: clampedRow, col: clampedCol } };
    }),
  setMode: (mode) => set({ currentMode: mode }),
  cycleLens: () =>
    set((state) => {
      const nextIndex = (lensOptions.indexOf(state.lens) + 1) % lensOptions.length;
      return { lens: lensOptions[nextIndex] };
    }),
  cycleHud: () =>
    set((state) => {
      const nextIndex = (hudLevels.indexOf(state.hudLevel) + 1) % hudLevels.length;
      return { hudLevel: hudLevels[nextIndex] };
    }),
  updateExposure: (updates) =>
    set((state) => ({ exposure: { ...state.exposure, ...updates } })),
}));
