import ProgressTracker from '../education/ProgressTracker.js';
import SaveManager from '../core/SaveManager.js';
import EventManager, { Events } from '../events/EventManager.js';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const XP_PER_LEVEL = 200;
const SAVE_SLOT = 0;

/**
 * Service layer encapsulating progress business rules.
 */
class ProgressService {
  constructor() {
    const saved = SaveManager.load(SAVE_SLOT) || {};
    this.state = new ProgressTracker(saved.progress || {});

    EventManager.subscribe(Events.LESSON_COMPLETED, (e) => this._onLessonCompleted(e));
    EventManager.subscribe(Events.QUIZ_COMPLETED, (e) => this._onQuizCompleted(e));
  }

  getState() {
    return this.state;
  }

  _onLessonCompleted({ lessonId, xp = 20, vocab = [] }) {
    if (lessonId) this.state.completedLessons.add(lessonId);
    vocab.forEach((w) => this.state.knownVocab.add(w));
    this.addXP(xp);
    this.persist();
  }

  _onQuizCompleted({ xp = 50 }) {
    this.addXP(xp);
    this.persist();
  }

  addXP(amount) {
    this.state.xp += amount;
    const currentIndex = LEVELS.indexOf(this.state.level);
    const threshold = (currentIndex + 1) * XP_PER_LEVEL;
    if (currentIndex < LEVELS.length - 1 && this.state.xp >= threshold) {
      this.state.level = LEVELS[currentIndex + 1];
      EventManager.emit(Events.LEVEL_UP, { level: this.state.level });
    }
  }

  persist() {
    const existing = SaveManager.load(SAVE_SLOT) || {};
    SaveManager.save(SAVE_SLOT, { ...existing, progress: this.state.serialize() });
  }
}

export default new ProgressService();
