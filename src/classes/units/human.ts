import { UnitConfig } from '../../models/unit.model'
import PlayScene from '../../scenes/play'
import Bow from '../attacks/bow'
import Controller from '../controller/controller'
import Dash from '../skills/dash'
import Teleport from '../skills/teleport'
import Unit from './unit'

export default class Human extends Unit {
  static readonly CONFIG: UnitConfig = {
    key: 'character',
    origX: 0.5,
    origY: 0.65,
    maxLife: 100,
    moveSpeed: 200,
    radius: 13,
    scale: 2
  }
  
  constructor(scene: PlayScene, x: number, y: number){
    super(scene, x, y, Human.CONFIG)
    this.weapon = new Bow(scene, this)
    this.skill = new Teleport(scene, this)
  }
}