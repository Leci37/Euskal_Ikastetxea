import EventManager, { Events } from '../events/EventManager.js';
import ProgressService from '../education/ProgressService.js';

class HUD {
  constructor() {
    this.lesson = '';
    EventManager.subscribe(Events.LESSON_COMPLETED, e => this.lesson = '');
    EventManager.subscribe(Events.VOCABULARY_LEARNED, e => this.lesson = e.word);
  }

  render(ctx) {
    // Basque flag inspired banner
    ctx.save();
    const w = 70;
    ctx.fillStyle = '#d50000'; // red
    ctx.fillRect(2, 2, w, 6);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(2, 8, w, 6);
    ctx.fillStyle = '#007a3d'; // green
    ctx.fillRect(2, 14, w, 6);

    ctx.fillStyle = '#000';
    ctx.font = '10px monospace';
    ctx.fillText('XP: ' + ProgressService.data.xp, 5, 28);
    if (this.lesson) ctx.fillText('Word: ' + this.lesson, 5, 38);
    ctx.restore();
  }
}

const hud = new HUD();
export default hud;
