import PlayScene from '../../scenes/play'
import Unit from '../unit'

export default abstract class Attack {
  protected readonly scene: PlayScene
  protected readonly owner: Unit
  private activationTime = 0.5
  private recoveryTime = 0.5
  private activationCurr = 0
  private recoveryCurr = 0
  private attacking = false
  private activating = false
  private recovering = false

  constructor (scene: PlayScene, owner: Unit) {
    this.scene = scene
    this.owner = owner
  }

  update (delta: number) {
    this.updateAttack(delta)
  }

  beginAttack () {
    if (this.attacking) return

    this.attacking = true
    this.activating = true
    this.activationCurr = this.activationTime
  }

  isAttacking () {
    return this.attacking
  }

  isActivating () {
    return this.activating
  }

  isRecovering () {
    return this.recovering
  }

  cancelAttack () {
    if (this.isRecovering()) return

    this.attacking = false
    this.activating = false
  }

  private updateAttack (delta: number) {
    if (!this.isAttacking()) return

    if (this.isActivating()) {
      this.activationCurr -= delta
      if (this.activationCurr <= 0) this.releaseAttack()
      return
    }

    this.recoveryCurr -= delta
    if (this.recoveryCurr <= 0) this.finishAttack()
  }

  private releaseAttack () {
    this.activating = false
    this.recovering = true
    this.recoveryCurr = this.recoveryTime
    this.attack()
  }

  private finishAttack () {
    this.attacking = false
    this.recovering = false
  }

  protected abstract attack (): void
}