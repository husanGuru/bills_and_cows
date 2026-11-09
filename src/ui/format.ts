import type { Base } from '../core/types';

const BASE_NAMES: Record<Base, string> = { 2: 'bin', 8: 'oct', 10: 'dec', 16: 'hex' };

export const formatBase = (base: Base): string => BASE_NAMES[base];

export const formatTime = (ms: number): string => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = String(totalSeconds % 60).padStart(2, '0');
  return `${minutes}:${seconds}`;
};

export const formatNumber = (value: number): string => value.toLocaleString('en-US');

export const formatDate = (timestamp: number): string =>
  new Date(timestamp).toLocaleDateString('en-GB');
