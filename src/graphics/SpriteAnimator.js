class SpriteAnimator {
  constructor(sprite, frameTime = 150) {
    this.sprite = sprite;
    this.frameTime = frameTime;
    this.elapsed = 0;
    this.frame = 0;
  }

  update(dt) {
    this.elapsed += dt;
    if (this.elapsed >= this.frameTime) {
      this.elapsed = 0;
      this.frame = (this.frame + 1) % 4; // 4-frame cycles
    }
  }

  render(ctx, x, y) {
    ctx.drawImage(this.sprite, this.frame * 16, 0, 16, 16, x, y, 16, 16);
  }

  triggerAnimation(name) {
    // placeholder for highlight animations
  }
}

export default SpriteAnimator;
