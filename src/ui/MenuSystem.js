import EventManager from '../events/EventManager.js';
import StateManager, { States } from '../state/StateManager.js';
import ProgressTracker from '../education/ProgressTracker.js';

class MenuSystem {
  constructor() {
    this.activeMenu = null;
  }

  open(menu) {
    this.activeMenu = menu;
    StateManager.pushState(States.MENU);
  }

  close() {
    this.activeMenu = null;
    StateManager.popState();
  }

  render(ctx) {
    if (!this.activeMenu) return;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 240, 160);
    ctx.fillStyle = '#fff';
    if (this.activeMenu === 'Progress') {
      ctx.fillText('Level: ' + ProgressTracker.data.level, 20, 20);
    } else {
      ctx.fillText(this.activeMenu, 20, 20);
    }
  }
}

const menu = new MenuSystem();
export default menu;
