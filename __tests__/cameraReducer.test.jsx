import {
  cameraReducer,
  initialCameraState,
  LENS_OPTIONS,
} from '../lib/cameraState';

describe('cameraReducer', () => {
  it('changes lens when provided a valid option', () => {
    const next = cameraReducer(initialCameraState, {
      type: 'CHANGE_LENS',
      lens: LENS_OPTIONS[2],
    });

    expect(next.lens).toBe(LENS_OPTIONS[2]);
  });

  it('ignores invalid lens changes', () => {
    const next = cameraReducer(initialCameraState, {
      type: 'CHANGE_LENS',
      lens: 'macro',
    });

    expect(next).toBe(initialCameraState);
  });

  it('applies exposure adjustments within the allowed bounds', () => {
    const increased = cameraReducer(initialCameraState, {
      type: 'ADJUST_EXPOSURE',
      delta: 1.5,
    });

    expect(increased.exposure).toBeCloseTo(1.5, 5);

    const clipped = cameraReducer(
      { ...initialCameraState, exposure: 2.7 },
      {
        type: 'ADJUST_EXPOSURE',
        delta: 2,
      },
    );

    expect(clipped.exposure).toBe(3);
  });
});
