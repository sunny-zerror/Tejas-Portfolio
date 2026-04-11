class SoundManager {
  constructor() {
    this.click = null;
  }

  init() {
    if (typeof window === "undefined") return;

    this.click = new Audio("/music/click.mp3");
    this.click.preload = "auto";
  }

  playClick() {
    if (!this.click) return;

    this.click.currentTime = 0;
    this.click.play().catch(() => {});
  }
}

export const sound = new SoundManager();