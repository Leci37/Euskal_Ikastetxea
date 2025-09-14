import HUD from './HUD.js';

// Basque flag colors
const COLORS = {
  red: '#d52b1e',
  green: '#006233',
  white: '#ffffff'
};

class UIManager {
  constructor() {
    this.health = 100;
  }

  update(dt) {
    // reserved for future UI logic
  }

  render(ctx) {
    // draw HUD info like XP and vocabulary
    HUD.render(ctx);

    // simple health bar top-right
    const barWidth = 50;
    const x = ctx.canvas.width - barWidth - 10;
    const y = 4;
    ctx.fillStyle = COLORS.white;
    ctx.fillRect(x - 2, y - 2, barWidth + 4, 10);
    ctx.fillStyle = COLORS.red;
    ctx.fillRect(x, y, barWidth * (this.health / 100), 6);

    // menu button bottom-right
    const mb = 16;
    ctx.fillStyle = COLORS.green;
    ctx.fillRect(ctx.canvas.width - mb - 4, ctx.canvas.height - mb - 4, mb, mb);
    ctx.fillStyle = COLORS.white;
    ctx.font = '10px monospace';
    ctx.fillText('M', ctx.canvas.width - mb + 1, ctx.canvas.height - 6);
  }
}

export default new UIManager();
