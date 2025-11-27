import { Application, Assets } from 'pixi.js';
import { SceneManager } from './SceneManager';
import { MenuScene } from './scenes/MenuScene';

(async () => {
  const app = new Application();

  await app.init({
    resizeTo: window,
    backgroundColor: 'black',
  });

  document.body.style.margin = '0';
  app.canvas.style.position = 'absolute';
  document.body.appendChild(app.canvas);

  Assets.add({ alias: 'background', src: 'assets/images/background.jpg' });
  Assets.add({ alias: 'levels', src: 'assets/data/levels.json' });
  Assets.add({ alias: 'sound_shoot', src: 'assets/sounds/laser.ogg' });
  Assets.add({ alias: 'sound_win', src: 'assets/sounds/win.wav' });
  Assets.add({ alias: 'sound_lose', src: 'assets/sounds/over.wav' });
  Assets.add({ alias: 'sound_music', src: 'assets/sounds/music.mp3' });
  Assets.add({ alias: 'sound_applause', src: 'assets/sounds/applause.wav' });
  Assets.add({ alias: 'fighter', src: 'assets/images/fighter.json' });

  await Assets.load([
    'background',
    'levels',
    'sound_shoot',
    'sound_win',
    'sound_lose',
    'sound_music',
    'fighter',
    'sound_applause',
  ]);

  SceneManager.init(app);

  const menu = new MenuScene();
  SceneManager.changeScene(menu);

  app.ticker.add((ticker) => {
    SceneManager.update(ticker.deltaTime);
  });
})();
