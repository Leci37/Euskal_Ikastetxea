// Manages switching and updating of all game scenes.
class SceneManager {
  constructor() {
    this.registry = new Map(); // name -> Scene class
    this.current = null; // active scene instance
    this.transitioning = false;
  }

  /** Register a scene class by name */
  registerScene(name, sceneClass) {
    this.registry.set(name, sceneClass);
  }

  /**
   * Switch to another scene, handling the full lifecycle.
   * @param {string} sceneName
   * @param {*} transitionData
   */
  async switchTo(sceneName, transitionData) {
    if (this.transitioning) return;
    const SceneClass = this.registry.get(sceneName);
    if (!SceneClass) throw new Error(`Scene not found: ${sceneName}`);

    this.transitioning = true;

    // Exit current scene
    if (this.current?.onExit) {
      this.current.onExit();
    }

    // Instantiate and preload new scene
    const newScene = new SceneClass();
    if (newScene.preload) {
      await newScene.preload();
    }

    // Enter new scene
    if (newScene.onEnter) {
      await newScene.onEnter(transitionData);
    }

    this.current = newScene;
    this.transitioning = false;
  }

  /** Delegate update to active scene */
  update(dt) {
    if (!this.transitioning) {
      this.current?.update?.(dt);
    }
  }

  /** Delegate render to active scene */
  render(ctx) {
    if (!this.transitioning) {
      this.current?.render?.(ctx);
    }
  }
}

export default new SceneManager();
