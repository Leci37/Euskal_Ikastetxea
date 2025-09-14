import MapManager from './MapManager.js';

class TileEngine {
  constructor(ctx) {
    this.ctx = ctx;
    this.camera = { x: 0, y: 0 };
  }

  drawLayer(layer) {
    const tileSize = 16;
    const tileset = MapManager.current.tilesets[0];
    const image = document.createElement('img');
    image.src = tileset.image; // assume loaded elsewhere
    const cols = tileset.columns;
    for (let y = 0; y < layer.height; y++) {
      for (let x = 0; x < layer.width; x++) {
        const index = y * layer.width + x;
        const id = layer.data[index];
        if (id === 0) continue;
        const sx = ((id - 1) % cols) * tileSize;
        const sy = Math.floor((id - 1) / cols) * tileSize;
        this.ctx.drawImage(image, sx, sy, tileSize, tileSize, x * tileSize - this.camera.x, y * tileSize - this.camera.y, tileSize, tileSize);
      }
    }
  }

  render() {
    MapManager.current.layers?.filter(l => l.type === 'tilelayer').forEach(l => this.drawLayer(l));
  }

  centerOn(x, y) {
    this.camera.x = x - 120; // half of 240
    this.camera.y = y - 80;  // half of 160
  }
}

export default TileEngine;
