export interface ProjectileConfig {
  key: string,
  origX: number,
  origY: number,
  x: number,
  y: number
  dirX: number,
  dirY: number,
  damage: number,
  range?: number,
  moveSpeed?: number
  radius?: number,
}