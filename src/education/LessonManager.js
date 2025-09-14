import EventManager, { Events } from '../events/EventManager.js';
import ContentDatabase from './ContentDatabase.js';

class LessonManager {
  constructor() {
    this.active = null;
  }

  startLesson(id) {
    this.active = ContentDatabase.getVocabulary(id);
  }

  completeLesson(id) {
    EventManager.emit(Events.LESSON_COMPLETED, { lesson: id });
    this.active = null;
  }

  getAvailableLessons() {
    return Object.keys(ContentDatabase.data.vocab || {});
  }
}

const manager = new LessonManager();
export default manager;
