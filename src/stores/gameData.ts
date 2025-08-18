import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type Character from '@/game/character'
import type Ship from '@/game/ship'
import type Mission from '@/game/mission'
import type Species from '@/game/species'
import type Rank from '@/game/rank'
import type Department from '@/game/department'
import { dataService } from '@/services/dataService'

/**
 * Main game data store - manages all game entities with API-like loading patterns
 * Designed to easily transition from static imports to external API calls
 */
export const useGameDataStore = defineStore('gameData', () => {
  // State
  const characters = ref<Character[]>([])
  const ships = ref<Ship[]>([])
  const missions = ref<Mission[]>([])
  const species = ref<Species[]>([])
  const ranks = ref<Rank[]>([])
  const departments = ref<Department[]>([])
  const loading = ref<boolean>(false)
  const error = ref<string | null>(null)

  // Computed getters
  const getCharacterById = computed(() => {
    return (id: string) => characters.value.find((char) => char.id === id)
  })

  const getCharacterByName = computed(() => {
    return (name: string) => characters.value.find((char) => char.name === name)
  })

  const getShipById = computed(() => {
    return (id: string) => ships.value.find((ship) => ship.id === id)
  })

  const getShipByName = computed(() => {
    return (name: string) => ships.value.find((ship) => ship.name === name)
  })

  const getMissionById = computed(() => {
    return (id: string) => missions.value.find((mission) => mission.id === id)
  })

  const getActiveCharacters = computed(() => {
    // For now, consider all characters active - can add status property later
    return characters.value
  })

  const getActiveShips = computed(() => {
    // For now, consider all ships active - can add status property later
    return ships.value
  })

  const getActiveMissions = computed(() => {
    // For now, consider all missions active - can add status property later
    return missions.value
  })

  const getCharactersByDepartment = computed(() => {
    return (departmentName: string) =>
      characters.value.filter((char) => char.department?.name === departmentName)
  })

  const getShipsByClass = computed(() => {
    return (shipClass: string) => ships.value.filter((ship) => ship.type === shipClass)
  })

  // API-like loading functions
  const loadCharacters = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // Use data service for API-like loading
      const response = await dataService.loadCharacters()

      if (response.status === 'success') {
        characters.value = response.data
      } else {
        throw new Error(response.message || 'Failed to load characters')
      }
    } catch (err) {
      error.value = `Failed to load characters: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('Error loading characters:', err)
    } finally {
      loading.value = false
    }
  }

  const loadShips = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await dataService.loadShips()
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to load ships')
      }
      ships.value = response.data
    } catch (err) {
      error.value = `Failed to load ships: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('Error loading ships:', err)
    } finally {
      loading.value = false
    }
  }

  const loadMissions = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      const response = await dataService.loadMissions()
      if (response.status === 'error') {
        throw new Error(response.message || 'Failed to load missions')
      }
      missions.value = response.data
    } catch (err) {
      error.value = `Failed to load missions: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('Error loading missions:', err)
    } finally {
      loading.value = false
    }
  }

  const loadReferenceData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // Load reference data using DataService
      const [speciesResponse, ranksResponse, departmentsResponse] = await Promise.all([
        dataService.loadSpecies(),
        dataService.loadRanks(),
        dataService.loadDepartments(),
      ])

      // Check for errors
      if (speciesResponse.status === 'error') {
        throw new Error(speciesResponse.message || 'Failed to load species')
      }
      if (ranksResponse.status === 'error') {
        throw new Error(ranksResponse.message || 'Failed to load ranks')
      }
      if (departmentsResponse.status === 'error') {
        throw new Error(departmentsResponse.message || 'Failed to load departments')
      }

      species.value = speciesResponse.data
      ranks.value = ranksResponse.data
      departments.value = departmentsResponse.data
    } catch (err) {
      error.value = `Failed to load reference data: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('Error loading reference data:', err)
    } finally {
      loading.value = false
    }
  }

  const loadAllData = async (): Promise<void> => {
    try {
      loading.value = true
      error.value = null

      // Load all data in parallel for better performance
      await Promise.all([loadReferenceData(), loadCharacters(), loadShips(), loadMissions()])
    } catch (err) {
      error.value = `Failed to load game data: ${err instanceof Error ? err.message : 'Unknown error'}`
      console.error('Error loading game data:', err)
    } finally {
      loading.value = false
    }
  }

  // Data manipulation actions
  const addCharacter = (character: Character): void => {
    characters.value.push(character)
  }

  const removeCharacter = (characterId: string): void => {
    const index = characters.value.findIndex((char) => char.id === characterId)
    if (index > -1) {
      characters.value.splice(index, 1)
    }
  }

  const updateCharacter = (characterId: string, updates: Partial<Character>): void => {
    const character = characters.value.find((char) => char.id === characterId)
    if (character) {
      Object.assign(character, updates)
    }
  }

  const addShip = (ship: Ship): void => {
    ships.value.push(ship)
  }

  const removeShip = (shipId: string): void => {
    const index = ships.value.findIndex((ship) => ship.id === shipId)
    if (index > -1) {
      ships.value.splice(index, 1)
    }
  }

  const updateShip = (shipId: string, updates: Partial<Ship>): void => {
    const ship = ships.value.find((ship) => ship.id === shipId)
    if (ship) {
      Object.assign(ship, updates)
    }
  }

  const addMission = (mission: Mission): void => {
    missions.value.push(mission)
  }

  const removeMission = (missionId: string): void => {
    const index = missions.value.findIndex((mission) => mission.id === missionId)
    if (index > -1) {
      missions.value.splice(index, 1)
    }
  }

  const updateMission = (missionId: string, updates: Partial<Mission>): void => {
    const mission = missions.value.find((mission) => mission.id === missionId)
    if (mission) {
      Object.assign(mission, updates)
    }
  }

  // Statistics and computed data
  const totalCharacters = computed(() => characters.value.length)
  const totalShips = computed(() => ships.value.length)
  const totalMissions = computed(() => missions.value.length)
  const activeMissionsCount = computed(() => getActiveMissions.value.length)
  const activeShipsCount = computed(() => getActiveShips.value.length)
  const activeCharactersCount = computed(() => getActiveCharacters.value.length)

  return {
    // State
    characters,
    ships,
    missions,
    species,
    ranks,
    departments,
    loading,
    error,

    // Getters
    getCharacterById,
    getCharacterByName,
    getShipById,
    getShipByName,
    getMissionById,
    getActiveCharacters,
    getActiveShips,
    getActiveMissions,
    getCharactersByDepartment,
    getShipsByClass,

    // Actions
    loadCharacters,
    loadShips,
    loadMissions,
    loadReferenceData,
    loadAllData,
    addCharacter,
    removeCharacter,
    updateCharacter,
    addShip,
    removeShip,
    updateShip,
    addMission,
    removeMission,
    updateMission,

    // Computed stats
    totalCharacters,
    totalShips,
    totalMissions,
    activeMissionsCount,
    activeShipsCount,
    activeCharactersCount,
  }
})
