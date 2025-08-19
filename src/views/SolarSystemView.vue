<template>
  <div class="solar-system-view">
    <!-- Fullscreen Map Container -->
    <div class="map-container-wrapper" @contextmenu.prevent="handleRightClick">
      <!-- Remove the v-card wrapper to make map truly fullscreen -->
      <SolarSystemMap :height="mapHeight" :width="mapWidth" ref="mapComponent" @object-hover="handleObjectHover"
        @object-click="handleObjectClick" />

      <!-- Collapsible Dashboard Panel (Floating) -->
      <v-card v-show="panelsReady" class="dashboard-panel draggable-panel" :class="{
        'collapsed': isDashboardCollapsed,
        'dragging': isDragging && dragTarget === 'dashboard'
      }" elevation="8" :style="{
        left: dashboardPosition.x + 'px',
        top: dashboardPosition.y + 'px'
      }">
        <v-card-title class="d-flex justify-space-between align-center pa-2 drag-handle"
          @mousedown="startDrag($event, 'dashboard')" style="cursor: move;">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-space-station</v-icon>
            <span class="text-h6">{{ currentSystem?.name || 'Solar System' }}</span>
          </div>
          <v-btn icon size="small" @click="toggleDashboard" :color="isDashboardCollapsed ? 'primary' : 'default'">
            <v-icon>{{ isDashboardCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-expand-transition>
          <div v-show="!isDashboardCollapsed">
            <v-card-text class="pa-2">
              <div class="system-info-grid">
                <div class="info-card">
                  <div class="info-header">
                    <v-icon color="primary" size="small">mdi-earth</v-icon>
                    <span>Planets</span>
                  </div>
                  <div class="info-value text-primary">{{ getSystemStats.totalPlanets }}</div>
                  <div class="info-subtitle">{{ getSystemStats.habitablePlanets }} Habitable</div>
                </div>

                <div class="info-card">
                  <div class="info-header">
                    <v-icon color="error" size="small">mdi-alert-octagram</v-icon>
                    <span>Anomalies</span>
                  </div>
                  <div class="info-value text-error">{{ getSystemStats.activeAnomalies }}</div>
                  <div class="info-subtitle">{{ getSystemStats.criticalAnomalies }} Critical</div>
                </div>

                <div class="info-card">
                  <div class="info-header">
                    <v-icon color="success" size="small">mdi-rocket</v-icon>
                    <span>Ships</span>
                  </div>
                  <div class="info-value text-success">{{ visibleShips.length }}</div>
                  <div class="info-subtitle">{{ activeShips.length }} Active</div>
                </div>

                <div class="info-card">
                  <div class="info-header">
                    <v-icon color="warning" size="small">mdi-shield-alert</v-icon>
                    <span>Threat</span>
                  </div>
                  <div class="info-value" :class="getThreatLevelClass()">{{ getSystemStats.overallThreat }}/10</div>
                  <div class="info-subtitle">{{ getSystemStats.isSafe ? 'Safe' : 'Caution' }}</div>
                </div>
              </div>

              <v-btn color="primary" variant="outlined" size="small" prepend-icon="mdi-refresh" @click="refreshData"
                :loading="isLoading" class="mt-2" block>
                Refresh Data
              </v-btn>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- Entity List Panel (Left Side Below Dashboard) -->
      <v-card v-show="panelsReady" class="entity-list-panel draggable-panel" :class="{
        'collapsed': isEntityListCollapsed,
        'dragging': isDragging && dragTarget === 'entityList'
      }" elevation="8" :style="{
        left: entityListPosition.x + 'px',
        top: entityListPosition.y + 'px'
      }">
        <v-card-title class="d-flex justify-space-between align-center pa-2 drag-handle"
          @mousedown="startDrag($event, 'entityList')" style="cursor: move;">
          <div class="d-flex align-center">
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            <span class="text-subtitle-1">System Objects</span>
          </div>
          <v-btn icon size="small" @click="toggleEntityList" :color="isEntityListCollapsed ? 'primary' : 'default'">
            <v-icon>{{ isEntityListCollapsed ? 'mdi-chevron-down' : 'mdi-chevron-up' }}</v-icon>
          </v-btn>
        </v-card-title>

        <v-expand-transition>
          <div v-show="!isEntityListCollapsed">
            <v-card-text class="pa-0">
              <v-tabs v-model="activeTab" grow density="compact">
                <v-tab value="planets">
                  <v-icon size="small" class="mr-1">mdi-earth</v-icon>
                  Planets
                </v-tab>
                <v-tab value="anomalies">
                  <v-icon size="small" class="mr-1">mdi-alert-octagram</v-icon>
                  Anomalies
                </v-tab>
                <v-tab value="ships">
                  <v-icon size="small" class="mr-1">mdi-rocket</v-icon>
                  Ships
                </v-tab>
              </v-tabs>

              <v-window v-model="activeTab" class="entity-window">
                <!-- Planets Tab -->
                <v-window-item value="planets">
                  <v-list density="compact" class="entity-list">
                    <v-list-item v-for="planet in visiblePlanets" :key="planet.id" @click="selectAndCenter(planet.id)"
                      :class="{ 'selected-item': mapView.selectedObject === planet.id }" class="entity-list-item">
                      <template v-slot:prepend>
                        <v-avatar :color="getPlanetColor(planet)" size="x-small">
                          <v-icon size="x-small">mdi-earth</v-icon>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="text-body-2">{{ planet.name }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{ formatPlanetType((planet as any).type) }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="d-flex align-center">
                          <v-chip size="x-small" :color="getThreatColor((planet as any).threatLevel)" variant="flat"
                            class="mr-1">
                            {{ (planet as any).threatLevel }}
                          </v-chip>
                          <v-icon v-if="(planet as any).isHabitable" size="x-small" color="success">
                            mdi-check-circle
                          </v-icon>
                        </div>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-window-item>

                <!-- Anomalies Tab -->
                <v-window-item value="anomalies">
                  <v-list density="compact" class="entity-list">
                    <v-list-item v-for="anomaly in visibleAnomalies" :key="anomaly.id"
                      @click="selectAndCenter(anomaly.id)"
                      :class="{ 'selected-item': mapView.selectedObject === anomaly.id }" class="entity-list-item">
                      <template v-slot:prepend>
                        <v-avatar :color="getAnomalyColor(anomaly)" size="x-small">
                          <v-icon size="x-small">mdi-alert-octagram</v-icon>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="text-body-2">{{ anomaly.name }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{ formatAnomalyType((anomaly as any).anomalyType) }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <v-chip size="x-small" :color="getSeverityColor((anomaly as any).severity)" variant="flat">
                          {{ formatSeverity((anomaly as any).severity) }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-window-item>

                <!-- Ships Tab -->
                <v-window-item value="ships">
                  <v-list density="compact" class="entity-list">
                    <v-list-item v-for="ship in visibleShips" :key="ship.id" @click="selectAndCenter(ship.id)"
                      :class="{ 'selected-item': mapView.selectedObject === ship.id }" class="entity-list-item">
                      <template v-slot:prepend>
                        <v-avatar :color="getShipStatusColor(ship)" size="x-small">
                          <v-icon size="x-small">mdi-rocket</v-icon>
                        </v-avatar>
                      </template>

                      <v-list-item-title class="text-body-2">{{ ship.name }}</v-list-item-title>
                      <v-list-item-subtitle class="text-caption">
                        {{ (ship as any).registry }}
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <v-chip size="x-small" :color="getShipStatusColor(ship)" variant="flat">
                          {{ formatShipStatus((ship as any).status) }}
                        </v-chip>
                      </template>
                    </v-list-item>
                  </v-list>
                </v-window-item>
              </v-window>
            </v-card-text>
          </div>
        </v-expand-transition>
      </v-card>

      <!-- Context Menu -->
      <v-menu v-model="showContextMenu" :position-x="contextMenuPosition.x" :position-y="contextMenuPosition.y" absolute
        offset-y>
        <v-list density="compact">
          <v-list-item v-for="item in contextMenuItems" :key="item.action" @click="handleContextAction(item.action)">
            <template v-slot:prepend>
              <v-icon>{{ item.icon }}</v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>

      <!-- Map Controls (Bottom Right) -->
      <div class="map-controls-container">
        <v-btn-group elevation="2" divided>
          <v-btn icon="mdi-plus" size="small" @click="zoomIn" title="Zoom In" />
          <v-btn icon="mdi-minus" size="small" @click="zoomOut" title="Zoom Out" />
          <v-btn icon="mdi-fit-to-screen" size="small" @click="resetView" title="Reset View" />
        </v-btn-group>
      </div>

      <!-- Layer Toggle Controls (Bottom Left) -->
      <div class="layer-controls-container">
        <v-btn-group elevation="2" divided>
          <v-btn :color="mapView.showPlanets ? 'primary' : 'default'"
            :variant="mapView.showPlanets ? 'flat' : 'outlined'" size="small" @click="toggleLayer('planets')"
            title="Toggle Planets">
            <v-icon>mdi-earth</v-icon>
          </v-btn>
          <v-btn :color="mapView.showAnomalies ? 'error' : 'default'"
            :variant="mapView.showAnomalies ? 'flat' : 'outlined'" size="small" @click="toggleLayer('anomalies')"
            title="Toggle Anomalies">
            <v-icon>mdi-alert-octagram</v-icon>
          </v-btn>
          <v-btn :color="mapView.showShips ? 'success' : 'default'" :variant="mapView.showShips ? 'flat' : 'outlined'"
            size="small" @click="toggleLayer('ships')" title="Toggle Ships">
            <v-icon>mdi-rocket</v-icon>
          </v-btn>
          <v-btn :color="showOrbits ? 'warning' : 'default'" :variant="showOrbits ? 'flat' : 'outlined'" size="small"
            @click="toggleOrbits" title="Toggle Orbital Paths">
            <v-icon>mdi-orbit</v-icon>
          </v-btn>
        </v-btn-group>
      </div>
    </div>

    <!-- Removed duplicate tooltip - using only SVG tooltips from marker components -->
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useMapDataStore } from '@/stores/mapData'
import SolarSystemMap from '@/components/map/SolarSystemMap.vue'

// Store
const mapStore = useMapDataStore()
const {
  loadAllMapData,
  selectObject,
  setCenter,
  setZoom,
  toggleLayer,
  resetView: storeResetView
} = mapStore

// Local state
const isDashboardCollapsed = ref(false)
const isEntityListCollapsed = ref(false)
const activeTab = ref('planets')
const mapHeight = ref(600)
const mapWidth = ref(800)
const mapComponent = ref<any>(null)
const showOrbits = ref(true)

// Panel positioning state
const dashboardPosition = ref({ x: 16, y: 80 }) // Account for header height
const entityListPosition = ref({ x: 16, y: 250 }) // Stack below dashboard
const panelsReady = ref(false) // Controls panel visibility during loading

// Dragging state
const isDragging = ref(false)
const dragTarget = ref<string | null>(null)
const dragOffset = ref({ x: 0, y: 0 })

// Context menu state
const showContextMenu = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuTarget = ref<any>(null)

// Computed
const getSystemStats = computed(() => {
  return mapStore.currentSystem?.getSystemStats?.() || {
    totalPlanets: mapStore.visiblePlanets.length,
    habitablePlanets: mapStore.visiblePlanets.filter((p: any) => p.isHabitable).length,
    activeAnomalies: mapStore.visibleAnomalies.length,
    criticalAnomalies: mapStore.visibleAnomalies.filter((a: any) => a.severity === 'critical').length,
    overallThreat: Math.max(...[
      ...mapStore.visiblePlanets.map((p: any) => p.threatLevel || 0),
      ...mapStore.visibleAnomalies.map((a: any) => a.threatLevel || 0),
      0
    ]),
    isSafe: true
  }
})

const currentSystem = computed(() => mapStore.currentSystem)
const isLoading = computed(() => mapStore.isLoading)
const visiblePlanets = computed(() => mapStore.visiblePlanets)
const visibleAnomalies = computed(() => mapStore.visibleAnomalies)
const visibleShips = computed(() => mapStore.visibleShips)
const activeShips = computed(() => mapStore.activeShips)
const mapView = computed(() => mapStore.mapView)

const contextMenuItems = computed(() => {
  const items = [
    { action: 'center', title: 'Center View Here', icon: 'mdi-crosshairs-gps' },
    { action: 'reset', title: 'Reset View', icon: 'mdi-fit-to-screen' }
  ]

  if (contextMenuTarget.value) {
    const obj = contextMenuTarget.value
    items.unshift(
      { action: 'select', title: `Select ${obj.name}`, icon: 'mdi-cursor-default-click' },
      { action: 'details', title: 'Show Details', icon: 'mdi-information' }
    )

    if (obj.type === 'planet') {
      items.push({ action: 'explore', title: 'Send Exploration Mission', icon: 'mdi-rocket-launch' })
    } else if (obj.type === 'ship') {
      items.push({ action: 'orders', title: 'Issue Orders', icon: 'mdi-clipboard-text' })
    } else if (obj.type === 'anomaly') {
      items.push({ action: 'investigate', title: 'Investigate Anomaly', icon: 'mdi-magnify' })
    }
  }

  return items
})

// Methods
async function refreshData() {
  await loadAllMapData()
}

function toggleDashboard() {
  isDashboardCollapsed.value = !isDashboardCollapsed.value
}

function toggleEntityList() {
  isEntityListCollapsed.value = !isEntityListCollapsed.value
}

function toggleOrbits() {
  showOrbits.value = !showOrbits.value
  // Emit to the map component to show/hide orbits
  if (mapComponent.value) {
    mapComponent.value.setShowOrbits?.(showOrbits.value)
  }
}

function getThreatLevelClass(): string {
  const threat = getSystemStats.value.overallThreat
  if (threat >= 8) return 'text-error'
  if (threat >= 6) return 'text-warning'
  if (threat >= 3) return 'text-orange'
  return 'text-success'
}

function selectAndCenter(objectId: string) {
  selectObject(objectId)

  // Find the object and center the map on it
  const allObjects = [...visiblePlanets.value, ...visibleAnomalies.value, ...visibleShips.value]
  const targetObject = allObjects.find((obj: any) => obj.id === objectId) as any

  if (targetObject && targetObject.position) {
    setCenter(targetObject.position.x, targetObject.position.y)
  }
}

function zoomIn() {
  setZoom(mapView.value.zoom * 1.2)
}

function zoomOut() {
  setZoom(mapView.value.zoom / 1.2)
}

function resetView() {
  storeResetView()
}

function handleRightClick(event: MouseEvent) {
  event.preventDefault()

  contextMenuPosition.value = {
    x: event.clientX,
    y: event.clientY
  }

  // Determine what was clicked based on the event target
  const target = event.target as HTMLElement
  const svgElement = target.closest('[data-entity-id]')

  if (svgElement) {
    const entityId = svgElement.getAttribute('data-entity-id')
    const allObjects = [...visiblePlanets.value, ...visibleAnomalies.value, ...visibleShips.value]
    contextMenuTarget.value = allObjects.find((obj: any) => obj.id === entityId)
  } else {
    contextMenuTarget.value = null
  }

  showContextMenu.value = true
}

function handleContextAction(action: string) {
  showContextMenu.value = false

  switch (action) {
    case 'select':
      if (contextMenuTarget.value) {
        selectObject(contextMenuTarget.value.id)
      }
      break
    case 'center':
      if (contextMenuTarget.value && contextMenuTarget.value.position) {
        setCenter(contextMenuTarget.value.position.x, contextMenuTarget.value.position.y)
      } else {
        // Center on clicked position (approximate)
        setCenter(0, 0) // For now, center on system core
      }
      break
    case 'reset':
      resetView()
      break
    case 'details':
      // Open details dialog/panel
      if (contextMenuTarget.value) {
        selectObject(contextMenuTarget.value.id)
        // Could emit event to show detailed info panel
      }
      break
    case 'explore':
    case 'orders':
    case 'investigate':
      // These would trigger specific game actions
      console.log(`Action: ${action} on`, contextMenuTarget.value?.name)
      break
  }

  contextMenuTarget.value = null
}

function handleObjectHover(object: any) {
  // Object hover is now handled by SVG tooltips in marker components
  // This function kept for potential future use
}

function handleObjectClick(object: any) {
  if (object) {
    selectAndCenter(object.id)
  }
}

// Panel dragging functionality
function startDrag(event: MouseEvent, panelType: string) {
  if (event.button !== 0) return // Only left click

  isDragging.value = true
  dragTarget.value = panelType

  const currentPosition = panelType === 'dashboard' ? dashboardPosition.value : entityListPosition.value
  dragOffset.value = {
    x: event.clientX - currentPosition.x,
    y: event.clientY - currentPosition.y
  }

  document.addEventListener('mousemove', handleDrag)
  document.addEventListener('mouseup', stopDrag)
  event.preventDefault()
}

function handleDrag(event: MouseEvent) {
  if (!isDragging.value || !dragTarget.value) return

  // Account for header height (~64px) and safe margins
  const headerHeight = 64
  const safeMargin = 8
  const minPanelWidth = 280
  const minPanelHeight = 100

  const newX = Math.max(safeMargin, Math.min(window.innerWidth - minPanelWidth - safeMargin, event.clientX - dragOffset.value.x))
  const newY = Math.max(headerHeight + safeMargin, Math.min(window.innerHeight - minPanelHeight - safeMargin, event.clientY - dragOffset.value.y))

  if (dragTarget.value === 'dashboard') {
    dashboardPosition.value = { x: newX, y: newY }
  } else if (dragTarget.value === 'entityList') {
    entityListPosition.value = { x: newX, y: newY }
  }
}

function stopDrag() {
  if (isDragging.value && dragTarget.value) {
    // Save position to localStorage
    const positions = JSON.parse(localStorage.getItem('solar-system-panel-positions') || '{}')
    if (dragTarget.value === 'dashboard') {
      positions.dashboard = dashboardPosition.value
    } else if (dragTarget.value === 'entityList') {
      positions.entityList = entityListPosition.value
    }
    localStorage.setItem('solar-system-panel-positions', JSON.stringify(positions))
  }

  isDragging.value = false
  dragTarget.value = null
  document.removeEventListener('mousemove', handleDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// Load saved panel positions
function loadPanelPositions() {
  const saved = localStorage.getItem('solar-system-panel-positions')
  // Define constraints for panel positioning
  const headerHeight = 64
  const safeMargin = 8
  const minPanelWidth = 280
  const minPanelHeight = 100

  if (saved) {
    try {
      const positions = JSON.parse(saved)
      if (positions.dashboard) {
        // Validate and constrain saved positions
        dashboardPosition.value = {
          x: Math.max(safeMargin, Math.min(window.innerWidth - minPanelWidth - safeMargin, positions.dashboard.x)),
          y: Math.max(headerHeight + safeMargin, Math.min(window.innerHeight - minPanelHeight - safeMargin, positions.dashboard.y))
        }
      }
      if (positions.entityList) {
        entityListPosition.value = {
          x: Math.max(safeMargin, Math.min(window.innerWidth - minPanelWidth - safeMargin, positions.entityList.x)),
          y: Math.max(headerHeight + safeMargin, Math.min(window.innerHeight - minPanelHeight - safeMargin, positions.entityList.y))
        }
      }
    } catch (e) {
      console.warn('Failed to load panel positions:', e)
    }
  }

  // Show panels after positions are set
  nextTick(() => {
    panelsReady.value = true
  })
}

function getObjectType(obj: any): string {
  if (obj.type) return obj.type
  if (obj.anomalyType) return 'Anomaly'
  if (obj.registry) return 'Starship'
  if (obj.isHabitable !== undefined) return 'Planet'
  return 'Unknown'
}

function getPlanetColor(planet: any): string {
  return planet.getMapColor?.() || '#4CAF50'
}

function getAnomalyColor(anomaly: any): string {
  return anomaly.getMapColor?.() || '#F44336'
}

function getShipStatusColor(ship: any): string {
  switch (ship.status) {
    case 'active': return 'success'
    case 'docked': return 'info'
    case 'exploring': return 'primary'
    case 'maintenance': return 'warning'
    case 'emergency': return 'error'
    default: return 'default'
  }
}

function formatPlanetType(type: string): string {
  return type?.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Unknown'
}

function formatSize(size: string): string {
  return size?.charAt(0).toUpperCase() + size?.slice(1) || 'Unknown'
}

function formatAnomalyType(type: string): string {
  return type?.split('-').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') || 'Unknown'
}

function formatSeverity(severity: string): string {
  return severity?.charAt(0).toUpperCase() + severity?.slice(1) || 'Unknown'
}

function formatShipStatus(status: string): string {
  return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
}

function getThreatColor(level: number): string {
  if (level >= 8) return 'error'
  if (level >= 6) return 'warning'
  if (level >= 3) return 'orange'
  return 'success'
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'error'
    case 'major': return 'warning'
    case 'moderate': return 'orange'
    case 'minor': return 'info'
    default: return 'default'
  }
}

// Lifecycle
onMounted(async () => {
  await refreshData()

  // Load saved panel positions
  loadPanelPositions()

  // Set map dimensions based on viewport
  nextTick(() => {
    mapWidth.value = window.innerWidth
    mapHeight.value = window.innerHeight

    // Handle window resize
    const handleResize = () => {
      mapWidth.value = window.innerWidth
      mapHeight.value = window.innerHeight
    }

    window.addEventListener('resize', handleResize)

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize)
      // Cleanup drag listeners if they're still active
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', stopDrag)
    }
  })
})
</script>

<style scoped>
.solar-system-view {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

.map-container-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}

/* Dashboard Panel - Draggable */
.dashboard-panel {
  position: fixed;
  min-width: 300px;
  max-width: min(350px, calc(50vw - 32px));
  z-index: 1000;
  background: rgba(18, 18, 18, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.dashboard-panel.collapsed {
  min-width: auto;
  width: auto;
}

.dashboard-panel:hover {
  background: rgba(18, 18, 18, 0.98) !important;
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.system-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.info-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.info-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.8;
}

.info-value {
  font-size: 1.5rem;
  font-weight: bold;
  line-height: 1;
  margin-bottom: 2px;
}

.info-subtitle {
  font-size: 0.7rem;
  opacity: 0.6;
}

/* Entity List Panel - Draggable */
.entity-list-panel {
  position: fixed;
  width: min(350px, calc(50vw - 32px));
  max-height: calc(100vh - 220px);
  z-index: 1000;
  background: rgba(18, 18, 18, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.entity-list-panel.collapsed {
  width: auto;
  min-width: auto;
}

.entity-list-panel:hover {
  background: rgba(18, 18, 18, 0.98) !important;
  border-color: rgba(255, 255, 255, 0.2);
}

.entity-window {
  max-height: calc(100vh - 260px);
  /* Account for new top position */
  overflow: hidden;
}

.entity-list {
  max-height: calc(100vh - 300px);
  /* Account for new top position */
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.entity-list::-webkit-scrollbar {
  width: 4px;
}

.entity-list::-webkit-scrollbar-track {
  background: transparent;
}

.entity-list::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
}

.entity-list::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.entity-list-item {
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
  cursor: pointer;
}

.entity-list-item:hover {
  background: rgba(255, 255, 255, 0.05);
  transform: translateX(4px);
}

.selected-item {
  background: rgba(33, 150, 243, 0.15) !important;
  border-left: 3px solid #2196F3;
}

/* Draggable Panel Styles */
.draggable-panel {
  user-select: none;
}

.drag-handle {
  cursor: move !important;
}

.drag-handle:hover {
  background: rgba(255, 255, 255, 0.1) !important;
}

.draggable-panel.dragging {
  transition: none !important;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.5) !important;
  transform: scale(1.02);
}

/* Map Controls - Bottom Right */
.map-controls-container {
  position: absolute;
  bottom: 16px;
  right: 16px;
  z-index: 1000;
  max-width: calc(100vw - 32px);
}

/* Layer Controls - Bottom Left */
.layer-controls-container {
  position: absolute;
  bottom: 16px;
  left: 16px;
  z-index: 1000;
  max-width: calc(100vw - 32px);
}

/* Context Menu Styling */
:deep(.v-overlay__content) {
  background: rgba(18, 18, 18, 0.95) !important;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Tooltip Styling */
.object-tooltip {
  background: rgba(0, 0, 0, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  max-width: 200px;
}

/* Button Group Styling */
:deep(.v-btn-group) {
  background: rgba(18, 18, 18, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  overflow: hidden;
}

:deep(.v-btn-group .v-btn) {
  border: none !important;
  background: transparent;
  transition: all 0.2s ease;
}

:deep(.v-btn-group .v-btn:hover) {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

/* Card Animations */
.dashboard-panel,
.entity-list-panel {
  animation: slideInFromTop 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes slideInFromTop {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Game-like glow effects */
.info-value.text-primary,
.info-value.text-success,
.info-value.text-error,
.info-value.text-warning {
  text-shadow: 0 0 8px currentColor;
}

/* Scrollbar custom styling for Vuetify components */
:deep(.v-list) {
  background: transparent !important;
}

:deep(.v-list-item) {
  border-radius: 4px;
  margin-bottom: 2px;
}

:deep(.v-tabs) {
  background: rgba(255, 255, 255, 0.05);
}

:deep(.v-tab) {
  transition: all 0.2s ease;
}

:deep(.v-tab:hover) {
  background: rgba(255, 255, 255, 0.1);
}

:deep(.v-tab--selected) {
  background: rgba(33, 150, 243, 0.2);
  color: #2196F3 !important;
}

/* Chip styling */
:deep(.v-chip) {
  font-size: 0.7rem;
  font-weight: 500;
}

/* Expand transition styling */
:deep(.v-expand-transition-enter-active),
:deep(.v-expand-transition-leave-active) {
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* Orange color class */
.text-orange {
  color: #FF9800 !important;
}

.text-orange--text {
  color: #FF9800 !important;
}

/* Responsive design - simplified for draggable panels */
@media (max-width: 768px) {
  .system-info-grid {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .dashboard-panel,
  .entity-list-panel {
    max-width: calc(100vw - 32px);
    min-width: 250px;
  }
}
</style>
