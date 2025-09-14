import MapManager from './MapManager.js';

// Handles tile-based collision detection using a dedicated layer.
class CollisionSystem {
  /**
   * Check whether the target grid coordinates are blocked.
   * @param {number} targetGridX
   * @param {number} targetGridY
   * @returns {boolean}
   */
  checkCollision(targetGridX, targetGridY) {
    const map = MapManager.current;
    if (!map) return false;
    const layer = map.layers?.find(l => l.name === 'Collision');
    if (!layer) return false;

    const index = targetGridY * layer.width + targetGridX;
    const tileId = layer.data[index];
    return tileId > 0; // any tile id > 0 is impassable
  }

  /**
   * Resolve movement by checking the target tile. Returns the new position
   * if walkable otherwise the original position.
   * @param {{x:number, y:number}} currentPos grid coordinates
   * @param {{x:number, y:number}} direction delta movement
   */
  resolveMovement(currentPos, direction) {
    const target = {
      x: currentPos.x + direction.x,
      y: currentPos.y + direction.y,
    };
    if (this.checkCollision(target.x, target.y)) {
      return currentPos; // blocked, stay in place
    }
    return target;
  }
}

export default new CollisionSystem();
