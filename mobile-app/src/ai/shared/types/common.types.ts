export type Milliseconds = number;
export type UnixTimestamp = number;
export type NormalizedFloat = number;

export type Result<T, E = SDKError> =
  | { success: true; data: T }
  | { success: false; error: E };

import type { SDKError } from '../errors/SDKError';
