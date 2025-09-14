import GameEngine from './src/core/GameEngine.js';
import SceneManager from './src/scenes/SceneManager.js';
import OverworldScene from './src/scenes/OverworldScene.js';
import VocabularyQuizScene from './src/scenes/VocabularyQuizScene.js';

const game = new GameEngine();
SceneManager.registerScene('Overworld', OverworldScene);
SceneManager.registerScene('VocabularyQuizScene', VocabularyQuizScene);

const assetManifest = {};

async function main() {
  await game.start(assetManifest);
  SceneManager.switchTo('Overworld');
}

main();
