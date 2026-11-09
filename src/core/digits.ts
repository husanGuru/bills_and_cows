import type { Base, DigitValidator } from './types';

const ALL_DIGITS = '0123456789abcdef';

export const getAlphabet = (base: Base): string => ALL_DIGITS.slice(0, base);

export const normalizeDigit = (char: string): string => char.toLowerCase();

export const createDigitValidator = (base: Base): DigitValidator => {
  const alphabet = getAlphabet(base);

  return (char) => char.length === 1 && alphabet.includes(normalizeDigit(char));
};
