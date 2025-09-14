import EventManager, { Events } from '../events/EventManager.js';
import MapManager from './MapManager.js';
import SceneManager from '../scenes/SceneManager.js';

class TransitionManager {
  constructor() {
    EventManager.subscribe(Events.PLAYER_ENTER_WARP, warp => this.handleWarp(warp));
  }

  fade(cb) {
    // simplistic fade using CSS class
    cb();
  }

  handleWarp(warp) {
    this.fade(() => {
      MapManager.load(warp.target, warp.map).then(() => {
        if (warp.scene) SceneManager.switchTo(warp.scene, warp.data);
      });
    });
  }
}

const manager = new TransitionManager();
export default manager;
