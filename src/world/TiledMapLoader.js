// Loader and processor for Tiled JSON maps.
class TiledMapLoader {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Fetch and process a map exported from Tiled.
   * @param {string} mapPath
   * @returns {Promise<Object>} processed map data
   */
  async loadMap(mapPath) {
    if (this.cache.has(mapPath)) {
      return this.cache.get(mapPath);
    }
    const response = await fetch(mapPath);
    const raw = await response.json();
    const processed = this.processMapData(raw);
    this.cache.set(mapPath, processed);
    return processed;
  }

  /**
   * Convert raw Tiled data into a game-friendly format.
   * Separates layers, objects and custom properties.
   * @param {Object} data raw Tiled JSON
   * @returns {Object}
   */
  processMapData(data) {
    const layers = {};
    const objects = { npc: [], door: [], interactable: [] };

    for (const layer of data.layers || []) {
      if (layer.type === 'objectgroup') {
        for (const obj of layer.objects) {
          const type = obj.type?.toLowerCase();
          if (objects[type]) {
            objects[type].push(obj);
          }
        }
      } else {
        layers[layer.name] = layer;
      }
    }

    const properties = {};
    if (Array.isArray(data.properties)) {
      for (const prop of data.properties) {
        properties[prop.name] = prop.value;
      }
    }

    return { ...data, layers, objects, properties };
  }
}

export default new TiledMapLoader();
