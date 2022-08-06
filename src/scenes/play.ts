import Phaser from 'phaser'
import Human from '../classes/units/human'
import Projectile from '../classes/projectile'
import Spider from '../classes/units/spider'
import Unit from '../classes/units/unit'
import { GameEvents } from '../enums/events.enum'
import ManualController from '../classes/controller/manual-controller'
import EnemyController from '../classes/controller/enemy-controller'
import { Vector } from 'matter'

export default class PlayScene extends Phaser.Scene {
  public static readonly SCENE_KEY = 'playscene'
  public static readonly UNITS_DATA_KEY = 'unitsprites'
  public static readonly ENEMIES_DATA_KEY = 'enemiesprites'
  public static readonly PROJECTILES_DATA_KEY = 'projectilesprites'
  public static readonly PLAYER_PROJECTILES_DATA_KEY = 'playerprojectilesprites'
  public static readonly ENEMY_PROJECTILES_DATA_KEY = 'enemyprojectilesprites'

  private tilemap: Phaser.Tilemaps.Tilemap
  private units: Unit[] = []
  private unitsGroup: Phaser.Physics.Arcade.Group;
  private enemies: Phaser.Physics.Arcade.Group;
  private projectiles: Phaser.Physics.Arcade.Group;
  private playerProjectiles: Phaser.Physics.Arcade.Group;
  private enemyProjectiles: Phaser.Physics.Arcade.Group;
  private playerAimProjection = new Phaser.Math.Vector2()
  public player: Unit
  private nextId = 0

  constructor () {
    super(PlayScene.SCENE_KEY);
  }

  create () {
    this.unitsGroup = this.physics.add.group()
    this.unitsGroup.defaults.setCollideWorldBounds = true
    this.registry.set(PlayScene.UNITS_DATA_KEY, this.unitsGroup)
    this.enemies = this.physics.add.group()
    this.registry.set(PlayScene.ENEMIES_DATA_KEY, this.enemies)
    this.projectiles = this.physics.add.group()
    this.registry.set(PlayScene.PROJECTILES_DATA_KEY, this.projectiles)
    this.playerProjectiles = this.physics.add.group()
    this.registry.set(PlayScene.PLAYER_PROJECTILES_DATA_KEY, this.playerProjectiles)
    this.enemyProjectiles = this.physics.add.group()
    this.registry.set(PlayScene.ENEMIES_DATA_KEY, this.playerProjectiles)

    this.createTilemap()
    this.createPlayer()
    this.createEnemies()
    this.setupCamera()
    this.setupCollisions()
    this.setupEvents()
  }

  update (time: number, delta: number) {
    const deltaS = delta / 1000
    this.updateUnits(deltaS)
    this.updateProjectiles(deltaS)
    this.updatePlayerAimProjection()
  }

  private updatePlayerAimProjection () {
    const playerSprite = this.player.getSprite()
    const pointerPos = this.getPointerWorldPosition()
    const offset = new Phaser.Math.Vector2(pointerPos.x - playerSprite.x, pointerPos.y - playerSprite.y).scale(0.1)
    this.playerAimProjection.set(playerSprite.x + offset.x, playerSprite.y + offset.y)
  }

  private updateUnits (delta: number) {
    this.units.forEach(unit => { unit.update(delta) })
  }

  private updateProjectiles (delta: number) {
    this.playerProjectiles.getChildren().forEach(sprite => {
      const projectile = sprite.getData(Projectile.DATA_KEY) as Projectile
      projectile.update(delta)
    })
    this.enemyProjectiles.getChildren().forEach(sprite => {
      const projectile = sprite.getData(Projectile.DATA_KEY) as Projectile
      projectile.update(delta)
    })
  }

  private createTilemap () {
    this.tilemap = this.add.tilemap('map1')
    this.tilemap.addTilesetImage('tileset', 'tileset')
    this.tilemap.createLayer('layer1', 'tileset').setDepth(-Infinity)

    this.physics.world.setBounds(0, 0, this.tilemap.widthInPixels, this.tilemap.heightInPixels)
  }

  private createPlayer () {
    const playerSpawn = new Phaser.Math.Vector2(Phaser.Math.Between(0, this.tilemap.widthInPixels), Phaser.Math.Between(0, this.tilemap.heightInPixels))
    this.player = new Human(this, playerSpawn.x, playerSpawn.y)
    this.player.setController(new ManualController(this, this.player))
    const playerSprite = this.player.getSprite()
    this.unitsGroup.add(playerSprite)
    this.units.push(this.player)

    this.playerAimProjection.set(playerSpawn.x, playerSpawn.y)
  }

  private createEnemies () {
    for (let i = 0; i < 50; i++) {
      const newEnemy = new Spider(this, Phaser.Math.Between(0, this.tilemap.widthInPixels), Phaser.Math.Between(0, this.tilemap.heightInPixels))
      newEnemy.setController(new EnemyController(this, newEnemy))
      const newEnemySprite = newEnemy.getSprite()
      this.unitsGroup.add(newEnemySprite)
      this.enemies.add(newEnemySprite)
      this.units.push(newEnemy)
    }
  }

  private setupCamera () {
    this.cameras.main.startFollow(this.playerAimProjection, true, 0.06, 0.06)
  }

  private setupCollisions () {
    this.physics.add.collider(this.unitsGroup, this.unitsGroup)
    this.physics.add.overlap(this.enemies, this.playerProjectiles, this.manageProjectileHit, () => { }, this)
    this.physics.add.overlap(this.player.getSprite(), this.enemyProjectiles, this.manageProjectileHit, () => { }, this)
  }

  private setupEvents () {
    this.events.on(GameEvents.UNIT_DIED, (unit: Unit) => {
      this.removeUnit(unit)
    })

    this.events.on(GameEvents.PROJECTILE_DIED, (projectile: Projectile) => {
      const projectileSprite = projectile.getSprite()
      this.projectiles.remove(projectileSprite, true, true)
    })

    this.events.on(GameEvents.START_PHASING, (unit: Unit) => {
      const unitSprite = unit.getSprite()
      this.unitsGroup.remove(unitSprite)
    })

    this.events.on(GameEvents.STOP_PHASING, (unit: Unit) => {
      const unitSprite = unit.getSprite()
      this.unitsGroup.add(unitSprite)
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

  removeUnit (unit: Unit) {
    this.units.splice(this.units.indexOf(unit), 1)
    this.unitsGroup.remove(unit.getSprite(), true, true)
  }

  getPointerWorldPosition () {
    this.input.activePointer.updateWorldPoint(this.cameras.main);
    return new Phaser.Math.Vector2(this.input.activePointer.worldX, this.input.activePointer.worldY)
  }
}
