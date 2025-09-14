import AssetLoader from './AssetLoader.js';

/**
 * Loads assets before the game starts.
 */
export default class AssetPreloader {
  async load(manifest = {}) {
    await Promise.all([
      AssetLoader.loadImages(manifest.images || []),
      AssetLoader.loadAudio(manifest.audio || []),
      AssetLoader.loadJSON(manifest.json || []),
    ]);
  }
}
