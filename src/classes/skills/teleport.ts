import { SkillConfig } from '../../models/skill.model'
import PlayScene from '../../scenes/play'
import Unit from '../unit'
import Skill from './skill'

export default class Teleport extends Skill {
  static readonly CONFIG: SkillConfig = {
    coldown: 1,
    activationTime: 0
  }
  private readonly DISTANCE = 200

  constructor (scene: PlayScene, owner: Unit) {
    super(scene, owner, Teleport.CONFIG)
  }

  cast (): void {
    const destination = this.owner.getPos()
    destination.add(this.owner.getLookDir().scale(this.DISTANCE))
    this.owner.teleport(destination.x, destination.y)
  }
}