import { Events } from '../events/EventManager.js';

const TILE_SIZE = 16;
const MOVE_TIME = 0.18; // seconds per tile

/**
 * Handles player movement and rendering with a Pokémon-style feel.
 */
class PlayerController {
  /**
   * @param {import('../world/CollisionSystem.js').default} collisionSystem
   * @param {import('../graphics/SpriteAnimator.js').default} animator
   * @param {any} input
   * @param {import('../events/EventManager.js').default} eventManager
   */
  constructor(collisionSystem, animator, input, eventManager) {
    this.collisionSystem = collisionSystem;
    this.animator = animator;
    this.input = input;
    this.eventManager = eventManager;

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
  }

  enqueueMove(dir) {
    if (!this.enabled) return;
    this.pending.push(dir);
  }

  /**
   * Compute the tile coordinates directly in front of the player.
   * This helps interaction systems know which NPC or object is being
   * faced without duplicating direction math elsewhere.
   */
  getFacingPos() {
    const front = { x: this.gridPos.x, y: this.gridPos.y };
    if (this.direction === 'up') front.y -= 1;
    if (this.direction === 'down') front.y += 1;
    if (this.direction === 'left') front.x -= 1;
    if (this.direction === 'right') front.x += 1;
    return front;
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

  render(ctx) {
    const px = this.moving ? this.pixelPos.x : this.gridPos.x * TILE_SIZE;
    const py = this.moving ? this.pixelPos.y : this.gridPos.y * TILE_SIZE;
    if (this.animator && this.animator.sprite) {
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
    } else {
      // Placeholder player rectangle
      ctx.fillStyle = 'blue';
      const size = TILE_SIZE * 2;
      ctx.fillRect(px, py - (size - TILE_SIZE), size, size);
    }
  }
}

export default PlayerController;
