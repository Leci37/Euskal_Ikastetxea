import hud from './HUD.js';

/**
 * Central place to render HUD elements and temporary prompts such as
 * interaction indicators. Rendering is kept simple to avoid impacting
 * frame rate.
 */
class UIManager {
  constructor() {
    this.prompt = null; // {text, x, y}
  }

  /** Show an on-screen prompt above world elements. */
  showPrompt(text, x, y) {
    this.prompt = { text, x, y };
  }

  hidePrompt() {
    this.prompt = null;
  }

  render(ctx) {
    // Basic HUD (XP, current word, Basque-themed flag bar)
    hud.render(ctx);

    if (this.prompt) {
      const { text, x, y } = this.prompt;
      ctx.fillStyle = 'yellow';
      ctx.font = '10px monospace';
      ctx.fillText(text, x, y);
      // Small sparkle to draw attention
      ctx.fillRect(x - 2, y - 10, 2, 2);
      ctx.fillRect(x + ctx.measureText(text).width + 2, y - 10, 2, 2);
    }
  }
}

export default new UIManager();
