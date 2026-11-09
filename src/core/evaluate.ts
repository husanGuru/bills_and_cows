import { normalizeDigit } from './digits';
import type { Score } from './types';

const EMPTY_SCORE: Score = { bulls: 0, cows: 0 };

const toDigits = (value: string): string[] => [...value].map(normalizeDigit);

export const evaluateGuess = (secret: string, guess: string): Score => {
  const secretDigits = toDigits(secret);
  const secretSet = new Set(secretDigits);

  return toDigits(guess).reduce<Score>((score, digit, index) => {
    if (digit === secretDigits[index]) {
      return { ...score, bulls: score.bulls + 1 };
    }
    if (secretSet.has(digit)) {
      return { ...score, cows: score.cows + 1 };
    }
    return score;
  }, EMPTY_SCORE);
};
