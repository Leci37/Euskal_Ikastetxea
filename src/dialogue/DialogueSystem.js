import DialogueEngine from './DialogueEngine.js';

// Lightweight facade around the existing DialogueEngine. This keeps
// the scene code decoupled from the underlying implementation and makes
// it easier to expand with tutorials or quizzes later.
class DialogueSystem {
  start(id) {
    DialogueEngine.startDialogue(id);
  }

  update(dt) {
    DialogueEngine.update(dt);
  }

  render(ctx) {
    DialogueEngine.render(ctx);
  }

  isActive() {
    return !!DialogueEngine.script;
  }
}

export default new DialogueSystem();
