import EventManager, { Events } from '../events/EventManager.js';
import SceneManager from '../scenes/SceneManager.js';
import InputHandler from './InputHandler.js';
import AssetLoader from './AssetLoader.js';
import { scaleCanvas } from '../utils/ResponsiveScaler.js';

/**
 * Main game orchestrator. Handles the canvas, game loop and high level systems.
 */
export default class GameEngine {
  constructor() {
    // Base canvas configuration
    this.canvas = document.createElement('canvas');
    this.canvas.width = 240;
    this.canvas.height = 160;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Responsive scaling
    scaleCanvas(this.canvas);
    window.addEventListener('resize', () => scaleCanvas(this.canvas));

    // Core managers
    this.sceneManager = SceneManager;
    this.input = InputHandler;
    this.assets = AssetLoader;

    // Loop state
    this.running = false;
    this.lastTime = 0;
    this._frameId = null;
    this._boundLoop = this._loop.bind(this);

    // Pause / resume listeners
    EventManager.subscribe(Events.PAUSE_GAME, () => this.pause());
    EventManager.subscribe(Events.RESUME_GAME, () => this.resume());
  }

  /**
     * Load assets then start the main loop.
     * @param {Object} manifest { images: [], audio: [], json: [] }
     */
  async start(manifest = {}) {
    if (this.running) return;

    // Load all assets before starting
    await Promise.all([
      this.assets.loadImages(manifest.images || []),
      this.assets.loadAudio(manifest.audio || []),
      this.assets.loadJSON(manifest.json || []),
    ]);

    this.input.start();
    this.running = true;
    this.lastTime = performance.now();
    this._frameId = requestAnimationFrame(this._boundLoop);
  }

  /** Stop the game loop entirely */
  stop() {
    this.pause();
    this.input.stop();
  }

  /** Internal loop function */
  _loop(time) {
    if (!this.running) return;
    const dt = (time - this.lastTime) / 1000;

    this.update(dt);
    this.render();
    EventManager.emit(Events.FRAME_TICK, { dt });

    this.lastTime = time;
    this._frameId = requestAnimationFrame(this._boundLoop);
  }

  /** Pause the game loop */
  pause() {
    if (!this.running) return;
    this.running = false;
    if (this._frameId) {
      cancelAnimationFrame(this._frameId);
      this._frameId = null;
    }
  }

  /** Resume the game loop */
  resume() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this._frameId = requestAnimationFrame(this._boundLoop);
  }

  update(dt) {
    this.sceneManager.update(dt);
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.sceneManager.render(this.ctx);
  }
}

