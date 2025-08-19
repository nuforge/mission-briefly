import Entity from './entity'
import type { Coordinates3D } from './coordinates'

export type AnomalyType =
  | 'temporal'
  | 'spatial'
  | 'energy'
  | 'gravitational'
  | 'quantum'
  | 'subspace'
  | 'unknown'
export type AnomalySeverity = 'minor' | 'moderate' | 'major' | 'critical'

export interface AnomalyData {
  id: string
  name: string
  type: AnomalyType
  severity: AnomalySeverity
  position: Coordinates3D
  radius: number // Area of effect in AU
  description: string
  isActive: boolean
  discoveredBy?: string // Character ID who discovered it
  discoveryDate?: Date
  effects: string[]
  requiresSpecialEquipment?: boolean
  threatLevel: number // 0-10 scale
}

/**
 * Represents a spatial anomaly in the solar system
 */
export default class Anomaly extends Entity {
  protected _anomalyType: AnomalyType
  protected _severity: AnomalySeverity
  protected _position: Coordinates3D
  protected _radius: number
  protected _description: string
  protected _isActive: boolean
  protected _discoveredBy?: string
  protected _discoveryDate?: Date
  protected _effects: string[]
  protected _requiresSpecialEquipment: boolean
  protected _threatLevel: number

  constructor(data: AnomalyData) {
    super(data.id, data.name)
    this._anomalyType = data.type
    this._severity = data.severity
    this._position = data.position
    this._radius = data.radius
    this._description = data.description
    this._isActive = data.isActive
    this._discoveredBy = data.discoveredBy
    this._discoveryDate = data.discoveryDate
    this._effects = data.effects
    this._requiresSpecialEquipment = data.requiresSpecialEquipment || false
    this._threatLevel = data.threatLevel
  }

  // Getters
  get anomalyType(): AnomalyType {
    return this._anomalyType
  }

  get severity(): AnomalySeverity {
    return this._severity
  }

  get position(): Coordinates3D {
    return { ...this._position }
  }

  get radius(): number {
    return this._radius
  }

  get description(): string {
    return this._description
  }

  get isActive(): boolean {
    return this._isActive
  }

  get discoveredBy(): string | undefined {
    return this._discoveredBy
  }

  get discoveryDate(): Date | undefined {
    return this._discoveryDate
  }

  get effects(): string[] {
    return [...this._effects]
  }

  get requiresSpecialEquipment(): boolean {
    return this._requiresSpecialEquipment
  }

  get threatLevel(): number {
    return this._threatLevel
  }

  // Setters
  setPosition(position: Coordinates3D): Anomaly {
    this._position = position
    return this
  }

  setRadius(radius: number): Anomaly {
    this._radius = Math.max(0, radius)
    return this
  }

  setDescription(description: string): Anomaly {
    this._description = description
    return this
  }

  activate(): Anomaly {
    this._isActive = true
    return this
  }

  deactivate(): Anomaly {
    this._isActive = false
    return this
  }

  discover(characterId: string, date: Date = new Date()): Anomaly {
    this._discoveredBy = characterId
    this._discoveryDate = date
    return this
  }

  addEffect(effect: string): Anomaly {
    if (!this._effects.includes(effect)) {
      this._effects.push(effect)
    }
    return this
  }

  removeEffect(effect: string): Anomaly {
    this._effects = this._effects.filter((e) => e !== effect)
    return this
  }

  setSeverity(severity: AnomalySeverity): Anomaly {
    this._severity = severity
    return this
  }

  setThreatLevel(level: number): Anomaly {
    this._threatLevel = Math.max(0, Math.min(10, level))
    return this
  }

  /**
   * Get the anomaly's color based on type for map display
   */
  getMapColor(): string {
    const colorMap: Record<AnomalyType, string> = {
      temporal: '#9C27B0',
      spatial: '#3F51B5',
      energy: '#FF5722',
      gravitational: '#795548',
      quantum: '#E91E63',
      subspace: '#00BCD4',
      unknown: '#607D8B',
    }
    return colorMap[this._anomalyType]
  }

  /**
   * Get the severity multiplier for visual effects
   */
  getSeverityMultiplier(): number {
    const severityMap: Record<AnomalySeverity, number> = {
      minor: 0.5,
      moderate: 1.0,
      major: 1.5,
      critical: 2.0,
    }
    return severityMap[this._severity]
  }

  /**
   * Check if this anomaly affects a given position
   */
  affectsPosition(position: Coordinates3D): boolean {
    const distance = Math.sqrt(
      Math.pow(position.x - this._position.x, 2) +
        Math.pow(position.y - this._position.y, 2) +
        Math.pow(position.z - this._position.z, 2),
    )
    return distance <= this._radius
  }

  /**
   * Check if this anomaly requires special precautions for missions
   */
  requiresSpecialPrecautions(): boolean {
    return this._severity === 'major' || this._severity === 'critical' || this._threatLevel >= 5
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      anomalyType: this._anomalyType,
      severity: this._severity,
      position: this._position,
      radius: this._radius,
      description: this._description,
      isActive: this._isActive,
      discoveredBy: this._discoveredBy,
      discoveryDate: this._discoveryDate,
      effects: this._effects,
      requiresSpecialEquipment: this._requiresSpecialEquipment,
      threatLevel: this._threatLevel,
    }
  }
}
