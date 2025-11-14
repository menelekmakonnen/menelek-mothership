import { useCameraContext } from '@/context/CameraContext';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Maximize2, Minimize2, Zap, ZapOff, Sparkles, Camera, CameraOff, RotateCcw, Gamepad2 } from 'lucide-react';
import ExposureControls from './ExposureControls';
import AssistTools from './AssistTools';
import LensSelector from './LensSelector';

export default function MobileImmersiveHUD() {
  const {
    mobileImmersiveMode,
    setMobileImmersiveMode,
    setGestureLock,
    flashMode,
    setFlashMode,
    cameraMode,
    setCameraMode,
    hasModifiedSettings,
    resetCamera,
    applyCameraPreset,
    activePreset,
  } = useCameraContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setGestureLock(mobileImmersiveMode);
    return () => setGestureLock(false);
  }, [mobileImmersiveMode, setGestureLock]);

  if (!mobileImmersiveMode || !isMobile) {
    return null;
  }

  const flashModes = [
    { id: 'auto', label: 'Auto', icon: Sparkles },
    { id: 'on', label: 'Flash On', icon: Zap },
    { id: 'off', label: 'Flash Off', icon: ZapOff },
  ];

  const presets = [
    { id: 'modern', title: 'Modern Hybrid' },
    { id: 'retro', title: 'Retro HUD' },
    { id: 'cinema', title: 'Cinema Rig' },
  ];

  return (
    <AnimatePresence>
      {mobileImmersiveMode && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[3000] pointer-events-auto bg-gradient-to-b from-black/95 via-black/90 to-black/80 text-white flex flex-col"
        >
          <div className="px-6 pt-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Maximize2 className="w-5 h-5 text-green-400" />
              <div>
                <p className="mono text-[10px] uppercase tracking-[0.4em] text-green-400/80">Immersive Mode</p>
                <h2 className="text-lg font-semibold">Control Rig</h2>
              </div>
            </div>
            <button
              onClick={() => setMobileImmersiveMode(false)}
              className="rounded-full p-3 border border-white/15 hover:border-green-400 transition-colors"
              aria-label="Exit immersive mode"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5">
            <motion.section
              layout
              className="camera-hud rounded-3xl p-4 border border-white/10"
            >
              <header className="flex items-center justify-between mb-4">
                <h3 className="mono text-xs uppercase tracking-[0.35em] text-green-300">Exposure Stack</h3>
              </header>
              <ExposureControls />
            </motion.section>

            <motion.section
              layout
              className="camera-hud rounded-3xl p-4 border border-white/10"
            >
              <header className="flex items-center justify-between mb-4">
                <h3 className="mono text-xs uppercase tracking-[0.35em] text-green-300">Glass Locker</h3>
              </header>
              <div className="max-h-56 overflow-y-auto pr-2">
                <LensSelector />
              </div>
            </motion.section>

            <motion.section
              layout
              className="camera-hud rounded-3xl p-4 border border-white/10"
            >
              <header className="flex items-center justify-between mb-4">
                <h3 className="mono text-xs uppercase tracking-[0.35em] text-green-300">Assist Suite</h3>
              </header>
              <div className="max-h-60 overflow-y-auto pr-2">
                <AssistTools />
              </div>
            </motion.section>

            <motion.section
              layout
              className="camera-hud rounded-3xl p-4 border border-white/10"
            >
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <h3 className="mono text-[11px] uppercase tracking-[0.3em] text-green-300 mb-3">Flash Matrix</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {flashModes.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        onClick={() => setFlashMode(id)}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          flashMode === id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className="w-4 h-4" />
                          <span className="mono text-xs">{label}</span>
                        </div>
                        <span className="mono text-[10px] uppercase opacity-70">{id}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="mono text-[11px] uppercase tracking-[0.3em] text-green-300 mb-3">Camera Body</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[{ id: 'dslr', label: 'DSLR', icon: Camera, blurb: 'Optical view, tactile HUD' },
                      { id: 'mirrorless', label: 'Mirrorless', icon: CameraOff, blurb: 'Electronic view with live feedback' }].map(({ id, label, icon: Icon, blurb }) => (
                        <button
                          key={id}
                          onClick={() => setCameraMode(id)}
                          className={`rounded-xl px-4 py-3 text-left border transition-all ${
                            cameraMode === id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="mono text-xs uppercase">{label}</span>
                            <Icon className="w-4 h-4" />
                          </div>
                          <p className="text-[11px] mt-2 opacity-70 leading-snug">{blurb}</p>
                        </button>
                      ))}
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              layout
              className="camera-hud rounded-3xl p-4 border border-white/10"
            >
              <header className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Gamepad2 className="w-4 h-4 text-green-300" />
                  <h3 className="mono text-xs uppercase tracking-[0.35em] text-green-300">Presets</h3>
                </div>
                {activePreset && (
                  <span className="text-[11px] text-green-300 mono uppercase">{activePreset}</span>
                )}
              </header>
              <div className="grid grid-cols-1 gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.id}
                    onClick={() => applyCameraPreset(preset.id)}
                    className={`rounded-xl px-4 py-3 text-left border transition-all ${
                      activePreset === preset.id ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                    }`}
                  >
                    <span className="mono text-xs uppercase">{preset.title}</span>
                  </button>
                ))}
                <button
                  onClick={() => applyCameraPreset(null)}
                  className={`rounded-xl px-4 py-3 text-left border transition-all ${
                    !activePreset ? 'border-green-400/60 bg-green-500/10 text-green-300' : 'border-white/10 bg-white/5'
                  }`}
                >
                  <span className="mono text-xs uppercase">Manual Configuration</span>
                </button>
              </div>
            </motion.section>
          </div>

          <div className="px-6 pb-6 flex items-center justify-between">
            <button
              onClick={resetCamera}
              disabled={!hasModifiedSettings}
              className={`px-6 py-3 rounded-full border text-sm font-semibold transition-all ${
                hasModifiedSettings ? 'border-red-400/70 text-red-300 hover:bg-red-500/10' : 'border-white/10 text-white/40 cursor-not-allowed'
              }`}
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                Reset Camera
              </div>
            </button>

            <button
              onClick={() => setMobileImmersiveMode(false)}
              className="px-6 py-3 rounded-full border border-green-400/60 text-green-300 font-semibold hover:bg-green-500/10 transition-all"
            >
              Return to Viewfinder
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
