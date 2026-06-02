import { useSessionState } from '../../../engine/state/sessionState';
import { shuffleChallenges } from './randomChallenge';
import type { ChallengeType } from '../../../shared/types/sdk.types';

class ChallengeSequencer {
  private lastSequence: ChallengeType[] = [];

  startNewSession(): void {
    const sequence = shuffleChallenges(undefined, this.lastSequence);
    this.lastSequence = sequence;
    useSessionState.getState().startSession(sequence);
  }

  advanceToNext(): ChallengeType | null {
    const state = useSessionState.getState();
    const currentIdx = state.completedChallenges.length;
    if (currentIdx >= state.challengeSequence.length) {
      return null;
    }
    const next = state.challengeSequence[currentIdx]!;
    state.setChallenge(next);
    return next;
  }

  completeCurrent(challenge: ChallengeType): void {
    useSessionState.getState().completeChallenge(challenge);
  }

  getCurrentChallenge(): ChallengeType | null {
    return useSessionState.getState().currentChallenge;
  }

  getProgress(): { completed: ChallengeType[]; total: number } {
    const state = useSessionState.getState();
    return {
      completed: state.completedChallenges,
      total: state.challengeSequence.length,
    };
  }

  isSessionComplete(): boolean {
    const state = useSessionState.getState();
    return state.completedChallenges.length >= state.challengeSequence.length;
  }

  endSession(): void {
    useSessionState.getState().endSession();
  }
}

export const challengeSequencer = new ChallengeSequencer();
