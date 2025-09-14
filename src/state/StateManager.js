import EventManager, { Events } from '../events/EventManager.js';

export const States = {
  TITLE: 'TITLE',
  WORLD: 'WORLD',
  DIALOGUE: 'DIALOGUE',
  QUIZ: 'QUIZ',
  MENU: 'MENU'
};

class StateManager {
  constructor() {
    this.stack = [];
  }

  pushState(state) {
    this.stack.push(state);
    EventManager.emit(Events.PAUSE_GAME);
  }

  popState() {
    const state = this.stack.pop();
    if (this.stack.length === 0) {
      EventManager.emit(Events.RESUME_GAME);
    }
    return state;
  }

  currentState() {
    return this.stack[this.stack.length - 1];
  }
}

const manager = new StateManager();
export default manager;
