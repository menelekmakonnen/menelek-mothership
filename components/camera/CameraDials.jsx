import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCameraContext } from '@/context/CameraContext';
import { X } from 'lucide-react';

/**
 * Camera Dials Component
 * Interactive circular dials for ISO, Aperture, and Shutter Speed
 */

const ISO_VALUES = [100, 200, 400, 800, 1600, 3200, 6400];
const APERTURE_VALUES = [1.4, 2, 2.8, 4, 5.6, 8, 11, 16, 22];
const SHUTTER_SPEED_VALUES = [8000, 4000, 2000, 1000, 500, 250, 125, 60, 30, 15, 8, 4, 2, 1];

const CircularDial = ({ title, values, currentValue, onSelect, onClose, formatValue }) => {
  const [rotation, setRotation] = useState(0);
  const dialRef = useRef(null);

  const currentIndex = values.indexOf(currentValue);
  const anglePerValue = 360 / values.length;

  useEffect(() => {
    setRotation(-currentIndex * anglePerValue);
  }, [currentIndex, anglePerValue]);

  const handleValueClick = (value, index) => {
    onSelect(value);
    setRotation(-index * anglePerValue);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="fixed inset-0 z-[5000] flex items-center justify-center bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        className="relative bg-black/90 border border-white/20 rounded-full p-8"
        style={{ width: '400px', height: '400px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Title */}
        <div className="absolute top-8 left-0 right-0 text-center">
          <h3 className="text-white text-lg font-bold tracking-wide">{title}</h3>
        </div>

        {/* Current Value Display */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl font-bold text-white mb-1">
              {formatValue ? formatValue(currentValue) : currentValue}
            </div>
            <div className="text-xs text-white/50 uppercase tracking-wider">Current</div>
          </div>
        </div>

        {/* Dial */}
        <div
          ref={dialRef}
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {values.map((value, index) => {
            const angle = index * anglePerValue;
            const radian = (angle - 90) * (Math.PI / 180);
            const radius = 150;
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            const isActive = value === currentValue;

            return (
              <button
                key={value}
                className={`absolute w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? 'bg-accent text-black scale-125 ring-2 ring-accent/50'
                    : 'bg-white/10 text-white hover:bg-white/20 hover:scale-110'
                }`}
                style={{
                  left: `calc(50% + ${x}px - 24px)`,
                  top: `calc(50% + ${y}px - 24px)`,
                  transform: `rotate(${-rotation}deg)`,
                }}
                onClick={() => handleValueClick(value, index)}
              >
                {formatValue ? formatValue(value) : value}
              </button>
            );
          })}
        </div>

        {/* Center dot */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-accent"></div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function CameraDials() {
  const {
    iso,
    setIso,
    aperture,
    setAperture,
    shutterSpeed,
    setShutterSpeed,
    openDials,
    toggleDial,
  } = useCameraContext();

  const formatShutterSpeed = (value) => {
    if (value >= 1) {
      return `${value}"`;
    }
    return `1/${value}`;
  };

  const formatAperture = (value) => {
    return `f/${value}`;
  };

  return (
    <AnimatePresence>
      {/* ISO Dial */}
      {openDials.includes('iso') && (
        <CircularDial
          title="ISO Sensitivity"
          values={ISO_VALUES}
          currentValue={iso}
          onSelect={setIso}
          onClose={() => toggleDial('iso')}
        />
      )}

      {/* Aperture Dial */}
      {openDials.includes('aperture') && (
        <CircularDial
          title="Aperture"
          values={APERTURE_VALUES}
          currentValue={aperture}
          onSelect={setAperture}
          onClose={() => toggleDial('aperture')}
          formatValue={formatAperture}
        />
      )}

      {/* Shutter Speed Dial */}
      {openDials.includes('shutter') && (
        <CircularDial
          title="Shutter Speed"
          values={SHUTTER_SPEED_VALUES}
          currentValue={shutterSpeed}
          onSelect={setShutterSpeed}
          onClose={() => toggleDial('shutter')}
          formatValue={formatShutterSpeed}
        />
      )}
    </AnimatePresence>
  );
}
