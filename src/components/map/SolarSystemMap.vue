<template>
  <v-card class="solar-system-map" :height="mapHeight">
    <v-card-title class="d-flex justify-space-between align-center">
      <span>{{ currentSystem?.name || 'Solar System Map' }}</span>
      <div class="d-flex align-center">
        <MapControls :zoom="mapView.zoom" :show-planets="mapView.showPlanets" :show-anomalies="mapView.showAnomalies"
          :show-ships="mapView.showShips" @zoom-in="zoomIn" @zoom-out="zoomOut" @reset-view="resetView"
          @toggle-layer="toggleLayer" />
      </div>
    </v-card-title>

    <v-card-text class="pa-0 position-relative">
      <!-- Loading State -->
      <div v-if="isLoading" class="d-flex justify-center align-center" :style="{ height: mapHeight + 'px' }">
        <v-progress-circular indeterminate size="64" color="primary" />
        <span class="ml-4">Loading solar system data...</span>
      </div>

      <!-- Main Map SVG -->
      <div v-else ref="mapContainer" class="map-container" :style="{ height: mapHeight + 'px' }" @mousedown="startPan"
        @mousemove="onPan" @mouseup="endPan" @mouseleave="endPan" @wheel.prevent="onWheel">
        <svg :width="mapWidth" :height="mapHeight" :viewBox="viewBox" class="map-svg">
          <!-- Grid Background -->
          <defs>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#424242" stroke-width="1" opacity="0.3" />
            </pattern>
          </defs>
          <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid)" />

          <!-- Coordinate System Center (Sun) -->
          <g class="star-system">
            <!-- Sun Glow Effect -->
            <defs>
              <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" style="stop-color:#FFD700;stop-opacity:1" />
                <stop offset="70%" style="stop-color:#FFA500;stop-opacity:0.8" />
                <stop offset="100%" style="stop-color:#FF8C00;stop-opacity:0" />
              </radialGradient>
            </defs>

            <!-- Sun Outer Glow -->
            <circle :cx="0 * SCALE_FACTOR" :cy="0 * SCALE_FACTOR" r="20" fill="url(#sunGlow)" opacity="0.6" />

            <!-- Sun Core -->
            <circle :cx="0 * SCALE_FACTOR" :cy="0 * SCALE_FACTOR" r="8" fill="#FFD700" stroke="#FF8F00"
              stroke-width="2" />

            <!-- Sun Label -->
            <text :x="0 * SCALE_FACTOR + 12" :y="0 * SCALE_FACTOR - 12" fill="#FFD700" font-size="14" font-weight="bold"
              class="star-label">
              {{ currentSystem?.name || 'System Star' }}
            </text>
          </g>

          <!-- Orbital Paths -->
          <g v-if="showOrbits && visiblePlanets.length > 0" class="orbital-paths">
            <circle v-for="planet in visiblePlanets" :key="`orbit-${planet.id}`" :cx="0 * SCALE_FACTOR"
              :cy="0 * SCALE_FACTOR" :r="getOrbitalRadius(planet) * SCALE_FACTOR" fill="none"
              stroke="rgba(255, 255, 255, 0.2)" stroke-width="1" stroke-dasharray="5,5" class="orbital-path" />
          </g>

          <!-- Planets -->
          <g v-if="mapView.showPlanets">
            <PlanetMarker v-for="planet in visiblePlanets" :key="planet.id" :planet="planet as any"
              :scale="SCALE_FACTOR" :is-selected="mapView.selectedObject === planet.id" :viewport-width="mapWidth"
              :viewport-height="mapHeight" :data-entity-id="planet.id" @click="selectObject(planet.id)"
              @mouseenter="handleMarkerHover(planet)" @mouseleave="handleMarkerLeave"
              @show-details="showPlanetDetails" />
          </g>

          <!-- Anomalies -->
          <g v-if="mapView.showAnomalies">
            <AnomalyMarker v-for="anomaly in visibleAnomalies" :key="anomaly.id" :anomaly="anomaly as any"
              :scale="SCALE_FACTOR" :is-selected="mapView.selectedObject === anomaly.id" :viewport-width="mapWidth"
              :viewport-height="mapHeight" :data-entity-id="anomaly.id" @click="selectObject(anomaly.id)"
              @mouseenter="handleMarkerHover(anomaly)" @mouseleave="handleMarkerLeave"
              @show-details="showAnomalyDetails" />
          </g>

          <!-- Ships -->
          <g v-if="mapView.showShips">
            <ShipMarker v-for="ship in visibleShips" :key="ship.id" :ship="ship as any" :scale="SCALE_FACTOR"
              :is-selected="mapView.selectedObject === ship.id" :viewport-width="mapWidth" :viewport-height="mapHeight"
              :data-entity-id="ship.id" @click="selectObject(ship.id)" @mouseenter="handleMarkerHover(ship)"
              @mouseleave="handleMarkerLeave" @show-details="showShipDetails" />
          </g>
        </svg>

        <!-- Info Panel -->
        <SystemInfoPanel v-if="selectedObjectData" :object-data="selectedObjectData" :position="infoPanelPosition"
          @close="selectObject(null)" />
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import { useMapDataStore } from '@/stores/mapData'
import { CoordinateUtils } from '@/game/coordinates'
import MapControls from './MapControls.vue'
import PlanetMarker from './PlanetMarker.vue'
import AnomalyMarker from './AnomalyMarker.vue'
import ShipMarker from './ShipMarker.vue'
import SystemInfoPanel from './SystemInfoPanel.vue'

interface Props {
  height?: number
  width?: number
  showOrbits?: boolean
}

interface Emits {
  (e: 'object-hover', object: any): void
  (e: 'object-click', object: any): void
}

const props = withDefaults(defineProps<Props>(), {
  height: 600,
  width: 800,
  showOrbits: true
})

const emit = defineEmits<Emits>()

// Store
const mapStore = useMapDataStore()
const {
  loadAllMapData,
  setZoom,
  setCenter,
  toggleLayer,
  selectObject,
  resetView: storeResetView,
  findObjectById
} = mapStore

// Local reactive data
const showOrbits = ref(props.showOrbits)

// Reactive store data - access through store to maintain reactivity
const isLoading = computed(() => mapStore.isLoading)
const mapView = computed(() => mapStore.mapView)
const currentSystem = computed(() => mapStore.currentSystem)
const visiblePlanets = computed(() => mapStore.visiblePlanets)
const visibleAnomalies = computed(() => mapStore.visibleAnomalies)
const visibleShips = computed(() => mapStore.visibleShips)

// Map dimensions
const mapHeight = ref(props.height)
const mapWidth = ref(props.width)
const mapContainer = ref<HTMLElement | null>(null)

// Pan and zoom state
const isPanning = ref(false)
const lastPanPosition = ref({ x: 0, y: 0 })

// Scale factor for coordinate conversion (AU to pixels)
const SCALE_FACTOR = 50

// Computed
const viewBox = computed(() => {
  const zoom = mapView.value.zoom
  const centerX = mapView.value.centerX * SCALE_FACTOR
  const centerY = mapView.value.centerY * SCALE_FACTOR
  const width = mapWidth.value / zoom
  const height = mapHeight.value / zoom

  return `${centerX - width / 2} ${centerY - height / 2} ${width} ${height}`
})

const selectedObjectData = computed(() => {
  if (!mapView.value.selectedObject) return null
  return findObjectById(mapView.value.selectedObject)
})

const infoPanelPosition = computed(() => {
  if (!selectedObjectData.value) return { x: 0, y: 0 }

  // Position info panel near selected object but ensure it stays within bounds
  const obj = selectedObjectData.value as any
  if (obj.position) {
    // Calculate SVG coordinates to screen coordinates
    const svgX = obj.position.x * SCALE_FACTOR
    const svgY = obj.position.y * SCALE_FACTOR

    // Convert SVG coordinates to screen coordinates
    const zoom = mapView.value.zoom
    const centerX = mapView.value.centerX * SCALE_FACTOR
    const centerY = mapView.value.centerY * SCALE_FACTOR
    const viewBoxWidth = mapWidth.value / zoom
    const viewBoxHeight = mapHeight.value / zoom

    // Calculate the screen position relative to the SVG viewport
    const screenX = ((svgX - centerX + viewBoxWidth / 2) / viewBoxWidth) * mapWidth.value
    const screenY = ((svgY - centerY + viewBoxHeight / 2) / viewBoxHeight) * mapHeight.value

    // Panel dimensions (approximate)
    const panelWidth = 320
    const panelHeight = 300
    const offset = 20

    // Calculate optimal position to keep panel within bounds
    let finalX = screenX + offset
    let finalY = screenY + offset

    // Adjust X position if panel would go off right edge
    if (finalX + panelWidth > mapWidth.value) {
      finalX = screenX - panelWidth - offset
    }

    // Adjust X position if panel would go off left edge
    if (finalX < 0) {
      finalX = offset
    }

    // Adjust Y position if panel would go off bottom edge
    if (finalY + panelHeight > mapHeight.value) {
      finalY = screenY - panelHeight - offset
    }

    // Adjust Y position if panel would go off top edge
    if (finalY < 0) {
      finalY = offset
    }

    return {
      x: Math.max(0, Math.min(finalX, mapWidth.value - panelWidth)),
      y: Math.max(0, Math.min(finalY, mapHeight.value - panelHeight))
    }
  }
  return { x: 100, y: 100 }
})

// Methods
function zoomIn() {
  setZoom(mapView.value.zoom * 1.2)
}

function zoomOut() {
  setZoom(mapView.value.zoom / 1.2)
}

function resetView() {
  storeResetView()
}

function startPan(event: MouseEvent) {
  isPanning.value = true
  lastPanPosition.value = { x: event.clientX, y: event.clientY }
}

function onPan(event: MouseEvent) {
  if (!isPanning.value) return

  const deltaX = (event.clientX - lastPanPosition.value.x) / SCALE_FACTOR / mapView.value.zoom
  const deltaY = (event.clientY - lastPanPosition.value.y) / SCALE_FACTOR / mapView.value.zoom

  setCenter(
    mapView.value.centerX - deltaX,
    mapView.value.centerY - deltaY
  )

  lastPanPosition.value = { x: event.clientX, y: event.clientY }
}

function endPan() {
  isPanning.value = false
}

function onWheel(event: WheelEvent) {
  const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1
  setZoom(mapView.value.zoom * zoomFactor)
}

function showPlanetDetails(planet: any) {
  selectObject(planet.id)
  emit('object-click', planet)
}

function showAnomalyDetails(anomaly: any) {
  selectObject(anomaly.id)
  emit('object-click', anomaly)
}

function showShipDetails(ship: any) {
  selectObject(ship.id)
  emit('object-click', ship)
}

function handleMarkerHover(object: any) {
  emit('object-hover', object)
}

function handleMarkerLeave() {
  emit('object-hover', null)
}

function getOrbitalRadius(planet: any): number {
  // Calculate orbital radius based on planet position
  // This is the distance from the center (0,0) to the planet
  if (planet.position) {
    return Math.sqrt(planet.position.x ** 2 + planet.position.y ** 2)
  }
  return 1 // Default radius
}

function setShowOrbits(value: boolean) {
  showOrbits.value = value
}

// Expose method to parent component
defineExpose({
  setShowOrbits
})

// Lifecycle
onMounted(async () => {
  await loadAllMapData()

  // Debug: Check if data was loaded
  console.log('Loaded planets:', visiblePlanets.value.length)
  console.log('Loaded anomalies:', visibleAnomalies.value.length)
  console.log('Loaded ships:', visibleShips.value.length)

  if (visiblePlanets.value.length > 0) {
    console.log('First planet:', visiblePlanets.value[0])
    console.log('First planet position:', (visiblePlanets.value[0] as any).position)
  }

  // Auto-fit view to show all objects
  nextTick(() => {
    if (visiblePlanets.value.length > 0 || visibleShips.value.length > 0) {
      const allObjects = [...visiblePlanets.value, ...visibleShips.value, ...visibleAnomalies.value]
      const positions = allObjects.map((obj: any) => obj.position).filter(Boolean)

      // Always include the system core (0,0) in the bounds
      positions.push({ x: 0, y: 0, z: 0 })

      if (positions.length > 0) {
        // Calculate bounds
        const minX = Math.min(...positions.map(p => p.x))
        const maxX = Math.max(...positions.map(p => p.x))
        const minY = Math.min(...positions.map(p => p.y))
        const maxY = Math.max(...positions.map(p => p.y))

        // Center on the middle of all objects (including system core)
        const centerX = (minX + maxX) / 2
        const centerY = (minY + maxY) / 2

        console.log('Auto-centering on:', centerX, centerY)
        console.log('Object bounds:', { minX, maxX, minY, maxY })
        setCenter(centerX, centerY)

        // Set zoom to show all objects with some padding
        const rangeX = maxX - minX
        const rangeY = maxY - minY
        const range = Math.max(rangeX, rangeY, 4) // Minimum range of 4 AU

        const targetZoom = Math.min(1.0, 12 / range) // Show more space around objects
        setZoom(targetZoom)
        console.log('Auto-zoom set to:', targetZoom, 'for range:', range)
      }
    } else {
      // No objects loaded, just reset to default view
      console.log('No objects found, using default view')
      resetView()
    }
  })
})

// Watch for container resize
watch([() => props.width, () => props.height], ([newWidth, newHeight]) => {
  mapWidth.value = newWidth
  mapHeight.value = newHeight
}, { immediate: true })
</script>

<style scoped>
.solar-system-map {
  user-select: none;
  overflow: hidden;
}

.map-container {
  cursor: grab;
  position: relative;
  overflow: hidden;
  background: #0a0a0a;
  background-image:
    radial-gradient(circle at 25% 25%, #1a1a2e 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, #16213e 0%, transparent 50%);
}

.map-container:active {
  cursor: grabbing;
}

.map-svg {
  display: block;
  background: transparent;
}

.position-relative {
  position: relative;
}

/* Orbital path styling */
.orbital-path {
  animation: orbit-rotate 20s linear infinite;
  transform-origin: center;
}

.orbital-paths circle:nth-child(2n) {
  animation-direction: reverse;
  animation-duration: 30s;
}

.orbital-paths circle:nth-child(3n) {
  animation-duration: 40s;
}

@keyframes orbit-rotate {
  from {
    stroke-dashoffset: 0;
  }

  to {
    stroke-dashoffset: 20;
  }
}

/* Star system styling */
.star-system {
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.star-label {
  filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.8));
}

/* Space-themed styling */
.map-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(1px 1px at 25px 5px, #fff, transparent),
    radial-gradient(1px 1px at 50px 25px, #fff, transparent),
    radial-gradient(2px 2px at 90px 10px, #fff, transparent),
    radial-gradient(1px 1px at 130px 50px, #fff, transparent);
  background-size: 150px 60px;
  animation: twinkle 4s infinite;
  opacity: 0.3;
  pointer-events: none;
}

@keyframes twinkle {

  0%,
  100% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.6;
  }
}
</style>
