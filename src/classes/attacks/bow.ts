import Unit from '../units/unit'
import Weapon from './attack'
import PlayScene from '../../scenes/play'
import { ProjectileConfig } from '../../models/projectile.model'
import Projectile from '../projectile'
import { WeaponConfig } from '../../models/attack.model'

export default class Bow extends Weapon {
  static readonly CONFIG: WeaponConfig = {
    activationTime: 1,
    recoveryTime: 0
  }

  constructor (scene: PlayScene, owner: Unit) {
    super(scene, owner, Bow.CONFIG)
  }

  attack () {
    const newArrow = this.buildArrow()
    this.scene.addProjectile(newArrow)
  }

  buildArrow () {
    const pos = this.owner.getPos()
    const dir = this.owner.getLookDir()
    const config: ProjectileConfig = {
      key: 'arrow',
      origX: 0.87,
      origY: 0.5,
      x: pos.x,
      y: pos.y,
      dirX: dir.x,
      dirY: dir.y,
      damage: 40,
      pierce: 1,
      moveSpeed: 900
    }
    return new Projectile(this.scene, this.owner, config)
  }
}