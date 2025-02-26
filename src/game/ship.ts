import Entity from '@/game/entity'
import Character from '@/game/character'
import Role from '@/game/role'

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
    super(name, type)
    this._registry = registry || this.generateRegistry()
    return this
  }

  sortCrewByRank(desc: boolean = true): Character | undefined {
    if (!this._crew) return undefined
    const officers = [...this._crew].sort((b, a) => {
      const rankA = a.rank?.value ?? Number.MAX_SAFE_INTEGER
      const rankB = b.rank?.value ?? Number.MAX_SAFE_INTEGER
      return desc ? rankA - rankB : rankB - rankA
    })
    return officers[0]
  }

  assignCrew(crew: Character, position: Role): Ship {
    this._roles.set(position, crew)
    return this
  }

  unassignCrew(position: Role): Ship {
    this._roles.delete(position as Role)
    return this
  }

  hasCrew(minimum: number = 0): boolean {
    return !!this._crew && this._crew.length > minimum
  }

  hasCaptain(captain: string = 'captain'): boolean {
    return Array.from(this._roles.keys()).some(
      (role) => role.name.toLowerCase() === captain.toLowerCase(),
    )
  }

  getAssignedCrew(position: Role | string): Character | undefined {
    if (typeof position === 'string') {
      const role = Array.from(this._roles.keys()).find(
        (r) => r.name.toLowerCase() === position.toLowerCase(),
      )
      return role ? this._roles.get(role) : undefined
    }
    return this._roles.get(position)
  }

  addCrew(crew: Character, position?: Role): Ship {
    if (!this._crew) {
      this._crew = []
    }
    this._crew.push(crew)
    if (position) {
      this.assignCrew(crew, position)
    }
    return this
  }

  setCrew(crew: Character[]): Ship {
    this._crew = crew
    return this
  }

  getCrew(): Character[] {
    return this._crew || []
  }

  removeCrew(crew: Character): Ship {
    if (this._crew) {
      this._crew = this._crew.filter((c) => c.id !== crew.id)
    }
    return this
  }

  clearCrew(): Ship {
    this._crew = []
    return this
  }

  generateExperimentalRegistry(probablity: number = 0.01): string {
    if (Math.random() < probablity) return 'NX'
    return `NCC`
  }
  generatRandomSuffix(probability: number = 0.1): string {
    const roll = Math.random()
    console.log('generatRandomSuffix', roll, probability)
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
  }

  generateRegistry(registration?: string, commission?: string): string {
    const random = Math.floor(Math.random() * (99999 - 1000) + 1000)
    const prefix = registration ? registration : this.generateExperimentalRegistry()
    const suffix = commission ? commission : this.generatRandomSuffix()
    return [prefix, random, suffix].filter(Boolean).join('-')
  }

  setRegistry(registry: string): Ship {
    this._registry = registry
    return this
  }

  get crew(): Character[] {
    return this._crew || []
  }

  set crew(crew: Character[]) {
    this._crew = crew
  }

  get assignments(): Map<Role, Character> {
    return this._roles
  }

  get registry(): string {
    return this._registry
  }

  set registry(registry: string) {
    this._registry = registry
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      registry: this._registry,
      crew: this._crew,
      roles: this._roles,
    }
  }

  // toString(): string {
  //   return this._name
  // }
}
