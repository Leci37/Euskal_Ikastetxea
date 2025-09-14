const SAVE_VERSION = 1;

class SaveManager {
  constructor() {
    this.version = SAVE_VERSION;
  }

  _key(slotId) {
    return `euskal_save_${slotId}`;
  }

  save(slotId, gameState) {
    try {
      const payload = { version: this.version, state: gameState };
      const encoded = btoa(JSON.stringify(payload));
      localStorage.setItem(this._key(slotId), encoded);
    } catch (err) {
      console.error('Save failed', err);
    }
  }

  load(slotId) {
    try {
      const raw = localStorage.getItem(this._key(slotId));
      if (!raw) return null;
      const decoded = atob(raw);
      const data = JSON.parse(decoded);
      if (typeof data !== 'object' || data === null) return null;
      if (data.version !== this.version) {
        console.warn('Save version mismatch', data.version, this.version);
        return null;
      }
      if (typeof data.state !== 'object' || data.state === null) {
        console.warn('Invalid save data');
        return null;
      }
      return data.state;
    } catch (err) {
      console.error('Load failed', err);
      return null;
    }
  }

  hasSave(slotId) {
    return localStorage.getItem(this._key(slotId)) !== null;
  }
}

const manager = new SaveManager();
export default manager;
export { SAVE_VERSION };
