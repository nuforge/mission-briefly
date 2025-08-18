import { describe, it, expect, beforeEach } from 'vitest'
import Character from '../character'
import Species from '../species'
import Rank from '../rank'
import Department from '../department'

describe('Character', () => {
  let character: Character
  let species: Species
  let rank: Rank
  let department: Department

  beforeEach(() => {
    species = new Species('Human')
    rank = new Rank('Captain', 'Captain', 4)
    department = new Department('Command', 'red', 'mdi-star-circle')
    character = new Character('Jean-Luc Picard', species, rank, department)
  })

  describe('constructor', () => {
    it('should create a character with all parameters', () => {
      expect(character.name).toBe('Jean-Luc Picard')
      expect(character.id).toBe('jean-luc-picard')
      expect(character.type).toBe('Character')
      expect(character.species).toBe(species)
      expect(character.rank).toBe(rank)
      expect(character.department).toBe(department)
    })

    it('should create a character with species as string', () => {
      const testCharacter = new Character('Data', 'Android', rank)

      expect(testCharacter.name).toBe('Data')
      expect(testCharacter.species).toBeInstanceOf(Species)
      expect(testCharacter.species.name).toBe('Android')
      expect(testCharacter.rank).toBe(rank)
      expect(testCharacter.department).toBeUndefined()
    })

    it('should create a character without optional parameters', () => {
      const testCharacter = new Character('Ensign Smith', species, rank)

      expect(testCharacter.name).toBe('Ensign Smith')
      expect(testCharacter.species).toBe(species)
      expect(testCharacter.rank).toBe(rank)
      expect(testCharacter.department).toBeUndefined()
    })
  })

  describe('species property', () => {
    it('should get species correctly', () => {
      expect(character.species).toBe(species)
      expect(character.species.name).toBe('Human')
    })

    it('should set species correctly', () => {
      const newSpecies = new Species('Vulcan')
      character.species = newSpecies

      expect(character.species).toBe(newSpecies)
      expect(character.species.name).toBe('Vulcan')
    })
  })

  describe('rank property', () => {
    it('should get rank correctly', () => {
      expect(character.rank).toBe(rank)
      expect(character.rank?.name).toBe('Captain')
    })

    it('should set rank correctly', () => {
      const newRank = new Rank('Admiral', 'Admiral', 5)
      character.rank = newRank

      expect(character.rank).toBe(newRank)
      expect(character.rank.name).toBe('Admiral')
    })

    it('should handle undefined rank', () => {
      const testCharacter = new Character('Civilian', species, undefined as any)
      expect(testCharacter.rank).toBeUndefined()
    })
  })

  describe('department property', () => {
    it('should get department correctly', () => {
      expect(character.department).toBe(department)
      expect(character.department?.name).toBe('Command')
    })

    it('should set department correctly', () => {
      const newDepartment = new Department('Engineering', 'gold', 'mdi-wrench')
      character.department = newDepartment

      expect(character.department).toBe(newDepartment)
      expect(character.department.name).toBe('Engineering')
    })

    it('should handle undefined department', () => {
      const testCharacter = new Character('Civilian', species, rank)
      expect(testCharacter.department).toBeUndefined()
    })
  })

  describe('fluent methods', () => {
    it('should support method chaining with setRank', () => {
      const newRank = new Rank('Commander', 'Commander', 3)
      const result = character.setRank(newRank)

      expect(result).toBe(character) // returns same instance
      expect(character.rank).toBe(newRank)
    })

    it('should support method chaining with setDepartment', () => {
      const newDepartment = new Department('Science', 'blue', 'mdi-flask')
      const result = character.setDepartment(newDepartment)

      expect(result).toBe(character) // returns same instance
      expect(character.department).toBe(newDepartment)
    })

    it('should support chaining multiple methods', () => {
      const newRank = new Rank('Lieutenant', 'Lieutenant', 2)
      const newDepartment = new Department('Security', 'gold', 'mdi-shield')

      const result = character.setRank(newRank).setDepartment(newDepartment)

      expect(result).toBe(character)
      expect(character.rank).toBe(newRank)
      expect(character.department).toBe(newDepartment)
    })
  })

  describe('inheritance from Entity', () => {
    it('should inherit Entity properties and methods', () => {
      expect(character.id).toBe('jean-luc-picard')
      expect(character.name).toBe('Jean-Luc Picard')
      expect(character.type).toBe('Character')
    })

    it('should support Entity fluent methods', () => {
      const result = character.newName('Jean-Luc Picard (Clone)')

      expect(result).toBe(character)
      expect(character.name).toBe('Jean-Luc Picard (Clone)')
    })
  })

  describe('toJSON', () => {
    it('should return complete JSON representation', () => {
      const json = character.toJSON()

      expect(json).toMatchObject({
        id: 'jean-luc-picard',
        name: 'Jean-Luc Picard',
        type: 'Character',
        species: species,
        rank: rank,
        department: department,
      })
    })

    it('should handle optional properties in JSON', () => {
      const testCharacter = new Character('Data', 'Android', rank)
      const json = testCharacter.toJSON()

      expect(json).toMatchObject({
        id: 'data',
        name: 'Data',
        type: 'Character',
        rank: rank,
        department: undefined,
      })
    })

    it('should include inherited Entity properties', () => {
      const json = character.toJSON()

      // Should include Entity base properties
      expect(json).toHaveProperty('id')
      expect(json).toHaveProperty('name')
      expect(json).toHaveProperty('type')
      expect(json).toHaveProperty('origin')

      // Should include Character-specific properties
      expect(json).toHaveProperty('species')
      expect(json).toHaveProperty('rank')
      expect(json).toHaveProperty('department')
    })
  })

  describe('edge cases', () => {
    it('should handle character creation with empty name', () => {
      const testCharacter = new Character('', species, rank)
      expect(testCharacter.name).toBe('')
      expect(testCharacter.id).toBe('')
    })

    it('should handle species conversion from string', () => {
      const testCharacter = new Character('Spock', 'Vulcan/Human', rank)
      expect(testCharacter.species).toBeInstanceOf(Species)
      expect(testCharacter.species.name).toBe('Vulcan/Human')
    })

    it('should maintain object references', () => {
      const anotherCharacter = new Character('William Riker', species, rank, department)

      // Both characters should reference the same objects
      expect(anotherCharacter.species).toBe(species)
      expect(anotherCharacter.rank).toBe(rank)
      expect(anotherCharacter.department).toBe(department)
    })
  })

  describe('real-world scenarios', () => {
    it('should handle TNG crew member creation', () => {
      const worf = new Character(
        'Worf',
        new Species('Klingon'),
        new Rank('Lieutenant Commander', 'Lt. Commander', 2.5),
        new Department('Security', 'gold', 'mdi-shield'),
      )

      expect(worf.name).toBe('Worf')
      expect(worf.species.name).toBe('Klingon')
      expect(worf.rank?.name).toBe('Lieutenant Commander')
      expect(worf.department?.name).toBe('Security')
    })

    it('should handle character promotion scenario', () => {
      const wesley = new Character(
        'Wesley Crusher',
        new Species('Human'),
        new Rank('Acting Ensign', 'Acting Ensign', 0.5),
      )

      // Promote to full Ensign
      const ensignRank = new Rank('Ensign', 'Ensign', 1)
      wesley.setRank(ensignRank)

      expect(wesley.rank?.name).toBe('Ensign')
      expect(wesley.rank?.value).toBe(1)
    })

    it('should handle department transfer scenario', () => {
      const laforge = new Character(
        'Geordi La Forge',
        new Species('Human'),
        new Rank('Lieutenant', 'Lieutenant', 2),
        new Department('Conn', 'red', 'mdi-airplane'),
      )

      // Transfer to Engineering
      const engineering = new Department('Engineering', 'gold', 'mdi-wrench')
      laforge.setDepartment(engineering)

      expect(laforge.department?.name).toBe('Engineering')
      expect(laforge.department?.color).toBe('gold')
    })
  })
})
