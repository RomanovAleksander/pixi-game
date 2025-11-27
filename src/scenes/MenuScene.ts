import { Container, TextStyle, Text } from 'pixi.js';

import { SceneManager, IScene } from "../SceneManager";
import { GameScene } from './GameScene';

export class MenuScene extends Container implements IScene {
  constructor() {
    super();

    this.createStartButton();
  }

  public update(framesPassed: number): void {}

  private createStartButton(): void {
   const style = new TextStyle({
     fontFamily: 'Arial',
     fontSize: '36px',
     fontWeight: 'bold',
     fill: '#ffffff',
   });

    const button = new Text({ text: 'Почати гру', style });

    button.anchor.set(0.5);
    button.x = SceneManager.width / 2;
    button.y = SceneManager.height / 2;

    button.eventMode = 'static';
    button.cursor = 'pointer';

    button.on('pointerdown', () => {
      SceneManager.changeScene(new GameScene());
    });

    this.addChild(button);
  }
}
