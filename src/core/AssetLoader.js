class AssetLoader {
  constructor() {
    this.imageCache = new Map();
    this.audioCache = new Map();
    this.jsonCache = new Map();
  }

  loadImages(paths = []) {
    const promises = paths.map(p => this._loadImage(p));
    return Promise.all(promises);
  }

  loadAudio(paths = []) {
    const promises = paths.map(p => this._loadAudio(p));
    return Promise.all(promises);
  }

  loadJSON(paths = []) {
    const promises = paths.map(p => this._loadJSON(p));
    return Promise.all(promises);
  }

  _loadImage(path) {
    if (this.imageCache.has(path)) {
      return Promise.resolve(this.imageCache.get(path));
    }
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.imageCache.set(path, img);
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
        resolve(audio);
      }, { once: true });
      audio.addEventListener('error', reject, { once: true });
      audio.src = path;
      audio.load();
    });
  }

  _loadJSON(path) {
    if (this.jsonCache.has(path)) {
      return Promise.resolve(this.jsonCache.get(path));
    }
    return fetch(path)
      .then(r => r.json())
      .then(data => {
        this.jsonCache.set(path, data);
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
}

const loader = new AssetLoader();
export default loader;
