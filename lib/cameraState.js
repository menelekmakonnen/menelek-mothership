export const LENS_OPTIONS = ['wide', 'ultra-wide', 'telephoto'];
export const HUD_LEVELS = ['minimal', 'standard', 'pro'];
export const CAMERA_MODES = ['photo', 'portrait', 'night'];

export const initialCameraState = {
  lens: LENS_OPTIONS[0],
  exposure: 0,
  hudLevel: HUD_LEVELS[1],
  cameraMode: CAMERA_MODES[0],
  albumOpen: false,
  flashFired: false,
  lastFlashTimestamp: null,
};

const EXPOSURE_RANGE = { min: -3, max: 3 };

const clampExposure = (value) => {
  const { min, max } = EXPOSURE_RANGE;
  return Math.min(Math.max(value, min), max);
};

export function cameraReducer(state, action) {
  switch (action.type) {
    case 'CHANGE_LENS': {
      if (!LENS_OPTIONS.includes(action.lens)) {
        return state;
      }
      if (state.lens === action.lens) {
        return state;
      }
      return {
        ...state,
        lens: action.lens,
      };
    }
    case 'SET_EXPOSURE': {
      const nextValue = clampExposure(action.value);
      if (nextValue === state.exposure) {
        return state;
      }
      return {
        ...state,
        exposure: nextValue,
      };
    }
    case 'ADJUST_EXPOSURE': {
      const nextValue = clampExposure(state.exposure + action.delta);
      if (nextValue === state.exposure) {
        return state;
      }
      return {
        ...state,
        exposure: nextValue,
      };
    }
    case 'SET_HUD_LEVEL': {
      if (!HUD_LEVELS.includes(action.level)) {
        return state;
      }
      if (state.hudLevel === action.level) {
        return state;
      }
      return {
        ...state,
        hudLevel: action.level,
      };
    }
    case 'SET_CAMERA_MODE': {
      if (!CAMERA_MODES.includes(action.mode)) {
        return state;
      }
      if (state.cameraMode === action.mode) {
        return state;
      }
      return {
        ...state,
        cameraMode: action.mode,
      };
    }
    case 'OPEN_ALBUM': {
      if (state.albumOpen) {
        return state;
      }
      return {
        ...state,
        albumOpen: true,
      };
    }
    case 'CLOSE_ALBUM': {
      if (!state.albumOpen) {
        return state;
      }
      return {
        ...state,
        albumOpen: false,
      };
    }
    case 'TRIGGER_FLASH': {
      const timestamp = action.timestamp ?? Date.now();
      if (state.flashFired && state.lastFlashTimestamp === timestamp) {
        return state;
      }
      return {
        ...state,
        flashFired: true,
        lastFlashTimestamp: timestamp,
      };
    }
    case 'RESET_FLASH': {
      if (!state.flashFired) {
        return state;
      }
      return {
        ...state,
        flashFired: false,
      };
    }
    default:
      return state;
  }
}

export function sanitizeHudLevel(level) {
  return HUD_LEVELS.includes(level) ? level : initialCameraState.hudLevel;
}

export function sanitizeCameraMode(mode) {
  return CAMERA_MODES.includes(mode) ? mode : initialCameraState.cameraMode;
}

export function sanitizeLens(lens) {
  return LENS_OPTIONS.includes(lens) ? lens : initialCameraState.lens;
}

export function getExposureRange() {
  return { ...EXPOSURE_RANGE };
}
