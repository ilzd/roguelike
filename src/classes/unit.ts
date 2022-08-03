import Phaser from 'phaser'
import { GameEvents } from '../enums/events.enum'
import { IntensityEffect } from '../models/effect.model'
import { UnitConfig } from '../models/unit.model'
import PlayScene from '../scenes/play'
import Attack from './attacks/attack'
import Skill from './skills/skill'

export default abstract class Unit {
  public static readonly DATA_KEY = 'unit'

  private scene: Phaser.Scene
  public readonly id: number
  protected sprite: Phaser.Physics.Arcade.Sprite
  private moveDir = new Phaser.Math.Vector2(0, 0)
  private lookDir = new Phaser.Math.Vector2(0, 0)
  protected attack: Attack
  protected skill: Skill

  // stats
  private maxLife = 100
  private life = this.maxLife
  private moveSpeed = 128;

  // negative effects
  private stunned = false
  private stunDuration = 0
  private silenced = false
  private silenceDuration = 0
  private rooted = false
  private rootDuration = 0
  private slow = 0
  private slowEffects: IntensityEffect[] = []

  //positive effects
  private fast = 0
  private fastEffects: IntensityEffect[] = []

  constructor (scene: PlayScene, x: number, y: number, key: string, config: UnitConfig) {
    this.scene = scene
    this.id = scene.getUniqueId()
    this.createSprite(x, y, key)

    this.initialize(config)
  }

  private initialize (config: UnitConfig) {
    if (config.maxLife) {
      this.maxLife = config.maxLife
      this.life = this.maxLife
    }
    if (config.moveSpeed) this.moveSpeed = config.moveSpeed
  }

  private createSprite (x: number, y: number, key: string) {
    this.sprite = this.scene.physics.add.sprite(x, y, key)
      .setCircle(20)
    this.sprite.setData(Unit.DATA_KEY, this)
  }

  private move () {
    if (this.stunned || this.rooted || this.skill.isActivating()) return

    const modifier = (1 - this.slow + this.fast)

    let speed = this.moveSpeed
    if (this.attack.isActivating()) speed *= .5
    speed *= modifier

    this.sprite.setVelocity(this.moveDir.x * speed, this.moveDir.y * speed)
  }

  private updateAttack (delta: number) {
    this.attack.update(delta)
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
  }

  getSprite () {
    return this.sprite
  }

  update (delta: number) {
    this.updateDebuffs(delta)
    this.updateBuffs(delta)
    this.move()
    this.updateAttack(delta)
    this.updateCast(delta)

    this.sprite.setDepth(this.sprite.y)
  }

  setMoveDir (x: number, y: number) {
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

     this.attack.beginAttack()
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

  applyStun (duration: number) {
    if (duration <= 0) return

    this.stunned = true
    this.stunDuration = Math.max(duration, this.stunDuration)
    this.stopMovement()
    this.attack.cancelAttack()
    this.skill.cancelCast()
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
    console.log(`received slow ${newSlow.intensity} - ${newSlow.duration}`)
    const betterSlow = this.slowEffects.find(slowEffect => slowEffect.duration >= newSlow.duration && slowEffect.intensity >= newSlow.intensity)
    if (betterSlow) return
    console.log(`added slow ${newSlow.intensity} - ${newSlow.duration}`)
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
    console.log(`received fast ${newFast.intensity} - ${newFast.duration}`)
    const betterFast = this.fastEffects.find(fastEffect => fastEffect.duration >= newFast.duration && fastEffect.intensity >= newFast.intensity)
    if (betterFast) return
    console.log(`added fast ${newFast.intensity} - ${newFast.duration}`)
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

  teleport (x: number, y: number) {
    this.sprite.setPosition(x, y)
  }
}