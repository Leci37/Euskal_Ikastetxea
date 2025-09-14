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
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(path, img);
        this._enforceLimit(this.imageCache, this.maxImages);
        resolve(img);
      };
      img.onerror = reject;
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
}

const loader = new AssetLoader();
export default loader;
