import EventManager, { Events } from '../events/EventManager.js';

/**
 * Runs the main update/render loop and handles pause/resume.
 */
export default class GameLoop {
  constructor(update, render) {
    this.update = update;
    this.render = render;
    this.running = false;
    this.lastTime = 0;
    this._frameId = null;
    this._boundLoop = this._loop.bind(this);

    EventManager.subscribe(Events.PAUSE_GAME, () => this.pause());
    EventManager.subscribe(Events.RESUME_GAME, () => this.resume());
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._frameId = requestAnimationFrame(this._boundLoop);
  }

  stop() {
    this.pause();
  }

  _loop(time) {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;

    this.update(dt);
    this.render();
    EventManager.emit(Events.FRAME_TICK, { dt });

    this.lastTime = time;
    this._frameId = requestAnimationFrame(this._boundLoop);
  }

  pause() {
    if (!this.running) return;
    this.running = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
  }

  resume() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._frameId = requestAnimationFrame(this._boundLoop);
  }
}
