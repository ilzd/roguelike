import Phaser from 'phaser';
import MenuScene from './menu';

export default class LoadScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'LoadScene' 

  constructor() {
    super(LoadScene.SCENE_KEY);
  }

  preload() {
    console.log('Load Scene: preload')
  }

  create() {
    console.log('Load Scene: create')
    this.scene.start(MenuScene.SCENE_KEY)
  }
}
