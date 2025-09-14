import AssetLoader from '../core/AssetLoader.js';

/**
 * Centralized in-memory store for vocabulary, dialogues and quizzes.
 */
class ContentDatabase {
  constructor() {
    this.vocab = new Map(); // level -> words[]
    this.dialogues = new Map(); // key -> script
    this.quizzes = new Map(); // id -> quiz data
  }

  /**
   * Load multiple JSON files into the database.
   * @param {Array<{type:string,key:string,src:string}>} manifest
   */
  async load(manifest = []) {
    const paths = manifest.map((m) => m.src);
    const jsons = await AssetLoader.loadJSON(paths);
    manifest.forEach((m, i) => {
      const data = jsons[i];
      switch (m.type) {
        case 'vocabulary':
          Object.entries(data).forEach(([level, words]) => {
            this.vocab.set(level, words);
          });
          break;
        case 'dialogue':
          this.dialogues.set(m.key, data);
          break;
        case 'quiz':
          this.quizzes.set(m.key, data);
          break;
        default:
          break;
      }
    });
  }

  /** Retrieve vocabulary for a CEFR level (A1-C2). */
  getVocabularyByLevel(level) {
    return this.vocab.get(level) || [];
  }

  /** Fetch a dialogue script by key. */
  getDialogue(dialogueKey) {
    return this.dialogues.get(dialogueKey) || null;
  }

  /** Fetch quiz data by id. */
  getQuiz(quizId) {
    return this.quizzes.get(quizId) || null;
  }
}

export default new ContentDatabase();
