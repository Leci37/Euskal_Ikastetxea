import EventManager, { Events } from '../events/EventManager.js';

const KEY_TO_DIR = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  s: 'down',
  a: 'left',
  d: 'right'
};

const ACTION_KEYS = ['Enter'];
const CANCEL_KEYS = ['Escape'];

export default class InputHandler {
  constructor() {
    this.pressed = new Set();
    this.buffer = [];
    this._onKeyDown = this._onKeyDown.bind(this);
    this._onKeyUp = this._onKeyUp.bind(this);
  }

  start() {
    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
  }

  stop() {
    window.removeEventListener('keydown', this._onKeyDown);
    window.removeEventListener('keyup', this._onKeyUp);
    this.pressed.clear();
    this.buffer.length = 0;
  }

  _onKeyDown(e) {
    const key = e.key;
    if (KEY_TO_DIR[key]) {
      const dir = KEY_TO_DIR[key];
      if (!this.pressed.has(dir)) {
        this.pressed.add(dir);
        EventManager.emit(Events.INPUT_DIRECTION_DOWN, { direction: dir });
        this.buffer.push({ type: 'direction', state: 'down', direction: dir });
      }
      e.preventDefault();
    } else if (ACTION_KEYS.includes(key)) {
      EventManager.emit(Events.INPUT_ACTION_PRESS);
      this.buffer.push({ type: 'action', state: 'press' });
      e.preventDefault();
    } else if (CANCEL_KEYS.includes(key)) {
      EventManager.emit(Events.INPUT_CANCEL_PRESS);
      this.buffer.push({ type: 'cancel', state: 'press' });
      e.preventDefault();
    }
  }

  _onKeyUp(e) {
    const key = e.key;
    if (KEY_TO_DIR[key]) {
      const dir = KEY_TO_DIR[key];
      if (this.pressed.has(dir)) {
        this.pressed.delete(dir);
        EventManager.emit(Events.INPUT_DIRECTION_UP, { direction: dir });
        this.buffer.push({ type: 'direction', state: 'up', direction: dir });
      }
      e.preventDefault();
    } else if (ACTION_KEYS.includes(key)) {
      EventManager.emit(Events.INPUT_ACTION_RELEASE);
      this.buffer.push({ type: 'action', state: 'release' });
      e.preventDefault();
    } else if (CANCEL_KEYS.includes(key)) {
      EventManager.emit(Events.INPUT_CANCEL_RELEASE);
      this.buffer.push({ type: 'cancel', state: 'release' });
      e.preventDefault();
    }
  }

  isDown(dir) {
    return this.pressed.has(dir);
  }

  consumeBuffer() {
    const events = [...this.buffer];
    this.buffer.length = 0;
    return events;
  }
}
