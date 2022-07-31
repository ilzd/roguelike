import Phaser from 'phaser';

export default class PlayScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'PlayScene' 

  constructor() {
    super(PlayScene.SCENE_KEY);
  }

  create() {
    console.log('Play Scene: create')
  }
}
