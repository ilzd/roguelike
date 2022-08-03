import Phaser from 'phaser'
import Controller from '../classes/controller'
import Player from '../classes/player'
import Projectile from '../classes/projectile'
import Spider from '../classes/spider'
import Unit from '../classes/unit'
import { GameEvents } from '../enums/events.enum'

export default class PlayScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'playscene'
  public static readonly UNITS_DATA_KEY = 'unitsprites'
  public static readonly ENEMIES_DATA_KEY = 'enemiesprites'
  public static readonly PROJECTILES_DATA_KEY = 'projectilesprites'
  public static readonly PLAYER_PROJECTILES_DATA_KEY = 'playerprojectilesprites'
  public static readonly ENEMY_PROJECTILES_DATA_KEY = 'enemyprojectilesprites'

  private tilemap: Phaser.Tilemaps.Tilemap
  private units: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private playerProjectiles: Phaser.Physics.Arcade.Group;
  private enemyProjectiles: Phaser.Physics.Arcade.Group;
  private player: Unit
  private controller: Controller
  private nextId = 0

  constructor () {
    super(PlayScene.SCENE_KEY);
  }

  create () {
    this.units = this.physics.add.group()
    this.registry.set(PlayScene.UNITS_DATA_KEY, this.units)
    this.enemies = this.physics.add.group()
    this.registry.set(PlayScene.ENEMIES_DATA_KEY, this.enemies)
    this.projectiles = this.physics.add.group()
    this.registry.set(PlayScene.PROJECTILES_DATA_KEY, this.projectiles)
    this.playerProjectiles = this.physics.add.group()
    this.registry.set(PlayScene.PLAYER_PROJECTILES_DATA_KEY, this.playerProjectiles)
    this.enemyProjectiles = this.physics.add.group()
    this.registry.set(PlayScene.ENEMIES_DATA_KEY, this.playerProjectiles)

    this.creatTilemap()
    this.createPlayer()
    this.createEnemies()
    this.createController()
    this.setupCamera()
    this.setupCollisions()
    this.setupEvents()
  }

  update (time: number, delta: number) {
    const deltaS = delta / 1000

    this.checkPlayerInput()

    this.units.getChildren().forEach(sprite => {
      const unit = sprite.getData(Unit.DATA_KEY) as Unit
      unit.update(deltaS)
    })
    this.playerProjectiles.getChildren().forEach(sprite => {
      const projectile = sprite.getData(Projectile.DATA_KEY) as Projectile
      projectile.update(deltaS)
    })
  }

  private checkPlayerInput () {
    const inputDir = this.controller.checkDirections()
    const pointerPos = this.controller.getPointerWorldPosition()
    this.player.setMoveDir(inputDir.x, inputDir.y)
    this.player.lookAt(pointerPos.x, pointerPos.y)
    if (this.controller.checkAttack()) this.player.beginAttack()
    if (this.controller.checkCast()) this.player.beginCast()
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
    layer1.fill(0).setDepth(-Infinity)
  }

  private createPlayer () {
    this.player = new Player(this, 0, 0)
    this.units.add(this.player.getSprite())
  }

  private createEnemies () {
    for (let i = 0; i < 20; i++) {
      const newEnemy = new Spider(this, Phaser.Math.Between(0, 1366), Phaser.Math.Between(0, 768))
      const newEnemySprite = newEnemy.getSprite()
      this.units.add(newEnemySprite)
      this.enemies.add(newEnemySprite)
    }
  }

  private setupCamera () {
    this.cameras.main.startFollow(this.player.getSprite())
  }

  private createController () {
    this.controller = new Controller(this)
  }

  private setupCollisions () {
    this.physics.add.collider(this.units, this.units)
    this.physics.add.overlap(this.enemies, this.playerProjectiles, this.manageProjectileHit, () => { }, this)
    this.physics.add.overlap(this.player.getSprite(), this.enemyProjectiles, this.manageProjectileHit, () => { }, this)
  }

  private setupEvents () {
    this.events.on(GameEvents.UNIT_DIED, (unit: Unit) => {
      this.units.remove(unit.getSprite(), true, true)
    })

    this.events.on(GameEvents.PROJECTILE_DIED, (projectile: Projectile) => {
      const projectileSprite = projectile.getSprite()
      this.projectiles.remove(projectileSprite, true, true)
    })
  }

  private manageProjectileHit (unitSprite: Phaser.GameObjects.GameObject, projectileSprite: Phaser.GameObjects.GameObject) {
    const unit = unitSprite.getData(Unit.DATA_KEY) as Unit
    const projectile = projectileSprite.getData(Projectile.DATA_KEY) as Projectile
    projectile.hit(unit)
  }

  addProjectile (projectile: Projectile) {
    const projectileSprite = projectile.getSprite()
    this.projectiles.add(projectileSprite)
    if (projectile.getOwner() === this.player) {
      this.playerProjectiles.add(projectileSprite)
      return
    }
    this.enemyProjectiles.add(projectileSprite)
  }

  getUniqueId () {
    return this.nextId++
  }
}
