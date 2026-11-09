import { describe, expect, it, vi } from 'vitest';
import { memoize } from '../src/core/memoize';

describe('memoize', () => {
  it('returns the same result as the original function', () => {
    const add = memoize((a: number, b: number) => a + b);

    expect(add(2, 3)).toBe(5);
  });

  it('calls the original function only once for the same arguments', () => {
    const square = vi.fn((n: number) => n * n);
    const memoSquare = memoize(square);

    memoSquare(4);
    memoSquare(4);
    memoSquare(4);

    expect(square).toHaveBeenCalledTimes(1);
  });

  it('calls the original function again for different arguments', () => {
    const add = vi.fn((a: number, b: number) => a + b);
    const memoAdd = memoize(add);

    expect(memoAdd(1, 2)).toBe(3);
    expect(memoAdd(2, 1)).toBe(3);
    expect(memoAdd(1, 2)).toBe(3);

    expect(add).toHaveBeenCalledTimes(2);
  });

  it('does not mix up arguments that look alike when joined', () => {
    const join = memoize((a: string, b: string) => `${a}|${b}`);

    expect(join('1,2', '3')).toBe('1,2|3');
    expect(join('1', '2,3')).toBe('1|2,3');
  });

  it('keeps a separate cache for every memoized function', () => {
    const double = memoize((n: number) => n * 2);
    const triple = memoize((n: number) => n * 3);

    expect(double(5)).toBe(10);
    expect(triple(5)).toBe(15);
  });
});
