import PlayScene from '../../scenes/play'
import Unit from '../units/unit'

export default abstract class Controller {
  protected readonly scene: PlayScene
  protected readonly target: Unit

  constructor(scene: PlayScene, target: Unit) {
    this.scene = scene
    this.target = target
  }

  public abstract update(): void
}