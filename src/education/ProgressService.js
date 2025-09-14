import SaveManager from '../core/SaveManager.js';
import EventManager, { Events } from '../events/EventManager.js';
import ProgressModel from './ProgressModel.js';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const XP_PER_LEVEL = 200;
const SAVE_SLOT = 0;

/**
 * Service layer that encapsulates progress business logic.
 */
class ProgressService {
  constructor() {
    const saved = SaveManager.load(SAVE_SLOT) || {};
    this.progress = new ProgressModel(saved.progress);

    EventManager.subscribe(Events.LESSON_COMPLETED, (e) => this._onLessonCompleted(e));
    EventManager.subscribe(Events.QUIZ_COMPLETED, (e) => this._onQuizCompleted(e));
  }

  get data() {
    return this.progress;
  }

  _onLessonCompleted({ lesson, xp = 20, vocab = [] }) {
    this.progress.completedLessons.add(lesson);
    vocab.forEach((w) => this.progress.knownVocab.add(w));
    this.addXP(xp);
    this.persist();
  }

  _onQuizCompleted({ score }) {
    this.addXP(score);
    this.persist();
  }

  addXP(amount) {
    this.progress.xp += amount;
    const currentIndex = LEVELS.indexOf(this.progress.level);
    const threshold = (currentIndex + 1) * XP_PER_LEVEL;
    if (currentIndex < LEVELS.length - 1 && this.progress.xp >= threshold) {
      this.progress.level = LEVELS[currentIndex + 1];
      EventManager.emit(Events.LEVEL_UP, { level: this.progress.level });
    }
  }

  persist() {
    const existing = SaveManager.load(SAVE_SLOT) || {};
    SaveManager.save(SAVE_SLOT, { ...existing, progress: this.progress.toJSON() });
  }
}

export default new ProgressService();

