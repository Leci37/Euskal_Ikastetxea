import EventManager, { Events } from '../../events/EventManager.js';

export class NPCComponent {
  constructor() {}
  update() {}
}

export class DialogueComponent extends NPCComponent {
  constructor(dialogueId) {
    super();
    this.dialogueId = dialogueId;
  }
  trigger() {
    EventManager.emit(Events.DIALOGUE_STARTED, this.dialogueId);
  }
}

export class LessonComponent extends NPCComponent {
  constructor(lessonId) {
    super();
    this.lessonId = lessonId;
  }
  trigger() {
    EventManager.emit(Events.LESSON_COMPLETED, { lessonId: this.lessonId });
  }
}

export class PatrolComponent extends NPCComponent {
  constructor(path) {
    super();
    this.path = path;
    this.index = 0;
  }
  update() {
    // simple loop
    this.index = (this.index + 1) % this.path.length;
  }
}
