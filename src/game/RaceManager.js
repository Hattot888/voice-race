import { RACE } from "../config.js";
import { clamp } from "../utils/easing.js";

export class RaceManager {
  constructor() {
    this.playerProgress = 0;
    this.botProgress = 0;
    this.playerBoost = 0;
    this.botBoost = 0;
  }

  reset() {
    this.playerProgress = 0;
    this.botProgress = 0;
    this.playerBoost = 0;
    this.botBoost = 0;
  }

  applyCorrect() {
    this.playerProgress += RACE.correctGain;
    this.playerBoost = -RACE.boostCorrect;
    this.botBoost = RACE.boostCorrect * 0.25;
  }

  applyClose() {
    this.playerProgress += RACE.closeGain;
    this.playerBoost = -RACE.boostClose;
    this.botBoost = RACE.boostClose * 0.15;
  }

  applyWrong() {
    this.botProgress += RACE.wrongBotGain;
    this.playerBoost = RACE.boostWrong * 0.35;
    this.botBoost = -RACE.boostWrong;
  }

  applyPassiveBot() {
    this.botProgress += RACE.botPassiveGain;
  }

  get playerPlace() {
    if (this.playerProgress === this.botProgress) return 1;
    return this.playerProgress > this.botProgress ? 1 : 2;
  }

  get botPlace() {
    return this.playerPlace === 1 ? 2 : 1;
  }

  get playerWon() {
    return this.playerProgress >= this.botProgress;
  }

  tick(deltaTime) {
    const decay = 1 - Math.min(1, deltaTime * 3.2);
    this.playerBoost *= decay;
    this.botBoost *= decay;
    if (Math.abs(this.playerBoost) < 0.4) this.playerBoost = 0;
    if (Math.abs(this.botBoost) < 0.4) this.botBoost = 0;
  }

  visualOffsets() {
    const lead = (this.playerProgress - this.botProgress) * RACE.pixelsPerPoint;
    const player = clamp(-lead + this.playerBoost, -RACE.maxVisualLead, RACE.maxVisualLead * 0.7);
    const bot = clamp(lead * 0.55 + this.botBoost, -RACE.maxVisualLead * 0.7, RACE.maxVisualLead);
    return { player, bot };
  }
}
