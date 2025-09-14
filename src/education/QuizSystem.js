import ContentDatabase from './ContentDatabase.js';
import EventManager, { Events } from '../events/EventManager.js';
import AudioManager from '../audio/AudioManager.js';

export default class QuizSystem {
  constructor() {
    this.active = null;
    this.score = 0;
  }

  startQuiz(id) {
    this.active = ContentDatabase.getQuiz(id);
    this.score = 0;
    EventManager.emit(Events.QUIZ_STARTED, id);
  }

  submitAnswer(answer) {
    const q = this.active.questions[this.active.index];
    if (q.correct === answer) this.score += 10;
    if (q.audio) AudioManager.playEuskeraWord(q.audio);
    this.active.index++;
    if (this.active.index >= this.active.questions.length) {
      this.endQuiz();
    }
  }

  endQuiz() {
    EventManager.emit(Events.QUIZ_COMPLETED, { score: this.score });
    this.active = null;
  }
}
