// @ts-check

// Decoupled message bus for communicating across systems

/** @enum {string} */
export const Events = Object.freeze({
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
});

/** @typedef {typeof Events[keyof typeof Events]} EventType */

/**
 * @typedef {Object} EventPayloads
 * @property {{ dt: number }} FRAME_TICK
 * @property {undefined} PAUSE_GAME
 * @property {undefined} RESUME_GAME
 * @property {{ asset: string }} ASSET_LOADED
 * @property {undefined} ASSETS_COMPLETE
 * @property {{ lesson: string }} LESSON_COMPLETED
 * @property {{ score: number }} QUIZ_COMPLETED
 * @property {{ id: string }} QUIZ_STARTED
 * @property {{ id: string }} DIALOGUE_STARTED
 * @property {{ id: string }} DIALOGUE_FINISHED
 * @property {{ area: string }} AREA_ENTERED
 * @property {any} PLAYER_ENTER_WARP
 * @property {{ pos: { x: number, y: number } }} PLAYER_MOVED
 * @property {{ word: string }} VOCABULARY_LEARNED
 * @property {{ level: number }} LEVEL_UP
 * @property {any} QUIZ_TRIGGER
 * @property {{ direction: string }} INPUT_DIRECTION_DOWN
 * @property {{ direction: string }} INPUT_DIRECTION_UP
 * @property {undefined} INPUT_ACTION_PRESS
 * @property {undefined} INPUT_ACTION_RELEASE
 * @property {undefined} INPUT_CANCEL_PRESS
 * @property {undefined} INPUT_CANCEL_RELEASE
 */

class EventManager {
  constructor() {
    /** @type {Map<EventType, Set<(data: any) => void>>} */
    this.listeners = new Map();
    /** @type {WeakMap<Function, number>} */
    this.errorCounts = new WeakMap();
    this.errorThreshold = 3;
  }

  /**
   * Register a callback for a specific event type.
   * @template {EventType} K
   * @param {K} eventType
   * @param {(payload: EventPayloads[K]) => void} callback
   */
  subscribe(eventType, callback) {
    if (!(eventType in Events)) {
      throw new Error(`Unknown event: ${eventType}`);
    }
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, new Set());
    }
    this.listeners.get(eventType).add(callback);
  }

  /**
   * Remove a previously registered callback.
   * @template {EventType} K
   * @param {K} eventType
   * @param {(payload: EventPayloads[K]) => void} callback
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
   * @template {EventType} K
   * @param {K} eventType
   * @param {EventPayloads[K]} [data]
   */
  emit(eventType, data) {
    if (!(eventType in Events)) {
      throw new Error(`Unknown event: ${eventType}`);
    }
    const set = this.listeners.get(eventType);
    if (!set) return;
    for (const cb of set) {
      try {
        cb(data);
        this.errorCounts.delete(cb);
      } catch (err) {
        const count = (this.errorCounts.get(cb) || 0) + 1;
        this.errorCounts.set(cb, count);
        console.error('Event handler error', err);
        if (count >= this.errorThreshold) {
          console.warn(`Listener removed after ${count} errors for ${eventType}`);
          set.delete(cb);
        }
      }
    }
  }
}

const instance = new EventManager();
export default instance;

