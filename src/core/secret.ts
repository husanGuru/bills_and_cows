import { getAlphabet } from './digits';
import type { Base, RandomSource } from './types';

const pickIndex = (size: number, random: RandomSource): number =>
  Math.min(Math.floor(random() * size), size - 1);

const removeAt = (text: string, index: number): string =>
  text.slice(0, index) + text.slice(index + 1);

const pickDigits = (available: string, count: number, random: RandomSource): string => {
  if (count === 0) {
    return '';
  }
  const index = pickIndex(available.length, random);
  return available.charAt(index) + pickDigits(removeAt(available, index), count - 1, random);
};

export const generateSecret = (
  length: number,
  base: Base,
  random: RandomSource = Math.random,
): string => pickDigits(getAlphabet(base), length, random);
