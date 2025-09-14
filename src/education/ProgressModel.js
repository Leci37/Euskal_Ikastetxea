/**
 * Plain data model representing player progress.
 */
class ProgressModel {
  constructor({ xp = 0, level = 'A1', completedLessons = [], knownVocab = [] } = {}) {
    this.xp = xp;
    this.level = level;
    this.completedLessons = new Set(completedLessons);
    this.knownVocab = new Set(knownVocab);
  }

  toJSON() {
    return {
      xp: this.xp,
      level: this.level,
      completedLessons: [...this.completedLessons],
      knownVocab: [...this.knownVocab],
    };
  }
}

export default ProgressModel;

