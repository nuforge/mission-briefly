/**
 * Data validation utilities to verify JSON migration is working
 */

import { useGameDataStore } from '@/stores/gameData'

export async function validateDataMigration(): Promise<{ success: boolean; errors: string[] }> {
  const errors: string[] = []

  try {
    const gameStore = useGameDataStore()

    // Load all data
    await gameStore.loadAllData()

    // Check if all data types have content
    if (gameStore.characters.length === 0) {
      errors.push('No characters loaded')
    }

    if (gameStore.species.length === 0) {
      errors.push('No species loaded')
    }

    if (gameStore.ranks.length === 0) {
      errors.push('No ranks loaded')
    }

    if (gameStore.departments.length === 0) {
      errors.push('No departments loaded')
    }

    if (gameStore.ships.length === 0) {
      errors.push('No ships loaded')
    }

    if (gameStore.missions.length === 0) {
      errors.push('No missions loaded')
    }

    // Validate data integrity
    const characters = gameStore.characters
    const firstCharacter = characters[0]

    if (firstCharacter) {
      if (!firstCharacter.name) {
        errors.push('Character missing name property')
      }
      if (!firstCharacter.species) {
        errors.push('Character missing species property')
      }
      if (!firstCharacter.rank) {
        errors.push('Character missing rank property')
      }
      if (!firstCharacter.department) {
        errors.push('Character missing department property')
      }
    }

    // Validate ships have crews
    const ships = gameStore.ships
    const firstShip = ships[0]

    if (firstShip && firstShip.crew.length === 0) {
      errors.push('Ship missing crew members')
    }

    // Log success metrics
    console.log('✅ Data Migration Validation:', {
      characters: gameStore.characters.length,
      species: gameStore.species.length,
      ranks: gameStore.ranks.length,
      departments: gameStore.departments.length,
      ships: gameStore.ships.length,
      missions: gameStore.missions.length,
    })

    return {
      success: errors.length === 0,
      errors,
    }
  } catch (error) {
    errors.push(`Validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return {
      success: false,
      errors,
    }
  }
}
