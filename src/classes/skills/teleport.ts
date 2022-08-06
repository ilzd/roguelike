import { SkillConfig } from '../../models/skill.model'
import PlayScene from '../../scenes/play'
import Unit from '../units/unit'
import Skill from './skill'

export default class Teleport extends Skill {
  static readonly CONFIG: SkillConfig = {
    coldown: 4,
    activationTime: 0
  }
  private readonly DISTANCE = 200

  constructor (scene: PlayScene, owner: Unit) {
    super(scene, owner, Teleport.CONFIG)
  }

  cast (): void {
    const destination = this.owner.getPos()
    let direction = this.owner.getMoveDir()
    if(direction.x === 0 && direction.y === 0) direction = this.owner.getLookDir()

    destination.add(direction.scale(this.DISTANCE))
    this.owner.teleport(destination.x, destination.y)
  }
}