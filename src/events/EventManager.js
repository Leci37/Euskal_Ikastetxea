// Simple event bus singleton for decoupled communication
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  subscribe(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
  }

  unsubscribe(event, callback) {
    const set = this.listeners.get(event);
    if (set) {
      set.delete(callback);
    }
  }

  emit(event, payload) {
    const set = this.listeners.get(event);
    if (set) {
      for (const cb of set) {
        try {
          cb(payload);
        } catch (err) {
          console.error('Event handler error', err);
        }
      }
    }
  }
}

export const Events = {
  FRAME_TICK: 'FRAME_TICK',
  PAUSE_GAME: 'PAUSE_GAME',
  RESUME_GAME: 'RESUME_GAME',
  ASSET_LOADED: 'ASSET_LOADED',
  ASSETS_COMPLETE: 'ASSETS_COMPLETE',
  LESSON_COMPLETED: 'LESSON_COMPLETED',
  QUIZ_COMPLETED: 'QUIZ_COMPLETED',
  QUIZ_STARTED: 'QUIZ_STARTED',
  DIALOGUE_STARTED: 'DIALOGUE_STARTED',
  DIALOGUE_FINISHED: 'DIALOGUE_FINISHED',
  AREA_ENTERED: 'AREA_ENTERED',
  PLAYER_ENTER_WARP: 'PLAYER_ENTER_WARP',
  PLAYER_MOVED: 'PLAYER_MOVED',
  VOCABULARY_LEARNED: 'VOCABULARY_LEARNED',
  LEVEL_UP: 'LEVEL_UP',
  QUIZ_TRIGGER: 'QUIZ_TRIGGER',
  INPUT_DIRECTION_DOWN: 'INPUT_DIRECTION_DOWN',
  INPUT_DIRECTION_UP: 'INPUT_DIRECTION_UP',
  INPUT_ACTION_PRESS: 'INPUT_ACTION_PRESS',
  INPUT_ACTION_RELEASE: 'INPUT_ACTION_RELEASE',
  INPUT_CANCEL_PRESS: 'INPUT_CANCEL_PRESS',
  INPUT_CANCEL_RELEASE: 'INPUT_CANCEL_RELEASE'
};

const instance = new EventManager();
export default instance;
