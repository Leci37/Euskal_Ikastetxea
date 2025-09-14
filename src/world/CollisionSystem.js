import MapManager from './MapManager.js';
import EventManager, { Events } from '../events/EventManager.js';

class CollisionSystem {
  checkCollision(x, y) {
    const layer = MapManager.current.layers?.find(l => l.name === 'Collision');
    if (!layer) return false;
    const tile = MapManager.getTile(x, y, 'Collision');
    return tile !== 0;
  }

  resolveMovement(pos, dir) {
    const nx = pos.x + dir.x;
    const ny = pos.y + dir.y;
    if (this.checkCollision(nx, ny)) return pos;
    return { x: nx, y: ny };
  }
}

const system = new CollisionSystem();
export default system;
