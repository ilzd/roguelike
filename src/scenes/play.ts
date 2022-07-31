import Phaser from 'phaser'
import Controller from '../classes/controller'
import Player from '../classes/player'
import Spider from '../classes/spider'
import Unit from '../classes/unit'

export default class PlayScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'playscene'
  public static readonly UNITS_DATA_KEY = 'unitsprites'

  private tilemap: Phaser.Tilemaps.Tilemap
  private units: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private player: Unit
  private controller: Controller

  constructor () {
    super(PlayScene.SCENE_KEY);
  }

  create () {
    this.units = this.physics.add.group()
    this.registry.set(PlayScene.UNITS_DATA_KEY, this.units)

    this.creatTilemap()
    this.createPlayer()
    this.createEnemies()
    this.createController()
    this.setupCamera()
    this.setupCollisions()
  }

  update () {
    const inputDir = this.controller.checkDirections()
    this.player.setMoveDir(inputDir.x, inputDir.y)

    this.units.getChildren().forEach(sprite => {
      const unit = sprite.getData(Unit.DATA_KEY) as Unit
      unit.update()
    })
  }

  private creatTilemap () {
    this.tilemap = this.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width: 20,
      height: 20
    })

    const tileset = this.tilemap.addTilesetImage('grass', 'grass', 64, 64)

    const layer1 = this.tilemap.createBlankLayer('layer1', tileset)
    layer1.fill(0)
  }

  private createPlayer () {
    this.player = new Player(this, 0, 0)
    this.units.add(this.player.getSprite())
  }

  private createEnemies () {
    this.enemies = this.physics.add.group()
    for (let i = 0; i < 20; i++) {
      const newEnemy = new Spider(this, Phaser.Math.Between(0, 1366), Phaser.Math.Between(0, 768))
      const newEnemySprite = newEnemy.getSprite()
      this.units.add(newEnemySprite)
      this.enemies.add(newEnemySprite)
    }
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player.getSprite())
  }

  private createController () {
    this.controller = new Controller(this)
  }

  private setupCollisions() {
    this.physics.add.collider(this.units, this.units)
  }
}
