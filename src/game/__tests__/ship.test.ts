import { describe, it, expect, beforeEach } from 'vitest'
import Ship from '../ship'
import Character from '../character'
import Species from '../species'
import Rank from '../rank'
import Department from '../department'
import Role from '../role'

describe('Ship', () => {
  let ship: Ship
  let captain: Character
  let firstOfficer: Character
  let engineer: Character
  let captainRole: Role
  let firstOfficerRole: Role

  beforeEach(() => {
    ship = new Ship('USS Enterprise', 'Galaxy-class', 'NCC-1701-D')

    captain = new Character(
      'Jean-Luc Picard',
      new Species('Human'),
      new Rank('Captain', 'Captain', 4),
      new Department('Command', 'red', 'mdi-star-circle'),
    )

    firstOfficer = new Character(
      'William Riker',
      new Species('Human'),
      new Rank('Commander', 'Commander', 3),
      new Department('Command', 'red', 'mdi-star-circle'),
    )

    engineer = new Character(
      'Geordi La Forge',
      new Species('Human'),
      new Rank('Lieutenant Commander', 'Lt. Commander', 2.5),
      new Department('Engineering', 'gold', 'mdi-wrench'),
    )

    captainRole = new Role('Captain', 'Commanding Officer')
    firstOfficerRole = new Role('First Officer', 'Executive Officer')
  })

  describe('constructor', () => {
    it('should create a ship with all parameters', () => {
      expect(ship.name).toBe('USS Enterprise')
      expect(ship.type).toBe('Galaxy-class')
      expect(ship.registry).toBe('NCC-1701-D')
      expect(ship.id).toBe('uss-enterprise')
    })

    it('should create a ship with minimal parameters', () => {
      const testShip = new Ship('USS Defiant')

      expect(testShip.name).toBe('USS Defiant')
      expect(testShip.type).toBe('Ship') // defaults to constructor name
      expect(testShip.registry).toBeDefined() // auto-generated
      expect(testShip.id).toBe('uss-defiant')
    })

    it('should auto-generate registry when not provided', () => {
      const testShip = new Ship('USS Voyager', 'Intrepid-class')

      expect(testShip.registry).toBeDefined()
      expect(testShip.registry.length).toBeGreaterThan(0)
    })
  })

  describe('crew management', () => {
    it('should start with no crew', () => {
      expect(ship.hasCrew()).toBe(false)
      expect(ship.getCrew()).toEqual([])
    })

    it('should add crew members', () => {
      const result = ship.addCrew(captain)

      expect(result).toBe(ship) // returns same instance for chaining
      expect(ship.hasCrew()).toBe(true)
      expect(ship.getCrew()).toContain(captain)
    })

    it('should set entire crew at once', () => {
      const crew = [captain, firstOfficer, engineer]
      const result = ship.setCrew(crew)

      expect(result).toBe(ship) // returns same instance for chaining
      expect(ship.getCrew()).toEqual(crew)
      expect(ship.hasCrew()).toBe(true)
      expect(ship.hasCrew(2)).toBe(true) // more than 2 crew members
    })

    it('should check minimum crew requirements', () => {
      ship.setCrew([captain])

      expect(ship.hasCrew()).toBe(true)
      expect(ship.hasCrew(0)).toBe(true)
      expect(ship.hasCrew(1)).toBe(false) // has exactly 1, but needs more than 1
      expect(ship.hasCrew(5)).toBe(false)
    })
  })

  describe('crew assignment and roles', () => {
    beforeEach(() => {
      ship.setCrew([captain, firstOfficer, engineer])
    })

    it('should assign crew to specific roles', () => {
      const result = ship.assignCrew(captain, captainRole)

      expect(result).toBe(ship) // returns same instance for chaining
      expect(ship.getAssignedCrew(captainRole)).toBe(captain)
    })

    it('should support method chaining for assignments', () => {
      const result = ship
        .assignCrew(captain, captainRole)
        .assignCrew(firstOfficer, firstOfficerRole)

      expect(result).toBe(ship)
      expect(ship.getAssignedCrew(captainRole)).toBe(captain)
      expect(ship.getAssignedCrew(firstOfficerRole)).toBe(firstOfficer)
    })

    it('should find crew by role name (string)', () => {
      ship.assignCrew(captain, captainRole)

      expect(ship.getAssignedCrew('Captain')).toBe(captain)
      expect(ship.getAssignedCrew('captain')).toBe(captain) // case insensitive
      expect(ship.getAssignedCrew('First Officer')).toBeUndefined()
    })

    it('should unassign crew from roles', () => {
      ship.assignCrew(captain, captainRole)
      expect(ship.getAssignedCrew(captainRole)).toBe(captain)

      const result = ship.unassignCrew(captainRole)

      expect(result).toBe(ship) // returns same instance for chaining
      expect(ship.getAssignedCrew(captainRole)).toBeUndefined()
    })

    it('should check if ship has a captain', () => {
      expect(ship.hasCaptain()).toBe(false)

      ship.assignCrew(captain, captainRole)
      expect(ship.hasCaptain()).toBe(true)
      expect(ship.hasCaptain('Captain')).toBe(true)
    })

    it('should add crew and assign role in one operation', () => {
      const newShip = new Ship('USS Reliant')
      const result = newShip.addCrew(captain, captainRole)

      expect(result).toBe(newShip)
      expect(newShip.getCrew()).toContain(captain)
      expect(newShip.getAssignedCrew(captainRole)).toBe(captain)
      expect(newShip.hasCaptain()).toBe(true)
    })
  })

  describe('crew sorting and ranking', () => {
    beforeEach(() => {
      ship.setCrew([captain, firstOfficer, engineer])
    })

    it('should sort crew by rank (descending by default)', () => {
      const highestRanking = ship.sortCrewByRank()

      expect(highestRanking).toBe(captain) // Captain has rank value 4
    })

    it('should sort crew by rank ascending', () => {
      const lowestRanking = ship.sortCrewByRank(false)

      expect(lowestRanking).toBe(engineer) // Lt. Commander has rank value 2.5
    })

    it('should handle empty crew when sorting', () => {
      const emptyShip = new Ship('Empty Ship')
      const result = emptyShip.sortCrewByRank()

      expect(result).toBeUndefined()
    })

    it('should handle crew without ranks', () => {
      const civilian = new Character('Civilian', new Species('Human'), undefined as any)
      const civilianShip = new Ship('Civilian Transport')
      civilianShip.setCrew([civilian, captain])

      const highestRanking = civilianShip.sortCrewByRank()

      expect(highestRanking).toBe(captain) // Captain should still be first
    })
  })

  describe('inheritance from Entity', () => {
    it('should inherit Entity properties and methods', () => {
      expect(ship.id).toBe('uss-enterprise')
      expect(ship.name).toBe('USS Enterprise')
      expect(ship.type).toBe('Galaxy-class')
    })

    it('should support Entity fluent methods', () => {
      const result = ship.newName('USS Enterprise-E')

      expect(result).toBe(ship)
      expect(ship.name).toBe('USS Enterprise-E')
    })
  })

  describe('toJSON', () => {
    it('should return complete JSON representation', () => {
      ship.setCrew([captain])
      ship.assignCrew(captain, captainRole)

      const json = ship.toJSON()

      // Should include Entity base properties
      expect(json).toHaveProperty('id')
      expect(json).toHaveProperty('name')
      expect(json).toHaveProperty('type')

      // Should include Ship-specific properties
      expect(json).toHaveProperty('registry')
      expect(json).toHaveProperty('crew')
      expect(json).toHaveProperty('roles')
    })

    it('should handle empty crew in JSON', () => {
      const json = ship.toJSON()

      expect(json).toMatchObject({
        id: 'uss-enterprise',
        name: 'USS Enterprise',
        type: 'Galaxy-class',
        registry: 'NCC-1701-D',
        crew: [],
        roles: expect.any(Object), // Map converted to object
      })
    })
  })

  describe('edge cases', () => {
    it('should handle ship with empty name', () => {
      const testShip = new Ship('')
      expect(testShip.name).toBe('')
      expect(testShip.id).toBe('')
    })

    it('should handle multiple assignments to same role', () => {
      ship.assignCrew(captain, captainRole)
      ship.assignCrew(firstOfficer, captainRole) // reassign same role

      expect(ship.getAssignedCrew(captainRole)).toBe(firstOfficer) // should be overwritten
    })

    it('should handle role lookup with non-existent role', () => {
      const nonExistentRole = new Role('Chief Medical Officer', 'CMO')
      expect(ship.getAssignedCrew(nonExistentRole)).toBeUndefined()
      expect(ship.getAssignedCrew('Non-existent Role')).toBeUndefined()
    })
  })

  describe('real-world scenarios', () => {
    it('should handle complete Enterprise crew setup', () => {
      const data = new Character(
        'Data',
        new Species('Android'),
        new Rank('Lieutenant Commander', 'Lt. Commander', 2.5),
        new Department('Operations', 'gold', 'mdi-account-circle'),
      )

      const opsRole = new Role('Operations Officer', 'Ops')

      ship
        .setCrew([captain, firstOfficer, engineer, data])
        .assignCrew(captain, captainRole)
        .assignCrew(firstOfficer, firstOfficerRole)
        .assignCrew(data, opsRole)

      expect(ship.hasCrew(3)).toBe(true) // more than 3 crew
      expect(ship.hasCaptain()).toBe(true)
      expect(ship.getAssignedCrew('Captain')).toBe(captain)
      expect(ship.getAssignedCrew('Operations Officer')).toBe(data)
      expect(ship.sortCrewByRank()).toBe(captain) // highest ranking
    })

    it('should handle ship without command structure', () => {
      const civilian1 = new Character('Civilian 1', new Species('Human'), undefined as any)
      const civilian2 = new Character('Civilian 2', new Species('Human'), undefined as any)

      const transport = new Ship('Civilian Transport', 'Transport')
      transport.setCrew([civilian1, civilian2])

      expect(transport.hasCaptain()).toBe(false)
      expect(transport.hasCrew()).toBe(true)
      expect(transport.sortCrewByRank()).toBeDefined() // should still work
    })
  })
})
