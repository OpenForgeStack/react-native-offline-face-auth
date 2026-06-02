import { useAuthState } from '../engine/state/authState';

export async function getRecognitionScore(): Promise<number> {
  const authState = useAuthState.getState();
  return authState.lastScore ?? 0;
}
