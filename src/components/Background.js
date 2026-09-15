import {
  BACKGROUND_BOTTOM,
  BACKGROUND_EASE_ZONE,
  BACKGROUND_SPEED,
  BACKGROUND_TOP,
} from "../config.js";

export class Background {
  constructor(root, src) {
    this.el = document.createElement("div");
    this.el.className = "game-bg";
    this.img = document.createElement("img");
    this.img.src = src;
    this.img.alt = "";
    this.img.draggable = false;
    this.el.appendChild(this.img);
    root.appendChild(this.el);
    this.y = 0;
    this.direction = 1;
  }

  resize() {}

  update(deltaTime) {
    const top = BACKGROUND_TOP;
    const bottom = BACKGROUND_BOTTOM;
    const target = this.direction > 0 ? bottom : top;
    const distance = Math.abs(target - this.y);
    const zone = Math.max(1, BACKGROUND_EASE_ZONE);
    const t = Math.min(1, distance / zone);
    const ease = t * t * (3 - 2 * t);
    const speed = BACKGROUND_SPEED * Math.max(0.22, ease);

    this.y += this.direction * speed * deltaTime;

    if (this.direction > 0 && this.y >= bottom) {
      this.y = bottom;
      this.direction = -1;
    } else if (this.direction < 0 && this.y <= top) {
      this.y = top;
      this.direction = 1;
    }

    this.img.style.transform = `translate3d(-50%, calc(-50% + ${this.y}px), 0) scale(1.18)`;
  }
}
