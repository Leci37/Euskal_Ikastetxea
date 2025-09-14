import EventManager, { Events } from '../events/EventManager.js';
import ProgressTracker from './ProgressTracker.js';

class RewardSystem {
  constructor() {
    EventManager.subscribe(Events.LESSON_COMPLETED, e => this.award('badge', e.lesson));
    EventManager.subscribe(Events.QUIZ_COMPLETED, e => this.award('xp', e.score));
    EventManager.subscribe(Events.LEVEL_UP, e => this.award('level', e.level));
  }

  award(type, data) {
    // placeholder for reward logic
    console.log('Reward', type, data);
  }
}

const rewards = new RewardSystem();
export default rewards;
