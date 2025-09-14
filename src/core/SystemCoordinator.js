import SceneManager from '../scenes/SceneManager.js';
import InputHandler from './InputHandler.js';
import AssetPreloader from './AssetPreloader.js';
import CanvasRenderer from './CanvasRenderer.js';
import GameLoop from './GameLoop.js';

/**
 * Coordinates core systems and bootstraps the game.
 */
export default class SystemCoordinator {
  constructor() {
    this.renderer = new CanvasRenderer();
    this.sceneManager = SceneManager;
    this.input = InputHandler;
    this.assets = new AssetPreloader();

    this.loop = new GameLoop(
      (dt) => this.sceneManager.update(dt),
      () => {
        this.renderer.clear();
        this.sceneManager.render(this.renderer.getContext());
      },
    );
  }

  async start(manifest = {}) {
    await this.assets.load(manifest);
    this.input.start();
    this.loop.start();
  }

  stop() {
    this.loop.stop();
    this.input.stop();
  }
}
