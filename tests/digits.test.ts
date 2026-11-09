import { describe, expect, it } from 'vitest';
import { createDigitValidator } from '../src/core/digits';

describe('createDigitValidator', () => {
  it('returns a function', () => {
    expect(typeof createDigitValidator(10)).toBe('function');
  });

  it('accepts only 0 and 1 for binary', () => {
    const isBinaryDigit = createDigitValidator(2);

    expect(isBinaryDigit('0')).toBe(true);
    expect(isBinaryDigit('1')).toBe(true);
    expect(isBinaryDigit('2')).toBe(false);
  });

  it('accepts 0-7 for octal', () => {
    const isOctalDigit = createDigitValidator(8);

    expect(['0', '3', '7'].every(isOctalDigit)).toBe(true);
    expect(isOctalDigit('8')).toBe(false);
    expect(isOctalDigit('9')).toBe(false);
  });

  it('accepts 0-9 for decimal and rejects letters', () => {
    const isDecimalDigit = createDigitValidator(10);

    expect([...'0123456789'].every(isDecimalDigit)).toBe(true);
    expect(isDecimalDigit('a')).toBe(false);
  });

  it('accepts 0-9 and a-f for hex', () => {
    const isHexDigit = createDigitValidator(16);

    expect([...'0123456789abcdef'].every(isHexDigit)).toBe(true);
    expect(isHexDigit('g')).toBe(false);
  });

  it('treats uppercase hex letters the same as lowercase', () => {
    const isHexDigit = createDigitValidator(16);

    expect([...'ABCDEF'].every(isHexDigit)).toBe(true);
    expect(isHexDigit('G')).toBe(false);
  });

  it('rejects empty strings, multi-char strings and non-digit symbols', () => {
    const isDecimalDigit = createDigitValidator(10);

    expect(isDecimalDigit('')).toBe(false);
    expect(isDecimalDigit('12')).toBe(false);
    expect(isDecimalDigit(' ')).toBe(false);
    expect(isDecimalDigit('-')).toBe(false);
  });

  it('can be used directly as an array predicate', () => {
    expect([...'0129'].filter(createDigitValidator(8))).toEqual(['0', '1', '2']);
  });
});
