import type { SDKError } from '../errors/SDKError';

export function sdkLog(module: string, message: string, data?: unknown): void {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;
  if (isDev) {
    const prefix = `[SDK:${module}]`;
    if (data !== undefined) {
      console.log(prefix, message, data);
    } else {
      console.log(prefix, message);
    }
  }
}

export function sdkWarn(module: string, message: string): void {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;
  if (isDev) {
    console.warn(`[SDK:${module}]`, message);
  }
}

export function sdkError(module: string, error: SDKError): void {
  const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : true;
  if (isDev) {
    console.error(
      `[SDK:${module}] [${error.code}] ${error.message}`,
      { module: error.module, recoverable: error.recoverable, timestamp: error.timestamp },
    );
  }
}
