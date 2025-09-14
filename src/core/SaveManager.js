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
      const json = JSON.stringify(payload);
      const encoded = btoa(unescape(encodeURIComponent(json)));
      localStorage.setItem(this._key(slotId), encoded);
    } catch (err) {
      console.error('Save failed', err);
    }
  }

  load(slotId) {
    try {
      const raw = localStorage.getItem(this._key(slotId));
      if (!raw) return null;
      const decoded = decodeURIComponent(escape(atob(raw)));
      const data = JSON.parse(decoded);
      if (data.version !== this.version || !this._validate(data.state)) {
        console.warn('Save validation failed');
        return null;
      }
      return this._sanitize(data.state);
    } catch (err) {
      console.error('Load failed', err);
      return null;
    }
  }

  hasSave(slotId) {
    return localStorage.getItem(this._key(slotId)) !== null;
  }

  _validate(state) {
    return state && typeof state === 'object';
  }

  _sanitize(obj) {
    if (typeof obj === 'string') {
      return obj.replace(/[&<>'"]/g, (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;',
      })[c]);
    }
    if (Array.isArray(obj)) return obj.map((v) => this._sanitize(v));
    if (obj && typeof obj === 'object') {
      const res = {};
      for (const [k, v] of Object.entries(obj)) res[k] = this._sanitize(v);
      return res;
    }
    return obj;
  }
}

const manager = new SaveManager();
export default manager;
export { SAVE_VERSION };
