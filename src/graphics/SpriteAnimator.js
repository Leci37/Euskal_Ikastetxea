/**
 * Handles sprite sheet animations for characters with multiple directions.
 * Assumes a sprite sheet with 4 rows for directions and 4 columns for animation frames.
 */
class SpriteAnimator {
  constructor(sprite, frameTime = 150, frameWidth = 16, frameHeight = 16) {
    this.sprite = sprite;
    this.frameTime = frameTime;
    this.frameWidth = frameWidth;
    this.frameHeight = frameHeight;
    this.elapsed = 0;
    this.frame = 0;
    // Maps direction to the row index on the sprite sheet
    this.directionRows = { down: 0, left: 1, right: 2, up: 3 };
  }

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.frameTime) {
      this.elapsed = 0;
      // Cycle through 4 animation frames (0, 1, 2, 3)
      this.frame = (this.frame + 1) % 4;
    }
  }

  render(ctx, x, y, direction = 'down') {
    if (!this.sprite) return;

    const row = this.directionRows[direction] || 0;
    const sx = this.frame * this.frameWidth;
    const sy = row * this.frameHeight;

    ctx.drawImage(
      this.sprite,
      sx,
      sy,
      this.frameWidth,
      this.frameHeight,
      x,
      y,
      this.frameWidth,
      this.frameHeight
    );
  }
}

export default SpriteAnimator;
