import Phaser from 'phaser'
import MenuScene from './menu'

export default class LoadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'loascene' 

  constructor() {
    super(LoadScene.SCENE_KEY);
  }

  preload() {
    this.load.image('spider', 'assets/images/aranha.png')
    this.load.image('arrow', 'assets/images/arrow.png')
    this.load.image('tileset', 'assets/tilesets/tileset.png')

    this.load.spritesheet('character', 'assets/spritesheets/character.png', {frameWidth: 64, frameHeight: 64})
    this.load.json('animations', 'assets/jsons/animations.json')

    this.load.tilemapTiledJSON('map1', 'assets/maps/map1.json')
  }

  create() {
    this.scene.start(MenuScene.SCENE_KEY)
  }
}
