import { UnitConfig } from '../../models/unit.model'
import PlayScene from '../../scenes/play'
import Bow from '../attacks/bow'
import Controller from '../controller/controller'
import Teleport from '../skills/teleport'
import Unit from './unit'

export default class Spider extends Unit {
  static readonly CONFIG: UnitConfig = {
    key: 'character',
    origX: 0.5,
    origY: 0.65,
    maxLife: 30,
    moveSpeed: 85,
    radius: 13,
    scale: 1.5
  }

  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, Spider.CONFIG)
    this.weapon = new Bow(scene, this)
    this.skill = new Teleport(scene, this)
  }
}