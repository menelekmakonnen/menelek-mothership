import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Aperture, Camera, Wrench } from 'lucide-react';
import ExposureControls from './ExposureControls';
import LensSelector from './LensSelector';
import AssistTools from './AssistTools';

export default function ControlBoxes() {
  const { openBoxes, toggleBox } = useCameraContext();

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
      id: 'assist',
      title: 'ASSIST',
      icon: Wrench,
      component: AssistTools,
    },
  ];

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
              className="pointer-events-auto"
              layout
              initial={false}
            >
              <div className="camera-hud rounded-lg overflow-hidden">
                {/* Header - Always visible */}
                <button
                  onClick={() => toggleBox(box.id)}
                  className="w-full px-4 py-2 flex items-center justify-between gap-3 hover:bg-white/5 transition-colors mono text-xs"
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
