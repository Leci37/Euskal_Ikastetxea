import EventManager, { Events } from '../events/EventManager.js';
import DialogueEngine from '../dialogue/DialogueEngine.js';
import { DialogueComponent, LessonComponent, PatrolComponent } from './components/NPCComponent.js';

const TILE_SIZE = 16;

class NPC {
  constructor(def, index) {
    this.pos = { x: def.x, y: def.y };
    this.color = def.color || `hsl(${(index * 67) % 360},60%,50%)`;
    this.components = [];
    if (def.dialogue) this.components.push(new DialogueComponent(def.dialogue));
    if (def.lesson) this.components.push(new LessonComponent(def.lesson));
    if (def.patrol) this.components.push(new PatrolComponent(def.patrol));
  }

  update(dt) {
    this.components.forEach(c => c.update?.(dt));
  }

  render(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.pos.x * TILE_SIZE, this.pos.y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
  }
}

class NPCManager {
  constructor() {
    this.npcs = [];
  }

  load(defs) {
    this.npcs = defs.map((d, i) => new NPC(d, i));
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
