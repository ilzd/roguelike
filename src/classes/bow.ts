import Unit from './unit'
import Attack from './attack'
import PlayScene from '../scenes/play'
import { ProjectileConfig } from '../models/projectile.model'
import Projectile from './projectile'

export default class Bow extends Attack {
  constructor (scene: PlayScene, owner: Unit) {
    super(scene, owner)
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
      pierce: 1
    }
    return new Projectile(this.scene, this.owner, config)
  }
}