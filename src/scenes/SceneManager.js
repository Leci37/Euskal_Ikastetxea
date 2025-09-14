import EventManager, { Events } from '../events/EventManager.js';
import TransitionManager from '../world/TransitionManager.js';

class SceneManager {
  constructor() {
    this.scenes = new Map();
    this.active = null;
  }

  registerScene(name, scene) {
    this.scenes.set(name, scene);
  }

  switchTo(name, data) {
    const next = this.scenes.get(name);
    if (!next) throw new Error('Scene not found: ' + name);
    if (this.active && this.active.onExit) this.active.onExit();
    this.active = new next(data);
    if (this.active.onEnter) this.active.onEnter(data);
  }

  update(dt) {
    this.active?.update?.(dt);
  }

  render(ctx) {
    this.active?.render?.(ctx);
  }
}

const manager = new SceneManager();
export default manager;
