import Phaser from 'phaser';
import LoadScene from './scenes/load';
import MenuScene from './scenes/menu';
import PlayScene from './scenes/play';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  backgroundColor: '#222222',
  scale: {
    width: 1366,
    height: 768,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
        debug: false,
        fixedStep: true,
        fps: 120
    }
  },
  pixelArt: true,
  scene: [LoadScene, MenuScene, PlayScene]  
});
