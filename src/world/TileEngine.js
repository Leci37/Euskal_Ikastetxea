import MapManager from './MapManager.js';
import AssetLoader from '../core/AssetLoader.js';

class TileEngine {
  constructor(ctx, tileSize = 16) {
    this.ctx = ctx;
    this.tileSize = tileSize;
    this.camera = { x: 0, y: 0 };
    this.viewport = {
      width: ctx.canvas?.width || 0,
      height: ctx.canvas?.height || 0,
    };
  }

  updateViewport(width, height) {
    this.viewport.width = width;
    this.viewport.height = height;
  }

  drawLayer(layer, tilesetImage, tileset) {
    if (!tilesetImage) return; // Don't draw if the image isn't ready

    const cols = tileset.columns;
    const startCol = Math.max(Math.floor(this.camera.x / this.tileSize), 0);
    const endCol = Math.min(
      Math.ceil((this.camera.x + this.viewport.width) / this.tileSize),
      layer.width
    );
    const startRow = Math.max(Math.floor(this.camera.y / this.tileSize), 0);
    const endRow = Math.min(
      Math.ceil((this.camera.y + this.viewport.height) / this.tileSize),
      layer.height
    );

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const index = y * layer.width + x;
        const id = layer.data[index];
        if (id === 0) continue;

        // Calculate source position from the tileset image
        const sx = ((id - 1) % cols) * this.tileSize;
        const sy = Math.floor((id - 1) / cols) * this.tileSize;

        this.ctx.drawImage(
          tilesetImage,
          sx,
          sy,
          this.tileSize,
          this.tileSize,
          Math.floor(x * this.tileSize - this.camera.x),
          Math.floor(y * this.tileSize - this.camera.y),
          this.tileSize,
          this.tileSize
        );
      }
    }
  }

  render() {
    const map = MapManager.current;
    if (!map || !map.tilesets || map.tilesets.length === 0) return;

    const tileset = map.tilesets[0];
    const tilesetPath = `public/assets/tilesets/${tileset.image}`;
    const tilesetImage = AssetLoader.getImage(tilesetPath);

    // Render tile layers using the actual tileset
    const tileLayers = map.layers?.filter(
      (l) => l.type === 'tilelayer' && l.name !== 'Collision'
    );
    tileLayers.forEach((layer) => this.drawLayer(layer, tilesetImage, tileset));
  }

  centerOn(x, y) {
    this.camera.x = x - this.viewport.width / 2;
    this.camera.y = y - this.viewport.height / 2;
  }
}

export default TileEngine;
