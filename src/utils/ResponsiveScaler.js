export function scaleCanvas(canvas) {
  const width = 240;
  const height = 160;
  const scale = Math.floor(Math.min(window.innerWidth / width, window.innerHeight / height));
  canvas.style.width = width * scale + 'px';
  canvas.style.height = height * scale + 'px';
}
