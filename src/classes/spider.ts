import Unit from './unit'

export default class Spider extends Unit {
  constructor(scene: Phaser.Scene, x: number, y: number){
    super(scene, x, y, 'spider')
  }
}