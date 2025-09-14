import GameEngine from './src/core/GameEngine.js';
import SceneManager from './src/scenes/SceneManager.js';
import OverworldScene from './src/scenes/OverworldScene.js';

const game = new GameEngine();
SceneManager.registerScene('Overworld', OverworldScene);

async function main() {
  await game.start();
  SceneManager.switchTo('Overworld');
}

main();
