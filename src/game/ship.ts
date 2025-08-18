import Entity from '@/game/entity'
import Character from '@/game/character'
import Role from '@/game/role'
import {
  ShipError,
  validateNonEmptyString,
  validateRequired,
  validateMaxLength,
  validateNonEmptyArray,
} from '@/errors'

export interface Starship {
  name: string
  registry: string
  type: string
  crew: Character[]
}

export default class Ship extends Entity {
  protected _registry: string
  protected _crew?: Character[]
  protected _roles: Map<Role, Character> = new Map<Role, Character>()

  constructor(name: string, type?: string, registry?: string) {
    try {
      // Validate inputs
      validateNonEmptyString(name, 'Ship name')
      validateMaxLength(name, 100, 'Ship name')

      if (type) {
        validateNonEmptyString(type, 'Ship type')
        validateMaxLength(type, 50, 'Ship type')
      }

      if (registry) {
        validateNonEmptyString(registry, 'Ship registry')
        validateMaxLength(registry, 20, 'Ship registry')
      }

      super(name, type)
      this._registry = registry || this.generateRegistry()
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to create ship: ${errorMessage}`, { name, type, registry })
    }
    return this
  }

  sortCrewByRank(desc: boolean = true): Character | undefined {
    try {
      if (!this._crew) return undefined
      if (this._crew.length === 0) return undefined

      const officers = [...this._crew].sort((a, b) => {
        const rankA = a.rank?.value ?? -1 // Use -1 for no rank so they sort to end
        const rankB = b.rank?.value ?? -1
        return desc ? rankB - rankA : rankA - rankB // Higher values first for desc
      })
      return officers[0]
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to sort crew by rank: ${errorMessage}`, {
        desc,
        crew: this._crew,
      })
    }
  }

  assignCrew(crew: Character, position: Role): Ship {
    try {
      validateRequired(crew, 'Crew member')
      validateRequired(position, 'Position role')

      if (!(crew instanceof Character)) {
        throw new ShipError('Crew member must be a Character instance')
      }

      if (!(position instanceof Role)) {
        throw new ShipError('Position must be a Role instance')
      }

      this._roles.set(position, crew)
      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to assign crew: ${errorMessage}`, {
        crew: crew?.name,
        position: position?.name,
      })
    }
  }

  unassignCrew(position: Role): Ship {
    try {
      validateRequired(position, 'Position role')

      if (!(position instanceof Role)) {
        throw new ShipError('Position must be a Role instance')
      }

      this._roles.delete(position as Role)
      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to unassign crew: ${errorMessage}`, { position: position?.name })
    }
  }

  hasCrew(minimum: number = 0): boolean {
    try {
      if (minimum < 0) {
        throw new ShipError('Minimum crew count cannot be negative')
      }

      return !!this._crew && this._crew.length > minimum
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to check crew: ${errorMessage}`, { minimum })
    }
  }

  hasCaptain(captain: string = 'captain'): boolean {
    try {
      validateNonEmptyString(captain, 'Captain role name')

      return Array.from(this._roles.keys()).some(
        (role) => role.name.toLowerCase() === captain.toLowerCase(),
      )
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to check for captain: ${errorMessage}`, { captain })
    }
  }

  getAssignedCrew(position: Role | string): Character | undefined {
    try {
      validateRequired(position, 'Position')

      if (typeof position === 'string') {
        validateNonEmptyString(position, 'Position name')

        const role = Array.from(this._roles.keys()).find(
          (r) => r.name.toLowerCase() === position.toLowerCase(),
        )
        return role ? this._roles.get(role) : undefined
      }

      if (!(position instanceof Role)) {
        throw new ShipError('Position must be a Role instance or string')
      }

      return this._roles.get(position)
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      const positionName = typeof position === 'string' ? position : position?.name
      throw new ShipError(`Failed to get assigned crew: ${errorMessage}`, {
        position: positionName,
      })
    }
  }

  addCrew(crew: Character, position?: Role): Ship {
    try {
      validateRequired(crew, 'Crew member')

      if (!(crew instanceof Character)) {
        throw new ShipError('Crew member must be a Character instance')
      }

      if (position && !(position instanceof Role)) {
        throw new ShipError('Position must be a Role instance')
      }

      if (!this._crew) {
        this._crew = []
      }
      this._crew.push(crew)

      if (position) {
        this.assignCrew(crew, position)
      }

      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to add crew: ${errorMessage}`, {
        crew: crew?.name,
        position: position?.name,
      })
    }
  }

  setCrew(crew: Character[]): Ship {
    try {
      validateRequired(crew, 'Crew array')

      if (!Array.isArray(crew)) {
        throw new ShipError('Crew must be an array')
      }

      // Validate all crew members are Character instances
      crew.forEach((member, index) => {
        if (!(member instanceof Character)) {
          throw new ShipError(`Crew member at index ${index} must be a Character instance`)
        }
      })

      this._crew = crew
      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to set crew: ${errorMessage}`, { crewCount: crew?.length })
    }
  }

  getCrew(): Character[] {
    return this._crew || []
  }

  removeCrew(crew: Character): Ship {
    try {
      validateRequired(crew, 'Crew member')

      if (!(crew instanceof Character)) {
        throw new ShipError('Crew member must be a Character instance')
      }

      if (this._crew) {
        this._crew = this._crew.filter((c) => c.id !== crew.id)
      }
      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to remove crew: ${errorMessage}`, { crew: crew?.name })
    }
  }

  clearCrew(): Ship {
    try {
      this._crew = []
      return this
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to clear crew: ${errorMessage}`)
    }
  }

  generateExperimentalRegistry(probability: number = 0.01): string {
    try {
      if (probability < 0 || probability > 1) {
        throw new ShipError('Probability must be between 0 and 1')
      }

      if (Math.random() < probability) return 'NX'
      return `NCC`
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to generate experimental registry: ${errorMessage}`, {
        probability,
      })
    }
  }

  generateRandomSuffix(probability: number = 0.1): string {
    try {
      if (probability < 0 || probability > 1) {
        throw new ShipError('Probability must be between 0 and 1')
      }

      const roll = Math.random()
      console.log('generateRandomSuffix', roll, probability)

      if (roll > probability) return ''

      console.log('roll less than probability', roll < probability, roll, probability)
      const suffixes = ['A', 'B', 'C', 'D', 'E', 'F']
      const weights = [0.9, 0.05, 0.02, 0.01, 0.005, 0.005]
      let cumulative = 0

      for (let i = 0; i < suffixes.length; i++) {
        cumulative += weights[i]
        if (roll < cumulative) {
          return suffixes[i]
        }
      }

      return suffixes[suffixes.length - 1]
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to generate random suffix: ${errorMessage}`, { probability })
    }
  }

  generateRegistry(registration?: string, commission?: string): string {
    try {
      if (registration && typeof registration !== 'string') {
        throw new ShipError('Registration must be a string')
      }

      if (commission && typeof commission !== 'string') {
        throw new ShipError('Commission must be a string')
      }

      const random = Math.floor(Math.random() * (99999 - 1000) + 1000)
      const prefix = registration ? registration : this.generateExperimentalRegistry()
      const suffix = commission ? commission : this.generateRandomSuffix()

      return [prefix, random, suffix].filter(Boolean).join('-')
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to generate registry: ${errorMessage}`, {
        registration,
        commission,
      })
    }
  }

  setRegistry(registry: string): Ship {
    try {
      validateNonEmptyString(registry, 'Registry')
      validateMaxLength(registry, 20, 'Registry')

      this._registry = registry
      return this
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to set registry: ${errorMessage}`, { registry })
    }
  }

  get crew(): Character[] {
    return this._crew || []
  }

  set crew(crew: Character[]) {
    try {
      validateRequired(crew, 'Crew array')

      if (!Array.isArray(crew)) {
        throw new ShipError('Crew must be an array')
      }

      // Validate all crew members are Character instances
      crew.forEach((member, index) => {
        if (!(member instanceof Character)) {
          throw new ShipError(`Crew member at index ${index} must be a Character instance`)
        }
      })

      this._crew = crew
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to set crew: ${errorMessage}`, { crewCount: crew?.length })
    }
  }

  get assignments(): Map<Role, Character> {
    return this._roles
  }

  get registry(): string {
    return this._registry
  }

  set registry(registry: string) {
    try {
      validateNonEmptyString(registry, 'Registry')
      validateMaxLength(registry, 20, 'Registry')

      this._registry = registry
    } catch (error) {
      if (error instanceof ShipError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to set registry: ${errorMessage}`, { registry })
    }
  }

  toJSON(): object {
    try {
      return {
        ...super.toJSON(),
        registry: this._registry,
        crew: this._crew || [],
        roles: Object.fromEntries(this._roles),
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new ShipError(`Failed to serialize ship to JSON: ${errorMessage}`)
    }
  }

  // toString(): string {
  //   return this._name
  // }
}
