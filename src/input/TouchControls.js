import EventManager, { Events } from '../events/EventManager.js';

/**
 * On-screen virtual controls for touch devices.
 */
class TouchControls {
  constructor() {
    if (!('ontouchstart' in window)) {
      this.enabled = false;
      return;
    }
    this.enabled = true;
    this.root = document.createElement('div');
    this.root.id = 'touch-controls';
    this.root.style.position = 'absolute';
    this.root.style.left = '0';
    this.root.style.top = '0';
    this.root.style.right = '0';
    this.root.style.bottom = '0';
    this.root.style.pointerEvents = 'none';
    document.body.appendChild(this.root);

    this._createDPad();
    this._createButtons();
    this._setupGestures();
  }

  _createButton(label, onStart, onEnd) {
    const btn = document.createElement('div');
    btn.textContent = label;
    btn.style.pointerEvents = 'auto';
    btn.style.width = '12vw';
    btn.style.height = '12vw';
    btn.style.margin = '5px';
    btn.style.border = '2px solid #666';
    btn.style.borderRadius = '8px';
    btn.style.display = 'flex';
    btn.style.alignItems = 'center';
    btn.style.justifyContent = 'center';
    btn.style.background = 'rgba(255,255,255,0.3)';
    btn.style.userSelect = 'none';
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      onStart();
      if (navigator.vibrate) navigator.vibrate(20);
    });
    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      onEnd();
    });
    return btn;
  }

  _createDPad() {
    const pad = document.createElement('div');
    pad.style.position = 'absolute';
    pad.style.left = '20px';
    pad.style.bottom = '20px';
    const up = this._createButton('▲', () => this._emitDir('up', true), () => this._emitDir('up', false));
    const down = this._createButton('▼', () => this._emitDir('down', true), () => this._emitDir('down', false));
    const left = this._createButton('◀', () => this._emitDir('left', true), () => this._emitDir('left', false));
    const right = this._createButton('▶', () => this._emitDir('right', true), () => this._emitDir('right', false));

    const row1 = document.createElement('div');
    row1.appendChild(up);
    const row2 = document.createElement('div');
    row2.appendChild(left);
    row2.appendChild(down);
    row2.appendChild(right);
    pad.appendChild(row1);
    pad.appendChild(row2);
    pad.style.pointerEvents = 'none';
    row1.style.display = 'flex';
    row2.style.display = 'flex';
    this.root.appendChild(pad);
  }

  _createButtons() {
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.right = '20px';
    container.style.bottom = '20px';
    const a = this._createButton('A', () => EventManager.emit(Events.INPUT_ACTION_PRESS), () => EventManager.emit(Events.INPUT_ACTION_RELEASE));
    const b = this._createButton('B', () => EventManager.emit(Events.INPUT_CANCEL_PRESS), () => EventManager.emit(Events.INPUT_CANCEL_RELEASE));
    container.appendChild(a);
    container.appendChild(b);
    container.style.display = 'flex';
    container.style.pointerEvents = 'none';
    this.root.appendChild(container);
  }

  _emitDir(dir, down) {
    EventManager.emit(down ? Events.INPUT_DIRECTION_DOWN : Events.INPUT_DIRECTION_UP, { direction: dir });
  }

  _setupGestures() {
    let startX = 0;
    let startY = 0;
    this._gestureStart = (e) => {
      const t = e.changedTouches[0];
      startX = t.clientX;
      startY = t.clientY;
    };
    this._gestureEnd = (e) => {
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      if (Math.max(absX, absY) > 30) {
        if (absX > absY) {
          const dir = dx > 0 ? 'right' : 'left';
          this._emitDir(dir, true);
          this._emitDir(dir, false);
        } else {
          const dir = dy > 0 ? 'down' : 'up';
          this._emitDir(dir, true);
          this._emitDir(dir, false);
        }
      }
    };
    window.addEventListener('touchstart', this._gestureStart, { passive: true });
    window.addEventListener('touchend', this._gestureEnd, { passive: true });
  }

  destroy() {
    if (!this.enabled) return;
    window.removeEventListener('touchstart', this._gestureStart);
    window.removeEventListener('touchend', this._gestureEnd);
    this.root.remove();
    this.enabled = false;
  }
}

export default TouchControls;
