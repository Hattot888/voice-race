export class PlayerCar {
  constructor(root, src) {
    this.el = document.createElement("div");
    this.el.className = "car car-player";
    this.img = document.createElement("img");
    this.img.src = src;
    this.img.alt = "سيارة الطفل";
    this.img.draggable = false;
    this.el.appendChild(this.img);
    root.appendChild(this.el);
    this.glow = false;
  }

  setGlow(on) {
    this.el.classList.toggle("is-boost", on);
  }

  update({ xPercent, y, time, burst }) {
    const floatY = Math.sin(time * 2.1) * 4;
    const tilt = Math.sin(time * 1.4) * 1.4;
    const breath = 1 + Math.sin(time * 2.6) * 0.012;
    this.el.style.left = `${xPercent}%`;
    this.el.style.transform = `translate(-50%, ${y + floatY}px) rotate(${tilt}deg) scale(${breath + (burst || 0)})`;
  }
}

export class BotCar {
  constructor(root, src) {
    this.el = document.createElement("div");
    this.el.className = "car car-bot";
    this.img = document.createElement("img");
    this.img.src = src;
    this.img.alt = "سيارة حكيم";
    this.img.draggable = false;
    this.el.appendChild(this.img);
    root.appendChild(this.el);
  }

  setGlow(on) {
    this.el.classList.toggle("is-boost", on);
  }

  update({ xPercent, y, time, burst }) {
    const floatY = Math.sin(time * 2.1 + 1.2) * 4;
    const tilt = Math.sin(time * 1.4 + 0.6) * 1.4;
    const breath = 1 + Math.sin(time * 2.4 + 0.8) * 0.012;
    this.el.style.left = `${xPercent}%`;
    this.el.style.transform = `translate(-50%, ${y + floatY}px) rotate(${tilt}deg) scale(${breath + (burst || 0)})`;
  }
}
