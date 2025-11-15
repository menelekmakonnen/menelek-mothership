import { useCameraContext } from '@/context/CameraContext';
import { motion } from 'framer-motion';
import { Power, Moon } from 'lucide-react';

export default function PowerControls({ orientation = 'horizontal', variant = 'panel' }) {
  const { powerOff, setStandby } = useCameraContext();

  const controls = [
    {
      id: 'standby',
      icon: Moon,
      title: 'Standby',
      onClick: setStandby,
      accent: 'text-amber-300 border-amber-400/60 hover:bg-amber-500/10',
    },
    {
      id: 'power',
      icon: Power,
      title: 'Power Down',
      onClick: powerOff,
      accent: 'text-red-400 border-red-500/60 hover:bg-red-500/10',
    },
  ];

  return (
    <div
      className={`${
        variant === 'panel'
          ? 'camera-hud rounded-xl px-2 py-2'
          : 'bg-transparent'
      } flex ${orientation === 'vertical' ? 'flex-col' : 'flex-row'} gap-2 pointer-events-auto`}
    >
      {controls.map(({ id, icon: Icon, title, onClick, accent }) => (
        <motion.button
          key={id}
          onClick={onClick}
          className={`w-12 h-12 rounded-lg border border-white/10 flex items-center justify-center transition-all ${
            variant === 'inline' ? 'bg-white/5' : ''
          } ${accent}`}
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          title={title}
          aria-label={title}
        >
          <Icon className="w-4 h-4" />
        </motion.button>
      ))}
    </div>
  );
}
