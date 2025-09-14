import { scaleCanvas } from '../utils/ResponsiveScaler.js';

/**
 * Handles canvas creation and responsive scaling.
 */
export default class CanvasRenderer {
  constructor(width = 240, height = 160) {
    this.canvas = document.createElement('canvas');
    this.canvas.width = width;
    this.canvas.height = height;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    scaleCanvas(this.canvas);
    window.addEventListener('resize', () => scaleCanvas(this.canvas));
  }

  /** Return the 2D rendering context. */
  getContext() {
    return this.ctx;
  }

  /** Clear the entire canvas. */
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
