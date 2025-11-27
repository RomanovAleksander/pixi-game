import { Assets, Container, Graphics, Text, TextStyle } from 'pixi.js';

import { IScene, SceneManager } from '../SceneManager';
import { GameScene } from './GameScene';
import { SoundManager } from "../game/SoundManager";

export class ResultScene extends Container implements IScene {
  constructor(isWin: boolean, stars: number = 0, levelId: number = 0) {
    super();

    this.createMessage(isWin, stars);
    this.createButtons(isWin, levelId);
  }

  public update(framesPassed: number): void {}

  private createMessage(isWin: boolean, stars: number): void {
    const titleString = isWin ? "Перемогаааа!" : "Поразка...";
    const subString = isWin
      ? "Ти молодець, я пишаюсь тобою"
      : "Не хвилюйся, наступного разу все вийде ;)";
    const color = isWin ? '#ffffff' : '#7f8585';

    const titleStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 48,
      fontWeight: 'bold',
      fill: color,
    });

    const titleText = new Text({ text: titleString, style: titleStyle });
    titleText.anchor.set(0.5);
    titleText.x = SceneManager.width / 2;
    titleText.y = SceneManager.height / 2 - 120;
    this.addChild(titleText);

    const subStyle = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fontWeight: 'normal',
      fill: '#b7b7b7',
      align: 'center'
    });

    const subText = new Text({ text: subString, style: subStyle });
    subText.anchor.set(0.5);
    subText.x = SceneManager.width / 2;
    subText.y = titleText.y + 50;
    this.addChild(subText);

    if (isWin) {
      const STAR_SIZE = 40;
      const TOTAL_COUNT = 3;

      const totalStarsWidth = TOTAL_COUNT * STAR_SIZE * 1.2;
      const START_X = (SceneManager.width - totalStarsWidth) / 2 + STAR_SIZE / 2;

      for (let i = 0; i < TOTAL_COUNT; i++) {
        const starColor = i < stars ? 0xFFD700 : 0x888888;

        const starGraphic = new Graphics();

        starGraphic.beginFill(starColor);
        starGraphic.drawStar(0, 0, 5, STAR_SIZE / 2, STAR_SIZE / 4);
        starGraphic.endFill();

        starGraphic.x = START_X + i * STAR_SIZE * 1.2;
        starGraphic.y = subText.y + 50;

        this.addChild(starGraphic);
      }
    }
  }

  private createButtons(isWin: boolean, currentLevelId: number): void {
    const levels = Assets.get('levels');
    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 24,
      fill: '#ffffff',
    });

    if (isWin) {
      const nextLevelId = currentLevelId + 1;

      if (levels && levels.levels.length > nextLevelId) {
        const nextLevelBtn = new Text({ text: "Наступний рівень >>>", style });
        nextLevelBtn.anchor.set(0.5);
        nextLevelBtn.x = SceneManager.width / 2;
        nextLevelBtn.y = SceneManager.height / 2 + 60;

        nextLevelBtn.eventMode = 'static';
        nextLevelBtn.cursor = 'pointer';

        nextLevelBtn.on('pointerdown', () => {
          SceneManager.changeScene(new GameScene(nextLevelId));
        });

        this.addChild(nextLevelBtn);

      } else {
        const endMessage = new Text({ text: "Гру завершено! Тримай кубок 🏆", style });
        endMessage.anchor.set(0.5);
        endMessage.x = SceneManager.width / 2;
        endMessage.y = SceneManager.height / 2 + 50;

        this.addChild(endMessage);

        SoundManager.play('sound_applause', 0.5);
      }
    } else {
      const replayBtn = new Text({ text: "Повторити ще раз", style });
      replayBtn.anchor.set(0.5);
      replayBtn.x = SceneManager.width / 2;
      replayBtn.y = SceneManager.height / 2 + 50;

      replayBtn.eventMode = 'static';
      replayBtn.cursor = 'pointer';

      replayBtn.on('pointerdown', () => {
        SceneManager.changeScene(new GameScene(currentLevelId));
      });

      this.addChild(replayBtn);
    }
  }
}
