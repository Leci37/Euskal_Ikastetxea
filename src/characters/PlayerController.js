import EventManager, { Events } from '../events/EventManager.js';
import CollisionSystem from '../world/CollisionSystem.js';
import SpriteAnimator from '../graphics/SpriteAnimator.js';

class PlayerController {
  constructor(sprite) {
    this.pos = { x: 0, y: 0 };
    this.animator = new SpriteAnimator(sprite);
    this.enabled = true;
    EventManager.subscribe(Events.DIALOGUE_STARTED, () => this.enabled = false);
    EventManager.subscribe(Events.QUIZ_STARTED, () => this.enabled = false);
    EventManager.subscribe(Events.DIALOGUE_FINISHED, () => this.enabled = true);
    EventManager.subscribe(Events.RESUME_GAME, () => this.enabled = true);
    window.addEventListener('keydown', e => this.handleInput(e));
  }

  handleInput(e) {
    if (!this.enabled) return;
    const dir = { x: 0, y: 0 };
    if (e.key === 'ArrowUp') dir.y = -16;
    if (e.key === 'ArrowDown') dir.y = 16;
    if (e.key === 'ArrowLeft') dir.x = -16;
    if (e.key === 'ArrowRight') dir.x = 16;
    if (dir.x || dir.y) {
      const newPos = CollisionSystem.resolveMovement(this.pos, dir);
      if (newPos !== this.pos) {
        this.pos = newPos;
        EventManager.emit(Events.PLAYER_MOVED, { pos: this.pos });
      }
    }
  }

  update(dt) {
    this.animator.update(dt);
  }

  render(ctx) {
    this.animator.render(ctx, this.pos.x, this.pos.y);
  }
}

export default PlayerController;
