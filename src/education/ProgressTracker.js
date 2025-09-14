import SaveManager from '../core/SaveManager.js';
import EventManager, { Events } from '../events/EventManager.js';

class ProgressTracker {
  constructor() {
    this.data = { xp: 0, level: 1, lessons: [], vocab: [] };
    const saved = SaveManager.loadGame();
    if (saved?.progress) this.data = saved.progress;
    EventManager.subscribe(Events.LESSON_COMPLETED, e => this.recordLesson(e.lesson));
    EventManager.subscribe(Events.QUIZ_COMPLETED, e => this.addXP(e.score));
  }

  recordLesson(id) {
    if (!this.data.lessons.includes(id)) this.data.lessons.push(id);
    this.persist();
  }

  addXP(xp) {
    this.data.xp += xp;
    if (this.data.xp > this.data.level * 100) {
      this.data.level++;
      EventManager.emit(Events.LEVEL_UP, { level: this.data.level });
    }
    this.persist();
  }

  persist() {
    const save = SaveManager.loadGame() || {};
    save.progress = this.data;
    SaveManager.saveGame(save);
  }
}

const tracker = new ProgressTracker();
export default tracker;
