// Decoupled message bus for communicating across systems
class EventManager {
  constructor() {
    this.listeners = new Map();
  }

  /**
   * Register a callback for a specific event type.
   * @param {string} eventType
   * @param {Function} callback
   */
  subscribe(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
  }

  /**
   * Remove a previously registered callback.
   * @param {string} eventType
   * @param {Function} callback
   */
  unsubscribe(eventType, callback) {
    const set = this.listeners.get(eventType);
    if (set) {
      set.delete(callback);
      if (set.size === 0) this.listeners.delete(eventType);
    }
  }

  /**
   * Broadcast an event to all subscribers.
   * @param {string} eventType
   * @param {*} data
   */
  emit(eventType, data) {
    const set = this.listeners.get(eventType);
    if (!set) return;
    for (const cb of set) {
      try {
        cb(data);
      } catch (err) {
        console.error('Event handler error', err);
      }
    }
  }
}

// Enumeration of all possible event types in the game.
EventManager.Events = {
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
  INPUT_CANCEL_RELEASE: 'INPUT_CANCEL_RELEASE',
};

const instance = new EventManager();
export const Events = EventManager.Events;
export default instance;
