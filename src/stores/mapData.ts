import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { dataService } from '@/services/dataService'
import Planet from '@/game/planet'
import Anomaly from '@/game/anomaly'
import SolarSystem from '@/game/solarSystem'
import Ship from '@/game/ship'
import type { Coordinates3D } from '@/game/coordinates'

export interface MapViewState {
  zoom: number
  centerX: number
  centerY: number
  showPlanets: boolean
  showAnomalies: boolean
  showShips: boolean
  selectedObject: string | null
}

export const useMapDataStore = defineStore('mapData', () => {
  // State
  const planets = ref<Planet[]>([])
  const anomalies = ref<Anomaly[]>([])
  const solarSystems = ref<SolarSystem[]>([])
  const ships = ref<Ship[]>([])

  // Loading states
  const isLoadingPlanets = ref(false)
  const isLoadingAnomalies = ref(false)
  const isLoadingSystems = ref(false)
  const isLoadingShips = ref(false)

  // Map view state
  const mapView = ref<MapViewState>({
    zoom: 1.0,
    centerX: 0,
    centerY: 0,
    showPlanets: true,
    showAnomalies: true,
    showShips: true,
    selectedObject: null,
  })

  // Computed
  const isLoading = computed(() => {
    return (
      isLoadingPlanets.value ||
      isLoadingAnomalies.value ||
      isLoadingSystems.value ||
      isLoadingShips.value
    )
  })

  const currentSystem = computed(() => {
    return solarSystems.value[0] // For now, just return the first system
  })

  const visiblePlanets = computed(() => {
    return mapView.value.showPlanets ? planets.value : []
  })

  const visibleAnomalies = computed(() => {
    return mapView.value.showAnomalies ? anomalies.value.filter((a) => a.isActive) : []
  })

  const visibleShips = computed(() => {
    return mapView.value.showShips ? ships.value : []
  })

  const criticalAnomalies = computed(() => {
    return anomalies.value.filter((a) => a.severity === 'critical' && a.isActive)
  })

  const habitablePlanets = computed(() => {
    return planets.value.filter((p) => p.isHabitable)
  })

  const unexploredPlanets = computed(() => {
    return planets.value.filter((p) => !p.isExplored)
  })

  const activeShips = computed(() => {
    return ships.value.filter((s: any) => s.status === 'active')
  })

  // Actions
  async function loadPlanets() {
    isLoadingPlanets.value = true
    console.log('Starting to load planets...')
    try {
      const response = await dataService.loadPlanets()
      console.log('Planets response:', response)
      if (response.status === 'success') {
        planets.value = response.data
        console.log(
          `Loaded ${response.data.length} planets:`,
          response.data.map((p) => ({ id: p.id, name: p.name, position: (p as any).position })),
        )
      } else {
        console.error('Failed to load planets:', response.message)
      }
    } catch (error) {
      console.error('Error loading planets:', error)
    } finally {
      isLoadingPlanets.value = false
    }
  }

  async function loadAnomalies() {
    isLoadingAnomalies.value = true
    try {
      const response = await dataService.loadAnomalies()
      if (response.status === 'success') {
        anomalies.value = response.data
      } else {
        console.error('Failed to load anomalies:', response.message)
      }
    } catch (error) {
      console.error('Error loading anomalies:', error)
    } finally {
      isLoadingAnomalies.value = false
    }
  }

  async function loadSolarSystems() {
    isLoadingSystems.value = true
    try {
      const response = await dataService.loadSolarSystems()
      if (response.status === 'success') {
        solarSystems.value = response.data
      } else {
        console.error('Failed to load solar systems:', response.message)
      }
    } catch (error) {
      console.error('Error loading solar systems:', error)
    } finally {
      isLoadingSystems.value = false
    }
  }

  async function loadShips() {
    isLoadingShips.value = true
    console.log('Starting to load ships...')
    try {
      const response = await dataService.loadShips()
      console.log('Ships response:', response)
      if (response.status === 'success') {
        ships.value = response.data
        console.log(
          `Loaded ${response.data.length} ships:`,
          response.data.map((s) => ({
            id: s.id,
            name: s.name,
            position: (s as any).position,
            status: (s as any).status,
          })),
        )
      } else {
        console.error('Failed to load ships:', response.message)
      }
    } catch (error) {
      console.error('Error loading ships:', error)
    } finally {
      isLoadingShips.value = false
    }
  }

  async function loadAllMapData() {
    await Promise.all([loadPlanets(), loadAnomalies(), loadSolarSystems(), loadShips()])
  }

  // Map view controls
  function setZoom(zoom: number) {
    mapView.value.zoom = Math.max(0.1, Math.min(5.0, zoom))
  }

  function setCenter(x: number, y: number) {
    mapView.value.centerX = x
    mapView.value.centerY = y
  }

  function toggleLayer(layer: 'planets' | 'anomalies' | 'ships') {
    switch (layer) {
      case 'planets':
        mapView.value.showPlanets = !mapView.value.showPlanets
        break
      case 'anomalies':
        mapView.value.showAnomalies = !mapView.value.showAnomalies
        break
      case 'ships':
        mapView.value.showShips = !mapView.value.showShips
        break
    }
  }

  function selectObject(objectId: string | null) {
    mapView.value.selectedObject = objectId
  }

  function resetView() {
    mapView.value.zoom = 1.0
    mapView.value.centerX = 0
    mapView.value.centerY = 0
    mapView.value.selectedObject = null
  }

  // Utility functions
  function findObjectById(id: string): any {
    let found: any = null

    found = planets.value.find((p) => p.id === id) || null
    if (found) return found as Planet

    found = anomalies.value.find((a) => a.id === id) || null
    if (found) return found as Anomaly

    found = ships.value.find((s) => s.id === id) || null
    if (found) return found as Ship

    return null
  }

  function getObjectsInRange(center: Coordinates3D, range: number): any[] {
    const objects: any[] = []

    // Check planets
    planets.value.forEach((planet) => {
      const distance = Math.sqrt(
        Math.pow(planet.position.x - center.x, 2) +
          Math.pow(planet.position.y - center.y, 2) +
          Math.pow(planet.position.z - center.z, 2),
      )
      if (distance <= range) {
        objects.push(planet as Planet)
      }
    })

    // Check anomalies
    anomalies.value.forEach((anomaly) => {
      const distance = Math.sqrt(
        Math.pow(anomaly.position.x - center.x, 2) +
          Math.pow(anomaly.position.y - center.y, 2) +
          Math.pow(anomaly.position.z - center.z, 2),
      )
      if (distance <= range) {
        objects.push(anomaly as Anomaly)
      }
    })

    return objects
  }

  return {
    // State
    planets,
    anomalies,
    solarSystems,
    ships,
    mapView,

    // Loading states
    isLoading,
    isLoadingPlanets,
    isLoadingAnomalies,
    isLoadingSystems,
    isLoadingShips,

    // Computed
    currentSystem,
    visiblePlanets,
    visibleAnomalies,
    visibleShips,
    criticalAnomalies,
    habitablePlanets,
    unexploredPlanets,
    activeShips,

    // Actions
    loadPlanets,
    loadAnomalies,
    loadSolarSystems,
    loadShips,
    loadAllMapData,
    setZoom,
    setCenter,
    toggleLayer,
    selectObject,
    resetView,
    findObjectById,
    getObjectsInRange,
  }
})
