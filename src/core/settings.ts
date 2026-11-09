import type { Base } from './types';

export const BASES: readonly Base[] = [2, 8, 10, 16];

export const LENGTHS: readonly number[] = [2, 3, 4, 5, 6];

export const isLengthAvailable = (_length: number, _base: Base): boolean => {
  throw new Error('Not implemented');
};

export const getAvailableLengths = (_base: Base): readonly number[] => {
  throw new Error('Not implemented');
};
