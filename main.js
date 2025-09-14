import SystemCoordinator from './src/core/SystemCoordinator.js';

const game = new SystemCoordinator();

const assetManifest = {};

async function main() {
  await game.start(assetManifest);
}

main();
