import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RuleOfThirds() {
  const { ruleOfThirds } = useCameraContext();

  return (
    <AnimatePresence>
      {ruleOfThirds && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="rule-of-thirds"
        >
          <svg className="w-full h-full">
            {/* Vertical lines */}
            <line x1="33.33%" y1="0" x2="33.33%" y2="100%" />
            <line x1="66.66%" y1="0" x2="66.66%" y2="100%" />

            {/* Horizontal lines */}
            <line x1="0" y1="33.33%" x2="100%" y2="33.33%" />
            <line x1="0" y1="66.66%" x2="100%" y2="66.66%" />

            {/* Intersection points */}
            <circle cx="33.33%" cy="33.33%" r="3" />
            <circle cx="66.66%" cy="33.33%" r="3" />
            <circle cx="33.33%" cy="66.66%" r="3" />
            <circle cx="66.66%" cy="66.66%" r="3" />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
