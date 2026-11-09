import { getRecordsFor } from '../core/records';
import type { GameSettings, RecordEntry } from '../core/types';
import { h } from './dom';
import { formatBase, formatDate, formatTime } from './format';

const row = (cells: readonly string[], tag: 'td' | 'th' = 'td'): HTMLElement =>
  h(
    'tr',
    {},
    cells.map((text) => h(tag, { textContent: text })),
  );

const recordRow = (record: RecordEntry, index: number): HTMLElement =>
  row([
    String(index + 1),
    String(record.attempts),
    formatTime(record.timeMs),
    formatDate(record.date),
  ]);

export const recordsView = (
  records: readonly RecordEntry[],
  settings: GameSettings,
): HTMLElement => {
  const best = getRecordsFor(records, settings);

  return h('section', { className: 'card' }, [
    h('div', { className: 'card-title' }, [
      h('h2', { textContent: 'Best results' }),
      h('span', {
        className: 'badge',
        textContent: `${settings.length} digits · ${formatBase(settings.base)}`,
      }),
    ]),
    best.length === 0
      ? h('p', { className: 'hint', textContent: 'No results yet' })
      : h('table', {}, [
          h('thead', {}, [row(['#', 'Attempts', 'Time', 'Date'], 'th')]),
          h('tbody', {}, best.map(recordRow)),
        ]),
  ]);
};
