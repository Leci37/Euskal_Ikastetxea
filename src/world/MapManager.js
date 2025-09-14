import AssetLoader from '../core/AssetLoader.js';
import EventManager, { Events } from '../events/EventManager.js';
import GameState from '../state/GameState.js';

class MapManager {
  constructor() {
    this.current = null;
    this.warps = [];
  }

  load(name, src) {
    return AssetLoader.loadJSON(name, src).then(data => {
      this.current = data;
      this.warps = data.layers?.find(l => l.name === 'Warps')?.objects || [];
      EventManager.emit(Events.AREA_ENTERED, { area: name });
      GameState.update({ map: { name } });
      return data;
    });
  }

  getTile(x, y, layerName) {
    const layer = this.current.layers?.find(l => l.name === layerName);
    if (!layer) return 0;
    const index = y * layer.width + x;
    return layer.data[index];
  }
}

const manager = new MapManager();
export default manager;
