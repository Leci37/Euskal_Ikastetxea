import GameEngine from './src/core/GameEngine.js';

const game = new GameEngine();

const assetManifest = {};

async function main() {
  await game.start(assetManifest);
}

main();
