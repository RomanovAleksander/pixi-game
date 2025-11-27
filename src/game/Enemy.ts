import { Container, AnimatedSprite, Texture, ColorMatrixFilter } from 'pixi.js';

import { IEnemyConfig } from '../types';

import { SceneManager } from '../SceneManager';
import { SoundManager } from './SoundManager';

export class Enemy extends Container {
  public speed: number;
  private animatedSprite: AnimatedSprite;

  // Напрямки руху (1 або -1)
  private directionX: number;
  private directionY: number;

  constructor(config: IEnemyConfig) {
    super();

    this.x = config.x;
    this.y = config.y;
    this.speed = config.speed;

    const textures: Texture[] = [];
    const FRAME_COUNT = 30;

    for (let i = 0; i < FRAME_COUNT; i++) {
      // padStart(2, '0') забезпечує, що 0 стане 00, 1 стане 01 і т.д.
      const frameIndex = i.toString().padStart(2, '0');
      const frameName = `rollSequence00${frameIndex}.png`;

      // Pixi автоматично реєструє кожну текстуру з атласу під її іменем.
      // Texture.from() дістає цей зареєстрований кадр.
      textures.push(Texture.from(frameName));
    }

    this.animatedSprite = new AnimatedSprite(textures);
    this.animatedSprite.animationSpeed = 0.2; // Швидкість (0.1 = 10 кадрів за секунду)
    this.animatedSprite.play();
    this.animatedSprite.anchor.set(0.5);
    this.animatedSprite.rotation = Math.PI / 2;
    this.animatedSprite.scale.set(0.75);

    const monochromeFilter = new ColorMatrixFilter();
    monochromeFilter.desaturate();
    this.animatedSprite.filters = [monochromeFilter];

    this.addChild(this.animatedSprite);

    // this.sprite = Sprite.from(config.type);
    // this.sprite.anchor.set(0.5);
    // this.sprite.scale.set(2);
    // this.addChild(this.sprite);

    // Визначання випадкового початкового напрямку
    // Math.random() > 0.5 дає true або false, це буде 1 або -1
    this.directionX = Math.random() > 0.5 ? 1 : -1;
    this.directionY = Math.random() > 0.5 ? 1 : -1;

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.on('pointerdown', this.kill, this);
  }

  public kill(): void {
    SoundManager.play('sound_shoot');
    this.destroy({ children: true });
  }

  public update(delta: number): void {
    // Рух по обох осях
    this.x += this.speed * this.directionX * delta;
    this.y += this.speed * this.directionY * delta;

    if (this.x < 0 || this.x > SceneManager.width) {
      this.directionX *= -1; // Зміна напрямку (було 1 стало -1, і навпаки)
      // Корекція позиції, щоб ворог не застряг у стіні
      this.x = Math.max(0, Math.min(this.x, SceneManager.width));
    }

    if (this.y < 0 || this.y > SceneManager.height) {
      this.directionY *= -1;
      this.y = Math.max(0, Math.min(this.y, SceneManager.height));
    }
  }
}
