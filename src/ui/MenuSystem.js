import EventManager from '../events/EventManager.js';
import StateManager, { States } from '../state/StateManager.js';
import ProgressService from '../services/ProgressService.js';

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
      const { level } = ProgressService.getState();
      ctx.fillText('Level: ' + level, 20, 20);
    } else {
      ctx.fillText(this.activeMenu, 20, 20);
    }
  }
}

const menu = new MenuSystem();
export default menu;
