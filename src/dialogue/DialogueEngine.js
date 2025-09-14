import EventManager, { Events } from '../events/EventManager.js';
import DialogueBox from '../ui/DialogueBox.js';
import ContentDatabase from '../education/ContentDatabase.js';

class DialogueEngine {
  constructor() {
    this.active = null;
    this.index = 0;
    this.box = new DialogueBox();
  }

  startDialogue(id) {
    this.active = ContentDatabase.getDialogue(id);
    this.index = 0;
    this.box.open();
    this.showLine();
    EventManager.emit(Events.DIALOGUE_STARTED, id);
  }

  showLine() {
    if (!this.active) return;
    const line = this.active.lines[this.index];
    if (!line) {
      this.end();
    } else {
      this.box.setText(line.text, line.translation);
    }
  }

  advance() {
    this.index++;
    this.showLine();
  }

  chooseOption(i) {
    const opt = this.active.options[i];
    if (opt.quiz) EventManager.emit(Events.QUIZ_TRIGGER, opt.quiz);
    this.end();
  }

  end() {
    this.active = null;
    this.box.close();
    EventManager.emit(Events.DIALOGUE_FINISHED);
  }
}

const engine = new DialogueEngine();
export default engine;
