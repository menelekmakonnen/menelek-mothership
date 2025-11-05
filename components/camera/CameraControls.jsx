import { useState, useContext } from 'react';
import { Camera, Zap, Eye, Aperture, Sun, Droplets, Battery, BatteryCharging } from 'lucide-react';
import CameraContext from './CameraContext';
import { CAMERA_DATABASE, LENS_DATABASE } from './CameraDatabase';

export default function CameraControls({
  settings,
  updateSetting,
  toggleFlash,
  cycleHudMode,
  changeLens,
  onShoot
}) {
  const context = useContext(CameraContext);
  const { changeCamera, rechargeBattery, currentCamera, currentLens } = context || {};

  const [isMinimized, setIsMinimized] = useState(false);
  const [showPanel, setShowPanel] = useState(true);

  const isoStops = [100, 200, 400, 800, 1600, 3200, 6400, 12800, 25600, 51200, 102400];
  const apertureStops = [1.2, 1.4, 1.8, 2.0, 2.8, 4.0, 5.6, 8.0, 11, 16, 22];
  const shutterSpeeds = [
    { value: 1/8000, label: '1/8000' },
    { value: 1/4000, label: '1/4000' },
    { value: 1/2000, label: '1/2000' },
    { value: 1/1000, label: '1/1000' },
    { value: 1/500, label: '1/500' },
    { value: 1/250, label: '1/250' },
    { value: 1/125, label: '1/125' },
    { value: 1/60, label: '1/60' },
    { value: 1/30, label: '1/30' },
    { value: 1/15, label: '1/15' },
    { value: 1/8, label: '1/8' },
    { value: 1/4, label: '1/4' },
    { value: 1/2, label: '1/2' },
    { value: 1, label: '1"' },
    { value: 2, label: '2"' },
  ];

  const whiteBalancePresets = [
    { value: 'auto', label: 'Auto', kelvin: 5500 },
    { value: 'daylight', label: 'Daylight', kelvin: 5500 },
    { value: 'cloudy', label: 'Cloudy', kelvin: 6500 },
    { value: 'shade', label: 'Shade', kelvin: 7500 },
    { value: 'tungsten', label: 'Tungsten', kelvin: 3200 },
    { value: 'fluorescent', label: 'Fluorescent', kelvin: 4000 },
    { value: 'flash', label: 'Flash', kelvin: 5500 },
  ];

  const hudModeLabels = ['None', 'Minimal', 'Standard', 'Full', 'Cinematic'];

  const handleWhiteBalanceChange = (preset) => {
    updateSetting('whiteBalanceMode', preset.value);
    updateSetting('whiteBalance', preset.kelvin);
  };

  const getCurrentShutterLabel = () => {
    const closest = shutterSpeeds.reduce((prev, curr) =>
      Math.abs(curr.value - settings.shutterSpeed) < Math.abs(prev.value - settings.shutterSpeed) ? curr : prev
    );
    return closest.label;
  };

  if (!showPanel) {
    return (
      <button
        onClick={() => setShowPanel(true)}
        className="control-toggle-btn"
        title="Show Controls (C)"
      >
        <Camera size={24} />
        <style jsx>{`
          .control-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 56px;
            height: 56px;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            cursor: pointer;
            z-index: 9990;
            transition: all 0.2s;
          }

          .control-toggle-btn:hover {
            background: rgba(0, 0, 0, 0.95);
            border-color: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
          }
        `}</style>
      </button>
    );
  }

  return (
    <div className={`camera-controls ${isMinimized ? 'minimized' : ''}`}>
      {/* Header */}
      <div className="controls-header">
        <div className="header-title">
          <Camera size={20} />
          <span>Camera Controls</span>
        </div>
        <div className="header-actions">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="btn-icon"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '▼' : '▲'}
          </button>
          <button
            onClick={() => setShowPanel(false)}
            className="btn-icon"
            title="Hide Controls (C)"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="controls-body">
          {/* Camera Type */}
          <div className="control-group">
            <label>Camera Type</label>
            <div className="btn-group">
              <button
                className={`btn ${settings.type === 'dslr' ? 'active' : ''}`}
                onClick={() => updateSetting('type', 'dslr')}
              >
                DSLR
              </button>
              <button
                className={`btn ${settings.type === 'mirrorless' ? 'active' : ''}`}
                onClick={() => updateSetting('type', 'mirrorless')}
              >
                Mirrorless
              </button>
            </div>
          </div>

          {/* Brand Selection */}
          <div className="control-group">
            <label>Brand</label>
            <select
              value={settings.brand}
              onChange={(e) => {
                const newBrand = e.target.value;
                const firstModel = Object.keys(CAMERA_DATABASE[newBrand] || {})[0];
                if (firstModel && changeCamera) {
                  changeCamera(newBrand, firstModel);
                }
              }}
              className="select"
            >
              <option value="nikon">Nikon</option>
              <option value="sony">Sony</option>
              <option value="canon">Canon</option>
              <option value="fujifilm">Fujifilm</option>
              <option value="panasonic">Panasonic</option>
            </select>
          </div>

          {/* Camera Model Selection */}
          <div className="control-group">
            <label>Model: <span className="value">{currentCamera?.name || 'Unknown'}</span></label>
            <select
              value={settings.model}
              onChange={(e) => changeCamera && changeCamera(settings.brand, e.target.value)}
              className="select"
            >
              {CAMERA_DATABASE[settings.brand] && Object.entries(CAMERA_DATABASE[settings.brand]).map(([key, cam]) => (
                <option key={key} value={key}>{cam.name}</option>
              ))}
            </select>
            <div className="camera-info">
              <small>
                {currentCamera?.megapixels}MP • {currentCamera?.type === 'dslr' ? 'DSLR' : 'Mirrorless'} • {currentCamera?.releaseYear}
              </small>
            </div>
          </div>

          {/* Battery Status */}
          <div className="control-group">
            <label>
              Battery: <span className={`value ${settings.battery < 20 ? 'text-red' : ''}`}>{settings.battery.toFixed(1)}%</span>
            </label>
            <div className="battery-bar">
              <div className="battery-fill" style={{ width: `${settings.battery}%` }} />
            </div>
            {settings.battery < 20 && (
              <button onClick={rechargeBattery} className="btn-action" style={{ marginTop: '8px', padding: '6px' }}>
                <BatteryCharging size={16} />
                Recharge Battery
              </button>
            )}
            <small style={{ opacity: 0.6, marginTop: '4px', display: 'block' }}>
              Shots taken: {settings.shotCount}
            </small>
          </div>

          <div className="divider" />

          {/* Lens Selection */}
          <div className="control-group">
            <label>Lens: <span className="value">{currentLens?.name || 'Unknown'}</span></label>
            <select
              value={settings.lens}
              onChange={(e) => changeLens(e.target.value)}
              className="select"
            >
              {Object.entries(LENS_DATABASE).map(([key, lens]) => (
                <option key={key} value={key}>{lens.name} {lens.nickname ? `"${lens.nickname}"` : ''}</option>
              ))}
            </select>
            <div className="lens-info">
              <small>
                {currentLens?.type === 'prime' ? 'Prime' : 'Zoom'} • f/{currentLens?.aperture?.max} • {currentLens?.category}
              </small>
            </div>
          </div>

          <div className="divider" />

          {/* ISO */}
          <div className="control-group">
            <label>
              ISO: <span className="value">{settings.iso}</span>
            </label>
            <input
              type="range"
              min="0"
              max={isoStops.length - 1}
              value={isoStops.indexOf(settings.iso)}
              onChange={(e) => updateSetting('iso', isoStops[parseInt(e.target.value)])}
              className="slider"
            />
            <div className="range-labels">
              <span>100</span>
              <span>102400</span>
            </div>
          </div>

          {/* Aperture */}
          <div className="control-group">
            <label>
              Aperture: <span className="value">f/{settings.aperture.toFixed(1)}</span>
            </label>
            <input
              type="range"
              min="0"
              max={apertureStops.length - 1}
              value={apertureStops.indexOf(apertureStops.reduce((prev, curr) =>
                Math.abs(curr - settings.aperture) < Math.abs(prev - settings.aperture) ? curr : prev
              ))}
              onChange={(e) => updateSetting('aperture', apertureStops[parseInt(e.target.value)])}
              className="slider"
            />
            <div className="range-labels">
              <span>f/1.2</span>
              <span>f/22</span>
            </div>
          </div>

          {/* Shutter Speed */}
          <div className="control-group">
            <label>
              Shutter: <span className="value">{getCurrentShutterLabel()}</span>
            </label>
            <input
              type="range"
              min="0"
              max={shutterSpeeds.length - 1}
              value={shutterSpeeds.findIndex(s => s.value === settings.shutterSpeed)}
              onChange={(e) => updateSetting('shutterSpeed', shutterSpeeds[parseInt(e.target.value)].value)}
              className="slider"
            />
            <div className="range-labels">
              <span>1/8000</span>
              <span>2"</span>
            </div>
          </div>

          {/* White Balance */}
          <div className="control-group">
            <label>
              White Balance: <span className="value">{settings.whiteBalanceMode === 'auto' ? 'Auto' : `${settings.whiteBalance}K`}</span>
            </label>
            <div className="wb-presets">
              {whiteBalancePresets.map(preset => (
                <button
                  key={preset.value}
                  className={`btn-wb ${settings.whiteBalanceMode === preset.value ? 'active' : ''}`}
                  onClick={() => handleWhiteBalanceChange(preset)}
                  title={`${preset.label} (${preset.kelvin}K)`}
                >
                  {preset.label === 'Auto' && <Sun size={14} />}
                  {preset.label === 'Tungsten' && <Droplets size={14} />}
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="divider" />

          {/* Flash Toggle */}
          <div className="control-group">
            <button
              onClick={toggleFlash}
              className={`btn-action ${settings.flashEnabled ? 'flash-on' : ''}`}
            >
              <Zap size={18} />
              Flash: {settings.flashEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* HUD Mode */}
          <div className="control-group">
            <button
              onClick={cycleHudMode}
              className="btn-action"
            >
              <Eye size={18} />
              HUD: {hudModeLabels[settings.hudMode]}
            </button>
          </div>

          {/* Shoot Button */}
          <div className="control-group">
            <button
              onClick={onShoot}
              className="btn-shoot"
            >
              <Camera size={20} />
              SHOOT (Enter)
            </button>
          </div>

          {/* Keyboard Shortcuts Info */}
          <div className="shortcuts-info">
            <div className="shortcuts-title">Keyboard Shortcuts:</div>
            <div className="shortcuts-list">
              <span><kbd>Space</kbd> Focus</span>
              <span><kbd>Enter</kbd> Shoot</span>
              <span><kbd>F</kbd> Flash</span>
              <span><kbd>H</kbd> HUD</span>
              <span><kbd>↑↓</kbd> Aperture</span>
              <span><kbd>+−</kbd> ISO</span>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .camera-controls {
          position: fixed;
          bottom: 100px;
          right: 20px;
          width: 320px;
          max-height: calc(100vh - 140px);
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          overflow: hidden;
          z-index: 9990;
          pointer-events: auto;
          cursor: auto;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
        }

        .camera-controls.minimized {
          max-height: 60px;
        }

        .controls-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.05);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .header-actions {
          display: flex;
          gap: 8px;
        }

        .btn-icon {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          transition: all 0.2s;
        }

        .btn-icon:hover {
          color: white;
          background: rgba(255, 255, 255, 0.1);
        }

        .controls-body {
          padding: 16px;
          max-height: calc(100vh - 200px);
          overflow-y: auto;
          overflow-x: hidden;
        }

        .controls-body::-webkit-scrollbar {
          width: 6px;
        }

        .controls-body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }

        .control-group {
          margin-bottom: 16px;
        }

        label {
          display: block;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 8px;
        }

        .value {
          color: #FFB800;
          font-weight: 700;
        }

        .btn-group {
          display: flex;
          gap: 8px;
        }

        .btn {
          flex: 1;
          padding: 8px 12px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn:hover {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .btn.active {
          background: rgba(255, 184, 0, 0.2);
          border-color: #FFB800;
          color: #FFB800;
        }

        .select {
          width: 100%;
          padding: 8px 12px;
          background: rgba(0, 0, 0, 0.6);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          color: white;
          font-size: 13px;
          cursor: pointer;
        }

        .select option {
          background: #1a1a1a;
          color: white;
          padding: 8px;
        }

        .select:focus {
          outline: none;
          border-color: #FFB800;
        }

        .slider {
          width: 100%;
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          outline: none;
          -webkit-appearance: none;
        }

        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 16px;
          height: 16px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          background: #FFB800;
          border-radius: 50%;
          cursor: pointer;
          border: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .range-labels {
          display: flex;
          justify-content: space-between;
          margin-top: 4px;
          font-size: 11px;
          color: rgba(255, 255, 255, 0.5);
        }

        .wb-presets {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }

        .btn-wb {
          padding: 6px 10px;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 4px;
          color: rgba(255, 255, 255, 0.8);
          font-size: 11px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .btn-wb:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .btn-wb.active {
          background: rgba(255, 184, 0, 0.2);
          border-color: #FFB800;
          color: #FFB800;
        }

        .btn-action {
          width: 100%;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          color: white;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-action:hover {
          background: rgba(255, 255, 255, 0.12);
        }

        .btn-action.flash-on {
          background: rgba(255, 255, 0, 0.15);
          border-color: rgba(255, 255, 0, 0.5);
          color: #ffff00;
        }

        .btn-shoot {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%);
          border: none;
          border-radius: 8px;
          color: white;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }

        .btn-shoot:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(255, 107, 107, 0.4);
        }

        .btn-shoot:active {
          transform: translateY(0);
        }

        .divider {
          height: 1px;
          background: rgba(255, 255, 255, 0.1);
          margin: 16px 0;
        }

        .shortcuts-info {
          margin-top: 16px;
          padding: 12px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .shortcuts-title {
          font-size: 11px;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 8px;
          font-weight: 600;
        }

        .shortcuts-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          font-size: 10px;
          color: rgba(255, 255, 255, 0.7);
        }

        .shortcuts-list span {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        kbd {
          padding: 2px 6px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          font-family: monospace;
          font-size: 10px;
        }

        .battery-bar {
          width: 100%;
          height: 12px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          overflow: hidden;
          margin-top: 8px;
        }

        .battery-fill {
          height: 100%;
          background: linear-gradient(90deg, #4ade80, #22c55e);
          transition: width 0.3s ease;
          border-radius: 6px;
        }

        .battery-fill[style*="width: 0%"],
        .battery-fill[style*="width: 1"] {
          background: linear-gradient(90deg, #ef4444, #dc2626);
        }

        .camera-info,
        .lens-info {
          margin-top: 6px;
          padding: 6px 8px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 4px;
          border: 1px solid rgba(255, 255, 255, 0.08);
        }

        .camera-info small,
        .lens-info small {
          color: rgba(255, 255, 255, 0.7);
          font-size: 11px;
        }

        .text-red {
          color: #ef4444 !important;
          animation: blink 1s infinite;
        }

        @keyframes blink {
          0%, 50%, 100% { opacity: 1; }
          25%, 75% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
