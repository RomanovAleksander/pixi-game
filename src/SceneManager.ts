import { Application, Container } from 'pixi.js';

export interface IScene extends Container {
  update(framesPassed: number): void;
}

export class SceneManager {
  private static app: Application;
  private static currentScene: IScene;

  public static init(app: Application): void {
    this.app = app;
  }

  public static changeScene(newScene: IScene): void {
    if (this.currentScene) {
      this.currentScene.destroy();
    }

    this.app.stage.addChild(newScene);

    this.currentScene = newScene;
  }

  public static update(framesPassed: number): void {
    if (this.currentScene) {
      this.currentScene.update(framesPassed);
    }
  }

  public static get width(): number {
    return this.app.screen.width;
  }

  public static get height(): number {
    return this.app.screen.height;
  }
}
