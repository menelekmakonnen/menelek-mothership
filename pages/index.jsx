import { useMemo } from 'react';
import { useGesture } from '@use-gesture/react';
import { useInterfaceStore, zIndexLayers } from '../store/useInterfaceStore';

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const Slide = ({ panel, isActive }) => {
  const baseClasses =
    'flex h-screen w-screen flex-col items-center justify-center gap-4 px-8 text-center transition-opacity duration-500';
  const tone = isActive ? 'opacity-100' : 'opacity-30';

  return (
    <section aria-current={isActive} className={`${baseClasses} ${tone}`}>
      <h2 className="text-4xl font-semibold tracking-wide sm:text-5xl">{panel.title}</h2>
      <p className="max-w-2xl text-lg text-slate-200 sm:text-xl">{panel.description}</p>
    </section>
  );
};

export default function Home() {
  const {
    panelGrid,
    activePanel,
    setActivePanel,
    currentMode,
    setMode,
    lens,
    cycleLens,
    hudLevel,
    cycleHud,
    exposure,
    updateExposure,
  } = useInterfaceStore();

  const totalRows = panelGrid.length;
  const totalCols = panelGrid[0]?.length ?? 0;

  const bind = useGesture(
    {
      onDragEnd: ({ direction: [dx, dy] }) => {
        if (Math.abs(dx) > Math.abs(dy)) {
          const delta = dx < 0 ? 1 : -1;
          const nextCol = clamp(activePanel.col + delta, 0, totalCols - 1);
          if (nextCol !== activePanel.col) {
            setActivePanel({ row: activePanel.row, col: nextCol });
          }
        } else {
          const delta = dy < 0 ? 1 : -1;
          const nextRow = clamp(activePanel.row + delta, 0, totalRows - 1);
          if (nextRow !== activePanel.row) {
            setActivePanel({ row: nextRow, col: activePanel.col });
          } else {
            setMode(currentMode === 'DSLR' ? 'Mirrorless' : 'DSLR');
          }
        }
      },
    },
    {
      drag: {
        threshold: 15,
        axis: undefined,
      },
    }
  );

  const sliderStyle = useMemo(
    () => ({
      gridTemplateColumns: `repeat(${totalCols}, 100vw)`,
      gridTemplateRows: `repeat(${totalRows}, 100vh)`,
      width: `${totalCols * 100}vw`,
      height: `${totalRows * 100}vh`,
      transform: `translate3d(${-activePanel.col * 100}vw, ${-activePanel.row * 100}vh, 0)`,
      transition: 'transform 0.65s cubic-bezier(0.22, 1, 0.36, 1)',
    }),
    [activePanel.col, activePanel.row, totalCols, totalRows]
  );

  return (
    <main
      {...bind()}
      className="relative h-screen w-screen overflow-hidden bg-slate-950 text-white"
      style={{ touchAction: 'none' }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          zIndex: zIndexLayers.backgroundTexture,
          backgroundImage:
            'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 45%), radial-gradient(circle at 80% 10%, rgba(255,255,255,0.05), transparent 35%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.06), transparent 40%)',
          backgroundColor: '#020617',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          zIndex: zIndexLayers.contentPanels,
        }}
      >
        <div className="grid" style={sliderStyle}>
          {panelGrid.map((rowPanels, rowIndex) =>
            rowPanels.map((panel, colIndex) => (
              <Slide
                key={panel.id}
                panel={panel}
                isActive={rowIndex === activePanel.row && colIndex === activePanel.col}
              />
            ))
          )}
        </div>
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          zIndex: zIndexLayers.lensVignette,
          background:
            'radial-gradient(circle at center, transparent 55%, rgba(2, 6, 23, 0.65) 85%)',
        }}
      />

      <div
        className="absolute left-6 top-6 rounded-xl border border-white/10 bg-slate-900/70 p-4 shadow-lg backdrop-blur"
        style={{ zIndex: zIndexLayers.hudOverlay }}
      >
        <p className="text-xs uppercase tracking-[0.4em] text-slate-400">Mode</p>
        <p className="text-2xl font-semibold">{currentMode}</p>
        <div className="mt-3 space-y-1 text-sm text-slate-300">
          <p>
            Lens: <span className="font-medium text-white">{lens}</span>
          </p>
          <p>
            HUD: <span className="font-medium text-white">{hudLevel}</span>
          </p>
          <p>
            Exposure:
            <span className="ml-2 font-medium text-white">
              ISO {exposure.iso} / {exposure.shutter} / {exposure.aperture}
            </span>
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-6 right-6 flex flex-col gap-2 rounded-xl border border-white/10 bg-slate-900/80 p-4 shadow-xl backdrop-blur"
        style={{ zIndex: zIndexLayers.cameraControls }}
      >
        <button
          type="button"
          onClick={cycleLens}
          className="rounded-md border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-slate-700"
        >
          Cycle Lens
        </button>
        <button
          type="button"
          onClick={cycleHud}
          className="rounded-md border border-white/10 bg-slate-800 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-slate-700"
        >
          Cycle HUD
        </button>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() =>
              setMode(currentMode === 'DSLR' ? 'Mirrorless' : 'DSLR')
            }
            className="flex-1 rounded-md border border-white/10 bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500"
          >
            Toggle Mode
          </button>
          <button
            type="button"
            onClick={() => {
              const nextIso = exposure.iso >= 800 ? 200 : exposure.iso + 200;
              updateExposure({ iso: nextIso });
            }}
            className="flex-1 rounded-md border border-white/10 bg-slate-800 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-slate-700"
          >
            ISO
          </button>
        </div>
      </div>
    </main>
  );
}
