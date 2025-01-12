import Entity from './entity'
import Character from './character'

export interface Starship {
  name: string
  registry: string
  type: string
  crew: Character[]
}

export default class Ship extends Entity {
  protected _registry: string
  protected _crew?: Character[]

  constructor(name: string, type?: string, registry?: string) {
    super(name, type)
    this._registry = registry || this.generateRegistry()
    return this
  }

  addCrew(crew: Character): Ship {
    if (!this._crew) {
      this._crew = []
    }
    this._crew.push(crew)
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

  generateExperimentalRegistry(probablity: number = 0.1): string {
    console.log(Math.random() < probablity)
    if (Math.random() < probablity) return 'NX'
    return `NCC`
  }

  generatRandomSuffix(probablity: number = 1): string {
    if (Math.random() < probablity) return ''
    const suffixes = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']
    return suffixes[Math.floor(Math.random() * suffixes.length)]
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

  get registry(): string {
    return this._registry
  }

  set registry(registry: string) {
    this._registry = registry
  }

  // toJSON(): object {
  //   return {
  //     ...super.toJSON(),
  //     registry: this._registry,
  //     type: this._type,
  //     crew: this._crew,
  //   }
  // }

  // toString(): string {
  //   return this._name
  // }
}
