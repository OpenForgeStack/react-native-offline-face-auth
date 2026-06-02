import { computeEAR } from '../../../../modules/liveness/analysis/eyeAspectRatio';
import { getEyeLandmarks } from '../../../../modules/landmarks/facial/eyeLandmarks';
import { FRONTAL_FACE_LANDMARKS, BLINK_LANDMARKS } from '../../../unit/__mocks__/mockLandmarks';

describe('eyeAspectRatio', () => {
  it('known landmark coords should produce expected EAR value', () => {
    const eyes = getEyeLandmarks(FRONTAL_FACE_LANDMARKS);
    const result = computeEAR(eyes);
    expect(result.averageEAR).toBeGreaterThan(0);
    expect(result.averageEAR).toBeLessThan(1);
  });

  it('blink landmarks should have EAR < 0.21', () => {
    const eyes = getEyeLandmarks(BLINK_LANDMARKS);
    const result = computeEAR(eyes);
    expect(result.blinkDetected).toBe(true);
  });
});
