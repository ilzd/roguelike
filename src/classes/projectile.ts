import { GameEvents } from '../enums/events.enum'
import { ProjectileConfig } from '../models/projectile.model'
import PlayScene from '../scenes/play'
import Unit from './unit'

export default class Projectile {
  public static readonly DATA_KEY = 'projectile'
  private readonly scene: PlayScene
  private readonly owner: Unit
  protected sprite: Phaser.Physics.Arcade.Sprite
  private unitsHit: Unit[] = []
  private moveDir = new Phaser.Math.Vector2()
  private moveSpeed = 600
  private rangeMax = 600
  private rangeCurr = 0
  private damage: number
  private radius = 4
  private pierce = 0


  constructor (scene: PlayScene, owner: Unit, config: ProjectileConfig) {
    this.scene = scene
    this.owner = owner
    this.initialize(config)
  }

  private initialize (config: ProjectileConfig) {
    if (config.radius) this.radius = config.radius
    this.createSprite(config.x, config.y, config.key, config.origX, config.origY)
    this.setMoveDir(config.dirX, config.dirY)
    this.damage = config.damage
    if (config.range) this.rangeMax = config.range
    if (config.moveSpeed) this.moveSpeed = config.moveSpeed
    if (config.pierce) this.pierce = config.pierce
  }

  private createSprite (x: number, y: number, key: string, originX: number, originY: number) {
    this.sprite = this.scene.physics.add.sprite(x, y, key)
    .setCircle(this.radius)
    .setOrigin(originX, originY)

    this.sprite.setOffset(this.sprite.width * originX - this.radius, this.sprite.height * originY - this.radius)
    this.sprite.setData(Projectile.DATA_KEY, this)
  }

  public setMoveDir (x: number, y: number) {
    this.moveDir.set(x, y).normalize()
    this.sprite.setRotation(this.moveDir.angle())
  }

  update (delta: number) {
    this.rangeCurr += delta * this.moveSpeed
    if (this.rangeCurr >= this.rangeMax) {
      this.die()
      return
    }
    this.move()
  }

  private move () {
    this.sprite.setVelocity(this.moveDir.x * this.moveSpeed, this.moveDir.y * this.moveSpeed)
  }

  private die() {
    this.scene.events.emit(GameEvents.PROJECTILE_DIED, this)
  }

  getOwner() {
    return this.owner
  }

  getSprite () {
    return this.sprite
  }

  hit(unit: Unit) {
    if(this.unitsHit.includes(unit)) return
    this.unitsHit.push(unit)
    unit.takeDamage(this.damage, this.owner)

    if(this.pierce > 0) {
      this.pierce--
      return
    }

    this.die()
  }
}