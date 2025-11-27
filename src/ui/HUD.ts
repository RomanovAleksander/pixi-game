import { Container, Text, TextStyle, ColorMatrixFilter } from 'pixi.js';
import { SceneManager } from '../SceneManager';
import { Button } from './Button';

export class HUD extends Container {
  private timeText!: Text;
  private scoreText!: Text;
  public muteButton: Button;
  public pauseButton: Button;
  private muteIconText: Text;
  public boosterButton: Container;

  constructor(totalEnemies: number) {
    super();

    const center = SceneManager.width / 2;

    this.boosterButton = new Button('+10 сек', center - 50, 20, 0xCCCCCC, 100, 40);
    this.addChild(this.boosterButton);

    this.pauseButton = new Button('Пауза', center + 70, 20, 0x555555, 100, 40);
    this.addChild(this.pauseButton);

    this.muteButton = new Button('🔊', center - 170, 20, 0x555555, 100, 40);
    this.muteIconText = this.muteButton.buttonText;
    const monochromeFilter = new ColorMatrixFilter();
    monochromeFilter.desaturate();
    this.muteButton.filters = [monochromeFilter];
    this.addChild(this.muteButton);

    this.createUI(totalEnemies);
  }

  private createUI(totalEnemies: number): void {
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'bold',
      fill: '#ffffff',
    });

    this.timeText = new Text({ text: 'Час: 00:00', style });
    this.timeText.x = 20;
    this.timeText.y = 20;
    this.addChild(this.timeText);

    this.scoreText = new Text({ text: `Вороги: 0 / ${totalEnemies}`, style });
    this.scoreText.anchor.set(1, 0);
    this.scoreText.x = SceneManager.width - 20;
    this.scoreText.y = 20;

    this.addChild(this.scoreText);
  }

  public updateTimer(secondsLeft: number): void {
    const seconds = Math.max(0, Math.ceil(secondsLeft));
    this.timeText.text = `Час: ${seconds}`;

    if (seconds <= 10) {
      this.timeText.style.fill = '#ff0000';
    } else {
      this.timeText.style.fill = '#ffffff';
    }
  }

  public updateScore(killed: number, total: number): void {
    this.scoreText.text = `Вороги: ${killed} / ${total}`;
  }

  public updateMuteVisual(isMuted: boolean): void {
    this.muteIconText.text = isMuted ? '🔇' : '🔊';
  }

  public disableBooster(): void {
    this.boosterButton.eventMode = 'none';
    this.boosterButton.alpha = 0.5;
  }
}
