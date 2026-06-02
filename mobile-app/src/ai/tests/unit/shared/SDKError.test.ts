import { SDKError } from '../../../shared/errors/SDKError';
import { SDKErrorCode, SDKModule } from '../../../shared/constants/errorCodes';
import { livenessFailed } from '../../../shared/errors/errorFactory';

describe('SDKError', () => {
  it('should be instanceof Error', () => {
    const error = new SDKError({
      code: SDKErrorCode.LIVENESS_FAILED,
      module: SDKModule.LIVENESS,
      message: 'Test error',
      recoverable: true,
    });
    expect(error).toBeInstanceOf(Error);
    expect(error.name).toBe('SDKError');
  });

  it('recoverable: true should have correct code', () => {
    const error = livenessFailed('Blink not detected');
    expect(error.code).toBe(SDKErrorCode.LIVENESS_FAILED);
    expect(error.recoverable).toBe(true);
  });

  it('errorFactory.livenessFailed should return correct module + code', () => {
    const error = livenessFailed('Test');
    expect(error.module).toBe(SDKModule.LIVENESS);
    expect(error.code).toBe(SDKErrorCode.LIVENESS_FAILED);
  });
});
