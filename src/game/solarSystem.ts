import Entity from './entity'
import Planet from './planet'
import Anomaly from './anomaly'
import type { Coordinates3D } from './coordinates'

export interface SolarSystemData {
  id: string
  name: string
  starType: string
  coordinates: Coordinates3D
  planets: Planet[]
  anomalies: Anomaly[]
  description?: string
  isExplored: boolean
  threatLevel: number
}

/**
 * Represents a complete solar system with planets, anomalies, and spatial data
 */
export default class SolarSystem extends Entity {
  protected _starType: string
  protected _coordinates: Coordinates3D
  protected _planets: Map<string, Planet>
  protected _anomalies: Map<string, Anomaly>
  protected _description: string
  protected _isExplored: boolean
  protected _threatLevel: number

  constructor(data: SolarSystemData) {
    super(data.id, data.name)
    this._starType = data.starType
    this._coordinates = data.coordinates
    this._planets = new Map()
    this._anomalies = new Map()
    this._description = data.description || ''
    this._isExplored = data.isExplored
    this._threatLevel = data.threatLevel

    // Add planets
    data.planets.forEach((planet) => {
      this._planets.set(planet.id, planet)
    })

    // Add anomalies
    data.anomalies.forEach((anomaly) => {
      this._anomalies.set(anomaly.id, anomaly)
    })
  }

  // Getters
  get starType(): string {
    return this._starType
  }

  get coordinates(): Coordinates3D {
    return { ...this._coordinates }
  }

  get planets(): Planet[] {
    return Array.from(this._planets.values())
  }

  get anomalies(): Anomaly[] {
    return Array.from(this._anomalies.values())
  }

  get description(): string {
    return this._description
  }

  get isExplored(): boolean {
    return this._isExplored
  }

  get threatLevel(): number {
    return this._threatLevel
  }

  // Planet management
  getPlanet(planetId: string): Planet | undefined {
    return this._planets.get(planetId)
  }

  addPlanet(planet: Planet): SolarSystem {
    this._planets.set(planet.id, planet)
    return this
  }

  removePlanet(planetId: string): SolarSystem {
    this._planets.delete(planetId)
    return this
  }

  getHabitablePlanets(): Planet[] {
    return this.planets.filter((planet) => planet.isHabitable)
  }

  getPlanetsWithStarbases(): Planet[] {
    return this.planets.filter((planet) => planet.hasStarbase)
  }

  // Anomaly management
  getAnomaly(anomalyId: string): Anomaly | undefined {
    return this._anomalies.get(anomalyId)
  }

  addAnomaly(anomaly: Anomaly): SolarSystem {
    this._anomalies.set(anomaly.id, anomaly)
    return this
  }

  removeAnomaly(anomalyId: string): SolarSystem {
    this._anomalies.delete(anomalyId)
    return this
  }

  getActiveAnomalies(): Anomaly[] {
    return this.anomalies.filter((anomaly) => anomaly.isActive)
  }

  getCriticalAnomalies(): Anomaly[] {
    return this.anomalies.filter(
      (anomaly) => anomaly.severity === 'critical' || anomaly.threatLevel >= 8,
    )
  }

  // System analysis
  calculateOverallThreat(): number {
    const planetThreats = this.planets.map((p) => p.threatLevel)
    const anomalyThreats = this.anomalies.map((a) => a.threatLevel)
    const allThreats = [...planetThreats, ...anomalyThreats, this._threatLevel]

    return allThreats.length > 0 ? Math.max(...allThreats) : 0
  }

  isSystemSafe(): boolean {
    return this.calculateOverallThreat() <= 3 && this._isExplored
  }

  hasActiveThreats(): boolean {
    return (
      this.getActiveAnomalies().some((a) => a.threatLevel >= 5) ||
      this.planets.some((p) => p.threatLevel >= 5)
    )
  }

  // System operations
  explore(): SolarSystem {
    this._isExplored = true
    return this
  }

  setDescription(description: string): SolarSystem {
    this._description = description
    return this
  }

  setThreatLevel(level: number): SolarSystem {
    this._threatLevel = Math.max(0, Math.min(10, level))
    return this
  }

  /**
   * Get system statistics for display
   */
  getSystemStats() {
    return {
      totalPlanets: this._planets.size,
      habitablePlanets: this.getHabitablePlanets().length,
      starbases: this.getPlanetsWithStarbases().length,
      totalAnomalies: this._anomalies.size,
      activeAnomalies: this.getActiveAnomalies().length,
      criticalAnomalies: this.getCriticalAnomalies().length,
      overallThreat: this.calculateOverallThreat(),
      isExplored: this._isExplored,
      isSafe: this.isSystemSafe(),
    }
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      starType: this._starType,
      coordinates: this._coordinates,
      planets: Array.from(this._planets.values()).map((p) => p.toJSON()),
      anomalies: Array.from(this._anomalies.values()).map((a) => a.toJSON()),
      description: this._description,
      isExplored: this._isExplored,
      threatLevel: this._threatLevel,
    }
  }
}
