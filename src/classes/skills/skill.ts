import { SkillConfig } from '../../models/skill.model'
import PlayScene from '../../scenes/play'
import Unit from '../unit'

export default abstract class Skill {
  protected scene: PlayScene
  protected owner: Unit
  private casting = false
  private activating = false
  private onColdown = false
  private coldownTime = 10
  private coldownCurr: number
  private activationTime = 0.5
  private activationCurr: number

  constructor(scene: PlayScene, owner: Unit, config: SkillConfig) {
    this.scene = scene
    this.owner = owner

    this.initialize(config)
  }

  initialize(config: SkillConfig) {
    this.coldownTime = config.coldown
    this.activationTime = config.activationTime
  }

  update (delta: number) {
    this.updateSkill(delta)
  }

  isCasting() {
    return this.casting
  }

  isActivating() {
    return this.activating
  }

  isOnColdown() {
    return this.onColdown
  }

  beginCast() {
    if(this.isCasting()) return

    this.casting = true
    this.activating = true
    this.activationCurr = this.activationTime
    this.owner.stopMovement()
  }

  cancelCast () {
    if (this.isOnColdown()) return

    this.casting = false
    this.activating = false
  }
  
  private updateSkill(delta: number) {
    if(!this.isCasting()) return

    if (this.isActivating()) {
      this.activationCurr -= delta
      if (this.activationCurr <= 0) this.releaseCast()
      return
    }

    this.coldownCurr -= delta
    if (this.coldownCurr <= 0) this.finishCast()
  }

  private releaseCast() {
    this.activating = false
    this.onColdown = true
    this.coldownCurr = this.coldownTime
    this.cast()
  }

  private finishCast() {
    this.casting = false
    this.onColdown = false
  }

  protected abstract cast(): void
}