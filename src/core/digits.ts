import type { Base, DigitValidator } from './types';

export const createDigitValidator =
  (_base: Base): DigitValidator =>
  (_char) => {
    throw new Error('Not implemented');
  };
