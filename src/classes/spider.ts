import PlayScene from '../scenes/play'
import Bow from './bow'
import Unit from './unit'

export default class Spider extends Unit {
  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, 'spider')
    this.attack = new Bow(scene, this)
  }
}