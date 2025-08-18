import Entity from '@/game/entity'
import Species from '@/game/species'
import Rank from '@/game/rank'
import Department from '@/game/department'
import { CharacterError, validateNonEmptyString, validateRequired } from '@/errors'

export default class Character extends Entity {
  protected _species: Species
  protected _rank?: Rank
  protected _department?: Department

  constructor(name: string, species: Species | string, rank?: Rank, department?: Department) {
    try {
      // Validate inputs
      validateNonEmptyString(name, 'Character name')
      validateRequired(species, 'Character species')

      super(name, 'Character')

      // Handle species conversion with error handling
      if (typeof species === 'string') {
        validateNonEmptyString(species, 'Species name')
        this._species = new Species(species)
      } else if (species instanceof Species) {
        this._species = species
      } else {
        throw new CharacterError('Species must be a Species instance or string', { species })
      }

      this._rank = rank
      this._department = department
    } catch (error) {
      if (error instanceof CharacterError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new CharacterError(`Failed to create character: ${errorMessage}`, {
        name,
        species,
        rank,
        department,
      })
    }
    return this
  }

  get species(): Species {
    return this._species
  }

  get rank(): Rank | undefined {
    return this._rank
  }

  set species(species: Species) {
    try {
      validateRequired(species, 'Species')
      if (!(species instanceof Species)) {
        throw new CharacterError('Species must be a Species instance', { species })
      }
      this._species = species
    } catch (error) {
      if (error instanceof CharacterError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new CharacterError(`Failed to set species: ${errorMessage}`, { species })
    }
  }

  set rank(rank: Rank | undefined) {
    try {
      if (rank !== undefined && !(rank instanceof Rank)) {
        throw new CharacterError('Rank must be a Rank instance or undefined', { rank })
      }
      this._rank = rank
    } catch (error) {
      if (error instanceof CharacterError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new CharacterError(`Failed to set rank: ${errorMessage}`, { rank })
    }
  }

  setRank(rank: Rank | undefined): Character {
    this.rank = rank
    return this
  }

  get department(): Department | undefined {
    return this._department
  }

  set department(department: Department | undefined) {
    try {
      if (department !== undefined && !(department instanceof Department)) {
        throw new CharacterError('Department must be a Department instance or undefined', {
          department,
        })
      }
      this._department = department
    } catch (error) {
      if (error instanceof CharacterError) {
        throw error
      }
      const errorMessage = error instanceof Error ? error.message : String(error)
      throw new CharacterError(`Failed to set department: ${errorMessage}`, { department })
    }
  }

  setDepartment(department: Department | undefined): Character {
    this.department = department
    return this
  }

  toJSON(): object {
    return {
      ...super.toJSON(),
      species: this._species,
      rank: this._rank,
      department: this._department,
    }
  }

  // static fromJSON(json: object): Character {
  //   return new Character(json['name'], json['species'], json['rank'])
  // }
}
