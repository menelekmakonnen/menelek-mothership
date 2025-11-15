import { useCameraContext } from '@/context/CameraContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Aperture,
  Camera,
  CameraOff,
  Gamepad2,
  Maximize2,
  Minimize2,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Wrench,
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
    cameraMode,
    setCameraMode,
    resetCamera,
    ensurePartialReset,
    currentLens,
    cycleLens,
    hasModifiedSettings,
    setHasModifiedSettings,
    setGestureLock,
    mobileImmersiveMode,
    setMobileImmersiveMode,
    applyCameraPreset,
    activePreset,
    hudVisibility,
  } = useCameraContext();

  const [isMobile, setIsMobile] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);
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
  }, [updateRailHeight, isMobile, activeMobilePanel, hasModifiedSettings]);

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
        icon: Wrench,
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
      mode: {
        title: 'Camera Body',
        icon: cameraMode === 'dslr' ? Camera : CameraOff,
        content: (
          <div className="space-y-3">
            <p className="text-[13px] text-[color:var(--text-secondary)]">
              Swap between DSLR heft and the lightweight mirrorless body. Mirrorless unlocks expanded HUD telemetry.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[{ id: 'dslr', label: 'DSLR', description: 'Optical view, classic HUD' }, { id: 'mirrorless', label: 'Mirrorless', description: 'Electronic viewfinder with live data' }].map(
                ({ id, label, description }) => (
                  <button
                    key={id}
                    onClick={() => setCameraMode(id)}
                    className={`rounded-lg px-4 py-3 text-left border transition-all ${
                      cameraMode === id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="mono text-xs font-bold uppercase">{label}</span>
                      {cameraMode === id && <Sparkles className="w-4 h-4 text-green-300" />}
                    </div>
                    <p className="text-[11px] mt-2 opacity-70 leading-snug">{description}</p>
                  </button>
                )
              )}
            </div>
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
      presets: {
        title: 'Camera Presets',
        icon: Gamepad2,
        content: (
          <div className="space-y-3">
            {[{ id: 'modern', name: 'Modern Hybrid', desc: 'Clean mirrorless telemetry with adaptive flash logic.' }, { id: 'retro', name: 'Retro HUD', desc: 'Amber overlays, tungsten balance, manual focus.' }, { id: 'cinema', name: 'Cinema Rig', desc: 'Waveform scopes, film matte, audio meters.' }].map(
              (preset) => (
                <button
                  key={preset.id}
                  onClick={() => applyCameraPreset(preset.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                    activePreset === preset.id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-bold uppercase">{preset.name}</span>
                    {activePreset === preset.id && <Sparkles className="w-4 h-4" />}
                  </div>
                  <p className="text-[11px] mt-2 opacity-70 leading-snug">{preset.desc}</p>
                </button>
              )
            )}
            <button
              onClick={() => applyCameraPreset(null)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                !activePreset ? 'border-green-400/40 text-green-300 bg-green-500/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="mono text-xs uppercase">Manual Setup</span>
              <p className="text-[11px] mt-2 opacity-70 leading-snug">Return to your manual configuration.</p>
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
  }, [FlashIcon, activePreset, applyCameraPreset, cameraMode, closeMobilePanel, currentLens.name, flashMode, hasModifiedSettings, mobileImmersiveMode, resetCamera, setCameraMode, setFlashMode, setHasModifiedSettings, setMobileImmersiveMode]);

  const mobilePanelOrder = useMemo(
    () =>
      ['exposure', 'assist', 'lens', 'flash', 'mode', 'immersive', 'presets', 'reset'].filter((key) => mobilePanels[key]),
    [mobilePanels]
  );

  if (!isMobile) {
    const flashLabel = flashMode === 'auto' ? 'AUTO' : flashMode === 'on' ? 'FLASH ON' : 'FLASH OFF';
    const flashAccent =
      flashMode === 'on' ? 'border-amber-400/40 text-amber-200' : flashMode === 'off' ? 'border-white/15 text-slate-200' : '';
    const BodyIcon = cameraMode === 'dslr' ? Camera : CameraOff;

    return (
      <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[2000]">
        <div className="camera-top-rail pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-4 pointer-events-auto space-y-4">
            <div className="flex items-start gap-3 flex-wrap">
              <div className="flex-shrink-0">
                <PowerControls orientation="horizontal" variant="inline" />
              </div>
              <div className="flex-1 min-w-[320px] camera-hud rounded-3xl border border-white/10 p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Aperture className="w-4 h-4" />
                    <span className="mono text-xs tracking-[0.35em] uppercase">Exposure</span>
                  </div>
                  <span className="mono text-[10px] uppercase tracking-[0.35em] text-green-300/80">{currentLens.name}</span>
                </div>
                <ExposureControls variant="inline" />
              </div>
              <div className="flex-1 min-w-[320px] camera-hud rounded-3xl border border-white/10 p-4 shadow-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4" />
                    <span className="mono text-xs tracking-[0.35em] uppercase">Assist</span>
                  </div>
                  <span className="mono text-[10px] uppercase tracking-[0.35em] text-white/60">{hudVisibility.toUpperCase()}</span>
                </div>
                <AssistTools variant="inline" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 justify-end">
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

              <motion.button
                onClick={() => {
                  setHasModifiedSettings(true);
                  setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr');
                }}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                className={`camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all ${
                  cameraMode === 'mirrorless' ? 'text-cyan-200 border-cyan-400/40' : ''
                }`}
              >
                <BodyIcon className="w-4 h-4" />
                <div className="flex flex-col leading-none text-left">
                  <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Body</span>
                  <span className="mono text-xs font-semibold tracking-[0.35em]">
                    {cameraMode === 'dslr' ? 'DSLR' : 'MIRRORLESS'}
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
                className="camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all text-green-200"
              >
                <RefreshCw className="w-4 h-4" />
                <div className="flex flex-col leading-none text-left">
                  <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Lens</span>
                  <span className="mono text-xs font-semibold tracking-[0.35em]">{currentLens.id.toUpperCase()}</span>
                </div>
              </motion.button>

              <motion.button
                onClick={() => applyCameraPreset(activePreset ? null : 'modern')}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.03 }}
                className={`camera-hud h-12 px-4 rounded-2xl border border-white/12 flex items-center gap-3 transition-all ${
                  activePreset ? 'border-green-400/60 text-green-200' : 'text-white/80'
                }`}
              >
                <Gamepad2 className="w-4 h-4" />
                <div className="flex flex-col leading-none text-left">
                  <span className="mono text-[9px] uppercase tracking-[0.4em] opacity-70">Preset</span>
                  <span className="mono text-xs font-semibold tracking-[0.35em]">
                    {activePreset ? activePreset.toUpperCase() : 'MANUAL'}
                  </span>
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
