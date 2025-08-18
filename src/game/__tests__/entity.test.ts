import { describe, it, expect, beforeEach } from 'vitest'
import Entity from '../entity'

describe('Entity', () => {
  let entity: Entity

  beforeEach(() => {
    entity = new Entity('Test Entity', 'TestType')
  })

  describe('constructor', () => {
    it('should create an entity with required parameters', () => {
      const testEntity = new Entity('Jean-Luc Picard')

      expect(testEntity.name).toBe('Jean-Luc Picard')
      expect(testEntity.id).toBe('jean-luc-picard') // normalized
      expect(testEntity.type).toBe('Entity') // defaults to constructor name
      expect(testEntity.origin).toBe(true) // default origin
    })

    it('should create an entity with all parameters', () => {
      const origin = { source: 'TNG' }
      const testEntity = new Entity('USS Enterprise', 'Starship', origin)

      expect(testEntity.name).toBe('USS Enterprise')
      expect(testEntity.id).toBe('uss-enterprise')
      expect(testEntity.type).toBe('Starship')
      expect(testEntity.origin).toBe(origin)
    })

    it('should generate normalized ID from name', () => {
      const testCases = [
        { name: 'Jean-Luc Picard', expected: 'jean-luc-picard' },
        { name: 'USS Enterprise NCC-1701-D', expected: 'uss-enterprise-ncc-1701-d' },
        { name: 'Data', expected: 'data' },
      ]

      testCases.forEach(({ name, expected }) => {
        const testEntity = new Entity(name)
        expect(testEntity.id).toBe(expected)
      })
    })
  })

  describe('getters', () => {
    it('should return correct property values', () => {
      expect(entity.id).toBe('test-entity')
      expect(entity.name).toBe('Test Entity')
      expect(entity.type).toBe('TestType')
      expect(entity.origin).toBe(true)
    })
  })

  describe('setters', () => {
    it('should update name property', () => {
      entity.name = 'Updated Name'
      expect(entity.name).toBe('Updated Name')
    })

    it('should update type property', () => {
      entity.type = 'UpdatedType'
      expect(entity.type).toBe('UpdatedType')
    })

    it('should update origin property', () => {
      const newOrigin = { source: 'test' }
      entity.origin = newOrigin
      expect(entity.origin).toBe(newOrigin)
    })
  })

  describe('fluent methods', () => {
    it('should return entity instance for method chaining', () => {
      const result = entity
        .newName('Chained Name')
        .newType('ChainedType')
        .newOrigin({ chained: true })

      expect(result).toBe(entity) // same instance
      expect(entity.name).toBe('Chained Name')
      expect(entity.type).toBe('ChainedType')
      expect(entity.origin).toEqual({ chained: true })
    })
  })

  describe('static methods', () => {
    it('should create entity from another entity', () => {
      const original = new Entity('Original', 'OriginalType', { data: 'test' })
      const copy = Entity.fromEntity(original)

      expect(copy.name).toBe('Original')
      expect(copy.type).toBe('OriginalType')
      expect(copy.origin).toBe(original) // origin is set to the original entity
    })

    it('should create entities from array of entities', () => {
      const entities = [new Entity('Entity 1'), new Entity('Entity 2')]

      const copies = Entity.fromEntities(entities)

      expect(copies).toHaveLength(2)
      expect(copies[0].name).toBe('Entity 1')
      expect(copies[1].name).toBe('Entity 2')
      expect(copies[0].origin).toBe(entities[0])
      expect(copies[1].origin).toBe(entities[1])
    })

    it('should normalize strings using nString method', () => {
      expect(Entity.nString('Test String')).toBe('test-string')
      expect(Entity.nString('Jean-Luc Picard')).toBe('jean-luc-picard')
    })
  })

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const origin = { source: 'test' }
      const testEntity = new Entity('Test Name', 'TestType', origin)

      const json = testEntity.toJSON()

      expect(json).toEqual({
        id: 'test-name',
        name: 'Test Name',
        type: 'TestType',
        origin: origin,
      })
    })

    it('should handle default values in JSON', () => {
      const testEntity = new Entity('Simple Entity')
      const json = testEntity.toJSON()

      expect(json).toEqual({
        id: 'simple-entity',
        name: 'Simple Entity',
        type: 'Entity',
        origin: true,
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty name', () => {
      const testEntity = new Entity('')
      expect(testEntity.name).toBe('')
      expect(testEntity.id).toBe('') // normalized empty string
    })

    it('should handle special characters in name', () => {
      const testEntity = new Entity("O'Brien")
      expect(testEntity.name).toBe("O'Brien")
      // ID normalization should handle special characters
    })

    it('should handle undefined origin gracefully', () => {
      const testEntity = new Entity('Test', 'Type', undefined)
      expect(testEntity.origin).toBe(true) // falls back to default
    })
  })
})
