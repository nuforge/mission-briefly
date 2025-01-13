import Entity from '@/game/entity'
import Species from '@/game/species'
import Rank from '@/game/rank'
import Department from '@/game/department'

export default class Character extends Entity {
  protected _species: Species
  protected _rank?: Rank
  protected _department?: Department

  constructor(name: string, species: Species | string, rank: Rank, department?: Department) {
    super(name, 'Character')
    this._species = species instanceof Species ? species : new Species(species)
    this._rank = rank
    this._department = department
    return this
  }

  get species(): Species {
    return this._species
  }

  get rank(): Rank | undefined {
    return this._rank
  }

  set species(species: Species) {
    this._species = species
  }

  set rank(rank: Rank) {
    this._rank = rank
  }

  setRank(rank: Rank): Character {
    this._rank = rank
    return this
  }

  get department(): Department | undefined {
    return this._department
  }

  set department(department: Department) {
    this._department = department
  }

  setDepartment(department: Department): Character {
    this._department = department
    return this
  }

  // static fromJSON(json: object): Character {
  //   return new Character(json['name'], json['species'], json['rank'])
  // }
}
