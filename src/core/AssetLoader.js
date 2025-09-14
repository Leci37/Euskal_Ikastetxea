import EventManager, { Events } from '../events/EventManager.js';

class AssetLoader {
  constructor() {
    this.images = new Map();
    this.audio = new Map();
    this.json = new Map();
  }

  loadImage(key, src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        this.images.set(key, img);
        EventManager.emit(Events.ASSET_LOADED, { type: 'image', key });
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  loadAudio(key, src) {
    return fetch(src)
      .then(r => r.arrayBuffer())
      .then(buf => {
        this.audio.set(key, buf);
        EventManager.emit(Events.ASSET_LOADED, { type: 'audio', key });
        return buf;
      });
  }

  loadJSON(key, src) {
    return fetch(src)
      .then(r => r.json())
      .then(data => {
        this.json.set(key, data);
        EventManager.emit(Events.ASSET_LOADED, { type: 'json', key });
        return data;
      });
  }

  loadAll(manifest) {
    const promises = [];
    manifest.images?.forEach(i => promises.push(this.loadImage(i.key, i.src)));
    manifest.audio?.forEach(a => promises.push(this.loadAudio(a.key, a.src)));
    manifest.json?.forEach(j => promises.push(this.loadJSON(j.key, j.src)));
    return Promise.all(promises).then(() => {
      EventManager.emit(Events.ASSETS_COMPLETE);
    });
  }

  getImage(key) { return this.images.get(key); }
  getAudio(key) { return this.audio.get(key); }
  getJSON(key) { return this.json.get(key); }
}

const loader = new AssetLoader();
export default loader;
