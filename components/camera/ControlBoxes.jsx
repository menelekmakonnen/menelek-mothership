import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { ChevronDown, Aperture, Camera, Wrench, Zap, ZapOff, Sparkles } from 'lucide-react';
import ExposureControls from './ExposureControls';
import LensSelector from './LensSelector';
import AssistTools from './AssistTools';

export default function ControlBoxes() {
  const { openBoxes, toggleBox, flashMode, setFlashMode, cameraMode, setCameraMode } = useCameraContext();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const boxes = [
    {
      id: 'exposure',
      title: 'EXPOSURE',
      icon: Aperture,
      component: ExposureControls,
      type: 'expandable',
    },
    {
      id: 'lenses',
      title: 'LENSES',
      icon: Camera,
      component: LensSelector,
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

  const cycleFlashMode = () => {
    const modes = ['auto', 'on', 'off'];
    const currentIndex = modes.indexOf(flashMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setFlashMode(modes[nextIndex]);
  };

  const toggleCameraMode = () => {
    setCameraMode(cameraMode === 'dslr' ? 'mirrorless' : 'dslr');
  };

  const getFlashIcon = () => {
    if (flashMode === 'on') return Zap;
    if (flashMode === 'off') return ZapOff;
    return Sparkles;
  };

  const getFlashLabel = () => {
    if (flashMode === 'on') return 'FLASH';
    if (flashMode === 'off') return 'OFF';
    return 'AUTO';
  };

  const FlashIcon = getFlashIcon();

  // On mobile, close all other boxes when opening one
  const handleToggle = (boxId) => {
    if (isMobile) {
      // Only allow one box open at a time on mobile
      if (openBoxes.includes(boxId)) {
        toggleBox(boxId); // Close it
      } else {
        // Close all others and open this one
        openBoxes.forEach(id => toggleBox(id));
        toggleBox(boxId);
      }
    } else {
      toggleBox(boxId);
    }
  };

  const hasOpenBox = openBoxes.length > 0;

  // Desktop layout - horizontal scroll
  if (!isMobile) {
    return (
      <div className="fixed top-0 left-0 right-0 z-[1500] pointer-events-none">
        <div className="flex gap-2 p-4 overflow-x-auto pb-2 scrollbar-hide">
          {boxes.map((box) => {
            const isOpen = openBoxes.includes(box.id);
            const Icon = box.icon;
            const Component = box.component;

            return (
              <motion.div
                key={box.id}
                className="pointer-events-auto flex-shrink-0"
                layout
                initial={false}
              >
                <div className="camera-hud rounded-lg overflow-hidden max-w-xs">
                  {/* Header - Always visible */}
                  <button
                    onClick={() => handleToggle(box.id)}
                    className="w-full px-4 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors mono text-xs whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-bold tracking-wider">{box.title}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="w-4 h-4" />
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
                        <div className="border-t border-white/10 p-4">
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
      </div>
    );
  }

  // Mobile layout - Grid with max 2 rows, expandable mode
  return (
    <div className="fixed top-0 left-0 right-0 z-[1500] pointer-events-none">
      <div className="p-4 pb-2">
        {!hasOpenBox ? (
          // All controls visible in grid layout
          <div className="flex flex-wrap gap-2 pointer-events-auto">
            {boxes.map((box) => {
              const Icon = box.icon;
              return (
                <motion.button
                  key={box.id}
                  onClick={() => handleToggle(box.id)}
                  className="camera-hud px-3 py-2 rounded-lg flex items-center gap-2 mono text-xs font-bold"
                  layout
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="tracking-wider">{box.title}</span>
                </motion.button>
              );
            })}

            {/* Flash toggle button */}
            <motion.button
              onClick={cycleFlashMode}
              className="camera-hud px-3 py-2 rounded-lg flex items-center gap-2 mono text-xs font-bold"
              layout
              whileTap={{ scale: 0.95 }}
            >
              <FlashIcon className="w-4 h-4" />
              <span className="tracking-wider">{getFlashLabel()}</span>
            </motion.button>

            {/* Camera mode toggle button */}
            <motion.button
              onClick={toggleCameraMode}
              className="camera-hud px-3 py-2 rounded-lg flex items-center gap-2 mono text-xs font-bold"
              layout
              whileTap={{ scale: 0.95 }}
            >
              <Camera className="w-4 h-4" />
              <span className="tracking-wider">
                {cameraMode === 'dslr' ? 'DSLR' : 'MIRRORLESS'}
              </span>
            </motion.button>
          </div>
        ) : (
          // One box expanded - show only that box
          <div className="pointer-events-auto">
            {boxes.map((box) => {
              const isOpen = openBoxes.includes(box.id);
              if (!isOpen) return null;

              const Icon = box.icon;
              const Component = box.component;

              return (
                <motion.div
                  key={box.id}
                  className="camera-hud rounded-lg overflow-hidden"
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Header */}
                  <button
                    onClick={() => handleToggle(box.id)}
                    className="w-full px-4 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors mono text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-bold tracking-wider">{box.title}</span>
                    </div>
                    <ChevronDown className="w-4 h-4 rotate-180" />
                  </button>

                  {/* Content */}
                  <div className="border-t border-white/10 p-4 max-h-[60vh] overflow-y-auto">
                    <Component />
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
