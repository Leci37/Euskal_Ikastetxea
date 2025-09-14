import EventManager, { Events } from '../events/EventManager.js';

const STORAGE_KEY = 'euskal_save';

class SaveManager {
  constructor() {
    EventManager.subscribe(Events.LESSON_COMPLETED, () => this.autoSave());
    EventManager.subscribe(Events.QUIZ_COMPLETED, () => this.autoSave());
  }

  saveGame(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Save failed', e);
    }
  }

  loadGame() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      console.error('Load failed', e);
      return null;
    }
  }

  deleteSave() {
    localStorage.removeItem(STORAGE_KEY);
  }

  autoSave() {
    const current = this.loadGame() || {};
    this.saveGame(current);
  }
}

const instance = new SaveManager();
export default instance;
