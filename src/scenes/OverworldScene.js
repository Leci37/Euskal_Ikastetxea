import Scene from './Scene.js';
import MapManager from '../world/MapManager.js';
import TileEngine from '../world/TileEngine.js';
import PlayerController from '../characters/PlayerController.js';
import CollisionSystem from '../world/CollisionSystem.js';
import InputHandler from '../core/InputHandler.js';
import AssetLoader from '../core/AssetLoader.js';
import EventManager, { Events } from '../events/EventManager.js';
import NPCManager from '../characters/NPCManager.js';
import DialogueEngine from '../dialogue/DialogueEngine.js';
import UIManager from '../ui/UIManager.js';
import SceneManager from './SceneManager.js';
import ContentDatabase from '../education/ContentDatabase.js';

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
    this.onDialogueFinished = this.onDialogueFinished.bind(this);
  }

  async onEnter(data) {
    EventManager.subscribe(Events.DIALOGUE_FINISHED, this.onDialogueFinished);
    
    // Load map data first to discover assets
    const map = await this.mapManager.load('entrance_hall', 'public/maps/entrance_hall.json');
    const tileset = map.tilesets?.[0];
    const tilesetPath = tileset ? `public/assets/tilesets/${tileset.image.split('/').pop()}` : null;
    
    // Define all required assets for the scene
    const playerPath = 'public/assets/characters/player_sprite.png';
    const receptionistPath = 'public/assets/characters/receptionist_sprite.png';
    const dialogueBoxPath = 'public/assets/ui/dialogue_box_pokemon_style.png';

    const imagesToLoad = [playerPath, receptionistPath, dialogueBoxPath];
    if (tilesetPath) {
      imagesToLoad.push(tilesetPath);
    }
    
    // Load all images and dialogue content in parallel
    await Promise.all([
      AssetLoader.loadImages(imagesToLoad),
      ContentDatabase.load([
        { type: 'dialogue', src: 'public/dialogues/dialogue_receptionist.json' },
        { type: 'dialogue', src: 'public/dialogues/dialogue_quizmaster.json' },
        { type: 'dialogue', src: 'public/dialogues/dialogue_board.json' },
      ])
    ]);
    
    // Now that assets are loaded, initialize game objects
    this.tileEngine.tileSize = map.tilewidth;
    
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
    const npcDefs = (objectLayer?.objects || [])
      .filter(o => o.type === 'npc' || o.type === 'interactable')
      .map(o => {
        const props = {};
        (o.properties || []).forEach(p => (props[p.name] = p.value));
        return {
          x: o.x / map.tilewidth,
          y: o.y / map.tilewidth, // Tiled y-pos can be tricky, ensure it aligns to grid
          dialogue: props.dialogueId,
          quizId: props.quizId,
          spriteKey: props.sprite || (o.type === 'interactable' ? null : 'receptionist'),
        };
      });
      
    const spriteMap = {
      receptionist: AssetLoader.getImage(receptionistPath)
    };
      
    this.npcManager.load(npcDefs, spriteMap);
    this.input.start();
  }

  onDialogueFinished(e) {
    const npc = this.npcManager.npcs?.find(
      n => n.dialogueId === e.id && n.quizId,
    );
    if (npc) {
      SceneManager.switchTo('VocabularyQuizScene', { quizId: npc.quizId });
    }
  }

  onExit() {
    EventManager.unsubscribe(Events.DIALOGUE_FINISHED, this.onDialogueFinished);
    this.input.stop();
  }

  update(dt) {
    this.player?.update(dt);
    this.npcManager.update(dt);
    this.dialogueEngine.update(dt);
    this.ui.update(dt);
    if (this.player) {
      this.tileEngine.centerOn(
        this.player.pixelPos.x + 8,
        this.player.pixelPos.y + 8,
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
    this.npcManager.render(ctx); // Render NPCs behind player
    this.player?.render(ctx);
    
    // UI should render on top of everything
    this.dialogueEngine.render(ctx);
    this.ui.render(ctx);

    // Keep debug info minimal
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, 0, 50, 12);
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
