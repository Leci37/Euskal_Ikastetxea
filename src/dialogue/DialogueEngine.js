import EventManager, { Events } from '../events/EventManager.js';
import ContentDatabase from '../education/ContentDatabase.js';
import PokemonDialogueBox from '../ui/PokemonDialogueBox.js';

/**
 * Manages in-game conversations using a Pokémon-style presentation.
 */
class DialogueEngine {
  constructor() {
    this.script = null; // array of pages
    this.page = 0;
    this.box = new PokemonDialogueBox();
    this.activeId = null;

    EventManager.subscribe(Events.INPUT_ACTION_PRESS, () => this.advance());
  }

  startDialogue(dialogueId) {
    const dialogue = ContentDatabase.getDialogue(dialogueId);
    if (!dialogue) return;
    this.activeId = dialogueId;
    this.script = Array.isArray(dialogue) ? dialogue : dialogue.lines;
    this.page = 0;
    this._showPage();
    EventManager.emit(Events.DIALOGUE_STARTED, { id: dialogueId });
  }

  _showPage() {
    const line = this.script[this.page];
    if (!line) {
      this.end();
      return;
    }
    const text = line.euskera || line.text || '';
    const translation = line.translation || '';
    this.box.show(text, translation);
  }

  advance() {
    if (!this.script) return;
    if (!this.box.isFinished()) {
      this.box.skip();
      return;
    }
    this.page += 1;
    if (this.page >= this.script.length) {
      this.end();
    } else {
      this._showPage();
    }
  }

  end() {
    this.box.hide();
    this.script = null;
    const id = this.activeId;
    this.activeId = null;
    EventManager.emit(Events.DIALOGUE_FINISHED, { id });
  }

  update(dt) {
    this.box.update(dt);
  }

  render(ctx) {
    this.box.render(ctx);
  }
}

export default new DialogueEngine();
