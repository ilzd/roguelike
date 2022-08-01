import Phaser from 'phaser'
import MenuScene from './menu'

export default class LoadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'loascene' 

  constructor() {
    super(LoadScene.SCENE_KEY);
  }

  preload() {
    this.load.image('player', 'assets/images/avatar.png')
    this.load.image('spider', 'assets/images/aranha.png')
    this.load.image('grass', 'assets/images/grass.png')
    this.load.image('arrow', 'assets/images/arrow.png')
  }

  create() {
    this.scene.start(MenuScene.SCENE_KEY)
  }
}
