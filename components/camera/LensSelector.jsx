import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function LensSelector() {
  const { currentLens, changeLens, availableLenses } = useCameraContext();

  return (
    <div className="grid grid-cols-1 gap-2 mono text-xs">
      {availableLenses.map((lens) => {
        const isActive = lens.id === currentLens.id;

        return (
          <motion.button
            key={lens.id}
            onClick={() => changeLens(lens)}
            className={`relative px-4 py-3 rounded-lg border transition-all text-left ${
              isActive
                ? 'bg-green-500/20 border-green-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-bold mb-1">{lens.name}</div>
                <div className="text-[10px] opacity-60">
                  Max Aperture: f/{lens.maxAperture}
                </div>
              </div>
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-green-400"
                >
                  <Check className="w-5 h-5" />
                </motion.div>
              )}
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
