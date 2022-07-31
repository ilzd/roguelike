import Phaser from 'phaser';
import PlayScene from './play';

export default class MenuScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'menuscene' 

  constructor() {
    super(MenuScene.SCENE_KEY);
  }

  create() {
    this.scene.start(PlayScene.SCENE_KEY)
  }
}
