import EventManager, { Events } from '../events/EventManager.js';
import CollisionSystem from '../world/CollisionSystem.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';
import InputHandler from '../core/InputHandler.js';

const TILE_SIZE = 16;
const MOVE_TIME = 0.18; // seconds per tile

/**
 * Handles player movement and rendering with a Pokémon-style feel.
 */
class PlayerController {
  constructor(spriteImage) {
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
    this.animator = new SpriteAnimator(spriteImage, 100);

    // Disable movement during dialogues and quizzes
    EventManager.subscribe(Events.DIALOGUE_STARTED, () => (this.enabled = false));
    EventManager.subscribe(Events.QUIZ_STARTED, () => (this.enabled = false));
    EventManager.subscribe(Events.DIALOGUE_FINISHED, () => (this.enabled = true));
    EventManager.subscribe(Events.QUIZ_COMPLETED, () => (this.enabled = true));

    // Listen to abstracted input events
    EventManager.subscribe(Events.INPUT_DIRECTION_DOWN, (e) => this.enqueueMove(e.direction));
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
    if (CollisionSystem.checkCollision(target.x, target.y)) {
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
    EventManager.emit(Events.PLAYER_MOVED, { pos: { ...this.gridPos } });
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
        // Continue moving if direction is still held
        if (InputHandler.isDown(this.direction)) {
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
      this.animator.frame = 0;
      this.animator.elapsed = 0;
    }
  }

  render(ctx) {
    const frame = this.animator.frame;
    const dirRow = { down: 0, left: 1, right: 2, up: 3 }[this.direction];
    const px = this.moving ? this.pixelPos.x : this.gridPos.x * TILE_SIZE;
    const py = this.moving ? this.pixelPos.y : this.gridPos.y * TILE_SIZE;

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
