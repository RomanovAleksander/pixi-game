import { sound } from '@pixi/sound';

export class SoundManager {
  private static isMuted: boolean = false;

  public static play(alias: string, volume: number = 1): void {
    if (sound.exists(alias)) {
      sound.play(alias, { volume: volume });
    } else {
      console.warn(`Звук '${alias}' не знайдено!`);
    }
  }

  public static stop(alias: string): void {
    if (sound.exists(alias)) {
      sound.stop(alias);
    }
  }

  public static toggleMute(): boolean {
    this.isMuted = !this.isMuted;

    if (this.isMuted) {
      sound.muteAll();
    } else {
      sound.unmuteAll();
    }

    // @ts-ignore
    sound.volume = this.isMuted ? 0 : 1;

    return this.isMuted;
  }

  public static startBackgroundMusic(alias: string): void {
    if (!sound.exists(alias)) return;

    sound.stop(alias);
    sound.play(alias, { loop: true, volume: 0.5 });
  }
}