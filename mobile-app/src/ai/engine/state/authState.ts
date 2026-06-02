import { create } from 'zustand';
import type { AuthResult } from '../../shared/types/sdk.types';

interface AuthState {
  lastResult: AuthResult | null;
  lastScore: number;
  sessionCount: number;
  setResult: (result: AuthResult) => void;
  reset: () => void;
}

export const useAuthState = create<AuthState>()((set) => ({
  lastResult: null,
  lastScore: 0,
  sessionCount: 0,
  setResult: (result: AuthResult) =>
    set({ lastResult: result, lastScore: result.score, sessionCount: 0 }),
  reset: () => set({ lastResult: null, lastScore: 0, sessionCount: 0 }),
}));
