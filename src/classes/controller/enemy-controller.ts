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
    const moveDir = targetPos.subtract(unitPos)
    this.unit.setMoveDir(moveDir.x, moveDir.y)
  }
}