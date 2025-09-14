import AssetLoader from '../core/AssetLoader.js';
import EventManager, { Events } from '../events/EventManager.js';
import DialogueEngine from '../dialogue/DialogueEngine.js';
import { DialogueComponent, LessonComponent, PatrolComponent } from './components/NPCComponent.js';

class NPC {
  constructor(def) {
    this.pos = { x: def.x, y: def.y };
    this.components = [];
    if (def.dialogue) this.components.push(new DialogueComponent(def.dialogue));
    if (def.lesson) this.components.push(new LessonComponent(def.lesson));
    if (def.patrol) this.components.push(new PatrolComponent(def.patrol));
  }

  update(dt) {
    this.components.forEach(c => c.update?.(dt));
  }

  render(ctx) {
    // draw sprite placeholder
  }
}

class NPCManager {
  constructor() {
    this.npcs = [];
  }

  load(defs) {
    this.npcs = defs.map(d => new NPC(d));
  }

  update(dt) {
    this.npcs.forEach(n => n.update(dt));
  }

  render(ctx) {
    this.npcs.forEach(n => n.render(ctx));
  }
}

const manager = new NPCManager();
export default manager;
