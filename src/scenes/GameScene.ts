import { Container, Assets, Sprite } from 'pixi.js';
import { IScene, SceneManager } from "../SceneManager";
import { ResultScene } from "./ResultScene";
import { LevelManager } from '../game/LevelManager';
import { Enemy } from '../game/Enemy';
import { IEnemyConfig } from '../types';
import { SoundManager } from '../game/SoundManager';
import { HUD } from '../ui/HUD';

export class GameScene extends Container implements IScene {
  private enemies: Enemy[] = [];
  private levelManager: LevelManager = new LevelManager(0, 0);
  private isGameOver: boolean = false;
  private hud!: HUD;
  private isPaused: boolean = false;
  public currentLevelId: number;
  private enemiesContainer: Container;

  constructor(levelId: number = 0) {
    super();

    this.currentLevelId = levelId;

    this.enemiesContainer = new Container();

    this.createBackground();
    this.addChild(this.enemiesContainer);
    this.createGameplay();
    this.createUI();

    SoundManager.startBackgroundMusic('sound_music');
  }

  public update(framesPassed: number): void {
    if (this.isPaused) return;
    if (this.isGameOver) return;

    const activeEnemiesCount = this.enemies.length;
    this.enemies = this.enemies.filter(enemy => !enemy.destroyed);

    const killedThisFrame = activeEnemiesCount - this.enemies.length;
    if (killedThisFrame > 0) {
      this.levelManager.registerKill();

      this.hud.updateScore(this.levelManager.enemiesKilled, this.levelManager.totalEnemies);
    }

    this.enemies.forEach(enemy => {
      enemy.update(framesPassed);
    });

    const deltaSeconds = framesPassed / 60;

    this.levelManager.update(deltaSeconds);

    this.hud.updateTimer(this.levelManager.timeLeft);

    if (this.levelManager.isWin) {
      SoundManager.stop('sound_music');
      SoundManager.play('sound_win');

      this.isGameOver = true;
      const stars = this.levelManager.getStars();
      SceneManager.changeScene(new ResultScene(true, stars, this.currentLevelId));
    } else if (this.levelManager.isLose) {
      SoundManager.stop('sound_music');
      SoundManager.play('sound_lose');

      this.isGameOver = true;
      SceneManager.changeScene(new ResultScene(false, 0, this.currentLevelId));
    }
  }

  private createBackground(): void {
    const background = Sprite.from('background');

    background.anchor.set(0.5);
    background.x = SceneManager.width / 2;
    background.y = SceneManager.height / 2;

    background.width = SceneManager.width;
    background.height = SceneManager.height;

    this.addChild(background);
  }

  private createGameplay(): void {
    const levelsData = Assets.get('levels');
    const currentLevel = levelsData.levels[this.currentLevelId];

    this.levelManager = new LevelManager(
      currentLevel.timeLimit,
      currentLevel.enemies.length,
    );

    currentLevel.enemies.forEach((enemyConfig: IEnemyConfig) => {
      const enemy = new Enemy(enemyConfig);

      this.enemiesContainer.addChild(enemy);

      this.enemies.push(enemy);
    })
  }

  private createUI(): void {
    this.hud = new HUD(this.levelManager.totalEnemies);

    this.addChild(this.hud);

    this.hud.boosterButton.on('pointerdown', () => {
      if (this.isPaused) return;

      const success = this.levelManager.useBooster();

      if (success) {
        this.hud.disableBooster();
      }
    });

    this.hud.pauseButton.on('pointerdown', () => {
      const isPaused = this.togglePause();
    });

    this.hud.muteButton.on('pointerdown', () => {
      const isMuted = SoundManager.toggleMute();

      this.hud.updateMuteVisual(isMuted);
    });
  }

  public togglePause(): boolean {
    this.isPaused = !this.isPaused;

    this.enemiesContainer.interactiveChildren = !this.isPaused;

    return this.isPaused;
  }
}
