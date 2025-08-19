import Entity from './entity'
import type { Coordinates3D } from './coordinates'

export type PlanetType =
  | 'terrestrial'
  | 'gas-giant'
  | 'ice-world'
  | 'desert'
  | 'ocean'
  | 'volcanic'
  | 'rogue'
export type PlanetSize = 'small' | 'medium' | 'large' | 'massive'

export interface PlanetData {
  id: string
  name: string
  type: PlanetType
  size: PlanetSize
  position: Coordinates3D
  population?: number
  atmosphere?: string
  resources?: string[]
  description?: string
  isHabitable: boolean
  hasStarbase?: boolean
  isExplored: boolean
  threatLevel: number // 0-10 scale
}

/**
 * Represents a planet in the solar system
 */
export default class Planet extends Entity {
  private _type: PlanetType
  private _size: PlanetSize
  private _position: Coordinates3D
  private _population: number
  private _atmosphere: string
  private _resources: string[]
  private _description: string
  private _isHabitable: boolean
  private _hasStarbase: boolean
  private _isExplored: boolean
  private _threatLevel: number

  constructor(data: PlanetData) {
    super(data.id, data.name)
    this._type = data.type
    this._size = data.size
    this._position = data.position
    this._population = data.population || 0
    this._atmosphere = data.atmosphere || 'Unknown'
    this._resources = data.resources || []
    this._description = data.description || ''
    this._isHabitable = data.isHabitable
    this._hasStarbase = data.hasStarbase || false
    this._isExplored = data.isExplored
    this._threatLevel = data.threatLevel
  }

  // Getters
  get type(): PlanetType {
    return this._type
  }

  get size(): PlanetSize {
    return this._size
  }

  get position(): Coordinates3D {
    return { ...this._position }
  }

  get population(): number {
    return this._population
  }

  get atmosphere(): string {
    return this._atmosphere
  }

  get resources(): string[] {
    return [...this._resources]
  }

  get description(): string {
    return this._description
  }

  get isHabitable(): boolean {
    return this._isHabitable
  }

  get hasStarbase(): boolean {
    return this._hasStarbase
  }

  get isExplored(): boolean {
    return this._isExplored
  }

  get threatLevel(): number {
    return this._threatLevel
  }

  // Setters
  setPosition(position: Coordinates3D): Planet {
    this._position = position
    return this
  }

  setPopulation(population: number): Planet {
    this._population = population
    return this
  }

  setAtmosphere(atmosphere: string): Planet {
    this._atmosphere = atmosphere
    return this
  }

  addResource(resource: string): Planet {
    if (!this._resources.includes(resource)) {
      this._resources.push(resource)
    }
    return this
  }

  removeResource(resource: string): Planet {
    this._resources = this._resources.filter((r) => r !== resource)
    return this
  }

  setDescription(description: string): Planet {
    this._description = description
    return this
  }

  explore(): Planet {
    this._isExplored = true
    return this
  }

  buildStarbase(): Planet {
    if (this._isHabitable) {
      this._hasStarbase = true
    }
    return this
  }

  setThreatLevel(level: number): Planet {
    this._threatLevel = Math.max(0, Math.min(10, level))
    return this
  }

  /**
   * Get the planet's color based on type for map display
   */
  getMapColor(): string {
    const colorMap: Record<PlanetType, string> = {
      terrestrial: '#4CAF50',
      'gas-giant': '#FF9800',
      'ice-world': '#E3F2FD',
      desert: '#FFC107',
      ocean: '#2196F3',
      volcanic: '#F44336',
      rogue: '#9E9E9E',
    }
    return colorMap[this._type]
  }

  /**
   * Get the planet's size multiplier for map display
   */
  getSizeMultiplier(): number {
    const sizeMap: Record<PlanetSize, number> = {
      small: 0.7,
      medium: 1.0,
      large: 1.4,
      massive: 2.0,
    }
    return sizeMap[this._size]
  }

  /**
   * Check if this planet is safe for missions
   */
  isSafeForMissions(): boolean {
    return this._threatLevel <= 3 && this._isExplored
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      type: this._type,
      size: this._size,
      position: this._position,
      population: this._population,
      atmosphere: this._atmosphere,
      resources: this._resources,
      description: this._description,
      isHabitable: this._isHabitable,
      hasStarbase: this._hasStarbase,
      isExplored: this._isExplored,
      threatLevel: this._threatLevel,
    }
  }
}
