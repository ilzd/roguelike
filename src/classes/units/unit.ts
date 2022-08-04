import Phaser from 'phaser'
import { GameEvents } from '../../enums/events.enum'
import { IntensityEffect } from '../../models/effect.model'
import { UnitConfig } from '../../models/unit.model'
import PlayScene from '../../scenes/play'
import Weapon from '../attacks/attack'
import Skill from '../skills/skill'

export default abstract class Unit {
  public static readonly DATA_KEY = 'unit'

  private scene: Phaser.Scene
  public readonly id: number
  protected sprite: Phaser.Physics.Arcade.Sprite
  private moveDir = new Phaser.Math.Vector2(0, 0)
  private lookDir = new Phaser.Math.Vector2(0, 0)
  protected weapon: Weapon
  protected skill: Skill

  // stats
  private maxLife = 100
  private life = this.maxLife
  private moveSpeed = 128;
  private radius = 20

  // negative effects
  private stunned = false
  private stunDuration = 0
  private silenced = false
  private silenceDuration = 0
  private rooted = false
  private rootDuration = 0
  private slow = 0
  private slowEffects: IntensityEffect[] = []
  private sliding = false
  private slideDuration = 0

  //positive effects
  private fast = 0
  private fastEffects: IntensityEffect[] = []
  private phasing = false
  private phasingDuration  = 0

  constructor (scene: PlayScene, x: number, y: number, key: string, config: UnitConfig) {
    this.scene = scene
    this.id = scene.getUniqueId()
    this.initialize(config)
    this.createSprite(x, y, key)
  }

  private initialize (config: UnitConfig) {
    if (config.maxLife) {
      this.maxLife = config.maxLife
      this.life = this.maxLife
    }
    if (config.moveSpeed) this.moveSpeed = config.moveSpeed
    if (config.radius) this.radius = config.radius
  }

  private createSprite (x: number, y: number, key: string) {
    this.sprite = this.scene.physics.add.sprite(x, y, key)
      .setCircle(this.radius)
    this.sprite.setData(Unit.DATA_KEY, this)
  }

  private move () {
    if (this.stunned || this.rooted || this.skill.isActivating()) return

    const modifier = (1 - this.slow + this.fast)

    let speed = this.moveSpeed
    if (this.weapon.isActivating()) speed *= .5
    speed *= modifier

    this.sprite.setVelocity(this.moveDir.x * speed, this.moveDir.y * speed)
  }

  private updateWeapon (delta: number) {
    this.weapon.update(delta)
  }

  private updateCast (delta: number) {
    this.skill.update(delta)
  }

  private die () {
    this.scene.events.emit(GameEvents.UNIT_DIED, this)
  }

  stopMovement () {
    this.sprite.setVelocity(0, 0)
  }

  private updateDebuffs (delta: number) {
    if (this.stunned) {
      this.stunDuration -= delta
      if (this.stunDuration <= 0) this.stunned = false
    }

    if (this.sliding) {
      this.slideDuration -= delta
      if (this.slideDuration <= 0) this.sliding = false
    }

    if (this.silenced) {
      this.silenceDuration -= delta
      if (this.silenceDuration <= 0) this.silenced = false
    }

    if (this.rooted) {
      this.rootDuration -= delta
      if (this.rootDuration <= 0) this.rooted = false
    }

    this.slowEffects.forEach((slowEffect, index) => {
      slowEffect.duration -= delta
      if (slowEffect.duration <= 0) this.removeSlow(index)
    })
  }

  private updateBuffs (delta: number) {
    this.fastEffects.forEach((fastEffect, index) => {
      fastEffect.duration -= delta
      if (fastEffect.duration <= 0) this.removeFast(index)
    })

    if (this.phasing) {
      this.phasingDuration -= delta
      if (this.phasingDuration <= 0) {
        this.phasing = false
        this.scene.events.emit(GameEvents.STOP_PHASING, this)
      }
    }
  }

  getSprite () {
    return this.sprite
  }

  update (delta: number) {
    this.updateDebuffs(delta)
    this.updateBuffs(delta)
    this.move()
    this.updateWeapon(delta)
    this.updateCast(delta)

    this.sprite.setDepth(this.sprite.y)
  }

  setMoveDir (x: number, y: number) {
    if(this.sliding) return
    this.moveDir.set(x, y).normalize()
  }

  lookAt (x: number, y: number) {
    this.lookDir.set(x - this.sprite.x, y - this.sprite.y).normalize()
  }

  takeDamage (amount: number, source: Unit) {
    const finalDamage = Math.min(this.life, amount)
    this.life -= finalDamage

    source.dealtDamage(finalDamage)
    if (this.life === 0) this.die()
  }

  dealtDamage (amount: number) {
  }

  beginAttack () {
    if (this.stunned) return

     this.weapon.beginAttack()
  }

  beginCast () {
    if (this.stunned || this.silenced) return
    
    this.skill.beginCast()
  }

  getPos () {
    return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
  }

  getLookDir () {
    return this.lookDir.clone()
  }

  getMoveDir() {
    return this.moveDir.clone()
  }

  applyStun (duration: number) {
    if (duration <= 0) return

    this.stunned = true
    this.stunDuration = Math.max(duration, this.stunDuration)
    this.stopMovement()
    this.weapon.cancelAttack()
    this.skill.cancelCast()
  }

  applySlide (duration: number) {
    if (duration <= 0) return

    this.sliding = true
    this.slideDuration = Math.max(duration, this.slideDuration)
  }

  applySilence (duration: number) {
    if (duration <= 0) return

    this.silenced = true
    this.silenceDuration = Math.max(duration, this.silenceDuration)
    this.skill.cancelCast()
  }

  applyRoot (duration: number) {
    if (duration <= 0) return

    this.rooted = true
    this.rootDuration = Math.max(duration, this.rootDuration)
    this.stopMovement()
  }

  addSlow (newSlow: IntensityEffect) {
    const betterSlow = this.slowEffects.find(slowEffect => slowEffect.duration >= newSlow.duration && slowEffect.intensity >= newSlow.intensity)
    if (betterSlow) return
    this.slowEffects.push(newSlow)
    this.slowEffects.sort((a, b) => b.intensity - a.intensity)

    this.applySlow(newSlow.intensity)
  }

  private removeSlow (index: number) {
    this.slowEffects.splice(index, 1)

    if (!this.slowEffects.length) {
      this.slow = 0
      return
    }
    this.slow = this.slowEffects[0].intensity
  }

  private applySlow (intensity: number) {
    if (intensity > this.slow) this.slow = intensity
  }

  addFast (newFast: IntensityEffect) {
    const betterFast = this.fastEffects.find(fastEffect => fastEffect.duration >= newFast.duration && fastEffect.intensity >= newFast.intensity)
    if (betterFast) return
    this.fastEffects.push(newFast)
    this.fastEffects.sort((a, b) => b.intensity - a.intensity)

    this.applyFast(newFast.intensity)
  }

  private removeFast (index: number) {
    this.fastEffects.splice(index, 1)

    if (!this.fastEffects.length) {
      this.fast = 0
      return
    }
    this.fast = this.fastEffects[0].intensity
  }

  private applyFast (intensity: number) {
    if (intensity > this.fast) this.fast = intensity
  }

  applyPhasing(duration: number) {
    if (duration <= 0) return

    this.phasing = true
    this.phasingDuration = Math.max(duration, this.phasingDuration)
    this.scene.events.emit(GameEvents.START_PHASING, this)    
  }

  teleport (x: number, y: number) {
    this.sprite.setPosition(x, y)
  }
}