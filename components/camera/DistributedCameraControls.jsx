import { useContext } from 'react';
import { Camera, Zap, Upload, X, Eye, Aperture, Gauge, Sun, Video } from 'lucide-react';
import CameraContext from './CameraContext';
import { CAMERA_DATABASE, LENS_DATABASE } from './CameraDatabase';

export default function DistributedCameraControls() {
  const context = useContext(CameraContext);
  const {
    cameraSettings,
    updateSetting,
    toggleFlash,
    cycleHudMode,
    handleImageUpload,
    clearUserImage,
    currentLens,
    currentCamera
  } = context || {};

  const isZoomLens = currentLens?.type === 'zoom';
  const isDslr = currentCamera?.type === 'dslr';
  const isPanasonic = cameraSettings.brand === 'panasonic';

  const toggleExposurePreview = () => {
    updateSetting('exposurePreview', !cameraSettings.exposurePreview);
  };

  const toggleVideoMode = () => {
    updateSetting('videoMode', !cameraSettings.videoMode);
  };

  const getCurrentFocalLength = () => {
    if (!isZoomLens) return null;

    const lens = currentLens;
    if (!lens.focalLength.min || !lens.focalLength.max) return null;

    const min = lens.focalLength.min;
    const max = lens.focalLength.max;
    const current = min + (cameraSettings.zoomLevel / 100) * (max - min);

    return Math.round(current);
  };

  return (
    <>
      {/* Top Right - Flash Toggle */}
      <button
        onClick={toggleFlash}
        className={`camera-btn top-right ${cameraSettings.flashEnabled ? 'active flash' : ''}`}
        title="Flash (F)"
      >
        <Zap size={20} />
        {cameraSettings.flashEnabled && <span className="flash-ready">READY</span>}
      </button>

      {/* Top Right 2 - Video Mode Toggle (Panasonic only) */}
      {isPanasonic && (
        <button
          onClick={toggleVideoMode}
          className={`camera-btn top-right-2 ${cameraSettings.videoMode ? 'active video' : ''}`}
          title="Video Mode"
        >
          <Video size={20} />
          <span className="btn-label">{cameraSettings.videoMode ? 'REC' : 'PHOTO'}</span>
        </button>
      )}

      {/* Top Left - HUD Toggle */}
      <button
        onClick={cycleHudMode}
        className="camera-btn top-left"
        title="HUD Mode (H)"
      >
        <Eye size={20} />
        <span className="btn-label">HUD</span>
      </button>

      {/* Top Left 2 - Exposure Preview Toggle (DSLR only) */}
      {isDslr && (
        <button
          onClick={toggleExposurePreview}
          className={`camera-btn top-left-2 ${cameraSettings.exposurePreview ? 'active' : ''}`}
          title="Exposure Preview (Live View)"
        >
          <Sun size={20} />
          <span className="btn-label">{cameraSettings.exposurePreview ? 'EVF' : 'OVF'}</span>
        </button>
      )}

      {/* Left Side - ISO */}
      <div className="camera-control left-side">
        <label>ISO</label>
        <input
          type="range"
          min="100"
          max="6400"
          step="100"
          value={cameraSettings.iso}
          onChange={(e) => updateSetting('iso', parseInt(e.target.value))}
          className="vertical-slider"
          orient="vertical"
        />
        <span className="value">{cameraSettings.iso}</span>
      </div>

      {/* Left Side Upper - Film Simulation (Fujifilm only) */}
      {cameraSettings.brand === 'fujifilm' && (
        <div className="camera-control left-side-upper film-sim">
          <label>Film Simulation</label>
          <select
            value={cameraSettings.filmSimulation}
            onChange={(e) => updateSetting('filmSimulation', e.target.value)}
            className="film-sim-select"
          >
            <option value="PROVIA">PROVIA/Standard</option>
            <option value="Velvia">Velvia/Vivid</option>
            <option value="ASTIA">ASTIA/Soft</option>
            <option value="Classic Chrome">Classic Chrome</option>
            <option value="Acros">Acros (B&W)</option>
            <option value="Acros+Ye">Acros+Ye Filter</option>
            <option value="Acros+R">Acros+R Filter</option>
            <option value="Eterna">Eterna/Cinema</option>
            <option value="Classic Neg">Classic Neg.</option>
            <option value="PRO Neg Std">PRO Neg. Std</option>
            <option value="PRO Neg Hi">PRO Neg. Hi</option>
          </select>
        </div>
      )}

      {/* Right Side - Aperture */}
      <div className="camera-control right-side">
        <label>f/</label>
        <input
          type="range"
          min="1.2"
          max="22"
          step="0.1"
          value={cameraSettings.aperture}
          onChange={(e) => updateSetting('aperture', parseFloat(e.target.value))}
          className="vertical-slider"
          orient="vertical"
        />
        <span className="value">{cameraSettings.aperture.toFixed(1)}</span>
      </div>

      {/* Bottom Left - Image Upload */}
      <div className="camera-btn-group bottom-left">
        <label htmlFor="image-upload" className="camera-btn upload-btn" title="Upload Image">
          <Upload size={20} />
          <span className="btn-label">Upload</span>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </label>
        {cameraSettings.userImage && (
          <button
            onClick={clearUserImage}
            className="camera-btn clear-btn"
            title="Clear Image"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Bottom Center - Zoom (for zoom lenses) */}
      {isZoomLens && (
        <div className="camera-control bottom-center zoom-control">
          <label>
            <Aperture size={16} />
            <span>{getCurrentFocalLength()}mm</span>
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={cameraSettings.zoomLevel}
            onChange={(e) => updateSetting('zoomLevel', parseInt(e.target.value))}
            className="zoom-slider"
          />
          <div className="zoom-labels">
            <span>{currentLens.focalLength.min}mm</span>
            <span>Shift+Scroll to zoom</span>
            <span>{currentLens.focalLength.max}mm</span>
          </div>
        </div>
      )}

      {/* Bottom Right - Focus Depth Indicator */}
      <div className="camera-control bottom-right focus-indicator">
        <Gauge size={16} />
        <span className="label">Focus</span>
        <div className="focus-scale">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className={`focus-tick ${Math.round(cameraSettings.focusDepth) === i + 1 ? 'active' : ''}`}
            />
          ))}
        </div>
        <span className="value">{cameraSettings.focusDepth.toFixed(1)}m</span>
        <small>Scroll to adjust</small>
      </div>

      <style jsx>{`
        .camera-btn {
          position: fixed;
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          cursor: pointer;
          z-index: 9980;
          transition: all 0.2s;
          font-size: 13px;
          font-weight: 600;
          pointer-events: auto;
        }

        .camera-btn:hover {
          background: rgba(0, 0, 0, 0.95);
          border-color: rgba(255, 255, 255, 0.4);
          transform: scale(1.05);
        }

        .camera-btn.active {
          border-color: #FFB800;
          background: rgba(255, 184, 0, 0.15);
        }

        .camera-btn.flash.active {
          border-color: #ffff00;
          background: rgba(255, 255, 0, 0.2);
          box-shadow: 0 0 20px rgba(255, 255, 0, 0.3);
        }

        .flash-ready {
          color: #ffff00;
          font-size: 10px;
          font-weight: 700;
          animation: flash-blink 1s infinite;
        }

        @keyframes flash-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }

        .btn-label {
          font-size: 11px;
          opacity: 0.9;
        }

        .top-right {
          top: 20px;
          right: 20px;
        }

        .top-right-2 {
          top: 20px;
          right: 120px;
        }

        .camera-btn.video.active {
          border-color: #ef4444;
          background: rgba(239, 68, 68, 0.2);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.3);
        }

        .top-left {
          top: 20px;
          left: 20px;
        }

        .top-left-2 {
          top: 20px;
          left: 110px;
        }

        .camera-control {
          position: fixed;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 16px 12px;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: white;
          z-index: 9980;
          pointer-events: auto;
        }

        .left-side {
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .left-side-upper {
          left: 20px;
          top: 100px;
        }

        .film-sim {
          min-width: 180px;
        }

        .film-sim-select {
          width: 100%;
          padding: 8px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 4px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          outline: none;
        }

        .film-sim-select option {
          background: #1a1a1a;
          color: white;
        }

        .film-sim-select:hover {
          border-color: rgba(255, 255, 255, 0.5);
        }

        .right-side {
          right: 20px;
          top: 50%;
          transform: translateY(-50%);
        }

        .camera-control label {
          font-size: 12px;
          font-weight: 700;
          opacity: 0.8;
          text-transform: uppercase;
        }

        .camera-control .value {
          font-size: 16px;
          font-weight: 700;
          color: #FFB800;
        }

        .vertical-slider {
          -webkit-appearance: slider-vertical;
          writing-mode: bt-lr;
          width: 8px;
          height: 120px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          outline: none;
        }

        .vertical-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .vertical-slider::-moz-range-thumb {
          width: 20px;
          height: 20px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .camera-btn-group {
          position: fixed;
          display: flex;
          gap: 8px;
          z-index: 9980;
        }

        .bottom-left {
          bottom: 120px;
          left: 20px;
        }

        .upload-btn,
        .clear-btn {
          padding: 10px 14px;
        }

        .clear-btn {
          background: rgba(239, 68, 68, 0.3);
          border-color: rgba(239, 68, 68, 0.5);
        }

        .clear-btn:hover {
          background: rgba(239, 68, 68, 0.5);
          border-color: rgba(239, 68, 68, 0.8);
        }

        .bottom-center {
          bottom: 100px;
          left: 50%;
          transform: translateX(-50%);
          flex-direction: row;
          padding: 12px 20px;
          min-width: 400px;
        }

        .zoom-control {
          gap: 12px;
        }

        .zoom-control label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
        }

        .zoom-slider {
          flex: 1;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          outline: none;
          -webkit-appearance: none;
        }

        .zoom-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .zoom-slider::-moz-range-thumb {
          width: 18px;
          height: 18px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
        }

        .zoom-labels {
          display: flex;
          justify-content: space-between;
          width: 100%;
          font-size: 10px;
          opacity: 0.6;
          margin-top: 4px;
        }

        .bottom-right {
          bottom: 100px;
          right: 20px;
        }

        .focus-indicator {
          gap: 6px;
        }

        .focus-indicator .label {
          font-size: 11px;
          opacity: 0.8;
          text-transform: uppercase;
        }

        .focus-scale {
          display: flex;
          gap: 3px;
          margin: 4px 0;
        }

        .focus-tick {
          width: 4px;
          height: 16px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 2px;
          transition: all 0.2s;
        }

        .focus-tick.active {
          background: #FFB800;
          height: 24px;
          box-shadow: 0 0 8px rgba(255, 184, 0, 0.6);
        }

        .focus-indicator small {
          font-size: 9px;
          opacity: 0.6;
          text-align: center;
        }
      `}</style>
    </>
  );
}
