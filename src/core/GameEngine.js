import EventManager, { Events } from '../events/EventManager.js';
import AssetLoader from './AssetLoader.js';
import SaveManager from './SaveManager.js';
import SceneManager from '../scenes/SceneManager.js';
import { scaleCanvas } from '../utils/ResponsiveScaler.js';

const GRID_SIZE = 16;

export default class GameEngine {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = 240;
    this.canvas.height = 160;
    document.body.appendChild(this.canvas);
    scaleCanvas(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this.lastTime = 0;
    this.paused = false;

    EventManager.subscribe(Events.PAUSE_GAME, () => this.paused = true);
    EventManager.subscribe(Events.RESUME_GAME, () => this.paused = false);
    window.addEventListener('resize', () => scaleCanvas(this.canvas));
  }

  start(manifest) {
    AssetLoader.loadAll(manifest).then(() => {
      this.loop(0);
    });
  }

  loop(time) {
    requestAnimationFrame(t => this.loop(t));
    const dt = time - this.lastTime;
    if (!this.paused) {
      SceneManager.update(dt);
      SceneManager.render(this.ctx);
      EventManager.emit(Events.FRAME_TICK, { dt });
    }
    this.lastTime = time;
  }
}
