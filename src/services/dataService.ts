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

      return new Character(char.name, speciesInstance, rankInstance, departmentInstance)
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
    return data.map(
      (missionData) =>
        new Mission(
          missionData.title,
          missionData.objective,
          missionData.location,
          new Date(missionData.date),
        ),
    )
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

        const characters = this.transformCharacterData(
          allCharacterData,
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
        const ships = this.transformShipData(response.ships as ShipData[], charactersResponse.data)

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
        const missions = this.transformMissionData(response.missions as MissionData[])

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
