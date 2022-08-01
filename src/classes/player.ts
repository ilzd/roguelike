import PlayScene from '../scenes/play'
import Bow from './bow'
import Unit from './unit'

export default class Player extends Unit {
  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, 'player')
    this.attack = new Bow(scene, this)
    this.sprite.body.setOffset(0, 40)
  }
}