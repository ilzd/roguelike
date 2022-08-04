import { SkillConfig } from '../../models/skill.model'
import PlayScene from '../../scenes/play'
import Unit from '../units/unit'
import Skill from './skill'

export default class Dash extends Skill {
  static readonly CONFIG: SkillConfig = {
    coldown: 2,
    activationTime: 0
  }
  private readonly DURATION = .25
  private readonly FAST_INTENSITY = 2

  constructor (scene: PlayScene, owner: Unit) {
    super(scene, owner, Dash.CONFIG)
  }

  cast (): void {
    let direction = this.owner.getMoveDir()
    if(direction.x === 0 && direction.y === 0) direction = this.owner.getLookDir()
    this.owner.setMoveDir(direction.x, direction.y)
    this.owner.addFast({intensity: this.FAST_INTENSITY, duration: this.DURATION})
    this.owner.applySlide(this.DURATION)
  }
}