import AudioManager from '../audio/AudioManager.js';

class DialogueBox {
  constructor() {
    this.opened = false;
    this.text = '';
    this.translation = '';
    this.speed = 30;
    this.index = 0;
  }

  open() { this.opened = true; this.index = 0; }
  close() { this.opened = false; }
  setText(t, tr) { this.text = t; this.translation = tr; this.index = 0; }

  draw(ctx) {
    if (!this.opened) return;
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 112, 240, 48);
    ctx.fillStyle = '#fff';
    const shown = this.text.slice(0, this.index);
    ctx.fillText(shown, 10, 130);
    if (this.index < this.text.length) this.index += 1;
  }
}

export default DialogueBox;
