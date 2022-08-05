import Controller from '../classes/controller/controller'

export interface UnitConfig {
  key: string,
  origX: number,
  origY: number,
  scale?: number,
  maxLife?: number
  moveSpeed?: number
  radius?: number
}