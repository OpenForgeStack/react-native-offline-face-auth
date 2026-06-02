import type { ChallengeType } from '../../../shared/types/sdk.types';

export function shuffleChallenges(
  challenges: ChallengeType[] = ['blink', 'smile', 'turn_left', 'turn_right'],
  lastSequence?: ChallengeType[],
): ChallengeType[] {
  const shuffled = [...challenges];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i]!;
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp;
  }

  if (lastSequence && sequencesEqual(shuffled, lastSequence)) {
    return shuffleChallenges(challenges, lastSequence);
  }

  return shuffled;
}

function sequencesEqual(a: ChallengeType[], b: ChallengeType[]): boolean {
  if (a.length !== b.length) return false;
  return a.every((val, idx) => val === b[idx]);
}
