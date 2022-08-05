import Phaser from 'phaser'
import PlayScene from '../../scenes/play'
import Unit from '../units/unit'
import Controller from './controller'

export default class EnemyController extends Controller {

  constructor (scene: PlayScene, target: Unit) {
    super(scene, target)
  }

  update() {
  }
}