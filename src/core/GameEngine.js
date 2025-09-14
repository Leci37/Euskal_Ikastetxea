import EventManager, { Events } from '../events/EventManager.js';
import SceneManager from '../scenes/SceneManager.js';
import InputHandler from './InputHandler.js';
import AssetLoader from './AssetLoader.js';
import { scaleCanvas } from '../utils/ResponsiveScaler.js';

export default class GameEngine {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 240;
    this.canvas.height = 160;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    scaleCanvas(this.canvas);
    window.addEventListener('resize', () => scaleCanvas(this.canvas));

    this.sceneManager = SceneManager;
    this.input = InputHandler;
    this.assets = AssetLoader;

    this.lastTime = 0;
    this.running = false;
    this._frameId = null;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.input.start();
    this.lastTime = performance.now();

    const loop = (time) => {
      if (!this.running) return;
      const dt = (time - this.lastTime) / 1000;
      this.update(dt);
      this.render();
      EventManager.emit(Events.FRAME_TICK, { dt });
      this.lastTime = time;
      this._frameId = requestAnimationFrame(loop);
    };

    this._frameId = requestAnimationFrame(loop);
  }

  stop() {
    this.running = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
    this.input.stop();
  }

  update(dt) {
    this.sceneManager.update(dt);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sceneManager.render(this.ctx);
  }
}
