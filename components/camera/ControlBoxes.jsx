import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Aperture, Camera, Wrench, Zap, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import ExposureControls from './ExposureControls';
import LensSelector from './LensSelector';
import AssistTools from './AssistTools';
import FlashToggle from './FlashToggle';

export default function ControlBoxes() {
  const { openBoxes, toggleBox, flashMode, setFlashMode } = useCameraContext();
  const [resetStage, setResetStage] = useState(0);

  // Auto-close boxes and trigger reset on mobile when closing
  useEffect(() => {
    const handleAutoReset = () => {
      if (openBoxes.length === 0 && window.innerWidth < 768) {
        // Trigger a subtle reset when all boxes are closed on mobile
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    handleAutoReset();
  }, [openBoxes]);

  const handleReset = () => {
    if (resetStage === 0) {
      // First click: Close all boxes and clear overlays
      // This will be handled by the parent (main index)
      setResetStage(1);
      setTimeout(() => setResetStage(0), 3000);
    } else if (resetStage === 1) {
      // Second click: Reset page
      window.location.reload();
    }
  };

  const boxes = [
    {
      id: 'exposure',
      title: 'EXPOSURE',
      icon: Aperture,
      component: ExposureControls,
    },
    {
      id: 'lenses',
      title: 'LENSES',
      icon: Camera,
      component: LensSelector,
    },
    {
      id: 'flash',
      title: 'FLASH',
      icon: Zap,
      component: () => (
        <div className="flex gap-2">
          {['auto', 'on', 'off'].map((mode) => (
            <button
              key={mode}
              onClick={() => setFlashMode(mode)}
              className={`px-4 py-2 rounded mono text-xs capitalize transition-all ${
                flashMode === mode
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                  : 'bg-white/5 border border-white/10 hover:border-white/30'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      ),
    },
    {
      id: 'assist',
      title: 'ASSIST',
      icon: Wrench,
      component: AssistTools,
    },
  ];

  return (
    <div className="md:hidden fixed top-0 left-0 right-0 z-[1500] pointer-events-none">
      <div className="flex flex-col gap-2 p-2">
        <div className="flex gap-2 flex-wrap">
          {boxes.map((box) => {
            const isOpen = openBoxes.includes(box.id);
            const Icon = box.icon;
            const Component = box.component;

            return (
              <motion.div
                key={box.id}
                className="pointer-events-auto flex-1 min-w-[120px]"
                layout
                initial={false}
              >
                <div className="camera-hud rounded-lg overflow-hidden">
                  {/* Header - Always visible */}
                  <button
                    onClick={() => toggleBox(box.id)}
                    className="w-full px-3 py-2 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3 h-3" />
                      <span className="font-bold tracking-wider text-[10px]">{box.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-3 h-3" />
                    </motion.div>
                  </button>

                  {/* Content - Expandable */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/10 p-3">
                          <Component />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Reset button - appears when any box is open on mobile */}
        <AnimatePresence>
          {openBoxes.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="pointer-events-auto flex justify-center"
            >
              <button
                onClick={handleReset}
                className={`camera-hud px-4 py-2 rounded-full mono text-xs flex items-center gap-2 ${
                  resetStage === 1
                    ? 'bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 animate-pulse'
                    : ''
                }`}
              >
                <RotateCcw className="w-3 h-3" />
                <span>{resetStage === 0 ? 'RESET VIEW' : 'RESET PAGE'}</span>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
