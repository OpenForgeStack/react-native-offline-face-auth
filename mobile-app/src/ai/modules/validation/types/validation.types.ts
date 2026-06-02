export interface ValidationResult {
  passed: boolean;
  qualityScore: number;
  failures: ValidationFailure[];
}

export interface ValidationFailure {
  code: ValidationFailureCode;
  message: string;
}

export type ValidationFailureCode =
  | 'BLUR_DETECTED'
  | 'TOO_DARK'
  | 'TOO_BRIGHT'
  | 'SHADOW_DETECTED'
  | 'FACE_TOO_SMALL'
  | 'MULTIPLE_FACES'
  | 'NO_FACE';
