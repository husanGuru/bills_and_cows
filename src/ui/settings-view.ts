import { countPossibleSecrets } from '../core/combinatorics';
import { BASES, LENGTHS, isLengthAvailable } from '../core/settings';
import type { Base, GameSettings } from '../core/types';
import { h } from './dom';
import { formatBase, formatNumber } from './format';

interface SettingsActions {
  setBase: (base: Base) => void;
  setLength: (length: number) => void;
  start: () => void;
}

const option = (label: string, active: boolean, disabled: boolean, onclick: () => void) =>
  h('button', {
    type: 'button',
    className: active ? 'option active' : 'option',
    textContent: label,
    disabled,
    onclick,
  });

export const settingsView = (
  settings: GameSettings,
  locked: boolean,
  actions: SettingsActions,
): HTMLElement => {
  const { length, base } = settings;

  const bases = BASES.map((value) =>
    option(formatBase(value), value === base, locked, () => actions.setBase(value)),
  );

  const lengths = LENGTHS.map((value) =>
    option(String(value), value === length, locked || !isLengthAvailable(value, base), () =>
      actions.setLength(value),
    ),
  );

  return h('section', { className: 'card' }, [
    h('p', { className: 'label', textContent: 'Number system' }),
    h('div', { className: 'options' }, bases),
    h('p', { className: 'label', textContent: 'Length' }),
    h('div', { className: 'options' }, lengths),
    h('p', {
      className: 'hint',
      textContent: `${formatNumber(countPossibleSecrets(length, base))} possible numbers`,
    }),
    !locked && h('button', { className: 'primary', textContent: 'Start', onclick: actions.start }),
  ]);
};
