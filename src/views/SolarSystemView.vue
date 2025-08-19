<template>
    <div class="solar-system-view">
        <!-- Header -->
        <v-container fluid>
            <v-row>
                <v-col cols="12">
                    <div class="d-flex justify-space-between align-center mb-4">
                        <div>
                            <h1 class="text-h4 font-weight-bold">
                                {{ currentSystem?.name || 'Solar System Map' }}
                            </h1>
                            <p class="text-subtitle-1 text-medium-emphasis" v-if="currentSystem">
                                {{ currentSystem.starType }} • {{ getSystemStats.totalPlanets }} Planets • {{
                                    getSystemStats.activeAnomalies }} Active Anomalies
                            </p>
                        </div>

                        <div class="d-flex align-center">
                            <v-btn color="primary" variant="outlined" prepend-icon="mdi-refresh" @click="refreshData"
                                :loading="isLoading">
                                Refresh Data
                            </v-btn>
                        </div>
                    </div>
                </v-col>
            </v-row>

            <!-- System Overview Cards -->
            <v-row class="mb-4">
                <v-col cols="12" md="3">
                    <v-card>
                        <v-card-title class="text-h6">
                            <v-icon color="primary" class="mr-2">mdi-earth</v-icon>
                            Planets
                        </v-card-title>
                        <v-card-text>
                            <div class="text-h4 font-weight-bold text-primary">
                                {{ getSystemStats.totalPlanets }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ getSystemStats.habitablePlanets }} Habitable
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="3">
                    <v-card>
                        <v-card-title class="text-h6">
                            <v-icon color="error" class="mr-2">mdi-alert-octagram</v-icon>
                            Anomalies
                        </v-card-title>
                        <v-card-text>
                            <div class="text-h4 font-weight-bold text-error">
                                {{ getSystemStats.activeAnomalies }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ getSystemStats.criticalAnomalies }} Critical
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="3">
                    <v-card>
                        <v-card-title class="text-h6">
                            <v-icon color="success" class="mr-2">mdi-rocket</v-icon>
                            Starships
                        </v-card-title>
                        <v-card-text>
                            <div class="text-h4 font-weight-bold text-success">
                                {{ visibleShips.length }}
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ activeShips.length }} Active
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>

                <v-col cols="12" md="3">
                    <v-card>
                        <v-card-title class="text-h6">
                            <v-icon color="warning" class="mr-2">mdi-shield-alert</v-icon>
                            Threat Level
                        </v-card-title>
                        <v-card-text>
                            <div class="text-h4 font-weight-bold" :class="getThreatLevelClass()">
                                {{ getSystemStats.overallThreat }}/10
                            </div>
                            <div class="text-caption text-medium-emphasis">
                                {{ getSystemStats.isSafe ? 'Safe' : 'Caution Required' }}
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Main Map -->
        <v-container fluid class="pa-0">
            <SolarSystemMap :height="mapHeight" :width="mapWidth" />
        </v-container>

        <!-- Side Panel with Object Lists -->
        <v-navigation-drawer v-model="showSidePanel" location="right" width="350" temporary class="side-panel">
            <v-card flat height="100%">
                <v-card-title class="d-flex justify-space-between align-center">
                    <span>System Objects</span>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="showSidePanel = false" />
                </v-card-title>

                <v-card-text class="pa-0">
                    <v-tabs v-model="activeTab" grow>
                        <v-tab value="planets">
                            <v-icon class="mr-2">mdi-earth</v-icon>
                            Planets
                        </v-tab>
                        <v-tab value="anomalies">
                            <v-icon class="mr-2">mdi-alert-octagram</v-icon>
                            Anomalies
                        </v-tab>
                        <v-tab value="ships">
                            <v-icon class="mr-2">mdi-rocket</v-icon>
                            Ships
                        </v-tab>
                    </v-tabs>

                    <v-window v-model="activeTab">
                        <!-- Planets Tab -->
                        <v-window-item value="planets">
                            <v-list>
                                <v-list-item v-for="planet in visiblePlanets" :key="planet.id"
                                    @click="selectAndCenter(planet.id)"
                                    :class="{ 'selected-item': mapView.selectedObject === planet.id }">
                                    <template v-slot:prepend>
                                        <v-avatar :color="getPlanetColor(planet)" size="small">
                                            <v-icon>mdi-earth</v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title>{{ planet.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ formatPlanetType((planet as any).type) }} • {{ formatSize((planet as
                                            any).size) }}
                                    </v-list-item-subtitle>

                                    <template v-slot:append>
                                        <div class="d-flex flex-column align-end">
                                            <v-chip size="x-small" :color="getThreatColor((planet as any).threatLevel)"
                                                variant="flat">
                                                {{ (planet as any).threatLevel }}
                                            </v-chip>
                                            <div class="d-flex mt-1">
                                                <v-icon v-if="(planet as any).isHabitable" size="x-small"
                                                    color="success" class="mr-1">
                                                    mdi-check-circle
                                                </v-icon>
                                                <v-icon v-if="(planet as any).hasStarbase" size="x-small"
                                                    color="primary">
                                                    mdi-space-station
                                                </v-icon>
                                            </div>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-window-item>

                        <!-- Anomalies Tab -->
                        <v-window-item value="anomalies">
                            <v-list>
                                <v-list-item v-for="anomaly in visibleAnomalies" :key="anomaly.id"
                                    @click="selectAndCenter(anomaly.id)"
                                    :class="{ 'selected-item': mapView.selectedObject === anomaly.id }">
                                    <template v-slot:prepend>
                                        <v-avatar :color="getAnomalyColor(anomaly)" size="small">
                                            <v-icon>mdi-alert-octagram</v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title>{{ anomaly.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ formatAnomalyType((anomaly as any).anomalyType) }}
                                    </v-list-item-subtitle>

                                    <template v-slot:append>
                                        <div class="d-flex flex-column align-end">
                                            <v-chip size="x-small" :color="getSeverityColor((anomaly as any).severity)"
                                                variant="flat">
                                                {{ formatSeverity((anomaly as any).severity) }}
                                            </v-chip>
                                            <v-chip size="x-small" :color="getThreatColor((anomaly as any).threatLevel)"
                                                variant="outlined" class="mt-1">
                                                {{ (anomaly as any).threatLevel }}
                                            </v-chip>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-window-item>

                        <!-- Ships Tab -->
                        <v-window-item value="ships">
                            <v-list>
                                <v-list-item v-for="ship in visibleShips" :key="ship.id"
                                    @click="selectAndCenter(ship.id)"
                                    :class="{ 'selected-item': mapView.selectedObject === ship.id }">
                                    <template v-slot:prepend>
                                        <v-avatar :color="getShipStatusColor(ship)" size="small">
                                            <v-icon>mdi-rocket</v-icon>
                                        </v-avatar>
                                    </template>

                                    <v-list-item-title>{{ ship.name }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ (ship as any).registry }} • {{ (ship as any).type }}
                                    </v-list-item-subtitle>

                                    <template v-slot:append>
                                        <div class="d-flex flex-column align-end">
                                            <v-chip size="x-small" :color="getShipStatusColor(ship)" variant="flat">
                                                {{ formatShipStatus((ship as any).status) }}
                                            </v-chip>
                                            <div class="text-caption text-medium-emphasis mt-1">
                                                {{ (ship as any).crew?.length || 0 }} crew
                                            </div>
                                        </div>
                                    </template>
                                </v-list-item>
                            </v-list>
                        </v-window-item>
                    </v-window>
                </v-card-text>
            </v-card>
        </v-navigation-drawer>

        <!-- Floating Action Button -->
        <v-btn icon="mdi-format-list-bulleted" color="primary" size="large" class="floating-btn"
            @click="showSidePanel = !showSidePanel">
            <v-tooltip activator="parent" location="left">
                Toggle Object List
            </v-tooltip>
        </v-btn>
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
    setCenter
} = mapStore

// Local state
const showSidePanel = ref(false)
const activeTab = ref('planets')
const mapHeight = ref(600)
const mapWidth = ref(800)

// Computed
const getSystemStats = computed(() => {
    return mapStore.currentSystem?.getSystemStats?.() || {
        totalPlanets: mapStore.visiblePlanets.length,
        habitablePlanets: mapStore.visiblePlanets.filter((p: any) => p.isHabitable).length,
        activeAnomalies: mapStore.visibleAnomalies.length,
        criticalAnomalies: mapStore.visibleAnomalies.filter((a: any) => a.severity === 'critical').length,
        overallThreat: Math.max(...[
            ...mapStore.visiblePlanets.map((p: any) => p.threatLevel),
            ...mapStore.visibleAnomalies.map((a: any) => a.threatLevel),
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

// Methods
// Methods
async function refreshData() {
    await loadAllMapData()
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

    // Set map dimensions based on viewport
    nextTick(() => {
        const container = document.querySelector('.solar-system-view')
        if (container) {
            mapWidth.value = container.clientWidth
            mapHeight.value = Math.max(600, window.innerHeight - 300)
        }
    })
})
</script>

<style scoped>
.solar-system-view {
    min-height: 100vh;
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%);
}

.floating-btn {
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 1000;
}

.selected-item {
    background-color: rgba(33, 150, 243, 0.1);
    border-left: 4px solid #2196F3;
}

.side-panel {
    z-index: 1001;
}

.text-orange {
    color: #FF9800 !important;
}

.text-orange--text {
    color: #FF9800 !important;
}

:deep(.v-navigation-drawer__content) {
    display: flex;
    flex-direction: column;
}

:deep(.v-card) {
    display: flex;
    flex-direction: column;
    height: 100%;
}

:deep(.v-window) {
    flex-grow: 1;
    overflow-y: auto;
}
</style>
