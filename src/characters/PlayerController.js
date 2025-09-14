import { Events } from '../events/EventManager.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';
import MapManager from '../world/MapManager.js';
import AudioManager from '../audio/AudioManager.js';

const TILE_SIZE = 16;
// Movement timing roughly matching Pokémon Emerald (250ms per tile)
const MOVE_TIME = 0.25; // seconds per tile

/**
 * Handles player movement and rendering with a Pokémon-style feel.
 */
class PlayerController {
  /**
   * @param {import('../world/CollisionSystem.js').default} collisionSystem
   * @param {HTMLImageElement} spriteSheet
   * @param {any} input
   * @param {import('../events/EventManager.js').default} eventManager
   * @param {import('./NPCManager.js').default} npcManager
   */
  constructor(collisionSystem, spriteSheet, input, eventManager, npcManager) {
    this.collisionSystem = collisionSystem;
    this.animator = new SpriteAnimator(spriteSheet);
    this.input = input;
    this.eventManager = eventManager;
    this.npcManager = npcManager;

    this.gridPos = { x: 0, y: 0 }; // in tile coordinates
    this.pixelPos = { x: 0, y: 0 }; // interpolated pixel position
    this.direction = 'down';
    this.state = 'idle';

    this.moving = false;
    this.moveTimer = 0;
    this.startPixel = { x: 0, y: 0 };
    this.targetPixel = { x: 0, y: 0 };
    this.pending = [];

    this.enabled = true;

    // Disable movement during dialogues and quizzes
    this.eventManager.subscribe(Events.DIALOGUE_STARTED, () => (this.enabled = false));
    this.eventManager.subscribe(Events.QUIZ_STARTED, () => (this.enabled = false));
    this.eventManager.subscribe(Events.DIALOGUE_FINISHED, () => (this.enabled = true));
    this.eventManager.subscribe(Events.QUIZ_COMPLETED, () => (this.enabled = true));

    // Listen to abstracted input events
    this.eventManager.subscribe(Events.INPUT_DIRECTION_DOWN, (e) => this.enqueueMove(e.direction));
    this.eventManager.subscribe(Events.INPUT_ACTION_PRESS, () => this.interact());
  }

  enqueueMove(dir) {
    if (!this.enabled) return;
    this.pending.push(dir);
  }

  _tryStartMove(dir) {
    const delta = { x: 0, y: 0 };
    if (dir === 'up') delta.y = -1;
    if (dir === 'down') delta.y = 1;
    if (dir === 'left') delta.x = -1;
    if (dir === 'right') delta.x = 1;

    const target = {
      x: this.gridPos.x + delta.x,
      y: this.gridPos.y + delta.y,
    };
    if (this.collisionSystem.checkCollision(target.x, target.y)) {
      return false; // blocked
    }
    this.direction = dir;
    this.state = 'walking';
    this.moving = true;
    this.moveTimer = 0;
    this.startPixel.x = this.gridPos.x * TILE_SIZE;
    this.startPixel.y = this.gridPos.y * TILE_SIZE;
    this.targetPixel.x = target.x * TILE_SIZE;
    this.targetPixel.y = target.y * TILE_SIZE;
    this.gridPos = target;
    this.eventManager.emit(Events.PLAYER_MOVED, { pos: { ...this.gridPos } });
    AudioManager.playSound('move');
    return true;
  }

  update(dt) {
    if (!this.enabled) return;

    if (this.moving) {
      this.moveTimer += dt;
      const t = Math.min(this.moveTimer / MOVE_TIME, 1);
      this.pixelPos.x = this.startPixel.x + (this.targetPixel.x - this.startPixel.x) * t;
      this.pixelPos.y = this.startPixel.y + (this.targetPixel.y - this.startPixel.y) * t;
      if (t >= 1) {
        this.moving = false;
        this.state = 'idle';
        // trigger warps when landing on a tile
        const warp = MapManager.warps.find(
          w => Math.floor(w.x / TILE_SIZE) === this.gridPos.x && Math.floor(w.y / TILE_SIZE) === this.gridPos.y,
        );
        if (warp) this.eventManager.emit(Events.PLAYER_ENTER_WARP, warp);
        // Continue moving if direction is still held
        if (this.input && this.input.isDown(this.direction)) {
          this._tryStartMove(this.direction);
        }
      }
    } else if (this.pending.length > 0) {
      // Start next queued move
      const next = this.pending.shift();
      this._tryStartMove(next);
    }

    // Update animator
    if (this.moving) {
      this.animator.update(dt * 1000); // animator expects ms
    } else {
      if (this.animator) {
        this.animator.frame = 0;
        this.animator.elapsed = 0;
      }
    }
  }

  /** Interact with NPC in front of the player */
  interact() {
    if (!this.npcManager) return;
    const offset = { x: 0, y: 0 };
    if (this.direction === 'up') offset.y = -1;
    if (this.direction === 'down') offset.y = 1;
    if (this.direction === 'left') offset.x = -1;
    if (this.direction === 'right') offset.x = 1;
    const target = { x: this.gridPos.x + offset.x, y: this.gridPos.y + offset.y };
    this.npcManager.interactAt(target.x, target.y);
    AudioManager.playSound('interact');
  }

  render(ctx) {
    const px = this.moving ? this.pixelPos.x : this.gridPos.x * TILE_SIZE;
    const py = this.moving ? this.pixelPos.y : this.gridPos.y * TILE_SIZE;
    if (!this.animator || !this.animator.sprite) return;
    const frame = this.animator.frame;
    const dirRow = { down: 0, left: 1, right: 2, up: 3 }[this.direction];
    ctx.drawImage(
      this.animator.sprite,
      frame * TILE_SIZE,
      dirRow * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE,
      px,
      py,
      TILE_SIZE,
      TILE_SIZE
    );
  }
}

export default PlayerController;
