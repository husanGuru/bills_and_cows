import { createDigitValidator } from '../core/digits';
import { getAttempts, getElapsedMs } from '../core/game';
import type { GameState, HistoryEntry } from '../core/types';
import { h } from './dom';
import { formatTime } from './format';

interface GameActions {
  guess: (value: string) => void;
  newGame: () => void;
}

const guessInput = (game: GameState): HTMLInputElement => {
  const { length, base } = game.settings;
  const isDigit = createDigitValidator(base);

  const input = h('input', {
    className: 'guess-input',
    maxLength: length,
    placeholder: '·'.repeat(length),
    autocomplete: 'off',
    spellcheck: false,
    inputMode: base > 10 ? 'text' : 'numeric',
    ariaLabel: 'Your guess',
  });

  input.addEventListener('input', () => {
    input.value = [...input.value].filter(isDigit).join('');
  });

  return input;
};

const guessForm = (game: GameState, message: string, actions: GameActions): HTMLElement => {
  const input = guessInput(game);

  const form = h('form', { className: 'guess-form' }, [
    input,
    h('button', { className: 'primary', type: 'submit', textContent: 'Check' }),
  ]);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    actions.guess(input.value);
  });

  return h('div', {}, [form, h('p', { className: 'message', textContent: message })]);
};

const historyItem = ({ guess, score }: HistoryEntry, index: number): HTMLElement =>
  h('li', {}, [
    h('span', { className: 'muted', textContent: String(index + 1) }),
    h('span', { className: 'digits', textContent: guess }),
    h('span', { className: 'score' }, [
      h('b', { className: 'bulls', textContent: `${score.bulls}B` }),
      h('b', { className: 'cows', textContent: `${score.cows}C` }),
    ]),
  ]);

const stat = (label: string, value: HTMLElement): HTMLElement =>
  h('div', { className: 'stat' }, [h('span', { className: 'muted', textContent: label }), value]);

export const gameView = (game: GameState, message: string, actions: GameActions): HTMLElement => {
  const isWon = game.status === 'won';
  const time = formatTime(getElapsedMs(game, Date.now()));

  return h('section', { className: 'card' }, [
    h('div', { className: 'stats' }, [
      stat('Attempts', h('strong', { textContent: String(getAttempts(game)) })),
      stat('Time', h('strong', { className: 'timer', textContent: time })),
    ]),
    isWon
      ? h('p', {
          className: 'win',
          textContent: `Got it! ${game.secret} in ${getAttempts(game)} attempts, ${time}`,
        })
      : guessForm(game, message, actions),
    game.history.length > 0 && h('ol', { className: 'history' }, game.history.map(historyItem)),
    h('button', {
      className: isWon ? 'primary' : 'secondary',
      textContent: 'New game',
      onclick: actions.newGame,
    }),
  ]);
};
