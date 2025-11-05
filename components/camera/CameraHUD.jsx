export default function CameraHUD({ settings }) {
  const formatShutterSpeed = (speed) => {
    if (speed >= 1) {
      return `${speed}"`;
    } else {
      return `1/${Math.round(1 / speed)}`;
    }
  };

  const formatWhiteBalance = () => {
    if (settings.whiteBalanceMode === 'auto') {
      return 'AWB';
    }
    return `${settings.whiteBalance}K`;
  };

  const getBrandColors = () => {
    const colors = {
      nikon: { primary: '#FFB800', secondary: '#FFFFFF', active: '#FF0000' },
      sony: { primary: '#FFFFFF', secondary: '#CCCCCC', active: '#FF8C00' },
      canon: { primary: '#FFFFFF', secondary: '#CCCCCC', active: '#FF0000' },
      fujifilm: { primary: '#FFFFFF', secondary: '#00BFFF', active: '#FFD700' },
      panasonic: { primary: '#FFFFFF', secondary: '#00FFFF', active: '#FF0000' }
    };

    return colors[settings.brand] || colors.nikon;
  };

  const renderNikonHUD = () => {
    const colors = getBrandColors();

    return (
      <div className="nikon-hud" style={{ '--primary-color': colors.primary, '--active-color': colors.active }}>
        {/* Bottom Bar */}
        <div className="hud-bottom">
          <span className="mode">M</span>
          <span className="shutter">{formatShutterSpeed(settings.shutterSpeed)}</span>
          <span className="aperture">f/{settings.aperture.toFixed(1)}</span>
          <span className="iso">ISO {settings.iso}</span>
          <span className="ev-meter">
            <span className="ev-bar">
              {[...Array(7)].map((_, i) => (
                <span key={i} className={`ev-tick ${i === 3 ? 'center' : ''}`}>|</span>
              ))}
            </span>
          </span>
          <span className="wb">{formatWhiteBalance()}</span>
          <span className="shots">247</span>
        </div>

        {/* Top Right */}
        <div className="hud-top-right">
          <div className="battery">||||</div>
          {settings.flashEnabled && <div className="flash-ready">⚡</div>}
        </div>

        {/* Top Left */}
        <div className="hud-top-left">
          <div className="af-mode">AF-C</div>
          <div className="focus-mode">Single Point</div>
        </div>

        <style jsx>{`
          .nikon-hud {
            pointer-events: none;
          }

          .hud-bottom {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            align-items: center;
            font-family: 'Eurostile', 'Arial Black', sans-serif;
            font-weight: bold;
            color: var(--primary-color);
            font-size: 16px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9), 0 0 3px var(--primary-color);
            z-index: 9999;
            padding: 12px 24px;
            background: rgba(0, 0, 0, 0.3);
            backdrop-filter: blur(5px);
            border-radius: 8px;
          }

          .mode {
            font-size: 18px;
            color: var(--primary-color);
          }

          .ev-meter {
            display: flex;
            gap: 4px;
          }

          .ev-tick {
            color: var(--primary-color);
          }

          .ev-tick.center {
            color: var(--active-color);
            font-weight: 900;
          }

          .hud-top-right {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
            font-family: 'Eurostile', 'Arial Black', sans-serif;
            color: var(--primary-color);
            font-size: 14px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .flash-ready {
            color: #00ff00;
            animation: flash-pulse 1s infinite;
          }

          @keyframes flash-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }

          .hud-top-left {
            position: fixed;
            top: 20px;
            left: 20px;
            font-family: 'Eurostile', 'Arial Black', sans-serif;
            color: var(--primary-color);
            font-size: 14px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  };

  const renderSonyHUD = () => {
    const colors = getBrandColors();

    return (
      <div className="sony-hud" style={{ '--primary-color': colors.primary, '--active-color': colors.active }}>
        {/* Bottom Bar */}
        <div className="hud-bottom">
          <span className="mode">S</span>
          <span className="shutter">{formatShutterSpeed(settings.shutterSpeed)}</span>
          <span className="aperture">F{settings.aperture.toFixed(1)}</span>
          <span className="iso">ISO {settings.iso}</span>
          <span className="ev">+{settings.exposureCompensation.toFixed(1)}</span>
          <span className="wb">{formatWhiteBalance()}</span>
          <span className="af">S-AF</span>
        </div>

        {/* Right Side */}
        <div className="hud-right">
          <div className="battery">78%</div>
          {settings.flashEnabled && <div className="flash-ready">⚡ Ready</div>}
          <div className="steadyshot">STEADY SHOT</div>
        </div>

        {/* Top */}
        <div className="hud-top">
          <span className="mode-info">STANDARD</span>
        </div>

        <style jsx>{`
          .sony-hud {
            pointer-events: none;
          }

          .hud-bottom {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 18px;
            align-items: center;
            font-family: 'Helvetica Neue', 'Arial', sans-serif;
            font-weight: 500;
            color: var(--primary-color);
            font-size: 15px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9), 0 1px 2px rgba(0, 0, 0, 0.8);
            z-index: 9999;
            padding: 10px 22px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            border-radius: 6px;
          }

          .mode {
            color: var(--active-color);
            font-weight: bold;
          }

          .hud-right {
            position: fixed;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            align-items: flex-end;
            font-family: 'Helvetica Neue', sans-serif;
            color: var(--primary-color);
            font-size: 12px;
            text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .flash-ready {
            color: var(--active-color);
          }

          .steadyshot {
            font-size: 11px;
            opacity: 0.8;
          }

          .hud-top {
            position: fixed;
            top: 15px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Helvetica Neue', sans-serif;
            color: var(--primary-color);
            font-size: 13px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }
        `}</style>
      </div>
    );
  };

  const renderCanonHUD = () => {
    const colors = getBrandColors();

    return (
      <div className="canon-hud" style={{ '--primary-color': colors.primary, '--active-color': colors.active }}>
        {/* Bottom Bar */}
        <div className="hud-bottom">
          <span className="mode">Av</span>
          <span className="shutter">{formatShutterSpeed(settings.shutterSpeed)}</span>
          <span className="aperture">f/{settings.aperture.toFixed(1)}</span>
          <span className="iso">ISO {settings.iso}</span>
          <span className="ev-meter">
            <span className="meter-bar"></span>
          </span>
          <span className="wb">{formatWhiteBalance()}</span>
          <span className="af">ONE SHOT</span>
        </div>

        {/* Top */}
        <div className="hud-top">
          {settings.focusLocked && <span className="ae-lock">AE LOCK *</span>}
          <span className="af-mode">AF: Face+Tracking</span>
        </div>

        {/* Right */}
        <div className="hud-right">
          <div className="battery">▮▮▮</div>
          {settings.flashEnabled && <div className="flash-ready">⚡</div>}
        </div>

        <style jsx>{`
          .canon-hud {
            pointer-events: none;
          }

          .hud-bottom {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            align-items: center;
            font-family: 'Arial Black', 'Arial', sans-serif;
            font-weight: 900;
            color: var(--primary-color);
            font-size: 17px;
            text-shadow: 0 0 12px rgba(0, 0, 0, 1), 0 2px 4px rgba(0, 0, 0, 0.9);
            z-index: 9999;
            padding: 14px 26px;
            background: rgba(0, 0, 0, 0.4);
            backdrop-filter: blur(5px);
            border-radius: 8px;
          }

          .mode {
            color: var(--primary-color);
            font-size: 20px;
          }

          .ev-meter {
            width: 100px;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            position: relative;
          }

          .meter-bar {
            position: absolute;
            left: 50%;
            top: 0;
            width: 4px;
            height: 100%;
            background: var(--active-color);
            transform: translateX(-50%);
          }

          .hud-top {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 20px;
            font-family: 'Arial Black', sans-serif;
            color: var(--primary-color);
            font-size: 14px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .ae-lock {
            color: var(--active-color);
          }

          .hud-right {
            position: fixed;
            top: 20px;
            right: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: flex-end;
            font-family: 'Arial Black', sans-serif;
            color: var(--primary-color);
            font-size: 16px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .flash-ready {
            color: #00ff00;
          }
        `}</style>
      </div>
    );
  };

  const renderFujifilmHUD = () => {
    const colors = getBrandColors();

    return (
      <div className="fujifilm-hud" style={{ '--primary-color': colors.primary, '--secondary-color': colors.secondary }}>
        {/* Bottom Bar */}
        <div className="hud-bottom">
          <span className="film-sim">PROVIA</span>
          <span className="mode">P</span>
          <span className="shutter">{formatShutterSpeed(settings.shutterSpeed)}</span>
          <span className="aperture">F{settings.aperture.toFixed(1)}</span>
          <span className="iso">ISO {settings.iso}</span>
          <span className="wb">{formatWhiteBalance()}</span>
          <span className="af">AF-C</span>
        </div>

        {/* Top */}
        <div className="hud-top">
          <span className="film-mode">Film Simulation: <span className="highlight">CLASSIC CHROME</span></span>
        </div>

        {/* Left */}
        <div className="hud-left">
          <div className="focus-distance">2.5m</div>
          {settings.flashEnabled && <div className="flash-ready">⚡</div>}
        </div>

        <style jsx>{`
          .fujifilm-hud {
            pointer-events: none;
          }

          .hud-bottom {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 16px;
            align-items: center;
            font-family: 'Futura', 'Helvetica', sans-serif;
            font-weight: 500;
            color: var(--primary-color);
            font-size: 15px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
            padding: 12px 24px;
            background: rgba(0, 0, 0, 0.35);
            backdrop-filter: blur(5px);
            border-radius: 8px;
          }

          .film-sim {
            color: var(--secondary-color);
            font-weight: 700;
            text-transform: uppercase;
          }

          .hud-top {
            position: fixed;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'Futura', 'Helvetica', sans-serif;
            color: var(--primary-color);
            font-size: 13px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .highlight {
            color: var(--secondary-color);
            font-weight: 700;
          }

          .hud-left {
            position: fixed;
            top: 50%;
            left: 20px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 12px;
            font-family: 'Futura', sans-serif;
            color: var(--primary-color);
            font-size: 14px;
            text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .flash-ready {
            color: #ffd700;
          }
        `}</style>
      </div>
    );
  };

  const renderPanasonicHUD = () => {
    const colors = getBrandColors();

    return (
      <div className="panasonic-hud" style={{ '--primary-color': colors.primary, '--secondary-color': colors.secondary }}>
        {/* Bottom Bar */}
        <div className="hud-bottom">
          <span className="mode">{settings.videoMode ? 'M' : 'P'}</span>
          <span className="shutter">{formatShutterSpeed(settings.shutterSpeed)}</span>
          <span className="aperture">F{settings.aperture.toFixed(1)}</span>
          <span className="iso">ISO {settings.iso}</span>
          <span className="wb">{formatWhiteBalance()}</span>
          <span className="profile">{settings.videoMode ? 'V-LOG' : 'STD.'}</span>
          <span className="af">{settings.videoMode ? 'AFC' : 'AFS'}</span>
        </div>

        {/* Top - Video Info (only in video mode) */}
        {settings.videoMode && (
          <div className="hud-top">
            <span className="video-info recording">● REC 6K 30p | ProRes 422 HQ | 00:12:34</span>
          </div>
        )}

        {/* Right */}
        <div className="hud-right">
          <div className="waveform-label">WAVEFORM</div>
          <div className="battery">Battery: 45min</div>
          {settings.flashEnabled && <div className="flash-ready">⚡ READY</div>}
        </div>

        <style jsx>{`
          .panasonic-hud {
            pointer-events: none;
          }

          .hud-bottom {
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 18px;
            align-items: center;
            font-family: 'DIN', 'Helvetica', sans-serif;
            font-weight: 600;
            color: var(--primary-color);
            font-size: 15px;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
            padding: 11px 22px;
            background: rgba(0, 0, 0, 0.45);
            backdrop-filter: blur(5px);
            border-radius: 6px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }

          .profile {
            color: var(--secondary-color);
          }

          .hud-top {
            position: fixed;
            top: 18px;
            left: 50%;
            transform: translateX(-50%);
            font-family: 'DIN', 'Helvetica', sans-serif;
            color: var(--secondary-color);
            font-size: 13px;
            font-weight: 700;
            text-shadow: 0 0 10px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .video-info.recording {
            color: #ef4444;
            animation: rec-blink 1.5s infinite;
          }

          @keyframes rec-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.6; }
          }

          .hud-right {
            position: fixed;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            display: flex;
            flex-direction: column;
            gap: 10px;
            align-items: flex-end;
            font-family: 'DIN', sans-serif;
            color: var(--primary-color);
            font-size: 11px;
            text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
            z-index: 9999;
          }

          .waveform-label {
            color: var(--secondary-color);
            font-weight: 700;
          }

          .flash-ready {
            color: var(--secondary-color);
          }
        `}</style>
      </div>
    );
  };

  const renderHUD = () => {
    // Check HUD mode
    if (settings.hudMode === 0) return null; // No HUD

    switch (settings.brand) {
      case 'sony':
        return renderSonyHUD();
      case 'canon':
        return renderCanonHUD();
      case 'fujifilm':
        return renderFujifilmHUD();
      case 'panasonic':
        return renderPanasonicHUD();
      case 'nikon':
      default:
        return renderNikonHUD();
    }
  };

  return (
    <div className={`camera-hud-container ${settings.hudMode === 1 ? 'minimal' : ''}`}>
      {renderHUD()}

      <style jsx global>{`
        .camera-hud-container.minimal {
          opacity: 0.5;
        }

        .camera-hud-container.minimal .hud-top,
        .camera-hud-container.minimal .hud-left,
        .camera-hud-container.minimal .hud-right {
          display: none;
        }
      `}</style>
    </div>
  );
}
