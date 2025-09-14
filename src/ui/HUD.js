import EventManager, { Events } from '../events/EventManager.js';
import ProgressTracker from '../education/ProgressTracker.js';

class HUD {
  constructor() {
    this.lesson = '';
    EventManager.subscribe(Events.LESSON_COMPLETED, e => this.lesson = '');
    EventManager.subscribe(Events.VOCABULARY_LEARNED, e => this.lesson = e.word);
  }

  render(ctx) {
    ctx.fillStyle = '#fff';
    ctx.fillText('XP: ' + ProgressTracker.data.xp, 5, 10);
    if (this.lesson) ctx.fillText('Word: ' + this.lesson, 5, 20);
  }
}

const hud = new HUD();
export default hud;
