import Phaser from 'phaser'
import PlayScene from '../../scenes/play'
import Unit from '../units/unit'
import Controller from './controller'

export default class ManualController extends Controller {
  private up: Phaser.Input.Keyboard.Key
  private down: Phaser.Input.Keyboard.Key
  private left: Phaser.Input.Keyboard.Key
  private right: Phaser.Input.Keyboard.Key
  private cast: Phaser.Input.Keyboard.Key

  constructor (scene: PlayScene, unit: Unit) {
    super(scene, unit)
    this.initializeKeys()
  }

  private initializeKeys () {
    this.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.cast = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
  }

  private checkDirections () {
    const dir = new Phaser.Math.Vector2()
    if (this.up.isDown) dir.y--
    if (this.down.isDown) dir.y++
    if (this.left.isDown) dir.x--
    if (this.right.isDown) dir.x++

    return dir
  }

  private checkAttack () {
    return this.scene.input.activePointer.isDown
  }

  private checkCast() {
    return this.cast.isDown
  }

  update() {
    const inputDir = this.checkDirections()
    const pointerPos = this.scene.getPointerWorldPosition()
    this.unit.setMoveDir(inputDir.x, inputDir.y)
    this.unit.lookAt(pointerPos.x, pointerPos.y)
    if (this.checkAttack()) this.unit.beginAttack()
    if (this.checkCast()) this.unit.beginCast()
  }
}