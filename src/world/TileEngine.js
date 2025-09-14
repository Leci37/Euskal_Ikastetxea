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

  drawLayer(layer) {
    const tileSize = this.tileSize;
    const tileset = MapManager.current.tilesets[0];
    let image = AssetLoader.getImage(tileset.image);
    if (!image) {
      // Try to load actual image; if it fails create a placeholder tileset
      AssetLoader.loadImages([tileset.image])
        .catch(() => AssetLoader.generateTilesetPlaceholder(tileset));
      image = AssetLoader.getImage(tileset.image) || AssetLoader.generateTilesetPlaceholder(tileset);
    }

    const cols = tileset.columns;
    const startCol = Math.max(Math.floor(this.camera.x / tileSize), 0);
    const endCol = Math.min(Math.ceil((this.camera.x + this.viewport.width) / tileSize), layer.width);
    const startRow = Math.max(Math.floor(this.camera.y / tileSize), 0);
    const endRow = Math.min(Math.ceil((this.camera.y + this.viewport.height) / tileSize), layer.height);

    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const index = y * layer.width + x;
        const id = layer.data[index];
        if (id === 0) continue;
        const sx = ((id - 1) % cols) * tileSize;
        const sy = Math.floor((id - 1) / cols) * tileSize;
        this.ctx.drawImage(
          image,
          sx,
          sy,
          tileSize,
          tileSize,
          x * tileSize - this.camera.x,
          y * tileSize - this.camera.y,
          tileSize,
          tileSize,
        );
      }
    }
  }

  render() {
    MapManager.current.layers?.filter(l => l.type === 'tilelayer').forEach(l => this.drawLayer(l));
    this._drawCollisionDebug();
    this._drawGrid();
  }

  centerOn(x, y) {
    this.camera.x = x - this.viewport.width / 2;
    this.camera.y = y - this.viewport.height / 2;
  }

  _drawCollisionDebug() {
    const map = MapManager.current;
    const layer = map.layers?.find(l => l.name === 'Collision');
    if (!layer) return;
    const tileSize = this.tileSize;
    const startCol = Math.max(Math.floor(this.camera.x / tileSize), 0);
    const endCol = Math.min(Math.ceil((this.camera.x + this.viewport.width) / tileSize), layer.width);
    const startRow = Math.max(Math.floor(this.camera.y / tileSize), 0);
    const endRow = Math.min(Math.ceil((this.camera.y + this.viewport.height) / tileSize), layer.height);
    this.ctx.strokeStyle = 'red';
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        const index = y * layer.width + x;
        if (layer.data[index] > 0) {
          this.ctx.strokeRect(
            x * tileSize - this.camera.x,
            y * tileSize - this.camera.y,
            tileSize,
            tileSize,
          );
        }
      }
    }
  }

  _drawGrid() {
    const tileSize = this.tileSize;
    const startCol = Math.floor(this.camera.x / tileSize);
    const endCol = Math.ceil((this.camera.x + this.viewport.width) / tileSize);
    const startRow = Math.floor(this.camera.y / tileSize);
    const endRow = Math.ceil((this.camera.y + this.viewport.height) / tileSize);
    this.ctx.strokeStyle = 'yellow';
    for (let y = startRow; y < endRow; y++) {
      for (let x = startCol; x < endCol; x++) {
        this.ctx.strokeRect(
          x * tileSize - this.camera.x,
          y * tileSize - this.camera.y,
          tileSize,
          tileSize,
        );
      }
    }
  }
}

export default TileEngine;
