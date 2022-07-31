import Unit from './unit'

export default class Player extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number){
    super(scene, x, y, 'player')
    this.sprite.body.setOffset(0, 40)
  }
}