import { computeEAR } from '../../../../modules/liveness/analysis/eyeAspectRatio';
import { validateBlink } from '../../../../modules/liveness/validators/blinkValidator';
import { getEyeLandmarks } from '../../../../modules/landmarks/facial/eyeLandmarks';
import { BLINK_LANDMARKS } from '../../../unit/__mocks__/mockLandmarks';

describe('blinkValidator', () => {
  it('EAR = 0.18 for 3 frames should detect blink', () => {
    const eyes = getEyeLandmarks(BLINK_LANDMARKS);
    const earResult = computeEAR(eyes);
    expect(earResult.averageEAR).toBeLessThan(0.21);
    expect(validateBlink(earResult, 3)).toBe(true);
  });
});
