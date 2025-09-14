import Scene from './Scene.js';

class OverworldScene extends Scene {
  render(ctx) {
    ctx.fillStyle = '#3a854a';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.fillStyle = '#fff';
    ctx.font = '16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Overworld Scene Loaded!', ctx.canvas.width / 2, ctx.canvas.height / 2);
  }
}

export default OverworldScene;
