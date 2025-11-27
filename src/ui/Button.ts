import { Container, Graphics, Text, TextStyle } from 'pixi.js';

export class Button extends Container {
  private static DEFAULT_WIDTH = 100;
  private static DEFAULT_HEIGHT = 40;
  private static DEFAULT_COLOR = 0x555555;
  public buttonText: Text;

  constructor(
    text: string,
    x: number,
    y: number,
    backgroundColor: number = Button.DEFAULT_COLOR,
    width: number = Button.DEFAULT_WIDTH,
    height: number = Button.DEFAULT_HEIGHT
  ) {
    super();

    const background = new Graphics();

    background.beginFill(backgroundColor);
    background.drawRoundedRect(0, 0, width, height, 10);
    background.endFill();

    this.addChild(background);

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 18,
      fontWeight: 'bold',
      fill:(backgroundColor === 0xCCCCCC) ? 0x000000 : 0xFFFFFF,
    });

    this.buttonText = new Text({ text: text, style });
    this.buttonText.anchor.set(0.5);
    this.buttonText.x = width / 2;
    this.buttonText.y = height / 2;

    this.addChild(this.buttonText);

    this.x = x;
    this.y = y;
    this.eventMode = 'static';
    this.cursor = 'pointer';
  }

}
