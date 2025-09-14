import Scene from './Scene.js';
import MapManager from '../world/MapManager.js';
import TileEngine from '../world/TileEngine.js';
import PlayerController from '../characters/PlayerController.js';
import CollisionSystem from '../world/CollisionSystem.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';
import InputHandler from '../core/InputHandler.js';
import AssetLoader from '../core/AssetLoader.js';
import EventManager, { Events } from '../events/EventManager.js';
import NPCManager from '../characters/NPCManager.js';
import DialogueSystem from '../dialogue/DialogueSystem.js';
import UIManager from '../ui/UIManager.js';

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
    const playerSprite = AssetLoader.getImage('player_sprite.png')
      || AssetLoader.createPlaceholder('player_sprite.png', 32, 32, 'blue');
    this.animator = new SpriteAnimator(playerSprite);
    this.player = new PlayerController(
      this.collisionSystem,
      this.animator,
      this.input,
      EventManager,
    );
    this.npcManager = NPCManager;
    this.dialogue = DialogueSystem;
    this.ui = UIManager;
    this.activeNpc = null;
    this.fps = 0;

    EventManager.subscribe(Events.INPUT_ACTION_PRESS, () => {
      if (this.activeNpc && !this.dialogue.isActive()) {
        this.activeNpc.components.forEach(c => c.trigger?.());
      }
    });
  }

  async onEnter(data) {
    const map = await this.mapManager.load('entrance_hall', 'public/maps/entrance_hall.json');
    const tileset = map.tilesets?.[0];
    if (tileset) {
      this.tileEngine.tileSize = tileset.tilewidth || map.tilewidth || this.tileEngine.tileSize;
      try {
        await AssetLoader.loadImages([tileset.image]);
      } catch {
        /* ignore */
      }
      const img = AssetLoader.getImage(tileset.image);
      if (!img || img.width === tileset.tilewidth) {
        AssetLoader.generateTilesetPlaceholder(tileset);
      }
    }

    this.player.gridPos = { x: 5, y: 5 };
    this.player.pixelPos = { x: 5 * 16, y: 5 * 16 };

    const objectLayer = map.layers?.find(l => l.type === 'objectgroup');
    const tileSize = map.tilewidth || this.tileEngine.tileSize;
    const npcs = [];
    const labels = [];
    (objectLayer?.objects || []).forEach(o => {
      const props = {};
      (o.properties || []).forEach(p => (props[p.name] = p.value));
      if (o.type === 'npc') {
        npcs.push({ x: o.x / tileSize, y: o.y / tileSize, dialogue: props.dialogueId });
      } else if (o.type === 'label') {
        labels.push({ x: o.x / tileSize, y: o.y / tileSize, text: o.name || props.text });
      }
    });
    this.npcManager.load(npcs);
    this.tileEngine.setLabels(labels);

    this.input.start();
  }

  update(dt) {
    this.player.update(dt);
    this.npcManager.update(dt);
    this.dialogue.update(dt);
    // Determine if player is facing an NPC for interaction
    const front = this.player.getFacingPos();
    this.activeNpc = this.npcManager.npcs.find(n => n.pos.x === front.x && n.pos.y === front.y) || null;
    if (this.activeNpc && !this.dialogue.isActive()) {
      const tileSize = this.tileEngine.tileSize;
      const px = this.activeNpc.pos.x * tileSize - this.tileEngine.camera.x;
      const py = this.activeNpc.pos.y * tileSize - this.tileEngine.camera.y - 4;
      this.ui.showPrompt('Press SPACE', px, py);
    } else {
      this.ui.hidePrompt();
    }
    this.tileEngine.centerOn(
      (this.player.pixelPos.x || this.player.gridPos.x * 16) + 8,
      (this.player.pixelPos.y || this.player.gridPos.y * 16) + 8,
    );
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
    this.player.render(ctx);
    this.npcManager.render(ctx);
    this.ui.render(ctx);
    this.dialogue.render(ctx);
    ctx.fillStyle = 'white';
    ctx.font = '10px monospace';
    ctx.fillText(
      `(${this.player.gridPos.x},${this.player.gridPos.y}) ${this.fps.toFixed(0)}fps`,
      2,
      10,
    );
  }
}

export default OverworldScene;
