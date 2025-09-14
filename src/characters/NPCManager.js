import { DialogueComponent, LessonComponent, PatrolComponent } from './components/NPCComponent.js';

const TILE_SIZE = 16;

class NPC {
  constructor(def, index, sprite) {
    this.pos = { x: def.x, y: def.y };
    this.sprite = sprite;
    this.dialogueId = def.dialogueId || def.dialogue || null;
    this.quizId = def.quizId || null;
    this.components = [];
    if (def.dialogueId || def.dialogue) {
      this.components.push(new DialogueComponent(this.dialogueId));
    }
    if (def.lesson) this.components.push(new LessonComponent(def.lesson));
    if (def.patrol) this.components.push(new PatrolComponent(def.patrol));
  }

  update(dt) {
    this.components.forEach(c => c.update?.(dt));
  }

  render(ctx) {
    if (!this.sprite) return;
    ctx.drawImage(
      this.sprite,
      0,
      0,
      TILE_SIZE,
      TILE_SIZE,
      this.pos.x * TILE_SIZE,
      this.pos.y * TILE_SIZE,
      TILE_SIZE,
      TILE_SIZE
    );
  }

  /** Trigger all interactable components */
  interact() {
    this.components.forEach(c => c.trigger?.());
  }
}

class NPCManager {
  constructor() {
    this.npcs = [];
  }

  load(defs, defaultSprite) {
    this.npcs = defs.map((d, i) => new NPC(d, i, d.sprite || defaultSprite));
  }

  update(dt) {
    this.npcs.forEach(n => n.update(dt));
  }

  render(ctx) {
    this.npcs.forEach(n => n.render(ctx));
  }

  /** Return NPC at grid coordinate */
  getNpcAt(x, y) {
    return this.npcs.find(n => n.pos.x === x && n.pos.y === y) || null;
  }

  /** Trigger NPC at coordinate */
  interactAt(x, y) {
    const npc = this.getNpcAt(x, y);
    npc?.interact();
  }

  /** Render interaction prompt if player faces an NPC */
  renderPrompts(ctx, player) {
    const dir = player.direction;
    const offset = { x: 0, y: 0 };
    if (dir === 'up') offset.y = -1;
    if (dir === 'down') offset.y = 1;
    if (dir === 'left') offset.x = -1;
    if (dir === 'right') offset.x = 1;
    const target = { x: player.gridPos.x + offset.x, y: player.gridPos.y + offset.y };
    const npc = this.getNpcAt(target.x, target.y);
    if (!npc) return;
    const px = npc.pos.x * TILE_SIZE;
    const py = npc.pos.y * TILE_SIZE;
    ctx.fillStyle = 'yellow';
    ctx.beginPath();
    ctx.arc(px + TILE_SIZE / 2, py - 2, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.font = '6px monospace';
    ctx.fillText('SPACE', px - 4, py - 6);
  }
}

const manager = new NPCManager();
export default manager;
