import { Events } from '../events/EventManager.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';
import MapManager from '../world/MapManager.js';
import AudioManager from '../audio/AudioManager.js';

const TILE_SIZE = 16;
const MOVE_TIME = 0.25;

class PlayerController {
  constructor(collisionSystem, spriteSheet, input, eventManager, npcManager) {
    this.collisionSystem = collisionSystem;
    // The player sprite is larger (32x32), but we handle it as 16x16 for grid logic
    this.animator = new SpriteAnimator(spriteSheet, 150, TILE_SIZE, TILE_SIZE);
    this.input = input;
    this.eventManager = eventManager;
    this.npcManager = npcManager;

    this.gridPos = { x: 0, y: 0 };
    this.pixelPos = { x: 0, y: 0 };
    this.direction = 'down';
    this.state = 'idle';

    this.moving = false;
    this.moveTimer = 0;
    this.startPixel = { x: 0, y: 0 };
    this.targetPixel = { x: 0, y: 0 };
    this.pending = [];

    this.enabled = true;

    this.eventManager.subscribe(Events.DIALOGUE_STARTED, () => (this.enabled = false));
    this.eventManager.subscribe(Events.QUIZ_STARTED, () => (this.enabled = false));
    this.eventManager.subscribe(Events.DIALOGUE_FINISHED, () => (this.enabled = true));
    this.eventManager.subscribe(Events.QUIZ_COMPLETED, () => (this.enabled = true));

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
      this.direction = dir; // Face the wall
      return false;
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

    if (this.moving) {
      this.animator.update(dt * 1000);
    } else {
      this.animator.frame = 0; // Reset to idle frame
      this.animator.elapsed = 0;
    }
  }

  /** Interact with NPC in front of the player */
  interact() {
    if (!this.enabled || !this.npcManager) return;

    const offset = { x: 0, y: 0 };
    if (this.direction === 'up') offset.y = -1;
    if (this.direction === 'down') offset.y = 1;
    if (this.direction === 'left') offset.x = -1;
    if (this.direction === 'right') offset.x = 1;

    const targetX = this.gridPos.x + offset.x;
    const targetY = this.gridPos.y + offset.y;
    const npc = this.npcManager.getNpcAt(targetX, targetY);

    if (npc && npc.dialogueId) {
      this.eventManager.emit(Events.DIALOGUE_STARTED, { id: npc.dialogueId });
      AudioManager.playSound('interact');
    }
  }

  render(ctx) {
    const px = this.moving ? this.pixelPos.x : this.gridPos.x * TILE_SIZE;
    const py = this.moving ? this.pixelPos.y : this.gridPos.y * TILE_SIZE;

    // Use the animator to draw the correct frame based on direction
    this.animator.render(ctx, px, py, this.direction);
  }
}

export default PlayerController;
