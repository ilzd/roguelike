import Phaser from 'phaser';
import PlayScene from './play';

export default class MenuScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'MenuSCene' 

  constructor() {
    super(MenuScene.SCENE_KEY);
  }

  create() {
    console.log('Menu Scene: create')
    this.scene.start(PlayScene.SCENE_KEY)
  }
}
