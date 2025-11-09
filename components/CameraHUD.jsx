import PropTypes from 'prop-types';
import { HUD_LEVELS } from '../lib/cameraState';

const levelCopy = {
  minimal: {
    label: 'Minimal HUD',
    description: 'Essential controls for quick shooting.',
  },
  standard: {
    label: 'Standard HUD',
    description: 'Balanced overlay with live histogram.',
  },
  pro: {
    label: 'Pro HUD',
    description: 'Detailed telemetry with manual overrides.',
  },
};

export default function CameraHUD({
  lens,
  exposure,
  hudLevel,
  cameraMode,
  flashFired,
}) {
  const copy = levelCopy[hudLevel];
  return (
    <section
      aria-label="Camera heads-up display"
      data-testid="camera-hud"
      className={`hud hud-${hudLevel}`}
    >
      <h2 className="hud__title">{copy.label}</h2>
      <p className="hud__description">{copy.description}</p>
      <dl className="hud__telemetry">
        <div>
          <dt>Lens</dt>
          <dd>{lens}</dd>
        </div>
        <div>
          <dt>Exposure</dt>
          <dd>{exposure.toFixed(1)} EV</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{cameraMode}</dd>
        </div>
        <div>
          <dt>Flash</dt>
          <dd>{flashFired ? 'Fired' : 'Ready'}</dd>
        </div>
      </dl>
    </section>
  );
}

CameraHUD.propTypes = {
  lens: PropTypes.string.isRequired,
  exposure: PropTypes.number.isRequired,
  hudLevel: PropTypes.oneOf(HUD_LEVELS).isRequired,
  cameraMode: PropTypes.string.isRequired,
  flashFired: PropTypes.bool.isRequired,
};
