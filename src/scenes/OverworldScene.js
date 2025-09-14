import Scene from './Scene.js';
import MapManager from '../world/MapManager.js';
import TileEngine from '../world/TileEngine.js';
import PlayerController from '../characters/PlayerController.js';
import CollisionSystem from '../world/CollisionSystem.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';
import InputHandler from '../core/InputHandler.js';
import AssetLoader from '../core/AssetLoader.js';
import EventManager from '../events/EventManager.js';
import NPCManager from '../characters/NPCManager.js';
import DialogueEngine from '../dialogue/DialogueEngine.js';

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
    const playerSprite = AssetLoader.getImage('player_sprite.png');
    this.animator = new SpriteAnimator(playerSprite);
    this.player = new PlayerController(
      this.collisionSystem,
      this.animator,
      this.input,
      EventManager,
    );
    this.npcManager = NPCManager;
    this.dialogueEngine = DialogueEngine;
  }

  async onEnter(data) {
    const map = await this.mapManager.load('entrance_hall', 'public/maps/entrance_hall.json');
    const tileset = map.tilesets?.[0];
    if (tileset) {
      this.tileEngine.tileSize = tileset.tilewidth || map.tilewidth || this.tileEngine.tileSize;
      await AssetLoader.loadImages([tileset.image]);
    }

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
    this.npcManager.load(npcDefs);

    this.input.start();
  }

  update(dt) {
    this.player.update(dt);
    this.npcManager.update(dt);
    this.dialogueEngine.update(dt);
  }

  render(ctx) {
    if (this.tileEngine.ctx !== ctx) {
      this.tileEngine.ctx = ctx;
      this.tileEngine.updateViewport(ctx.canvas.width, ctx.canvas.height);
    }
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.tileEngine.render();
    this.player.render(ctx);
    this.npcManager.render(ctx);
    this.dialogueEngine.render(ctx);
  }
}

export default OverworldScene;
