import { create } from 'zustand';
import type { ChallengeType } from '../../shared/types/sdk.types';

interface SessionState {
  currentChallenge: ChallengeType | null;
  challengeSequence: ChallengeType[];
  completedChallenges: ChallengeType[];
  sessionStartedAt: number | null;
  setChallenge: (challenge: ChallengeType) => void;
  completeChallenge: (challenge: ChallengeType) => void;
  startSession: (sequence: ChallengeType[]) => void;
  endSession: () => void;
  reset: () => void;
}

export const useSessionState = create<SessionState>()((set) => ({
  currentChallenge: null,
  challengeSequence: [],
  completedChallenges: [],
  sessionStartedAt: null,
  setChallenge: (challenge: ChallengeType) => set({ currentChallenge: challenge }),
  completeChallenge: (challenge: ChallengeType) =>
    set((state) => ({
      completedChallenges: [...state.completedChallenges, challenge],
    })),
  startSession: (sequence: ChallengeType[]) =>
    set({
      currentChallenge: sequence[0] ?? null,
      challengeSequence: sequence,
      completedChallenges: [],
      sessionStartedAt: Date.now(),
    }),
  endSession: () =>
    set({
      currentChallenge: null,
      challengeSequence: [],
      completedChallenges: [],
      sessionStartedAt: null,
    }),
  reset: () =>
    set({
      currentChallenge: null,
      challengeSequence: [],
      completedChallenges: [],
      sessionStartedAt: null,
    }),
}));
