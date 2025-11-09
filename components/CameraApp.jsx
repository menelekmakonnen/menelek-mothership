import { useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';
import CameraHUD from './CameraHUD';
import {
  CAMERA_MODES,
  HUD_LEVELS,
  LENS_OPTIONS,
  cameraReducer,
  initialCameraState,
  sanitizeCameraMode,
  sanitizeHudLevel,
  sanitizeLens,
  getExposureRange,
} from '../lib/cameraState';

const albumItems = [
  { id: 1, title: 'Sunset cliffs', exposure: '-0.3EV' },
  { id: 2, title: 'Neon cityscape', exposure: '+1.0EV' },
  { id: 3, title: 'Astro timelapse', exposure: '+2.0EV' },
];

const FLASH_RESET_DELAY = 900;

export default function CameraApp({ initialHud = undefined, initialMode = undefined, initialLens = undefined }) {
  const initializer = useMemo(
    () =>
      function init(state) {
        return {
          ...state,
          hudLevel: sanitizeHudLevel(initialHud),
          cameraMode: sanitizeCameraMode(initialMode),
          lens: sanitizeLens(initialLens),
        };
      },
    [initialHud, initialMode, initialLens],
  );

  const [state, dispatch] = useReducer(cameraReducer, initialCameraState, initializer);

  const theme = state.cameraMode === 'night' ? 'dark' : 'light';

  useEffect(() => {
    if (!state.flashFired) {
      return undefined;
    }
    const timer = setTimeout(() => {
      dispatch({ type: 'RESET_FLASH' });
    }, FLASH_RESET_DELAY);
    return () => clearTimeout(timer);
  }, [state.flashFired]);

  const exposureRange = getExposureRange();

  return (
    <div
      className={`camera-app hud-${state.hudLevel} mode-${state.cameraMode}`}
      data-testid="camera-app"
      data-theme={theme}
    >
      <header className="camera-app__header">
        <h1>Photon Pro Studio</h1>
        <p className="camera-app__tagline">Manual-first camera with adaptive HUD.</p>
      </header>

      <CameraHUD
        lens={state.lens}
        exposure={state.exposure}
        hudLevel={state.hudLevel}
        cameraMode={state.cameraMode}
        flashFired={state.flashFired}
      />

      <section className="camera-app__controls" aria-label="Camera controls">
        <label className="control control--lens">
          <span>Lens</span>
          <select
            aria-label="Lens selector"
            value={state.lens}
            onChange={(event) =>
              dispatch({ type: 'CHANGE_LENS', lens: event.target.value })
            }
          >
            {LENS_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="control control--exposure">
          <span>Exposure compensation</span>
          <input
            type="range"
            min={exposureRange.min}
            max={exposureRange.max}
            step="0.3"
            value={state.exposure}
            onChange={(event) =>
              dispatch({ type: 'SET_EXPOSURE', value: Number(event.target.value) })
            }
            aria-valuetext={`${state.exposure.toFixed(1)} exposure value`}
          />
        </label>

        <fieldset className="control control--modes">
          <legend className="control__legend">Mode</legend>
          {CAMERA_MODES.map((mode) => (
            <label key={mode}>
              <input
                type="radio"
                name="camera-mode"
                value={mode}
                checked={state.cameraMode === mode}
                onChange={() => dispatch({ type: 'SET_CAMERA_MODE', mode })}
              />
              {mode}
            </label>
          ))}
        </fieldset>

        <fieldset className="control control--hud">
          <legend className="control__legend">HUD</legend>
          {HUD_LEVELS.map((level) => (
            <label key={level}>
              <input
                type="radio"
                name="hud-level"
                value={level}
                checked={state.hudLevel === level}
                onChange={() => dispatch({ type: 'SET_HUD_LEVEL', level })}
              />
              {level}
            </label>
          ))}
        </fieldset>

        <button
          type="button"
          className="control control--flash"
          onClick={() => dispatch({ type: 'TRIGGER_FLASH' })}
        >
          Fire flash
        </button>

        <button
          type="button"
          className="control control--album"
          onClick={() => dispatch({ type: 'OPEN_ALBUM' })}
        >
          Open album
        </button>
      </section>

      {state.albumOpen && (
        <section
          className="camera-app__album"
          aria-live="polite"
          role="dialog"
          aria-label="Recent captures"
        >
          <header>
            <h2>Recent captures</h2>
            <button type="button" onClick={() => dispatch({ type: 'CLOSE_ALBUM' })}>
              Close album
            </button>
          </header>
          <ul>
            {albumItems.map((item) => (
              <li key={item.id}>
                <span>{item.title}</span>
                <span className="album__exposure">{item.exposure}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="camera-app__footer" aria-live="assertive">
        {state.flashFired ? 'Flash fired!' : 'Flash ready'}
      </footer>
    </div>
  );
}

CameraApp.propTypes = {
  initialHud: PropTypes.string,
  initialMode: PropTypes.string,
  initialLens: PropTypes.string,
};

