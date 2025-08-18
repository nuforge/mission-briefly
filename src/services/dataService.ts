import Character from '@/game/character'
import Ship from '@/game/ship'
import Mission from '@/game/mission'
import Species from '@/game/species'
import Rank from '@/game/rank'
import Department from '@/game/department'

/**
 * Data service layer for API-like data loading
 * This service abstracts data loading and provides a consistent interface
 * that can easily be switched from static imports to external API calls
 */

interface CharacterData {
  id: string
  name: string
  species: {
    name: string
    type: string
    origin: string
  }
  rank: {
    name: string
    title: string
    value: number
    class: string
  }
  department: {
    name: string
    color: string
    icon: string
  }
}

interface SpeciesData {
  id: string
  name: string
  type: string
  origin: string
}

interface DepartmentData {
  id: string
  name: string
  color: string
  icon: string
}

interface RankData {
  id: string
  name: string
  title: string
  value: number
  class: string
}

interface ShipData {
  id: string
  name: string
  type: string
  registry: string
  crew: string[]
  roles?: { [key: string]: string }
}

interface MissionData {
  id: string
  title: string
  objective: string
  location: string
  date: string
  status: string
  priority: string
}

interface APIResponse<T> {
  data: T
  status: 'success' | 'error'
  message?: string
  timestamp: string
}

/**
 * Data validation utilities
 */
class DataValidator {
  /**
   * Validate character data structure
   */
  static validateCharacterData(data: any): data is CharacterData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      data.species &&
      typeof data.species.name === 'string' &&
      data.rank &&
      typeof data.rank.name === 'string' &&
      data.department &&
      typeof data.department.name === 'string'
    )
  }

  /**
   * Validate ship data structure
   */
  static validateShipData(data: any): data is ShipData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.type === 'string' &&
      typeof data.registry === 'string' &&
      Array.isArray(data.crew)
    )
  }

  /**
   * Validate mission data structure
   */
  static validateMissionData(data: any): data is MissionData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.title === 'string' &&
      typeof data.objective === 'string' &&
      typeof data.location === 'string' &&
      typeof data.date === 'string'
    )
  }

  /**
   * Validate species data structure
   */
  static validateSpeciesData(data: any): data is SpeciesData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.type === 'string' &&
      typeof data.origin === 'string'
    )
  }

  /**
   * Validate department data structure
   */
  static validateDepartmentData(data: any): data is DepartmentData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.color === 'string' &&
      typeof data.icon === 'string'
    )
  }

  /**
   * Validate rank data structure
   */
  static validateRankData(data: any): data is RankData {
    return (
      data &&
      typeof data.id === 'string' &&
      typeof data.name === 'string' &&
      typeof data.title === 'string' &&
      typeof data.value === 'number'
    )
  }

  /**
   * Validate array of data with a specific validator
   */
  static validateArray<T>(
    data: any[],
    validator: (item: any) => boolean,
    itemType: string,
  ): data is T[] {
    if (!Array.isArray(data)) {
      throw new Error(`Expected ${itemType} data to be an array`)
    }

    const invalidItems: { index: number; item: any; error?: string }[] = []

    data.forEach((item, index) => {
      try {
        if (!validator(item)) {
          invalidItems.push({
            index,
            item,
            error: `Invalid ${itemType} structure`,
          })
        }
      } catch (error) {
        invalidItems.push({
          index,
          item,
          error: error instanceof Error ? error.message : 'Validation error',
        })
      }
    })

    if (invalidItems.length > 0) {
      console.warn(`Data validation warnings for ${itemType}:`, {
        total: data.length,
        invalid: invalidItems.length,
        details: invalidItems.slice(0, 5), // Show first 5 for debugging
      })

      // For now, we'll warn but continue - in production, might want to be stricter
      if (invalidItems.length === data.length) {
        throw new Error(`All ${itemType} data is invalid - cannot continue`)
      }
    }

    return true
  }

  /**
   * Filter out invalid items and return only valid ones
   */
  static filterValidItems<T>(
    data: any[],
    validator: (item: any) => boolean,
    itemType: string,
  ): T[] {
    if (!Array.isArray(data)) {
      console.error(`Expected ${itemType} data to be an array, got:`, typeof data)
      return []
    }

    const validItems = data.filter((item, index) => {
      try {
        const isValid = validator(item)
        if (!isValid) {
          console.warn(`Skipping invalid ${itemType} at index ${index}:`, item)
        }
        return isValid
      } catch (error) {
        console.warn(`Validation error for ${itemType} at index ${index}:`, error)
        return false
      }
    })

    if (validItems.length !== data.length) {
      console.warn(`Filtered ${itemType} data: ${validItems.length}/${data.length} items are valid`)
    }

    return validItems
  }
}

class DataService {
  private baseUrl: string
  private isLocalMode: boolean

  constructor(baseUrl?: string) {
    this.baseUrl = baseUrl || ''
    this.isLocalMode = !baseUrl // If no baseUrl provided, use local data
  }

  /**
   * Simulates API call delay for realistic testing
   */
  private async simulateNetworkDelay(ms: number = 100): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Transforms raw character data into Character class instances
   */
  private transformCharacterData(
    data: CharacterData[],
    species: Species[],
    ranks: Rank[],
    departments: Department[],
  ): Character[] {
    return data.map((char) => {
      const speciesInstance =
        species.find((s) => s.name === char.species.name) ||
        new Species(char.species.name, char.species.type, { origin: char.species.origin })

      const rankInstance =
        ranks.find((r) => r.name === char.rank.name) ||
        new Rank(char.rank.name, char.rank.title, char.rank.value)

      const departmentInstance =
        departments.find((d) => d.name === char.department.name) ||
        new Department(char.department.name, char.department.color, char.department.icon)

      const character = new Character(char.name, speciesInstance, rankInstance, departmentInstance)

      // Override the auto-generated ID with the JSON ID
      character.overrideId(char.id)

      return character
    })
  }

  /**
   * Transform species data
   */
  private transformSpeciesData(data: SpeciesData[]): Species[] {
    return data.map(
      (species) => new Species(species.name, species.type, { origin: species.origin }),
    )
  }

  /**
   * Transform department data
   */
  private transformDepartmentData(data: DepartmentData[]): Department[] {
    return data.map((dept) => new Department(dept.name, dept.color, dept.icon))
  }

  /**
   * Transform rank data
   */
  private transformRankData(data: RankData[]): Rank[] {
    return data.map((rank) => new Rank(rank.name, rank.title, rank.value))
  }

  /**
   * Transform ship data
   */
  private transformShipData(data: ShipData[], characters: Character[]): Ship[] {
    return data.map((shipData) => {
      const ship = new Ship(shipData.name, shipData.type, shipData.registry)

      // Override the auto-generated ID with the JSON ID
      ship.overrideId(shipData.id)

      // Add crew members
      const crewMembers = shipData.crew
        .map((charId) => characters.find((c) => c.id === charId))
        .filter((char) => char !== undefined) as Character[]

      if (crewMembers.length > 0) {
        ship.setCrew(crewMembers)
      }

      return ship
    })
  }

  /**
   * Transform mission data
   */
  private transformMissionData(data: MissionData[]): Mission[] {
    return data.map((missionData) => {
      const mission = new Mission(
        missionData.title,
        missionData.objective,
        missionData.location,
        new Date(missionData.date),
      )

      // Override the auto-generated ID with the JSON ID
      mission.overrideId(missionData.id)

      return mission
    })
  }

  /**
   * Load species data
   */
  async loadSpecies(): Promise<APIResponse<Species[]>> {
    try {
      await this.simulateNetworkDelay()

      if (this.isLocalMode) {
        const response = await import('@/data/json/species.json')
        const species = this.transformSpeciesData(response.species)

        return {
          data: species,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch(`${this.baseUrl}/api/species`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const species = this.transformSpeciesData(apiData.species)

        return {
          data: species,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load species:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Load departments data
   */
  async loadDepartments(): Promise<APIResponse<Department[]>> {
    try {
      await this.simulateNetworkDelay()

      if (this.isLocalMode) {
        const response = await import('@/data/json/departments.json')
        const departments = this.transformDepartmentData(response.departments)

        return {
          data: departments,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch(`${this.baseUrl}/api/departments`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const departments = this.transformDepartmentData(apiData.departments)

        return {
          data: departments,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load departments:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Load ranks data
   */
  async loadRanks(): Promise<APIResponse<Rank[]>> {
    try {
      await this.simulateNetworkDelay()

      if (this.isLocalMode) {
        const response = await import('@/data/json/ranks.json')
        const allRanks: RankData[] = []
        Object.values(response.rankSystems).forEach((ranks) => {
          allRanks.push(...ranks)
        })
        const ranks = this.transformRankData(allRanks)

        return {
          data: ranks,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch(`${this.baseUrl}/api/ranks`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const ranks = this.transformRankData(apiData.ranks)

        return {
          data: ranks,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load ranks:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Load characters - can switch between local JSON and external API
   */
  async loadCharacters(): Promise<APIResponse<Character[]>> {
    try {
      await this.simulateNetworkDelay()

      // Load reference data first
      const [speciesResponse, ranksResponse, departmentsResponse] = await Promise.all([
        this.loadSpecies(),
        this.loadRanks(),
        this.loadDepartments(),
      ])

      if (
        speciesResponse.status === 'error' ||
        ranksResponse.status === 'error' ||
        departmentsResponse.status === 'error'
      ) {
        throw new Error('Failed to load reference data')
      }

      if (this.isLocalMode) {
        // Load from local JSON files
        const [tngResponse, ds9Response] = await Promise.all([
          import('@/data/json/tng-characters.json'),
          import('@/data/json/ds9-characters.json'),
        ])

        const allCharacterData = [...tngResponse.tngCharacters, ...ds9Response.ds9Characters]

        // Filter out invalid character data with error recovery
        const validCharacterData = DataValidator.filterValidItems<CharacterData>(
          allCharacterData,
          DataValidator.validateCharacterData,
          'character',
        )

        if (validCharacterData.length === 0) {
          throw new Error('No valid character data found')
        }

        const characters = this.transformCharacterData(
          validCharacterData,
          speciesResponse.data,
          ranksResponse.data,
          departmentsResponse.data,
        )

        return {
          data: characters,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        // This would be replaced with actual API call
        const response = await fetch(`${this.baseUrl}/api/characters`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const characters = this.transformCharacterData(
          apiData.characters,
          speciesResponse.data,
          ranksResponse.data,
          departmentsResponse.data,
        )

        return {
          data: characters,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load characters:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Load ships - loads from JSON with character crew assignment
   */
  async loadShips(): Promise<APIResponse<Ship[]>> {
    try {
      await this.simulateNetworkDelay()

      // Load characters first for crew assignment
      const charactersResponse = await this.loadCharacters()
      if (charactersResponse.status === 'error') {
        throw new Error('Failed to load characters for ships')
      }

      if (this.isLocalMode) {
        const response = await import('@/data/json/ships.json')

        // Filter out invalid ship data with error recovery
        const validShipData = DataValidator.filterValidItems<ShipData>(
          response.ships,
          DataValidator.validateShipData,
          'ship',
        )

        if (validShipData.length === 0) {
          throw new Error('No valid ship data found')
        }

        const ships = this.transformShipData(validShipData, charactersResponse.data)

        return {
          data: ships,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch(`${this.baseUrl}/api/ships`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const ships = this.transformShipData(apiData.ships as ShipData[], charactersResponse.data)

        return {
          data: ships,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load ships:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Load missions - loads from JSON
   */
  async loadMissions(): Promise<APIResponse<Mission[]>> {
    try {
      await this.simulateNetworkDelay()

      if (this.isLocalMode) {
        const response = await import('@/data/json/missions.json')

        // Filter out invalid mission data with error recovery
        const validMissionData = DataValidator.filterValidItems<MissionData>(
          response.missions,
          DataValidator.validateMissionData,
          'mission',
        )

        if (validMissionData.length === 0) {
          throw new Error('No valid mission data found')
        }

        const missions = this.transformMissionData(validMissionData)

        return {
          data: missions,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      } else {
        const response = await fetch(`${this.baseUrl}/api/missions`)
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const apiData = await response.json()
        const missions = this.transformMissionData(apiData.missions as MissionData[])

        return {
          data: missions,
          status: 'success',
          timestamp: new Date().toISOString(),
        }
      }
    } catch (error) {
      console.error('Failed to load missions:', error)
      return {
        data: [],
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString(),
      }
    }
  }

  /**
   * Switch to external API mode
   */
  setApiMode(baseUrl: string): void {
    this.baseUrl = baseUrl
    this.isLocalMode = false
  }

  /**
   * Switch to local data mode
   */
  setLocalMode(): void {
    this.isLocalMode = true
    this.baseUrl = ''
  }

  /**
   * Check if service is in local mode
   */
  isLocal(): boolean {
    return this.isLocalMode
  }
}

// Export singleton instance
export const dataService = new DataService()

// Export class for custom instances
export default DataService
