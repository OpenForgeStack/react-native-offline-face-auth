import { SDKError } from '../../shared/errors/SDKError';

export function assertSDKError(error: unknown, expectedCode?: string): void {
  if (!(error instanceof SDKError)) {
    throw new Error(`Expected SDKError but got ${typeof error}`);
  }
  if (expectedCode && error.code !== expectedCode) {
    throw new Error(`Expected SDKError code ${expectedCode} but got ${error.code}`);
  }
}

export function assertShape(
  tensor: Float32Array,
  expected: number[],
): void {
  let size = 1;
  for (const dim of expected) size *= dim;
  if (tensor.length !== size) {
    throw new Error(
      `Expected shape ${JSON.stringify(expected)} (${size} elements) but got ${tensor.length} elements`,
    );
  }
}
