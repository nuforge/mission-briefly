<template>
    <g class="ship-marker" @click="$emit('click', ship)">
        <!-- Ship Hull -->
        <g :transform="`translate(${position.x}, ${position.y}) rotate(${heading})`">
            <!-- Main Hull Shape based on ship class -->
            <g v-if="shipClass === 'Galaxy-class'" class="galaxy-class">
                <!-- Galaxy-class Enterprise shape -->
                <ellipse cx="0" cy="0" rx="20" ry="8" :fill="hullColor" :stroke="strokeColor" stroke-width="2" />
                <ellipse cx="0" cy="-12" rx="12" ry="6" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
                <ellipse cx="-18" cy="2" rx="8" ry="4" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
                <ellipse cx="18" cy="2" rx="8" ry="4" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
            </g>

            <g v-else-if="shipClass === 'Defiant-class'" class="defiant-class">
                <!-- Defiant-class compact design -->
                <polygon points="0,-12 -8,8 8,8" :fill="hullColor" :stroke="strokeColor" stroke-width="2" />
                <ellipse cx="0" cy="0" rx="6" ry="8" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
            </g>

            <g v-else-if="shipClass === 'Sovereign-class'" class="sovereign-class">
                <!-- Sovereign-class sleek design -->
                <ellipse cx="0" cy="0" rx="18" ry="6" :fill="hullColor" :stroke="strokeColor" stroke-width="2" />
                <ellipse cx="0" cy="-10" rx="10" ry="4" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
                <ellipse cx="-15" cy="4" rx="6" ry="3" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
                <ellipse cx="15" cy="4" rx="6" ry="3" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
            </g>

            <g v-else class="generic-class">
                <!-- Generic ship design -->
                <ellipse cx="0" cy="0" rx="15" ry="6" :fill="hullColor" :stroke="strokeColor" stroke-width="2" />
                <ellipse cx="0" cy="-8" rx="8" ry="4" :fill="hullColor" :stroke="strokeColor" stroke-width="1" />
            </g>

            <!-- Ship Registry Number -->
            <text x="0" y="3" text-anchor="middle" fill="white" font-size="6" font-weight="bold" class="ship-registry">
                {{ ship.registry }}
            </text>
        </g>

        <!-- Status Indicators -->
        <g class="status-indicators">
            <!-- Mission Status -->
            <circle :cx="position.x + 15" :cy="position.y - 15" r="4" :fill="getStatusColor()" stroke="white"
                stroke-width="1" />

            <!-- Alert Status (if threat level high) -->
            <g v-if="isInDanger">
                <circle :cx="position.x - 15" :cy="position.y - 15" r="5" fill="#D32F2F" stroke="white"
                    stroke-width="1">
                    <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" repeatCount="indefinite" />
                </circle>
                <text :x="position.x - 15" :y="position.y - 15 + 2" text-anchor="middle" fill="white" font-size="6"
                    font-weight="bold">
                    !
                </text>
            </g>
        </g>

        <!-- Movement Trail (if ship is moving) -->
        <g v-if="isMoving" class="movement-trail">
            <line :x1="position.x - Math.cos(headingRadians) * 30" :y1="position.y - Math.sin(headingRadians) * 30"
                :x2="position.x" :y2="position.y" stroke="#4CAF50" stroke-width="2" :opacity="0.6"
                stroke-dasharray="5,5">
                <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
            </line>
        </g>

        <!-- Ship Name Label -->
        <text :x="position.x" :y="position.y + 25" text-anchor="middle" :fill="labelColor" font-size="10"
            font-weight="bold" class="ship-label">
            {{ ship.name }}
        </text>

        <!-- Tooltip -->
        <g v-if="showTooltip" class="ship-tooltip">
            <rect :x="position.x + 25" :y="position.y - 35" width="160" height="70" fill="rgba(0, 0, 0, 0.9)"
                stroke="#555" stroke-width="1" rx="4" />
            <text :x="position.x + 30" :y="position.y - 20" fill="white" font-size="10" font-weight="bold">
                {{ ship.name }}
            </text>
            <text :x="position.x + 30" :y="position.y - 10" fill="#ccc" font-size="9">
                {{ ship.registry }} • {{ ship.type }}
            </text>
            <text :x="position.x + 30" :y="position.y" fill="#ccc" font-size="9">
                Status: {{ getStatusText() }}
            </text>
            <text :x="position.x + 30" :y="position.y + 10" fill="#ccc" font-size="9">
                Crew: {{ getCrewCount() }}
            </text>
            <text v-if="currentMission" :x="position.x + 30" :y="position.y + 20" fill="#ccc" font-size="8">
                Mission: {{ currentMission }}
            </text>
        </g>
    </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type Ship from '@/game/ship'

interface Props {
    ship: Ship
    isSelected?: boolean
    scale?: number
}

const props = withDefaults(defineProps<Props>(), {
    isSelected: false,
    scale: 50 // pixels per AU
})

// Local state
const showTooltip = ref(false)

// Computed
const position = computed(() => {
    const shipData = props.ship as any
    return {
        x: (shipData.position?.x || 0) * props.scale,
        y: (shipData.position?.y || 0) * props.scale
    }
})

const shipClass = computed(() => {
    return (props.ship as any).type || 'Unknown-class'
})

const hullColor = computed(() => {
    const shipData = props.ship as any
    const status = shipData.status

    if (status === 'docked') return '#607D8B'
    if (status === 'active') return '#2196F3'
    if (status === 'exploring') return '#4CAF50'
    return '#9E9E9E'
})

const strokeColor = computed(() => {
    return props.isSelected ? '#FFC107' : '#fff'
})

const labelColor = computed(() => {
    return props.isSelected ? '#FFC107' : '#fff'
})

const heading = computed(() => {
    // Calculate heading based on movement direction or default to 0
    return 0 // For now, all ships face "up"
})

const headingRadians = computed(() => {
    return (heading.value * Math.PI) / 180
})

const isMoving = computed(() => {
    const shipData = props.ship as any
    return shipData.status === 'active' || shipData.status === 'exploring'
})

const isInDanger = computed(() => {
    // Check if ship is near any dangerous anomalies or high-threat planets
    // This would require access to the map store or anomaly data
    return false // For now
})

const currentMission = computed(() => {
    const shipData = props.ship as any
    return shipData.mission // This would map to mission titles
})

// Methods
function getStatusColor(): string {
    const shipData = props.ship as any
    const status = shipData.status

    switch (status) {
        case 'active': return '#4CAF50'
        case 'docked': return '#9E9E9E'
        case 'exploring': return '#2196F3'
        case 'maintenance': return '#FF9800'
        case 'emergency': return '#F44336'
        default: return '#607D8B'
    }
}

function getStatusText(): string {
    const shipData = props.ship as any
    const status = shipData.status || 'unknown'
    return status.charAt(0).toUpperCase() + status.slice(1)
}

function getCrewCount(): number {
    const shipData = props.ship as any
    return shipData.crew?.length || 0
}

// Emits
defineEmits<{
    click: [ship: Ship]
    'show-details': [ship: Ship]
}>()
</script>

<style>
.ship-marker {
    cursor: pointer;
}

.ship-marker:hover .ship-hull {
    filter: brightness(1.2);
}

.ship-label {
    pointer-events: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.ship-tooltip {
    pointer-events: none;
}

.ship-registry {
    pointer-events: none;
}

.movement-trail {
    pointer-events: none;
}

.status-indicators {
    pointer-events: none;
}

.galaxy-class,
.defiant-class,
.sovereign-class,
.generic-class {
    filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.3));
}
</style>
