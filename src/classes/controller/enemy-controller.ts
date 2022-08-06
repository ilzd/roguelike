import Phaser from 'phaser'
import PlayScene from '../../scenes/play'
import Unit from '../units/unit'
import Controller from './controller'

export default class EnemyController extends Controller {
  private readonly target: Unit

  constructor (scene: PlayScene, unit: Unit) {
    super(scene, unit)

    this.target = scene.player
  }

  update() {
    const unitPos = this.unit.getPos()
    const targetPos = this.target.getPos()
    this.unit.lookAt(targetPos.x, targetPos.y)

    const deltaPos = targetPos.subtract(unitPos)
    const distSq = deltaPos.lengthSq()

    const weaponRangeSq = Math.pow(this.unit.weapon?.getRange(), 2)
    if(distSq > weaponRangeSq) {
      this.unit.setMoveDir(deltaPos.x, deltaPos.y)
    } else {
      this.unit.setMoveDir(0, 0)
      this.unit.stopMovement()
      this.unit.beginAttack()
    }
  }
}