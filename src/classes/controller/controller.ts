import PlayScene from '../../scenes/play'
import Unit from '../units/unit'

export default abstract class Controller {
  protected readonly scene: PlayScene
  protected readonly unit: Unit

  constructor(scene: PlayScene, unit: Unit) {
    this.scene = scene
    this.unit = unit
  }

  public abstract update(): void
}