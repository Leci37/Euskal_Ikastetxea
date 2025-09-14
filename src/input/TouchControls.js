import EventManager, { Events } from '../events/EventManager.js';

class TouchControls {
  constructor() {
    this.enabled = 'ontouchstart' in window;
    if (!this.enabled) return;
    this.root = document.createElement('div');
    this.root.id = 'touch-controls';
    document.body.appendChild(this.root);
    this.root.addEventListener('touchstart', e => this.handle(e));
  }

  handle(e) {
    const dir = e.target.dataset.dir;
    if (dir) {
      EventManager.emit('TOUCH_DIR', dir);
    }
    if (e.target.dataset.action === 'hint') {
      EventManager.emit('HINT_REQUEST');
    }
  }
}

export default TouchControls;
