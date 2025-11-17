import { useCameraContext } from '@/context/CameraContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Aperture,
  Gauge,
  Grid3x3,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Timer,
  X,
  Zap,
  ZapOff,
} from 'lucide-react';
import ExposureControls from './ExposureControls';
import LensSelector from './LensSelector';
import AssistTools from './AssistTools';
import PowerControls from './PowerControls';

export default function ControlBoxes() {
  const {
    flashMode,
    setFlashMode,
    resetCamera,
    ensurePartialReset,
    currentLens,
    cycleLens,
    hasModifiedSettings,
    setHasModifiedSettings,
    setGestureLock,
    mobileImmersiveMode,
    setMobileImmersiveMode,
    iso,
    setIso,
    aperture,
    setAperture,
    shutterSpeed,
    setShutterSpeed,
    ruleOfThirds,
    setRuleOfThirds,
  } = useCameraContext();

  const [isMobile, setIsMobile] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);
  const [activeDial, setActiveDial] = useState(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateRailHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const height = Math.max(88, Math.ceil(el.getBoundingClientRect().height));
    document.documentElement.style.setProperty('--camera-top-rail-height', `${height}px`);
  }, []);

  useLayoutEffect(() => {
    updateRailHeight();
    window.addEventListener('resize', updateRailHeight);
    return () => window.removeEventListener('resize', updateRailHeight);
  }, [updateRailHeight]);

  useEffect(() => {
    updateRailHeight();
  }, [updateRailHeight, isMobile, activeMobilePanel, hasModifiedSettings, activeDial]);

  const getFlashIcon = () => {
    if (flashMode === 'on') return Zap;
    if (flashMode === 'off') return ZapOff;
    return Sparkles;
  };

  const FlashIcon = getFlashIcon();

  const closeMobilePanel = useCallback(() => {
    setActiveMobilePanel(null);
    setGestureLock(false);
    ensurePartialReset();
  }, [ensurePartialReset, setGestureLock]);

  useEffect(() => {
    const hasPanel = Boolean(activeMobilePanel);
    setGestureLock(hasPanel);
    if (hasPanel) {
      setHasModifiedSettings(true);
      if (typeof window !== 'undefined') {
        window.requestAnimationFrame(() => {
          try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (error) {
            window.scrollTo(0, 0);
          }
        });
      }
    }
  }, [activeMobilePanel, setGestureLock, setHasModifiedSettings]);

  const mobilePanels = useMemo(() => {
    const flashModes = [
      { id: 'auto', label: 'Auto', icon: Sparkles },
      { id: 'on', label: 'Flash On', icon: Zap },
      { id: 'off', label: 'Flash Off', icon: ZapOff },
    ];

    return {
      exposure: {
        title: 'Exposure Controls',
        icon: Aperture,
        content: <ExposureControls />,
      },
      assist: {
        title: 'Assist Options',
        icon: Grid3x3,
        content: <AssistTools />,
      },
      flash: {
        title: 'Flash Mode',
        icon: FlashIcon,
        content: (
          <div className="grid grid-cols-1 gap-2">
            {flashModes.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setFlashMode(id);
                  setHasModifiedSettings(true);
                }}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-all ${
                  flashMode === id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4" />
                  <span className="mono text-xs">{label}</span>
                </div>
                <span className="text-[10px] uppercase opacity-70">{id}</span>
              </button>
            ))}
          </div>
        ),
      },
      lens: {
        title: `Lens — ${currentLens.name}`,
        icon: RefreshCw,
        content: <LensSelector />,
      },
      immersive: {
        title: 'Immersive Layout',
        icon: mobileImmersiveMode ? Minimize2 : Maximize2,
        content: (
          <div className="space-y-3">
            <p className="text-[13px] text-[color:var(--text-secondary)]">
              Expand the interface into a game-like control rig. Buttons reposition to the screen edges.
            </p>
            <button
              onClick={() => setMobileImmersiveMode(!mobileImmersiveMode)}
              className={`w-full rounded-lg px-4 py-3 flex items-center justify-between border transition-all ${
                mobileImmersiveMode ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="mono text-xs uppercase">{mobileImmersiveMode ? 'Exit Immersive' : 'Enter Immersive'}</span>
              {mobileImmersiveMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        ),
      },
      reset: hasModifiedSettings
        ? {
            title: 'Reset Camera',
            icon: RotateCcw,
            content: (
              <div className="space-y-3">
                <p className="text-[13px] text-[color:var(--text-secondary)]">
                  First tap clears overlays, second tap restores the factory layout.
                </p>
                <button
                  onClick={() => {
                    resetCamera();
                    closeMobilePanel();
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-red-500/20 text-red-300 border border-red-400/50 mono text-xs uppercase"
                >
                  Confirm Reset
                </button>
              </div>
            ),
          }
        : null,
    };
  }, [FlashIcon, closeMobilePanel, currentLens.name, flashMode, hasModifiedSettings, mobileImmersiveMode, resetCamera, setFlashMode, setHasModifiedSettings, setMobileImmersiveMode]);

  const mobilePanelOrder = useMemo(
    () => ['exposure', 'assist', 'lens', 'flash', 'immersive', 'reset'].filter((key) => mobilePanels[key]),
    [mobilePanels]
  );

  if (!isMobile) {
    const flashLabel = flashMode === 'auto' ? 'AUTO' : flashMode === 'on' ? 'FLASH ON' : 'FLASH OFF';
    const flashAccent =
      flashMode === 'on' ? 'border-amber-400/40 text-amber-200' : flashMode === 'off' ? 'border-white/15 text-slate-200' : '';

    const formatApertureValue = (value) => `ƒ/${Number(value).toFixed(1)}`;
    const formatShutterValue = (speed) => {
      if (speed >= 1) return `${Math.round(speed)}"`;
      return `1/${Math.max(1, Math.round(speed))}`;
    };

    const dialConfigs = [
      {
        id: 'iso',
        label: 'ISO',
        icon: Gauge,
        min: 100,
        max: 6400,
        step: 100,
        marks: ['100', '1600', '3200', '6400'],
        value: iso,
        setValue: setIso,
        formatValue: (value) => Math.round(value),
      },
      {
        id: 'aperture',
        label: 'APERTURE',
        icon: Aperture,
        min: 1.4,
        max: 22,
        step: 0.1,
        marks: ['ƒ/1.4', 'ƒ/5.6', 'ƒ/11', 'ƒ/22'],
        value: Number(aperture.toFixed(1)),
        setValue: setAperture,
        formatValue: (value) => formatApertureValue(value),
      },
      {
        id: 'shutter',
        label: 'SHUTTER',
        icon: Timer,
        min: 30,
        max: 8000,
        step: 10,
        marks: ['30"', '1/250', '1/1000', '1/8000'],
        value: shutterSpeed,
        setValue: setShutterSpeed,
        formatValue: (value) => formatShutterValue(value),
      },
    ];

    const activeDialConfig = dialConfigs.find((dial) => dial.id === activeDial) || null;

    const handleDialToggle = (dialId) => {
      setActiveDial((prev) => {
        if (prev === dialId) {
          ensurePartialReset();
          return null;
        }
        return dialId;
      });
    };

    const handleDialClose = () => {
      setActiveDial(null);
      ensurePartialReset();
    };

    const handleDialChange = (dialId, value) => {
      const dial = dialConfigs.find((entry) => entry.id === dialId);
      if (!dial) return;
      const numeric = Number(value);
      if (Number.isNaN(numeric)) return;
      dial.setValue(numeric);
      setHasModifiedSettings(true);
    };

    const gridOrder = ['off', 'classic', 'precision', 'golden'];
    const gridLabels = {
      off: 'OFF',
      classic: 'CLASSIC',
      precision: 'PRECISION',
      golden: 'CINEMATIC',
    };

    const cycleGrid = () => {
      const index = gridOrder.indexOf(ruleOfThirds);
      const next = gridOrder[(index + 1) % gridOrder.length];
      setRuleOfThirds(next);
      setHasModifiedSettings(true);
    };

    return (
      <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[2000]">
        <div className="camera-top-rail pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-4 pointer-events-auto space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-1 min-w-[320px] flex-wrap items-center gap-3">
                {dialConfigs.map((dial) => {
                  const Icon = dial.icon;
                  const isActive = activeDial === dial.id;
                  return (
                    <motion.button
                      key={dial.id}
                      onClick={() => handleDialToggle(dial.id)}
                      whileTap={{ scale: 0.95 }}
                      whileHover={{ scale: 1.03 }}
                      className={`camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all ${
                        isActive ? 'border-green-400/60 text-green-200' : ''
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex flex-col leading-none text-left">
                        <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">{dial.label}</span>
                        <span className="mono text-xs font-semibold tracking-[0.35em]">
                          {dial.formatValue(dial.value)}
                        </span>
                      </div>
                    </motion.button>
                  );
                })}

                <motion.button
                  onClick={cycleGrid}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all"
                >
                  <Grid3x3 className="w-4 h-4" />
                  <div className="flex flex-col leading-none text-left">
                    <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Grid</span>
                    <span className="mono text-xs font-semibold tracking-[0.35em]">
                      {gridLabels[ruleOfThirds] || 'OFF'}
                    </span>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    setHasModifiedSettings(true);
                    cycleLens();
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className="camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  <div className="flex flex-col leading-none text-left">
                    <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Lens</span>
                    <span className="mono text-xs font-semibold tracking-[0.35em]">{currentLens.name}</span>
                  </div>
                </motion.button>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <motion.button
                  onClick={() => {
                    setHasModifiedSettings(true);
                    const modes = ['auto', 'on', 'off'];
                    const currentIndex = modes.indexOf(flashMode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    setFlashMode(modes[nextIndex]);
                  }}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.03 }}
                  className={`camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all ${flashAccent}`}
                >
                  <FlashIcon className="w-4 h-4" />
                  <div className="flex flex-col leading-none text-left">
                    <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Flash</span>
                    <span className="mono text-xs font-semibold tracking-[0.35em]">{flashLabel}</span>
                  </div>
                </motion.button>

                <AnimatePresence>
                  {hasModifiedSettings && (
                    <motion.button
                      key="reset"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={resetCamera}
                      className="camera-hud h-12 px-4 rounded-2xl border border-green-400/50 flex items-center gap-2 mono text-xs font-bold text-green-300 hover:bg-green-500/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span className="tracking-wider">RESET</span>
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>
      <AnimatePresence>
        {activeDialConfig && (
          <motion.div
            key={activeDialConfig.id}
            className="fixed inset-0 z-[2300] flex items-center justify-center bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDialClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="max-w-xl w-full mx-6 camera-hud rounded-3xl border border-white/12 p-6 shadow-[0_30px_120px_rgba(0,0,0,0.65)]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {(() => {
                    const ActiveDialIcon = activeDialConfig.icon;
                    return ActiveDialIcon ? <ActiveDialIcon className="w-5 h-5" /> : null;
                  })()}
                  <span className="mono text-xs tracking-[0.35em] uppercase">{activeDialConfig.label}</span>
                </div>
                <button
                  onClick={handleDialClose}
                  className="rounded-full bg-white/5 hover:bg-white/10 border border-white/10 p-2"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-4">
                <div className="text-3xl font-semibold">
                  {activeDialConfig.formatValue(activeDialConfig.value)}
                </div>
                <input
                  type="range"
                  min={activeDialConfig.min}
                  max={activeDialConfig.max}
                  step={activeDialConfig.step}
                  value={activeDialConfig.value}
                  onChange={(e) => handleDialChange(activeDialConfig.id, e.target.value)}
                  className="camera-slider w-full accent-green-400"
                />
                <div className="flex justify-between text-[10px] opacity-60">
                  {activeDialConfig.marks.map((mark) => (
                    <span key={mark}>{mark}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[1700] pointer-events-none">
      <div className="px-3 pt-4">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-2 overflow-x-auto px-3 py-2 bg-black/75 border border-white/10 rounded-full backdrop-blur-md">
            {mobilePanelOrder.map((panelId) => {
              const panel = mobilePanels[panelId];
              const Icon = panel.icon;
              const isActive = activeMobilePanel === panelId;

              return (
                <motion.button
                  key={panelId}
                  onClick={() => setActiveMobilePanel((prev) => (prev === panelId ? null : panelId))}
                  className={`relative flex items-center justify-center w-12 h-12 rounded-full border transition-all ${
                    isActive ? 'border-green-400/70 bg-green-500/20 text-green-300 scale-110' : 'border-white/15 bg-white/5'
                  }`}
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="sr-only">{panel.title}</span>
                </motion.button>
              );
            })}
            <PowerControls variant="inline" />
            <AnimatePresence>
              {(hasModifiedSettings || activeMobilePanel) && (
                <motion.button
                  key="mobile-reset"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => {
                    resetCamera();
                    closeMobilePanel();
                  }}
                  className="camera-hud w-12 h-12 rounded-full border border-green-400/60 flex items-center justify-center text-green-300"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span className="sr-only">Reset camera</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeMobilePanel && (
          <motion.div
            key={activeMobilePanel}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="pointer-events-auto px-3 pb-4"
          >
            <motion.div
              className="camera-hud rounded-3xl border border-white/10 p-4 shadow-xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  {(() => {
                    const PanelIcon = mobilePanels[activeMobilePanel].icon;
                    return PanelIcon ? <PanelIcon className="w-5 h-5" /> : null;
                  })()}
                  <div>
                    <p className="mono text-[10px] uppercase tracking-widest text-green-400/80">Camera Control</p>
                    <h3 className="text-sm font-semibold">{mobilePanels[activeMobilePanel].title}</h3>
                  </div>
                </div>
                <button
                  onClick={closeMobilePanel}
                  className="rounded-full p-2 hover:bg-white/10 transition-colors"
                  aria-label="Close panel"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4 max-h-[60vh] overflow-y-auto space-y-4">
                {mobilePanels[activeMobilePanel].content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
