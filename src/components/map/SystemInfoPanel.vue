<template>
    <div v-if="objectData" class="system-info-panel" :style="panelStyle">
        <v-card class="info-card" max-width="320" elevation="8">
            <v-card-title class="d-flex justify-space-between align-center">
                <span>{{ objectTitle }}</span>
                <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')" />
            </v-card-title>

            <v-card-text>
                <!-- Planet Info -->
                <div v-if="objectType === 'planet'" class="planet-info">
                    <v-row dense>
                        <v-col cols="6">
                            <div class="info-label">Type</div>
                            <div class="info-value">{{ formatPlanetType(objectData.type) }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">Size</div>
                            <div class="info-value">{{ formatSize(objectData.size) }}</div>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="6">
                            <div class="info-label">Population</div>
                            <div class="info-value">{{ formatPopulation(objectData.population) }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">Threat Level</div>
                            <v-chip :color="getThreatColor(objectData.threatLevel)" size="small" variant="flat">
                                {{ objectData.threatLevel }}/10
                            </v-chip>
                        </v-col>
                    </v-row>

                    <div class="mt-2">
                        <div class="info-label">Atmosphere</div>
                        <div class="info-value">{{ objectData.atmosphere }}</div>
                    </div>

                    <div class="mt-2" v-if="objectData.resources && objectData.resources.length > 0">
                        <div class="info-label">Resources</div>
                        <div class="d-flex flex-wrap gap-1">
                            <v-chip v-for="resource in objectData.resources" :key="resource" size="x-small"
                                variant="outlined">
                                {{ resource }}
                            </v-chip>
                        </div>
                    </div>

                    <div class="mt-3">
                        <v-row dense>
                            <v-col cols="4">
                                <v-chip :color="objectData.isHabitable ? 'success' : 'default'" size="small"
                                    variant="outlined">
                                    {{ objectData.isHabitable ? 'Habitable' : 'Uninhabitable' }}
                                </v-chip>
                            </v-col>
                            <v-col cols="4">
                                <v-chip :color="objectData.isExplored ? 'info' : 'warning'" size="small"
                                    variant="outlined">
                                    {{ objectData.isExplored ? 'Explored' : 'Unexplored' }}
                                </v-chip>
                            </v-col>
                            <v-col cols="4" v-if="objectData.hasStarbase">
                                <v-chip color="primary" size="small" variant="outlined">
                                    Starbase
                                </v-chip>
                            </v-col>
                        </v-row>
                    </div>
                </div>

                <!-- Anomaly Info -->
                <div v-else-if="objectType === 'anomaly'" class="anomaly-info">
                    <v-row dense>
                        <v-col cols="6">
                            <div class="info-label">Type</div>
                            <div class="info-value">{{ formatAnomalyType(objectData.anomalyType) }}</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">Severity</div>
                            <v-chip :color="getSeverityColor(objectData.severity)" size="small" variant="flat">
                                {{ formatSeverity(objectData.severity) }}
                            </v-chip>
                        </v-col>
                    </v-row>

                    <v-row dense>
                        <v-col cols="6">
                            <div class="info-label">Radius</div>
                            <div class="info-value">{{ objectData.radius.toFixed(1) }} AU</div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-label">Threat Level</div>
                            <v-chip :color="getThreatColor(objectData.threatLevel)" size="small" variant="flat">
                                {{ objectData.threatLevel }}/10
                            </v-chip>
                        </v-col>
                    </v-row>

                    <div class="mt-2">
                        <div class="info-label">Status</div>
                        <v-chip :color="objectData.isActive ? 'error' : 'success'" size="small" variant="outlined">
                            {{ objectData.isActive ? 'Active' : 'Inactive' }}
                        </v-chip>
                        <v-chip v-if="objectData.requiresSpecialEquipment" color="purple" size="small"
                            variant="outlined" class="ml-1">
                            Special Equipment Required
                        </v-chip>
                    </div>

                    <div class="mt-2" v-if="objectData.effects && objectData.effects.length > 0">
                        <div class="info-label">Effects</div>
                        <div class="d-flex flex-wrap gap-1">
                            <v-chip v-for="effect in objectData.effects" :key="effect" size="x-small" variant="outlined"
                                color="warning">
                                {{ effect }}
                            </v-chip>
                        </div>
                    </div>

                    <div class="mt-2" v-if="objectData.discoveredBy">
                        <div class="info-label">Discovered By</div>
                        <div class="info-value">{{ formatDiscoverer(objectData.discoveredBy) }}</div>
                        <div class="info-subtitle" v-if="objectData.discoveryDate">
                            {{ formatDate(objectData.discoveryDate) }}
                        </div>
                    </div>
                </div>

                <!-- Ship Info -->
                <div v-else-if="objectType === 'ship'" class="ship-info">
                    <v-row dense>
                        <v-col cols="8">
                            <div class="info-label">Registry</div>
                            <div class="info-value">{{ objectData.registry }}</div>
                        </v-col>
                        <v-col cols="4">
                            <div class="info-label">Class</div>
                            <div class="info-value">{{ objectData.type }}</div>
                        </v-col>
                    </v-row>

                    <div class="mt-2">
                        <div class="info-label">Status</div>
                        <v-chip :color="getShipStatusColor(objectData.status)" size="small" variant="flat">
                            {{ formatShipStatus(objectData.status) }}
                        </v-chip>
                    </div>

                    <div class="mt-2">
                        <div class="info-label">Crew</div>
                        <div class="info-value">{{ objectData.crew?.length || 0 }} personnel</div>
                    </div>

                    <div class="mt-2" v-if="objectData.mission">
                        <div class="info-label">Current Mission</div>
                        <div class="info-value">{{ formatMissionName(objectData.mission) }}</div>
                    </div>

                    <div class="mt-2">
                        <div class="info-label">Position</div>
                        <div class="info-value">
                            {{ objectData.position?.x.toFixed(1) }},
                            {{ objectData.position?.y.toFixed(1) }},
                            {{ objectData.position?.z.toFixed(1) }} AU
                        </div>
                    </div>
                </div>

                <!-- Description -->
                <div v-if="objectData.description" class="mt-3">
                    <div class="info-label">Description</div>
                    <div class="info-description">{{ objectData.description }}</div>
                </div>

                <!-- Quick Actions -->
                <div class="mt-3">
                    <v-btn v-if="objectType === 'planet' && !objectData.isExplored" color="primary" size="small"
                        variant="outlined" @click="exploreObject">
                        <v-icon left>mdi-telescope</v-icon>
                        Explore
                    </v-btn>

                    <v-btn v-if="objectType === 'ship'" color="success" size="small" variant="outlined"
                        @click="viewShipDetails">
                        <v-icon left>mdi-rocket</v-icon>
                        View Details
                    </v-btn>

                    <v-btn color="info" size="small" variant="text" @click="centerOnObject">
                        <v-icon left>mdi-crosshairs-gps</v-icon>
                        Center Map
                    </v-btn>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    objectData: any
    position: { x: number; y: number }
}

const props = defineProps<Props>()

// Computed
const objectType = computed(() => {
    if (props.objectData.type && typeof props.objectData.type === 'string') return 'planet'
    if (props.objectData.anomalyType) return 'anomaly'
    if (props.objectData.registry) return 'ship'
    return 'unknown'
})

const objectTitle = computed(() => {
    return props.objectData.name || 'Unknown Object'
})

const panelStyle = computed(() => ({
    position: 'absolute' as const,
    left: `${props.position.x}px`,
    top: `${props.position.y}px`,
    zIndex: 1000,
    pointerEvents: 'auto' as const
}))

// Methods
function formatPlanetType(type: string): string {
    return type.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}

function formatSize(size: string): string {
    return size.charAt(0).toUpperCase() + size.slice(1)
}

function formatPopulation(population: number): string {
    if (population === 0) return 'Uninhabited'
    if (population < 1000) return population.toString()
    if (population < 1000000) return `${(population / 1000).toFixed(0)}K`
    return `${(population / 1000000).toFixed(1)}M`
}

function formatAnomalyType(type: string): string {
    return type.split('-').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
}

function formatSeverity(severity: string): string {
    return severity.charAt(0).toUpperCase() + severity.slice(1)
}

function formatShipStatus(status: string): string {
    return status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'
}

function formatMissionName(missionId: string): string {
    // This would ideally look up the mission name from a store
    const missionNames: Record<string, string> = {
        'encounter-at-farpoint': 'Encounter at Farpoint',
        'repair-communications-array': 'Repair Communications Array'
    }
    return missionNames[missionId] || missionId
}

function formatDiscoverer(discovererId: string): string {
    // This would ideally look up the character name from a store
    const names: Record<string, string> = {
        'data': 'Lt. Commander Data',
        'geordi-la-forge': 'Lt. Commander La Forge'
    }
    return names[discovererId] || discovererId
}

function formatDate(date: string | Date): string {
    return new Date(date).toLocaleDateString()
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

function getShipStatusColor(status: string): string {
    switch (status) {
        case 'active': return 'success'
        case 'docked': return 'info'
        case 'exploring': return 'primary'
        case 'maintenance': return 'warning'
        case 'emergency': return 'error'
        default: return 'default'
    }
}

// Actions
function exploreObject() {
    // Emit event to parent to handle exploration
    console.log('Exploring object:', props.objectData.name)
}

function viewShipDetails() {
    // Navigate to ship details page
    console.log('Viewing ship details:', props.objectData.name)
}

function centerOnObject() {
    // Emit event to center map on this object
    console.log('Centering on object:', props.objectData.name)
}

// Emits
defineEmits<{
    close: []
}>()
</script>

<style scoped>
.system-info-panel {
    pointer-events: none;
}

.info-card {
    pointer-events: auto;
    backdrop-filter: blur(4px);
    background: rgba(30, 30, 30, 0.95) !important;
}

.info-label {
    font-size: 0.75rem;
    font-weight: bold;
    color: #90A4AE;
    margin-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.info-value {
    font-size: 0.875rem;
    color: white;
    font-weight: 500;
}

.info-subtitle {
    font-size: 0.75rem;
    color: #78909C;
    font-style: italic;
}

.info-description {
    font-size: 0.8rem;
    color: #B0BEC5;
    line-height: 1.4;
    font-style: italic;
}

.planet-info,
.anomaly-info,
.ship-info {
    color: white;
}

.gap-1 {
    gap: 4px;
}
</style>
