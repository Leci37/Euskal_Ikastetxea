class AssetLoader {
  constructor({
    maxImages = 100,
    maxAudio = 20,
    maxJSON = 100,
  } = {}) {
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.jsonCache = new Map();

    this.maxImages = maxImages;
    this.maxAudio = maxAudio;
    this.maxJSON = maxJSON;
  }

  _enforceLimit(cache, max) {
    while (cache.size > max) {
      const oldestKey = cache.keys().next().value;
      const asset = cache.get(oldestKey);

      // Release audio buffers explicitly
      if (asset instanceof HTMLAudioElement) {
        asset.pause();
        asset.src = '';
      }

      cache.delete(oldestKey);
    }
  }

  loadImages(paths = []) {
    const promises = paths.map(p => this._loadImage(p));
    return Promise.all(promises);
  }

  loadAudio(paths = []) {
    const promises = paths.map(p => this._loadAudio(p));
    return Promise.all(promises);
  }

  loadJSON(pathsOrKey, maybePath) {
    if (Array.isArray(pathsOrKey)) {
      const promises = pathsOrKey.map(p => this._loadJSON(p));
      return Promise.all(promises);
    }

    // Support calling with (key, path) for custom cache keys
    const key = maybePath ? pathsOrKey : pathsOrKey;
    const path = maybePath || pathsOrKey;
    return this._loadJSON(path, key);
  }

  _loadImage(path) {
    if (this.imageCache.has(path)) {
      return Promise.resolve(this.imageCache.get(path));
    }
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(path, img);
        this._enforceLimit(this.imageCache, this.maxImages);
        resolve(img);
      };
      img.onerror = () => {
        // Generate a simple placeholder so the game can run without assets
        const placeholder = this._generatePlaceholderForPath(path);
        this.imageCache.set(path, placeholder);
        resolve(placeholder);
      };
      img.src = path;
    });
  }

  _loadAudio(path) {
    if (this.audioCache.has(path)) {
      return Promise.resolve(this.audioCache.get(path));
    }
    return new Promise((resolve, reject) => {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => {
        this.audioCache.set(path, audio);
        this._enforceLimit(this.audioCache, this.maxAudio);
        resolve(audio);
      }, { once: true });
      audio.addEventListener('error', reject, { once: true });
      audio.src = path;
      audio.load();
    });
  }

  _loadJSON(path, key = path) {
    if (this.jsonCache.has(key)) {
      return Promise.resolve(this.jsonCache.get(key));
    }
    return fetch(path)
      .then(r => r.json())
      .then(data => {
        this.jsonCache.set(key, data);
        this._enforceLimit(this.jsonCache, this.maxJSON);
        return data;
      });
  }

  getImage(path) {
    return this.imageCache.get(path);
  }

  getAudio(path) {
    return this.audioCache.get(path);
  }

  getJSON(path) {
    return this.jsonCache.get(path);
  }

  getMemoryUsage() {
    return {
      images: this.imageCache.size,
      audio: this.audioCache.size,
      json: this.jsonCache.size,
    };
  }

  clearCaches() {
    this.imageCache.clear();
    this.audioCache.forEach(a => {
      if (a instanceof HTMLAudioElement) {
        a.pause();
        a.src = '';
      }
    });
    this.audioCache.clear();
    this.jsonCache.clear();
  }

  // --- Placeholder generation helpers ----------------------------------

  _generatePlaceholderForPath(path) {
    // Default to a 16x16 magenta tile with yellow border
    const size = /player/i.test(path) ? 32 : 16;
    const color = /player/i.test(path) ? 'blue' : 'magenta';
    return this.createPlaceholder(path, size, size, color);
  }

  createPlaceholder(key, width = 16, height = 16, color = 'magenta') {
    if (typeof document === 'undefined') return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = 'yellow';
    ctx.strokeRect(0, 0, width, height);
    this.imageCache.set(key, canvas);
    return canvas;
  }

  generateTilesetPlaceholder(tileset) {
    if (!tileset) return null;
    const {
      tilewidth = 16,
      tileheight = 16,
      tilecount = 1,
      columns = 1,
      image,
    } = tileset;
    if (typeof document === 'undefined') return null;
    const rows = Math.ceil(tilecount / columns);
    const canvas = document.createElement('canvas');
    canvas.width = columns * tilewidth;
    canvas.height = rows * tileheight;
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < tilecount; i++) {
      const x = (i % columns) * tilewidth;
      const y = Math.floor(i / columns) * tileheight;
      ctx.fillStyle = `hsl(${(i * 47) % 360},50%,50%)`;
      ctx.fillRect(x, y, tilewidth, tileheight);
      ctx.strokeStyle = 'yellow';
      ctx.strokeRect(x, y, tilewidth, tileheight);
    }
    this.imageCache.set(image, canvas);
    return canvas;
  }
}

const loader = new AssetLoader();
export default loader;
