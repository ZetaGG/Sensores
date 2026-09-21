import type { ActuatorChallenge } from '../../data/actuadores.ts';

export function isChallengeCorrect(challenge: ActuatorChallenge, selectedId: string): boolean {
  return challenge.correct === selectedId;
}
