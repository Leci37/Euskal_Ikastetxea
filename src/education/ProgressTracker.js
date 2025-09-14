import SaveManager from '../core/SaveManager.js';
import EventManager, { Events } from '../events/EventManager.js';
import GameState from '../state/GameState.js';

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const XP_PER_LEVEL = 200; // simple progression curve
const SAVE_SLOT = 0;

/**
 * Tracks the player's learning progress and persists it.
 */
class ProgressTracker {
  constructor() {
    const saved = SaveManager.load(SAVE_SLOT) || {};
    const data = saved.progress || {};
    this.xp = data.xp || 0;
    this.level = data.level || 'A1';
    this.completedLessons = new Set(data.completedLessons || []);
    this.knownVocab = new Set(data.knownVocab || []);

    EventManager.subscribe(Events.LESSON_COMPLETED, (e) => this._onLessonCompleted(e));
    EventManager.subscribe(Events.QUIZ_COMPLETED, (e) => this._onQuizCompleted(e));

    GameState.update({ progress: { xp: this.xp, level: this.level } });
  }

  _onLessonCompleted({ lessonId, xp = 20, vocab = [] }) {
    this.completedLessons.add(lessonId);
    vocab.forEach((w) => this.knownVocab.add(w));
    this.addXP(xp);
    this.persist();
  }

  _onQuizCompleted({ quizId, xp = 50 }) {
    this.addXP(xp);
    this.persist();
  }

  addXP(amount) {
    this.xp += amount;
    const currentIndex = LEVELS.indexOf(this.level);
    const threshold = (currentIndex + 1) * XP_PER_LEVEL;
    if (currentIndex < LEVELS.length - 1 && this.xp >= threshold) {
      this.level = LEVELS[currentIndex + 1];
      EventManager.emit(Events.LEVEL_UP, { level: this.level });
    }

    GameState.update({ progress: { xp: this.xp, level: this.level } });
  }

  persist() {
    const existing = SaveManager.load(SAVE_SLOT) || {};
    const progress = {
      xp: this.xp,
      level: this.level,
      completedLessons: [...this.completedLessons],
      knownVocab: [...this.knownVocab],
    };
    SaveManager.save(SAVE_SLOT, { ...existing, progress });
  }
}

export default new ProgressTracker();
