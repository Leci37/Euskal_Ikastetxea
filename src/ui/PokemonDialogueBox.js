import AssetLoader from '../core/AssetLoader.js';
import AudioManager from '../audio/AudioManager.js';

const PANEL_IMAGE = 'dialogue_box_pokemon_style.png';
const TILE = 8; // size of corner tiles in the 9-slice
const CHAR_DELAY = 0.05; // seconds per character

/**
 * Renders a Pokémon Emerald style dialogue box.
 */
class PokemonDialogueBox {
  constructor() {
    this.visible = false;
    this.text = '';
    this.translation = '';
    this.displayed = '';
    this.displayedTranslation = '';
    this.charIndex = 0;
    this.elapsed = 0;
    this.arrowTimer = 0;
  }

  show(text, translation = '') {
    this.visible = true;
    this.text = text;
    this.translation = translation;
    this.displayed = '';
    this.displayedTranslation = '';
    this.charIndex = 0;
    this.elapsed = 0;
    this.arrowTimer = 0;
  }

  hide() {
    this.visible = false;
  }

  isFinished() {
    return this.charIndex >= this.text.length;
  }

  skip() {
    this.displayed = this.text;
    this.displayedTranslation = this.translation;
    this.charIndex = this.text.length;
  }

  update(dt) {
    if (!this.visible) return;
    if (this.charIndex < this.text.length) {
      this.elapsed += dt;
      while (this.elapsed >= CHAR_DELAY && this.charIndex < this.text.length) {
        this.displayed += this.text[this.charIndex];
        if (this.translation) {
          this.displayedTranslation = this.translation.slice(0, this.charIndex + 1);
        }
        this.charIndex += 1;
        this.elapsed -= CHAR_DELAY;
        AudioManager.playSound('dialogue_tick');
      }
    }
    this.arrowTimer += dt;
  }

  render(ctx) {
    if (!this.visible) return;
    const img = AssetLoader.getImage(PANEL_IMAGE);
    const x = 0;
    const y = 112;
    const w = 240;
    const h = 48;
    ctx.imageSmoothingEnabled = false;
    if (img) {
      // Corners
      ctx.drawImage(img, 0, 0, TILE, TILE, x, y, TILE, TILE);
      ctx.drawImage(img, img.width - TILE, 0, TILE, TILE, x + w - TILE, y, TILE, TILE);
      ctx.drawImage(img, 0, img.height - TILE, TILE, TILE, x, y + h - TILE, TILE, TILE);
      ctx.drawImage(
        img,
        img.width - TILE,
        img.height - TILE,
        TILE,
        TILE,
        x + w - TILE,
        y + h - TILE,
        TILE,
        TILE
      );
      // Edges
      ctx.drawImage(img, TILE, 0, img.width - 2 * TILE, TILE, x + TILE, y, w - 2 * TILE, TILE);
      ctx.drawImage(img, TILE, img.height - TILE, img.width - 2 * TILE, TILE, x + TILE, y + h - TILE, w - 2 * TILE, TILE);
      ctx.drawImage(img, 0, TILE, TILE, img.height - 2 * TILE, x, y + TILE, TILE, h - 2 * TILE);
      ctx.drawImage(img, img.width - TILE, TILE, TILE, img.height - 2 * TILE, x + w - TILE, y + TILE, TILE, h - 2 * TILE);
      // Center
      ctx.drawImage(
        img,
        TILE,
        TILE,
        img.width - 2 * TILE,
        img.height - 2 * TILE,
        x + TILE,
        y + TILE,
        w - 2 * TILE,
        h - 2 * TILE
      );
    } else {
      ctx.fillStyle = '#fff';
      ctx.fillRect(x, y, w, h);
    }

    ctx.fillStyle = '#000';
    ctx.font = '16px monospace';
    ctx.textBaseline = 'top';
    ctx.fillText(this.displayed, x + 10, y + 8);
    if (this.translation) {
      ctx.font = '10px monospace';
      ctx.fillText(this.displayedTranslation, x + 10, y + 26);
    }

    if (this.isFinished()) {
      const blink = Math.floor(this.arrowTimer * 2) % 2 === 0;
      if (blink) {
        ctx.fillText('▼', x + w - 16, y + h - 16);
      }
    }
  }
}

export default PokemonDialogueBox;
