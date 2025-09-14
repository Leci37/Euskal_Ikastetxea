/**
 * Represents the player's persistent progress state.
 */
class ProgressTracker {
  constructor(data = {}) {
    this.xp = data.xp || 0;
    this.level = data.level || 'A1';
    this.completedLessons = new Set(data.completedLessons || []);
    this.knownVocab = new Set(data.knownVocab || []);
  }

  /**
   * Convert internal state to a plain object for saving.
   */
  serialize() {
    return {
      xp: this.xp,
      level: this.level,
      completedLessons: [...this.completedLessons],
      knownVocab: [...this.knownVocab],
    };
  }
}

export default ProgressTracker;
