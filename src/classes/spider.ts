import { UnitConfig } from '../models/unit.model'
import PlayScene from '../scenes/play'
import Bow from './attacks/bow'
import Teleport from './skills/teleport'
import Unit from './unit'

export default class Spider extends Unit {
  static readonly CONFIG: UnitConfig = {
    maxLife: 20,
    moveSpeed: 100
  }

  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, 'spider', Spider.CONFIG)
    this.attack = new Bow(scene, this)
    this.skill = new Teleport(scene, this)
  }
}