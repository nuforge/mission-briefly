import { describe, it, expect, beforeEach } from 'vitest'
import Mission from '../mission'

describe('Mission', () => {
  let mission: Mission
  let testDate: Date

  beforeEach(() => {
    testDate = new Date('2364-01-01')
    mission = new Mission(
      'Encounter at Farpoint',
      'Make contact with the administration at Farpoint Station',
      'Deneb IV',
      testDate,
    )
  })

  describe('constructor', () => {
    it('should create a mission with all parameters', () => {
      expect(mission.title).toBe('Encounter at Farpoint')
      expect(mission.objective).toBe('Make contact with the administration at Farpoint Station')
      expect(mission.location).toBe('Deneb IV')
      expect(mission.date).toBe(testDate)
      expect(mission.id).toBe('encounter-at-farpoint')
    })

    it('should create a mission with minimal parameters', () => {
      const testMission = new Mission('Test Mission', 'Test objective')

      expect(testMission.title).toBe('Test Mission')
      expect(testMission.objective).toBe('Test objective')
      expect(testMission.location).toBeUndefined()
      expect(testMission.date).toBeInstanceOf(Date) // defaults to current date
      expect(testMission.id).toBe('test-mission')
    })

    it('should auto-generate current date when not provided', () => {
      const beforeCreation = new Date()
      const testMission = new Mission('Auto Date Mission', 'Test objective')
      const afterCreation = new Date()

      expect(testMission.date).toBeInstanceOf(Date)
      expect(testMission.date!.getTime()).toBeGreaterThanOrEqual(beforeCreation.getTime())
      expect(testMission.date!.getTime()).toBeLessThanOrEqual(afterCreation.getTime())
    })

    it('should generate normalized ID from title', () => {
      const testCases = [
        { title: 'The Measure of a Man', expected: 'the-measure-of-a-man' },
        { title: 'Best of Both Worlds', expected: 'best-of-both-worlds' },
        { title: 'All Good Things...', expected: 'all-good-things' },
      ]

      testCases.forEach(({ title, expected }) => {
        const testMission = new Mission(title, 'Test objective')
        expect(testMission.id).toBe(expected)
      })
    })
  })

  describe('getters', () => {
    it('should return correct property values', () => {
      expect(mission.id).toBe('encounter-at-farpoint')
      expect(mission.title).toBe('Encounter at Farpoint')
      expect(mission.objective).toBe('Make contact with the administration at Farpoint Station')
      expect(mission.location).toBe('Deneb IV')
      expect(mission.date).toBe(testDate)
    })
  })

  describe('setters', () => {
    it('should update title property', () => {
      mission.title = 'Updated Mission Title'
      expect(mission.title).toBe('Updated Mission Title')
    })

    it('should update objective property', () => {
      mission.objective = 'Updated mission objective'
      expect(mission.objective).toBe('Updated mission objective')
    })

    it('should update location property', () => {
      mission.location = 'Risa'
      expect(mission.location).toBe('Risa')
    })

    it('should update date property', () => {
      const newDate = new Date('2365-01-01')
      mission.date = newDate
      expect(mission.date).toBe(newDate)
    })
  })

  describe('fluent methods', () => {
    it('should return mission instance for method chaining', () => {
      const newDate = new Date('2365-12-25')
      const result = mission
        .setTitle('Chain Test Mission')
        .setObjective('Test chaining')
        .setLocation('Earth')
        .setDate(newDate)

      expect(result).toBe(mission) // same instance
      expect(mission.title).toBe('Chain Test Mission')
      expect(mission.objective).toBe('Test chaining')
      expect(mission.location).toBe('Earth')
      expect(mission.date).toBe(newDate)
    })

    it('should support partial method chaining', () => {
      const result = mission.setTitle('Partial Chain').setObjective('Test partial')

      expect(result).toBe(mission)
      expect(mission.title).toBe('Partial Chain')
      expect(mission.objective).toBe('Test partial')
      // Other properties should remain unchanged
      expect(mission.location).toBe('Deneb IV')
      expect(mission.date).toBe(testDate)
    })
  })

  describe('toJSON', () => {
    it('should return correct JSON representation', () => {
      const json = mission.toJSON()

      expect(json).toEqual({
        id: 'encounter-at-farpoint',
        name: 'encounter-at-farpoint', // normalized title
        title: 'Encounter at Farpoint',
        objective: 'Make contact with the administration at Farpoint Station',
        location: 'Deneb IV',
        date: testDate,
      })
    })

    it('should handle optional properties in JSON', () => {
      const testMission = new Mission('Simple Mission', 'Simple objective')
      const json = testMission.toJSON()

      expect(json).toMatchObject({
        id: 'simple-mission',
        name: 'simple-mission',
        title: 'Simple Mission',
        objective: 'Simple objective',
        location: undefined,
        date: expect.any(Date),
      })
    })

    it('should include normalized name field', () => {
      const testMission = new Mission('Complex Mission: Part II', 'Complex objective')
      const json = testMission.toJSON()

      expect(json).toHaveProperty('name', 'complex-mission-part-ii')
      expect(json).toHaveProperty('title', 'Complex Mission: Part II')
      expect(json).toHaveProperty('id', 'complex-mission-part-ii')
    })
  })

  describe('toString', () => {
    it('should return JSON string representation', () => {
      const jsonString = mission.toString()
      const parsedJson = JSON.parse(jsonString)

      // When JSON is stringified and parsed, dates become strings
      const expectedJson = {
        ...mission.toJSON(),
        date: testDate.toISOString(),
      }

      expect(parsedJson).toEqual(expectedJson)
    })

    it('should be valid JSON', () => {
      const jsonString = mission.toString()

      expect(() => JSON.parse(jsonString)).not.toThrow()
    })
  })

  describe('edge cases', () => {
    it('should handle mission with empty title', () => {
      const testMission = new Mission('', 'Empty title mission')

      expect(testMission.title).toBe('')
      expect(testMission.id).toBe('')
      expect(testMission.objective).toBe('Empty title mission')
    })

    it('should handle mission with empty objective', () => {
      const testMission = new Mission('Title Only Mission', '')

      expect(testMission.title).toBe('Title Only Mission')
      expect(testMission.objective).toBe('')
    })

    it('should handle special characters in title', () => {
      const testMission = new Mission('Who Watches the Watchers?', 'Observe primitive civilization')

      expect(testMission.title).toBe('Who Watches the Watchers?')
      expect(testMission.id).toBe('who-watches-the-watchers') // normalized
    })

    it('should handle undefined location gracefully', () => {
      const testMission = new Mission('No Location Mission', 'Test objective', undefined)

      expect(testMission.location).toBeUndefined()
      expect(testMission.date).toBeInstanceOf(Date) // should still have date
    })
  })

  describe('real-world scenarios', () => {
    it('should handle typical TNG mission', () => {
      const tngMission = new Mission(
        'The Best of Both Worlds',
        'Stop the Borg invasion of Federation space',
        'Wolf 359',
        new Date('2366-12-31'),
      )

      expect(tngMission.title).toBe('The Best of Both Worlds')
      expect(tngMission.objective).toBe('Stop the Borg invasion of Federation space')
      expect(tngMission.location).toBe('Wolf 359')
      expect(tngMission.id).toBe('the-best-of-both-worlds')
    })

    it('should handle diplomatic mission', () => {
      const diplomatic = new Mission(
        'First Contact Protocol',
        'Establish peaceful relations with newly discovered species',
      )

      diplomatic.setLocation('Unexplored System').setDate(new Date('2367-05-15'))

      expect(diplomatic.location).toBe('Unexplored System')
      expect(diplomatic.date?.getFullYear()).toBe(2367)
    })

    it('should handle mission updates during progress', () => {
      const ongoing = new Mission('Scientific Survey', 'Survey planetary system for resources')

      // Mission evolves as it progresses
      ongoing.setObjective('Survey system and investigate ancient ruins discovered on third planet')
      ongoing.setLocation('Risa System - Planet III')

      expect(ongoing.objective).toContain('ancient ruins')
      expect(ongoing.location).toContain('Planet III')
    })

    it('should handle emergency mission creation', () => {
      const emergency = new Mission(
        'Rescue Operation',
        'Respond to distress call from Federation vessel',
      )

      // Emergency missions might have minimal initial data
      expect(emergency.location).toBeUndefined()
      expect(emergency.date).toBeInstanceOf(Date) // but should have timestamp

      // Updated as more information becomes available
      emergency.setLocation('Neutral Zone Border')

      expect(emergency.location).toBe('Neutral Zone Border')
    })
  })

  describe('mission lifecycle', () => {
    it('should support mission briefing updates', () => {
      const briefing = new Mission('Routine Patrol', 'Standard border patrol')

      // Mission briefing gets more detailed
      briefing.setObjective(
        'Border patrol with special attention to unusual subspace readings in sector 7G',
      )

      expect(briefing.objective).toContain('subspace readings')
    })

    it('should maintain ID consistency despite title changes', () => {
      const originalId = mission.id

      mission.setTitle('Modified Mission Title')

      // ID should remain the same (based on original title)
      expect(mission.id).toBe(originalId)
      expect(mission.title).toBe('Modified Mission Title')
    })

    it('should handle mission parameter updates', () => {
      const flexible = new Mission('Flexible Mission', 'TBD')
      const originalDate = flexible.date

      // Update all parameters
      flexible
        .setTitle('Well-Defined Mission')
        .setObjective('Specific objective with clear goals')
        .setLocation('Specific coordinates')
        .setDate(new Date('2370-01-01'))

      expect(flexible.title).toBe('Well-Defined Mission')
      expect(flexible.objective).toBe('Specific objective with clear goals')
      expect(flexible.location).toBe('Specific coordinates')
      expect(flexible.date).not.toBe(originalDate)
    })
  })
})
