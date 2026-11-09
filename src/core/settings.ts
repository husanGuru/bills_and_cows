import type { Base } from './types';

export const BASES: readonly Base[] = [2, 8, 10, 16];

export const LENGTHS: readonly number[] = [2, 3, 4, 5, 6];

export const isLengthAvailable = (length: number, base: Base): boolean => length <= base;

export const getAvailableLengths = (base: Base): readonly number[] =>
  LENGTHS.filter((length) => isLengthAvailable(length, base));
