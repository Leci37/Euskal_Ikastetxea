// Centralized game state store for cross-system coordination.
// Provides a single source of truth for debugging, save/load,
// and runtime synchronization.
class GameState {
  constructor() {
    this.state = {};
    this.listeners = new Set();
  }

  /** Subscribe to state changes. */
  subscribe(cb) {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  }

  /** Retrieve a shallow copy of the current state. */
  snapshot() {
    return { ...this.state };
  }

  /** Merge partial state and notify subscribers. */
  update(partial) {
    Object.assign(this.state, partial);
    for (const cb of this.listeners) {
      try {
        cb(this.snapshot());
      } catch (err) {
        console.error('State listener error', err);
      }
    }
  }
}

const instance = new GameState();
export default instance;
