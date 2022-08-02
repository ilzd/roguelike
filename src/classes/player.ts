import { UnitConfig } from '../models/unit.model'
import PlayScene from '../scenes/play'
import Bow from './bow'
import Unit from './unit'

export default class Player extends Unit {
  static readonly CONFIG: UnitConfig = {
    maxLife: 100,
    moveSpeed: 600
  }
  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, 'player', Player.CONFIG)
    this.attack = new Bow(scene, this)
    this.sprite.body.setOffset(0, 40)
  }
}