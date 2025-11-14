import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import {
  Aperture,
  Camera,
  CameraOff,
  ChevronDown,
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
    openBoxes,
    toggleBox,
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
  } = useCameraContext();
  const [isMobile, setIsMobile] = useState(false);
  const [activeMobilePanel, setActiveMobilePanel] = useState(null);
  const containerRef = useRef(null);
  const buttonRefs = useRef({});
  const [boxAlignment, setBoxAlignment] = useState({});

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const updateRailHeight = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    const height = Math.max(72, Math.ceil(el.getBoundingClientRect().height));
    document.documentElement.style.setProperty('--camera-top-rail-height', `${height}px`);
  }, []);

  useLayoutEffect(() => {
    updateRailHeight();
    window.addEventListener('resize', updateRailHeight);
    return () => window.removeEventListener('resize', updateRailHeight);
  }, [updateRailHeight]);

  useEffect(() => {
    updateRailHeight();
  }, [updateRailHeight, isMobile, openBoxes, activeMobilePanel, hasModifiedSettings]);

  const computeBoxAlignment = useCallback(() => {
    if (typeof window === 'undefined') return;
    const next = {};
    Object.entries(buttonRefs.current).forEach(([id, node]) => {
      if (!node) return;
      const rect = node.getBoundingClientRect();
      next[id] = rect.left + 320 > window.innerWidth;
    });
    setBoxAlignment(next);
  }, []);

  useLayoutEffect(() => {
    computeBoxAlignment();
    window.addEventListener('resize', computeBoxAlignment);
    return () => window.removeEventListener('resize', computeBoxAlignment);
  }, [computeBoxAlignment, openBoxes, isMobile]);

  const boxes = [
    {
      id: 'exposure',
      title: 'EXPOSURE',
      icon: Aperture,
      component: ExposureControls,
      type: 'expandable',
    },
    {
      id: 'assist',
      title: 'ASSIST',
      icon: Wrench,
      component: AssistTools,
      type: 'expandable',
    },
  ];

  const getFlashIcon = () => {
    if (flashMode === 'on') return Zap;
    if (flashMode === 'off') return ZapOff;
    return Sparkles;
  };

  const FlashIcon = getFlashIcon();

  const closeMobilePanel = () => {
    setActiveMobilePanel(null);
    setGestureLock(false);
  };

  useEffect(() => {
    if (!isMobile) {
      setActiveMobilePanel(null);
      setGestureLock(false);
    }
  }, [isMobile, setGestureLock]);

  useEffect(() => {
    setGestureLock(Boolean(activeMobilePanel));
  }, [activeMobilePanel, setGestureLock]);

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
                  flashMode === id
                    ? 'border-green-400/60 bg-green-500/10 text-green-300'
                    : 'border-white/10 bg-white/5'
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
              Swap between a rugged DSLR interface and the streamlined mirrorless layout. Mirrorless mode unlocks continuous focus and expanded HUD telemetry.
            </p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'dslr', label: 'DSLR', description: 'Optical feel, classic HUD' },
                { id: 'mirrorless', label: 'Mirrorless', description: 'Electronic viewfinder with live data' },
              ].map(({ id, label, description }) => (
                <button
                  key={id}
                  onClick={() => setCameraMode(id)}
                  className={`rounded-lg px-4 py-3 text-left border transition-all ${
                    cameraMode === id
                      ? 'border-green-400/60 bg-green-500/10 text-green-300'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="mono text-xs font-bold uppercase">{label}</span>
                    {cameraMode === id && <Sparkles className="w-4 h-4 text-green-300" />}
                  </div>
                  <p className="text-[11px] mt-2 opacity-70 leading-snug">{description}</p>
                </button>
              ))}
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
              Expand the interface into a full-screen control rig. Buttons reposition to the screen edges for a video game style cockpit.
            </p>
            <button
              onClick={() => setMobileImmersiveMode(!mobileImmersiveMode)}
              className={`w-full rounded-lg px-4 py-3 flex items-center justify-between border transition-all ${
                mobileImmersiveMode
                  ? 'border-green-400/60 bg-green-500/10 text-green-300'
                  : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="mono text-xs uppercase">
                {mobileImmersiveMode ? 'Exit Immersive' : 'Enter Immersive'}
              </span>
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
            {[{ id: 'modern', name: 'Modern Hybrid', desc: 'Clean mirrorless telemetry and auto flash logic.' },
              { id: 'retro', name: 'Retro HUD', desc: 'Amber overlays, tungsten balance, manual focus.' },
              { id: 'cinema', name: 'Cinema Rig', desc: 'Cloudy WB, flash disabled, negative EV for highlight roll-off.' }].map((preset) => (
              <button
                key={preset.id}
                onClick={() => applyCameraPreset(preset.id)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                  activePreset === preset.id
                    ? 'border-green-400/60 bg-green-500/10 text-green-300'
                    : 'border-white/10 bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="mono text-xs font-bold uppercase">{preset.name}</span>
                  {activePreset === preset.id && <Sparkles className="w-4 h-4" />}
                </div>
                <p className="text-[11px] mt-2 opacity-70 leading-snug">{preset.desc}</p>
              </button>
            ))}
            <button
              onClick={() => applyCameraPreset(null)}
              className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                !activePreset ? 'border-green-400/40 text-green-300 bg-green-500/5' : 'border-white/10 bg-white/5'
              }`}
            >
              <span className="mono text-xs uppercase">Default Layout</span>
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
                  Restore default camera parameters, clear HUD tweaks, and close active boxes.
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
  }, [FlashIcon, activePreset, applyCameraPreset, cameraMode, currentLens.name, flashMode, hasModifiedSettings, mobileImmersiveMode, resetCamera, setCameraMode, setFlashMode, setHasModifiedSettings, setMobileImmersiveMode]);

  const mobilePanelOrder = useMemo(() => {
    return [
      'exposure',
      'assist',
      'lens',
      'flash',
      'mode',
      'immersive',
      'presets',
      'reset',
    ].filter((key) => mobilePanels[key]);
  }, [mobilePanels]);

  const exclusiveBoxIds = useMemo(() => ['exposure', 'assist'], []);

  // On mobile, close all other boxes when opening one
  const handleToggle = (boxId) => {
    if (isMobile) {
      if (openBoxes.includes(boxId)) {
        toggleBox(boxId);
        ensurePartialReset();
      } else {
        let closedOther = false;
        openBoxes.forEach((id) => {
          if (id !== boxId) {
            toggleBox(id);
            closedOther = true;
          }
        });
        if (closedOther) {
          ensurePartialReset();
        }
        toggleBox(boxId);
      }
    } else {
      const isOpen = openBoxes.includes(boxId);
      if (isOpen) {
        toggleBox(boxId);
        ensurePartialReset();
      } else {
        let closedOther = false;
        exclusiveBoxIds
          .filter((id) => id !== boxId && openBoxes.includes(id))
          .forEach((id) => {
            toggleBox(id);
            closedOther = true;
          });
        if (closedOther) {
          ensurePartialReset();
        }
        toggleBox(boxId);
      }
    }
  };

  // Desktop layout - horizontal scroll
  if (!isMobile) {
    const renderRailButton = ({ onClick, icon: Icon, label, sublabel, accent }) => (
      <motion.button
        onClick={onClick}
        whileTap={{ scale: 0.96 }}
        whileHover={{ scale: 1.02 }}
        className={`camera-hud h-12 px-4 rounded-xl border border-white/10 flex items-center gap-3 transition-all ${accent || ''}`}
      >
        <Icon className="w-4 h-4" />
        <div className="flex flex-col leading-none text-left">
          <span className="mono text-[10px] uppercase tracking-[0.35em] opacity-70">{sublabel}</span>
          <span className="mono text-xs font-semibold tracking-wider">{label}</span>
        </div>
      </motion.button>
    );

    const flashLabel = flashMode === 'auto' ? 'AUTO' : flashMode === 'on' ? 'FLASH ON' : 'FLASH OFF';
    const flashAccent = flashMode === 'on' ? 'text-amber-200 border-amber-400/40' : flashMode === 'off' ? 'text-slate-200' : '';

    return (
      <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[1500]">
        <div className="camera-top-rail pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 pt-4 pb-3 pointer-events-auto">
            <div className="flex items-center gap-3 overflow-x-auto overflow-y-visible pb-1 scrollbar-hide pointer-events-auto">
              <div className="flex items-center gap-2 flex-shrink-0">
                <PowerControls orientation="horizontal" variant="inline" />
              </div>

              {boxes.map((box) => {
                const isOpen = openBoxes.includes(box.id);
                const Icon = box.icon;
                const Component = box.component;
                const alignRight = boxAlignment[box.id];

                return (
                  <div
                    key={box.id}
                    className="relative flex-shrink-0"
                    ref={(node) => {
                      if (node) {
                        buttonRefs.current[box.id] = node;
                      } else {
                        delete buttonRefs.current[box.id];
                      }
                    }}
                  >
                    <motion.button
                      onClick={() => handleToggle(box.id)}
                      className={`camera-hud h-12 px-4 rounded-xl border border-white/10 flex items-center gap-3 transition-all whitespace-nowrap ${
                        isOpen ? 'bg-green-500/10 border-green-400/40 text-green-200' : ''
                      }`}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <Icon className="w-4 h-4" />
                      <div className="flex flex-col text-left leading-none">
                        <span className="mono text-[10px] uppercase tracking-[0.35em] opacity-70">Control</span>
                        <span className="mono text-xs font-semibold tracking-wider">{box.title}</span>
                      </div>
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4" />
                      </motion.div>
                    </motion.button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -12 }}
                          transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                          className="absolute z-[1600] mt-3 w-[320px]"
                          style={{ left: alignRight ? 'auto' : 0, right: alignRight ? 0 : 'auto' }}
                        >
                          <div className="camera-hud rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
                            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                              <div className="flex items-center gap-3">
                                <Icon className="w-4 h-4" />
                                <span className="mono text-xs tracking-[0.3em]">{box.title}</span>
                              </div>
                              <button
                                onClick={() => handleToggle(box.id)}
                                className="rounded-full p-1.5 hover:bg-white/10"
                                aria-label={`Close ${box.title}`}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="p-4 max-h-[60vh] overflow-y-auto">
                              <Component />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}

              <div className="flex items-center gap-2 flex-shrink-0">
                {renderRailButton({
                  onClick: () => {
                    setHasModifiedSettings(true);
                    const modes = ['auto', 'on', 'off'];
                    const currentIndex = modes.indexOf(flashMode);
                    const nextIndex = (currentIndex + 1) % modes.length;
                    setFlashMode(modes[nextIndex]);
                  },
                  icon: getFlashIcon(),
                  label: flashLabel,
                  sublabel: 'Flash',
                  accent: flashAccent,
                })}
                {renderRailButton({
                  onClick: () => {
                    setHasModifiedSettings(true);
                    setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr');
                  },
                  icon: cameraMode === 'dslr' ? Camera : CameraOff,
                  label: cameraMode === 'dslr' ? 'DSLR' : 'MIRRORLESS',
                  sublabel: 'Body',
                  accent: cameraMode === 'mirrorless' ? 'text-cyan-200 border-cyan-400/40' : '',
                })}
                {renderRailButton({
                  onClick: () => {
                    setHasModifiedSettings(true);
                    cycleLens();
                  },
                  icon: RefreshCw,
                  label: currentLens.id.toUpperCase(),
                  sublabel: 'Lens',
                  accent: 'text-green-200',
                })}
                <AnimatePresence>
                  {hasModifiedSettings && (
                    <motion.button
                      key="reset"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      onClick={resetCamera}
                      className="camera-hud h-12 px-4 rounded-xl border border-green-400/50 flex items-center gap-2 mono text-xs font-bold text-green-300 hover:bg-green-500/10"
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
      </div>
    );
  }

  // Mobile layout - icon strip with expandable panels
  return (
    <div ref={containerRef} className="fixed top-0 left-0 right-0 z-[1500] pointer-events-none">
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
