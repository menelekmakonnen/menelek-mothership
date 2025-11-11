import { useCameraContext } from '@/context/CameraContext';

export default function ExposureControls() {
  const {
    iso,
    setIso,
    aperture,
    setAperture,
    shutterSpeed,
    setShutterSpeed,
    exposureComp,
    setExposureComp,
  } = useCameraContext();

  const formatShutterSpeed = (speed) => {
    if (speed >= 1) return `${speed}"`;
    return `1/${speed}`;
  };

  return (
    <div className="space-y-4 mono text-xs">
      {/* ISO Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] opacity-75 tracking-wider">ISO</label>
          <span className="font-bold">{iso}</span>
        </div>
        <input
          type="range"
          min="100"
          max="6400"
          step="100"
          value={iso}
          onChange={(e) => setIso(Number(e.target.value))}
          className="camera-slider w-full"
        />
        <div className="flex justify-between text-[9px] opacity-50">
          <span>100</span>
          <span>1600</span>
          <span>3200</span>
          <span>6400</span>
        </div>
      </div>

      {/* Aperture Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] opacity-75 tracking-wider">APERTURE</label>
          <span className="font-bold">f/{aperture.toFixed(1)}</span>
        </div>
        <input
          type="range"
          min="1.4"
          max="22"
          step="0.1"
          value={aperture}
          onChange={(e) => setAperture(Number(e.target.value))}
          className="camera-slider w-full"
        />
        <div className="flex justify-between text-[9px] opacity-50">
          <span>f/1.4</span>
          <span>f/5.6</span>
          <span>f/11</span>
          <span>f/22</span>
        </div>
      </div>

      {/* Shutter Speed Slider */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] opacity-75 tracking-wider">SHUTTER SPEED</label>
          <span className="font-bold">{formatShutterSpeed(shutterSpeed)}</span>
        </div>
        <input
          type="range"
          min="30"
          max="8000"
          step="10"
          value={shutterSpeed}
          onChange={(e) => setShutterSpeed(Number(e.target.value))}
          className="camera-slider w-full"
        />
        <div className="flex justify-between text-[9px] opacity-50">
          <span>30"</span>
          <span>1/250</span>
          <span>1/1000</span>
          <span>1/8000</span>
        </div>
      </div>

      {/* Exposure Compensation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[10px] opacity-75 tracking-wider">EXPOSURE COMP</label>
          <span className="font-bold">
            {exposureComp > 0 ? '+' : ''}{exposureComp.toFixed(1)} EV
          </span>
        </div>
        <input
          type="range"
          min="-3"
          max="3"
          step="0.3"
          value={exposureComp}
          onChange={(e) => setExposureComp(Number(e.target.value))}
          className="camera-slider w-full"
        />
        <div className="flex justify-between text-[9px] opacity-50">
          <span>-3</span>
          <span>0</span>
          <span>+3</span>
        </div>
      </div>
    </div>
  );
}
