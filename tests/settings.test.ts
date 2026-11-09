import { describe, expect, it } from 'vitest';
import { getAvailableLengths, isLengthAvailable } from '../src/core/settings';

describe('isLengthAvailable', () => {
  it('allows a length that fits into the base', () => {
    expect(isLengthAvailable(2, 2)).toBe(true);
    expect(isLengthAvailable(6, 8)).toBe(true);
    expect(isLengthAvailable(6, 16)).toBe(true);
  });

  it('does not allow a length bigger than the base', () => {
    expect(isLengthAvailable(3, 2)).toBe(false);
  });
});

describe('getAvailableLengths', () => {
  it('allows only length 2 for binary', () => {
    expect(getAvailableLengths(2)).toEqual([2]);
  });

  it('allows every length from 2 to 6 for other bases', () => {
    expect(getAvailableLengths(8)).toEqual([2, 3, 4, 5, 6]);
    expect(getAvailableLengths(10)).toEqual([2, 3, 4, 5, 6]);
    expect(getAvailableLengths(16)).toEqual([2, 3, 4, 5, 6]);
  });
});
