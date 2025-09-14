import EventManager, { Events } from '../events/EventManager.js';
import DialogueEngine from './DialogueEngine.js';

// Connects event-driven dialogue triggers with the DialogueEngine
class DialogueSystem {
  constructor() {
    EventManager.subscribe(Events.DIALOGUE_STARTED, e => DialogueEngine.startDialogue(e.id));
  }
}

export default new DialogueSystem();
