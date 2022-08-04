import { UnitConfig } from '../../models/unit.model'
import PlayScene from '../../scenes/play'
import Bow from '../attacks/bow'
import Dash from '../skills/dash'
import Teleport from '../skills/teleport'
import Unit from './unit'

export default class Player extends Unit {
  static readonly CONFIG: UnitConfig = {
    maxLife: 100,
    moveSpeed: 250,
    radius: 20
  }
  
  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, 'player', Player.CONFIG)
    this.weapon = new Bow(scene, this)
    this.skill = new Dash(scene, this)
    this.sprite.body.setOffset(-5, 40)
  }
}