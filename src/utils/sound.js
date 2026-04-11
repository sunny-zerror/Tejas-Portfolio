class SoundManager {
  constructor() {
    this.sounds = {};
  }

  init() {
    if (typeof window === "undefined") return;

    this.sounds.click = new Audio("/music/click.mp3");
    this.sounds.fx = new Audio("/music/fx.mp3");

    Object.values(this.sounds).forEach((audio) => {
      audio.preload = "auto";
    });
  }

  play(name) {
    const base = this.sounds[name];
    if (!base) return;

    const audio = base.cloneNode();
    audio.volume = base.volume;
    audio.play().catch(() => { });
  }
}

export const sound = new SoundManager();