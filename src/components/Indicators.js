export class PlayerIndicator {
  constructor(root, src) {
    this.el = document.createElement("div");
    this.el.className = "racer-chip player-chip";
    this.el.innerHTML = `
      <img alt="اللاعب" draggable="false" />
      <span class="place"></span>
    `;
    this.el.querySelector("img").src = src;
    root.appendChild(this.el);
    this.placeEl = this.el.querySelector(".place");
  }

  setPlace(place) {
    this.placeEl.textContent = place === 1 ? "1st" : "2nd";
    this.el.dataset.place = String(place);
  }
}

export class BotIndicator {
  constructor(root, src) {
    this.el = document.createElement("div");
    this.el.className = "racer-chip bot-chip";
    this.el.innerHTML = `
      <img alt="حكيم" draggable="false" />
      <span class="place"></span>
    `;
    this.el.querySelector("img").src = src;
    root.appendChild(this.el);
    this.placeEl = this.el.querySelector(".place");
  }

  setPlace(place) {
    this.placeEl.textContent = place === 1 ? "1st" : "2nd";
    this.el.dataset.place = String(place);
  }
}
