import Phaser from 'phaser'

export default abstract class Unit {
  public static readonly DATA_KEY = 'unit'

  private scene: Phaser.Scene
  protected sprite: Phaser.Physics.Arcade.Sprite
  private moveSpeed = 150;
  private moveDir = new Phaser.Math.Vector2(0, 0)
  private maxLife = 100
  private life = this.maxLife

  constructor (scene: Phaser.Scene, x: number, y: number, key: string) {
    this.scene = scene
    this.createSprite(x, y, key)
    
  }

  private createSprite (x: number, y: number, key: string) {
    this.sprite = this.scene.physics.add.sprite(x, y, key)
    .setOrigin(0.5, 1)
      .setCircle(20)
    this.sprite.setData(Unit.DATA_KEY, this)
  }

  getSprite () {
    return this.sprite
  }

  update () {
    this.sprite.setVelocity(this.moveDir.x * this.moveSpeed, this.moveDir.y * this.moveSpeed)
  }

  setMoveDir (x: number, y: number) {
    this.moveDir.set(x, y).normalize()
  }
}