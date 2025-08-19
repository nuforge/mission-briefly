<template>
    <v-card class="solar-system-map" :height="mapHeight">
        <v-card-title class="d-flex justify-space-between align-center">
            <span>{{ currentSystem?.name || 'Solar System Map' }}</span>
            <div class="d-flex align-center">
                <MapControls :zoom="mapView.zoom" :show-planets="mapView.showPlanets"
                    :show-anomalies="mapView.showAnomalies" :show-ships="mapView.showShips" @zoom-in="zoomIn"
                    @zoom-out="zoomOut" @reset-view="resetView" @toggle-layer="toggleLayer" />
            </div>
        </v-card-title>

        <v-card-text class="pa-0 position-relative">
            <!-- Loading State -->
            <div v-if="isLoading" class="d-flex justify-center align-center" :style="{ height: mapHeight + 'px' }">
                <v-progress-circular indeterminate size="64" color="primary" />
                <span class="ml-4">Loading solar system data...</span>
            </div>

            <!-- Main Map SVG -->
            <div v-else ref="mapContainer" class="map-container" :style="{ height: mapHeight + 'px' }"
                @mousedown="startPan" @mousemove="onPan" @mouseup="endPan" @mouseleave="endPan"
                @wheel.prevent="onWheel">
                <svg :width="mapWidth" :height="mapHeight" :viewBox="viewBox" class="map-svg">
                    <!-- Grid Background -->
                    <defs>
                        <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                            <path d="M 100 0 L 0 0 0 100" fill="none" stroke="#424242" stroke-width="1" opacity="0.3" />
                        </pattern>
                    </defs>
                    <rect x="-10000" y="-10000" width="20000" height="20000" fill="url(#grid)" />

                    <!-- Coordinate System Center (0,0 in space coordinates) -->
                    <circle :cx="0 * SCALE_FACTOR" :cy="0 * SCALE_FACTOR" r="5" fill="#FFC107" stroke="#FF8F00"
                        stroke-width="2" />
                    <text :x="0 * SCALE_FACTOR + 10" :y="0 * SCALE_FACTOR - 10" fill="#FFC107" font-size="12"
                        font-weight="bold">System Core</text>

                    <!-- Debug: Show calculated bounds -->
                    <g v-if="visiblePlanets.length > 0" class="debug-bounds" opacity="0.3">
                        <!-- Debug markers at extreme positions from console output -->
                        <circle :cx="-6.2 * SCALE_FACTOR" :cy="4.2 * SCALE_FACTOR" r="8" fill="red" />
                        <text :x="-6.2 * SCALE_FACTOR + 12" :y="4.2 * SCALE_FACTOR + 4" fill="red" font-size="10">Min X,
                            Max Y</text>

                        <circle :cx="8.5 * SCALE_FACTOR" :cy="-3.1 * SCALE_FACTOR" r="8" fill="red" />
                        <text :x="8.5 * SCALE_FACTOR + 12" :y="-3.1 * SCALE_FACTOR + 4" fill="red" font-size="10">Max X,
                            Min Y</text>

                        <circle :cx="1.15 * SCALE_FACTOR" :cy="0.55 * SCALE_FACTOR" r="10" fill="orange" stroke="white"
                            stroke-width="2" />
                        <text :x="1.15 * SCALE_FACTOR + 15" :y="0.55 * SCALE_FACTOR + 4" fill="orange" font-size="12"
                            font-weight="bold">Auto-Center</text>
                    </g>

                    <!-- Planets -->
                    <g v-if="mapView.showPlanets">
                        <PlanetMarker v-for="planet in visiblePlanets" :key="planet.id" :planet="planet"
                            :scale="SCALE_FACTOR" :is-selected="mapView.selectedObject === planet.id"
                            @click="selectObject(planet.id)" @show-details="showPlanetDetails" />
                    </g>

                    <!-- Anomalies -->
                    <g v-if="mapView.showAnomalies">
                        <AnomalyMarker v-for="anomaly in visibleAnomalies" :key="anomaly.id" :anomaly="anomaly"
                            :scale="SCALE_FACTOR" :is-selected="mapView.selectedObject === anomaly.id"
                            @click="selectObject(anomaly.id)" @show-details="showAnomalyDetails" />
                    </g>

                    <!-- Ships -->
                    <g v-if="mapView.showShips">
                        <ShipMarker v-for="ship in visibleShips" :key="ship.id" :ship="ship" :scale="SCALE_FACTOR"
                            :is-selected="mapView.selectedObject === ship.id" @click="selectObject(ship.id)"
                            @show-details="showShipDetails" />
                    </g>
                </svg>

                <!-- Info Panel -->
                <SystemInfoPanel v-if="selectedObjectData" :object-data="selectedObjectData"
                    :position="infoPanelPosition" @close="selectObject(null)" />
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
}

const props = withDefaults(defineProps<Props>(), {
    height: 600,
    width: 800
})

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

    // Position info panel near selected object
    const obj = selectedObjectData.value as any
    if (obj.position) {
        return {
            x: obj.position.x * SCALE_FACTOR + 50,
            y: obj.position.y * SCALE_FACTOR + 50
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
    // Could emit event or open dialog here
}

function showAnomalyDetails(anomaly: any) {
    selectObject(anomaly.id)
    // Could emit event or open dialog here
}

function showShipDetails(ship: any) {
    selectObject(ship.id)
    // Could emit event or open dialog here
}

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
