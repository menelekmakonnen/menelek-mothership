import { useCameraContext } from '@/context/CameraContext';
import { motion, AnimatePresence } from 'framer-motion';

const gridPresets = {
  classic: {
    horizontals: [33.33, 66.66],
    verticals: [33.33, 66.66],
    focusPoints: [
      [33.33, 33.33],
      [66.66, 33.33],
      [33.33, 66.66],
      [66.66, 66.66],
    ],
    diagonals: false,
    goldenHighlights: false,
  },
  precision: {
    horizontals: [25, 50, 75],
    verticals: [25, 50, 75],
    focusPoints: [
      [25, 25],
      [75, 25],
      [25, 75],
      [75, 75],
      [50, 50],
    ],
    diagonals: true,
    goldenHighlights: false,
  },
  golden: {
    horizontals: [38.2, 61.8, 50],
    verticals: [38.2, 61.8, 50],
    focusPoints: [
      [38.2, 38.2],
      [61.8, 38.2],
      [38.2, 61.8],
      [61.8, 61.8],
    ],
    diagonals: true,
    goldenHighlights: true,
  },
};

export default function RuleOfThirds() {
  const { ruleOfThirds } = useCameraContext();

  return (
    <AnimatePresence>
      {ruleOfThirds && ruleOfThirds !== 'off' && (
        <motion.div
          key={ruleOfThirds}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`rule-of-thirds rule-of-thirds-${ruleOfThirds}`}
        >
          {(() => {
            const preset = gridPresets[ruleOfThirds] || gridPresets.classic;

            return (
              <svg className="w-full h-full">
                {preset.horizontals.map((y) => (
                  <line key={`h-${y}`} x1="0" y1={`${y}%`} x2="100%" y2={`${y}%`} />
                ))}
                {preset.verticals.map((x) => (
                  <line key={`v-${x}`} x1={`${x}%`} y1="0" x2={`${x}%`} y2="100%" />
                ))}

                {preset.diagonals && (
                  <>
                    <line x1="0" y1="0" x2="100%" y2="100%" className="diagonal" />
                    <line x1="0" y1="100%" x2="100%" y2="0" className="diagonal" />
                  </>
                )}

                {preset.goldenHighlights && (
                  <>
                    <path d="M0,61.8 Q38.2,61.8 38.2,100" className="golden-arc" />
                    <path d="M61.8,0 Q61.8,38.2 100,38.2" className="golden-arc" />
                  </>
                )}

                {preset.focusPoints.map(([cx, cy], index) => (
                  <circle key={`fp-${index}`} cx={`${cx}%`} cy={`${cy}%`} r="2" />
                ))}
              </svg>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
