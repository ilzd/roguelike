import Phaser from 'phaser'
import MenuScene from './menu'

export default class LoadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'loascene'

  constructor () {
    super(LoadScene.SCENE_KEY);
  }

  preload () {
    this.load.image('spider', 'assets/images/aranha.png')
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('tileset', 'assets/tilesets/tileset.png')
    this.load.spritesheet('character', 'assets/spritesheets/character.png', { frameWidth: 64, frameHeight: 64 })
    this.load.json('animations', 'assets/jsons/animations.json')

    this.load.tilemapTiledJSON('map1', 'assets/maps/map1.json')

    this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, 'LOADING', { fontSize: '30px' }).setOrigin(0.5, 1)

    const loadBox = this.add.graphics()
    const loadBar = this.add.graphics()
    loadBox.lineStyle(2, 0xFFFFFF)
    loadBox.strokeRect(this.cameras.main.centerX - 250, this.cameras.main.centerY, 500, 30)

    this.load.on(Phaser.Loader.Events.PROGRESS, (progress: number) => {
      loadBar.clear()
      loadBar.fillStyle(0xFFFFFF)
      loadBar.fillRect(this.cameras.main.centerX - 250, this.cameras.main.centerY, progress * 500, 30)
    })

    this.load.on(Phaser.Loader.Events.COMPLETE, function () {
      loadBox.destroy();
      loadBar.destroy();
  });
  }

  create () {
    this.scene.start(MenuScene.SCENE_KEY)
  }
}
