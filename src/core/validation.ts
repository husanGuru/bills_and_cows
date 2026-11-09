import { createDigitValidator, normalizeDigit } from './digits';
import type { Base } from './types';

export const hasUniqueDigits = (digits: readonly string[]): boolean =>
  new Set(digits.map(normalizeDigit)).size === digits.length;

export const isValidGuess = (guess: string, length: number, base: Base): boolean => {
  const digits = [...guess];

  return (
    digits.length === length && digits.every(createDigitValidator(base)) && hasUniqueDigits(digits)
  );
};
