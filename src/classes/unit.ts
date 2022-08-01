import Phaser from 'phaser'
import { GameEvents } from '../enums/events.enum'
import PlayScene from '../scenes/play'
import Attack from './attack'

export default abstract class Unit {
  public static readonly DATA_KEY = 'unit'

  private scene: Phaser.Scene
  public readonly id: number
  protected sprite: Phaser.Physics.Arcade.Sprite
  private moveSpeed = 128;
  private moveDir = new Phaser.Math.Vector2(0, 0)
  private lookDir = new Phaser.Math.Vector2(0, 0)
  private maxLife = 100
  private life = this.maxLife
  protected attack: Attack

  constructor (scene: PlayScene, x: number, y: number, key: string) {
    this.scene = scene
    this.id = scene.getUniqueId()
    this.createSprite(x, y, key)
  }

  private createSprite (x: number, y: number, key: string) {
    this.sprite = this.scene.physics.add.sprite(x, y, key)
      .setOrigin(0.5, 1)
      .setCircle(20)
    this.sprite.setData(Unit.DATA_KEY, this)
  }

  private move () {
    let speed = this.moveSpeed
    if (this.attack.isAttacking()) speed *= .5

    this.sprite.setVelocity(this.moveDir.x * speed, this.moveDir.y * speed)
  }

  private die() {
    this.scene.events.emit(GameEvents.UNIT_DIED, this)
  }

  getSprite () {
    return this.sprite
  }

  update (delta: number) {
    this.move()
    this.attack.update(delta)
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
    console.log(`Dealt ${amount} damage`)
  }

  beginAttack () {
    this.attack.beginAttack()
  }

  getPos() {
    return new Phaser.Math.Vector2(this.sprite.x, this.sprite.y)
  }

  getLookDir() {
    return this.lookDir.clone()
  }
}