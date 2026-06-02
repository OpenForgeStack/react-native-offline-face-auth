import { computeMAR } from '../../../../modules/liveness/analysis/mouthRatio';
import { validateSmile } from '../../../../modules/liveness/validators/smileValidator';
import { getMouthLandmarks } from '../../../../modules/landmarks/facial/mouthLandmarks';
import { SMILE_LANDMARKS } from '../../../unit/__mocks__/mockLandmarks';

describe('smileValidator', () => {
  it('MAR = 0.75 should detect smile', () => {
    const mouth = getMouthLandmarks(SMILE_LANDMARKS);
    const marResult = computeMAR({
      upper: mouth.upper,
      lower: mouth.lower,
      left: mouth.left,
      right: mouth.right,
    });
    expect(marResult.mar).toBeGreaterThan(0.6);
    expect(validateSmile(marResult)).toBe(true);
  });
});
