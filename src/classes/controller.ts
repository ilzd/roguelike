import Phaser from 'phaser'

export default class Controller {
  private scene: Phaser.Scene
  private up: Phaser.Input.Keyboard.Key
  private down: Phaser.Input.Keyboard.Key
  private left: Phaser.Input.Keyboard.Key
  private right: Phaser.Input.Keyboard.Key
  private cast: Phaser.Input.Keyboard.Key

  constructor (scene: Phaser.Scene) {
    this.scene = scene
    this.initializeKeys()
  }

  private initializeKeys () {
    this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.cast = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  checkDirections () {
    const dir = new Phaser.Math.Vector2()
    if (this.up.isDown) dir.y--
    if (this.down.isDown) dir.y++
    if (this.left.isDown) dir.x--
    if (this.right.isDown) dir.x++

    return dir
  }

  checkAttack () {
    return this.scene.input.activePointer.isDown
  }

  checkCast() {
    return this.cast.isDown
  }

  getPointerWorldPosition () {
    this.scene.input.activePointer.updateWorldPoint(this.scene.cameras.main);
    return new Phaser.Math.Vector2(this.scene.input.activePointer.worldX, this.scene.input.activePointer.worldY)
  }
}