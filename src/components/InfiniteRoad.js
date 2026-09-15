import { ROAD_SPEED } from "../config.js";

const SEGMENT_COUNT = 4;
const SEAM_OVERLAP = 14;

export class InfiniteRoad {
  constructor(root, src) {
    this.src = src;
    this.wrap = document.createElement("div");
    this.wrap.className = "road-wrap";
    this.track = document.createElement("div");
    this.track.className = "road-track";
    this.wrap.appendChild(this.track);
    root.appendChild(this.wrap);

    this.segments = [];
    this.positions = [];
    this.segmentHeight = 0;
    this.speed = ROAD_SPEED;
    this.naturalWidth = 1024;
    this.naturalHeight = 1446;
    this.viewportHeight = window.innerHeight;

    for (let i = 0; i < SEGMENT_COUNT; i += 1) {
      const img = document.createElement("img");
      img.className = "road-segment";
      img.src = src;
      img.alt = "";
      img.draggable = false;
      img.decoding = "sync";
      this.track.appendChild(img);
      this.segments.push(img);
      this.positions.push(0);
    }
  }

  setSpeed(speed) {
    this.speed = speed;
  }

  layout() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.viewportHeight = vh;
    const maxWidth = Math.min(vw * 0.74, vh * 0.78 * (this.naturalWidth / this.naturalHeight));
    const width = Math.max(300, maxWidth);
    const height = width * (this.naturalHeight / this.naturalWidth);
    this.segmentHeight = height;
    this.wrap.style.width = `${width}px`;
    this.track.style.width = `${width}px`;
    this.segments.forEach((img) => {
      img.style.width = `${width}px`;
      img.style.height = `${height + SEAM_OVERLAP}px`;
    });
    this.#resetStack();
    return { width, height };
  }

  onImageReady() {
    const first = this.segments[0];
    if (first.naturalWidth) {
      this.naturalWidth = first.naturalWidth;
      this.naturalHeight = first.naturalHeight;
    }
    return this.layout();
  }

  #resetStack() {
    const height = this.segmentHeight;
    for (let i = 0; i < SEGMENT_COUNT; i += 1) {
      this.positions[i] = (i - 2) * height;
    }
    this.#paint();
  }

  update(deltaTime) {
    const height = this.segmentHeight;
    if (!height) return;
    const delta = this.speed * deltaTime;
    const cycle = height * SEGMENT_COUNT;
    for (let i = 0; i < SEGMENT_COUNT; i += 1) {
      this.positions[i] += delta;
      while (this.positions[i] >= this.viewportHeight) {
        this.positions[i] -= cycle;
      }
    }
    this.#paint();
  }

  #paint() {
    for (let i = 0; i < SEGMENT_COUNT; i += 1) {
      this.segments[i].style.transform = `translate3d(0, ${this.positions[i]}px, 0)`;
    }
  }

  get width() {
    return this.wrap.getBoundingClientRect().width;
  }
}
