import { SDKErrorCode, SDKModule } from '../constants/errorCodes';

export class SDKError extends Error {
  readonly code: SDKErrorCode;
  readonly module: SDKModule;
  readonly recoverable: boolean;
  readonly timestamp: number;

  constructor(params: {
    code: SDKErrorCode;
    module: SDKModule;
    message: string;
    recoverable: boolean;
  }) {
    super(params.message);
    this.name = 'SDKError';
    this.code = params.code;
    this.module = params.module;
    this.recoverable = params.recoverable;
    this.timestamp = Date.now();
  }
}
