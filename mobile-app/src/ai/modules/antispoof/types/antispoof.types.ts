export interface AntiSpoofResult {
  isLive: boolean;
  confidence: number;
  attackType?: 'photo' | 'video_replay' | 'mask';
  processingTimeMs: number;
}
