import Scene from './Scene.js';
import SceneManager from './SceneManager.js';
import EventManager, { Events } from '../events/EventManager.js';
import QuizSystem from '../education/QuizSystem.js';

class VocabularyQuizScene extends Scene {
  constructor() {
    super();
    this.quizSystem = new QuizSystem();
    this.quiz = null;
    this.selectedIndex = 0;
    this.onAction = this.onAction.bind(this);
    this.onDirection = this.onDirection.bind(this);
  }

  onEnter(data) {
    if (data?.quizId) {
      this.quizSystem.startQuiz(data.quizId);
      this.quiz = this.quizSystem.active;
      this.selectedIndex = 0;
    }
    EventManager.subscribe(Events.INPUT_ACTION_PRESS, this.onAction);
    EventManager.subscribe(Events.INPUT_DIRECTION_DOWN, this.onDirection);
    EventManager.subscribe(Events.INPUT_DIRECTION_UP, this.onDirection);
  }

  onDirection(e) {
    if (!this.quiz) return;
    const q = this.quiz.questions[this.quiz.index];
    const max = q.options.length;
    if (e.direction === 'down') {
      this.selectedIndex = (this.selectedIndex + 1) % max;
    } else if (e.direction === 'up') {
      this.selectedIndex = (this.selectedIndex - 1 + max) % max;
    }
  }

  onAction() {
    const q = this.quiz?.questions[this.quiz.index];
    if (!q) return;
    this.quizSystem.submitAnswer(this.selectedIndex);
    if (!this.quizSystem.active) {
      this._cleanup();
      SceneManager.switchTo('Overworld');
    } else {
      this.selectedIndex = 0;
    }
  }

  _cleanup() {
    EventManager.unsubscribe(Events.INPUT_ACTION_PRESS, this.onAction);
    EventManager.unsubscribe(Events.INPUT_DIRECTION_DOWN, this.onDirection);
    EventManager.unsubscribe(Events.INPUT_DIRECTION_UP, this.onDirection);
  }

  onExit() {
    this._cleanup();
  }

  render(ctx) {
    if (!this.quiz) return;
    const q = this.quiz.questions[this.quiz.index];
    ctx.fillStyle = '#fff';
    ctx.fillText(q.question || '', 20, 40);
    q.options.forEach((opt, i) => {
      const prefix = i === this.selectedIndex ? '>' : ' ';
      ctx.fillText(`${prefix} ${opt}`, 40, 60 + i * 20);
    });
  }
}

export default VocabularyQuizScene;
