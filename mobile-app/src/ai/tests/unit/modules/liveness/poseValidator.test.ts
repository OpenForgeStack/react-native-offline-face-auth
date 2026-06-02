import { validatePose } from '../../../../modules/liveness/validators/poseValidator';

describe('poseValidator', () => {
  it('yaw > 25 should confirm head turn', () => {
    expect(validatePose({ yaw: 30, pitch: 0, roll: 0 }, 'turn_right', 25)).toBe(true);
    expect(validatePose({ yaw: -30, pitch: 0, roll: 0 }, 'turn_left', 25)).toBe(true);
  });
});
