import './style.css';
import { createGame, getElapsedMs, getGuessError, submitGuess } from './core/game';
import { addRecord, createRecord } from './core/records';
import { generateSecret } from './core/secret';
import { getAvailableLengths, isLengthAvailable } from './core/settings';
import type { Base, GameSettings, GameState, GuessError, RecordEntry } from './core/types';
import { h } from './ui/dom';
import { formatTime } from './ui/format';
import { gameView } from './ui/game-view';
import { recordsView } from './ui/records-view';
import { settingsView } from './ui/settings-view';
import { loadRecords, saveRecords } from './ui/storage';

const RECORDS_LIMIT = 10;

interface AppState {
  readonly settings: GameSettings;
  readonly game: GameState | null;
  readonly records: readonly RecordEntry[];
  readonly message: string;
}

const errorMessages: Record<GuessError, (settings: GameSettings) => string> = {
  invalid: ({ length }) => `Enter ${length} different digits`,
  duplicate: () => 'You already tried this one',
  finished: () => 'The game is over',
};

const root = h('main', { className: 'app' });
document.body.append(root);

let state: AppState = {
  settings: { length: 4, base: 10 },
  game: null,
  records: loadRecords(),
  message: '',
};

const setState = (patch: Partial<AppState>): void => {
  state = { ...state, ...patch };
  render();
};

const setBase = (base: Base): void => {
  const { length } = state.settings;
  const nextLength = isLengthAvailable(length, base)
    ? length
    : Math.max(...getAvailableLengths(base));
  setState({ settings: { base, length: nextLength } });
};

const setLength = (length: number): void => {
  setState({ settings: { ...state.settings, length } });
};

const start = (): void => {
  const { length, base } = state.settings;
  setState({
    game: createGame(state.settings, generateSecret(length, base), Date.now()),
    message: '',
  });
};

const guess = (value: string): void => {
  if (state.game === null) {
    return;
  }

  const error = getGuessError(state.game, value);
  if (error !== null) {
    setState({ message: errorMessages[error](state.settings) });
    return;
  }

  const game = submitGuess(state.game, value, Date.now());
  const record = createRecord(game);
  const records = record ? addRecord(state.records, record, RECORDS_LIMIT) : state.records;

  if (record) {
    saveRecords(records);
  }
  setState({ game, records, message: '' });
};

const newGame = (): void => {
  setState({ game: null, message: '' });
};

function render(): void {
  const { settings, game, records, message } = state;

  root.replaceChildren(
    ...[
      h('h1', { textContent: 'Bulls & Cows' }),
      settingsView(settings, game !== null, { setBase, setLength, start }),
      game ? gameView(game, message, { guess, newGame }) : null,
      recordsView(records, settings),
    ].filter((node) => node !== null),
  );

  root.querySelector<HTMLInputElement>('.guess-input')?.focus();
}

setInterval(() => {
  const timer = root.querySelector('.timer');
  if (timer && state.game?.status === 'playing') {
    timer.textContent = formatTime(getElapsedMs(state.game, Date.now()));
  }
}, 1000);

render();
