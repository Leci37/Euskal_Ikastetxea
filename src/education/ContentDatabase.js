import AssetLoader from '../core/AssetLoader.js';
import EventManager, { Events } from '../events/EventManager.js';

class ContentDatabase {
  constructor() {
    this.data = {};
  }

  async load(manifest) {
    const promises = manifest.map(m => AssetLoader.loadJSON(m.key, m.src));
    await Promise.all(promises);
    manifest.forEach(m => {
      this.data[m.key] = AssetLoader.getJSON(m.key);
    });
    EventManager.emit('CONTENT_LOADED');
  }

  getVocabulary(topic) {
    return this.data.vocab?.[topic] || [];
  }

  getDialogue(id) {
    return this.data.dialogues?.[id] || null;
  }

  getQuiz(id) {
    return this.data.quizzes?.[id] || null;
  }
}

const db = new ContentDatabase();
export default db;
