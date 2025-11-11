import { useCameraContext } from '@/context/CameraContext';
import { Battery, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

export default function BatteryIndicator() {
  const { batteryLevel } = useCameraContext();

  const getBatteryIcon = () => {
    if (batteryLevel > 66) return BatteryFull;
    if (batteryLevel > 33) return BatteryMedium;
    return BatteryLow;
  };

  const BatteryIcon = getBatteryIcon();
  const batteryColor = batteryLevel > 20 ? 'text-green-400' : 'text-red-400';

  return (
    <div className="flex items-center gap-2">
      {/* Battery bar */}
      <div className="w-12 h-5 border border-current rounded-sm relative overflow-hidden">
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            batteryLevel > 20 ? 'bg-green-400' : 'bg-red-400'
          }`}
          style={{ width: `${batteryLevel}%` }}
        />
        {/* Battery terminal */}
        <div className={`absolute -right-1 top-1/2 -translate-y-1/2 w-1 h-2 ${
          batteryLevel > 20 ? 'bg-green-400' : 'bg-red-400'
        } rounded-r`} />
      </div>

      {/* Battery percentage (only shown in full HUD mode) */}
      {/* <span className="mono text-xs">{batteryLevel}%</span> */}
    </div>
  );
}
