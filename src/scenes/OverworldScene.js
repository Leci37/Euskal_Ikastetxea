import Scene from './Scene.js';
import MapManager from '../world/MapManager.js';
import TileEngine from '../world/TileEngine.js';
import PlayerController from '../characters/PlayerController.js';
import CollisionSystem from '../world/CollisionSystem.js';
import InputHandler from '../core/InputHandler.js';
import AssetLoader from '../core/AssetLoader.js';
import EventManager from '../events/EventManager.js';
import NPCManager from '../characters/NPCManager.js';
import DialogueEngine from '../dialogue/DialogueEngine.js';
import UIManager from '../ui/UIManager.js';
import '../dialogue/DialogueSystem.js';

class OverworldScene extends Scene {
  constructor() {
    super();
    this.mapManager = MapManager;
    const dummyCtx = typeof document !== 'undefined'
      ? document.createElement('canvas').getContext('2d')
      : { canvas: { width: 0, height: 0 } };
    this.tileEngine = new TileEngine(dummyCtx, 16);
    this.collisionSystem = CollisionSystem;
    this.input = new InputHandler();
    this.player = null;
    this.npcManager = NPCManager;
    this.dialogueEngine = DialogueEngine;
    this.ui = UIManager;
    this.fps = 0;
  }

  async onEnter(data) {
    const map = await this.mapManager.load('entrance_hall', 'public/maps/entrance_hall.json');
    const tileset = map.tilesets?.[0];
    const tilesetPath = tileset ? `public/assets/tilesets/${tileset.image}` : null;

    const playerPath = 'public/assets/characters/player_sprite.png';
    const receptionistPath = 'public/assets/characters/receptionist_sprite.png';

    const imagesToLoad = [playerPath, receptionistPath];
    if (tilesetPath) imagesToLoad.unshift(tilesetPath);
    await AssetLoader.loadImages(imagesToLoad);

    if (tileset) {
      this.tileEngine.tileSize = tileset.tilewidth || map.tilewidth || this.tileEngine.tileSize;
      const img = AssetLoader.getImage(tilesetPath);
      if (!img || img.width === tileset.tilewidth) {
        AssetLoader.generateTilesetPlaceholder({ ...tileset, image: tilesetPath });
      }
    }

    const playerSprite = AssetLoader.getImage(playerPath);
    this.player = new PlayerController(
      this.collisionSystem,
      playerSprite,
      this.input,
      EventManager,
      this.npcManager,
    );
    this.player.gridPos = { x: 5, y: 5 };
    this.player.pixelPos = { x: 5 * 16, y: 5 * 16 };

    const objectLayer = map.layers?.find(l => l.type === 'objectgroup');
    const tileSize = map.tilewidth || this.tileEngine.tileSize;
    const npcDefs = (objectLayer?.objects || [])
      .filter(o => o.type === 'npc')
      .map(o => {
        const props = {};
        (o.properties || []).forEach(p => (props[p.name] = p.value));
        return {
          x: o.x / tileSize,
          y: o.y / tileSize,
          dialogue: props.dialogueId,
        };
      });
    const receptionistSprite = AssetLoader.getImage(receptionistPath);
    this.npcManager.load(npcDefs, receptionistSprite);

    this.input.start();
  }

  update(dt) {
    this.player?.update(dt);
    this.npcManager.update(dt);
    this.dialogueEngine.update(dt);
    this.ui.update(dt);
    if (this.player) {
      this.tileEngine.centerOn(
        (this.player.pixelPos.x || this.player.gridPos.x * 16) + 8,
        (this.player.pixelPos.y || this.player.gridPos.y * 16) + 8,
      );
    }
    if (dt > 0) this.fps = 1 / dt;
  }

  render(ctx) {
    if (this.tileEngine.ctx !== ctx) {
      this.tileEngine.ctx = ctx;
      this.tileEngine.updateViewport(ctx.canvas.width, ctx.canvas.height);
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.tileEngine.render();
    this.player?.render(ctx);
    this.npcManager.render(ctx);
    this.npcManager.renderPrompts(ctx, this.player);
    this.dialogueEngine.render(ctx);
    this.ui.render(ctx);
    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.fillText(
      `${this.fps.toFixed(0)}fps`,
      2,
      10,
    );
  }
}

export default OverworldScene;
