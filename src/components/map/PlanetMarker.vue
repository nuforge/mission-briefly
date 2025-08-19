<template>
    <g class="planet-marker" :data-entity-id="planet.id" @click="$emit('click', planet)" @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave">
        <!-- Planet Body -->
        <circle :cx="position.x" :cy="position.y" :r="radius" :fill="planet.getMapColor()"
            :stroke="isSelected ? '#FFC107' : strokeColor" :stroke-width="isSelected ? 3 : 1.5"
            :opacity="planet.isExplored ? 1.0 : 0.7" class="planet-body" @mouseover="showTooltip = true"
            @mouseout="showTooltip = false" />

        <!-- Planet Rings (for gas giants) -->
        <ellipse v-if="planet.type === 'gas-giant'" :cx="position.x" :cy="position.y" :rx="radius * 1.4"
            :ry="radius * 0.3" fill="none" :stroke="planet.getMapColor()" :stroke-width="1" :opacity="0.6" />

        <!-- Starbase Indicator -->
        <g v-if="planet.hasStarbase">
            <rect :x="position.x - 8" :y="position.y - 8" width="16" height="16" fill="none" stroke="#4CAF50"
                stroke-width="2" :opacity="0.8" />
            <text :x="position.x" :y="position.y + 3" text-anchor="middle" fill="#4CAF50" font-size="8"
                font-weight="bold">
                SB
            </text>
        </g>

        <!-- Threat Level Indicator -->
        <g v-if="planet.threatLevel > 5">
            <circle :cx="position.x + radius * 0.7" :cy="position.y - radius * 0.7" r="6"
                :fill="getThreatColor(planet.threatLevel)" stroke="#000" stroke-width="1" />
            <text :x="position.x + radius * 0.7" :y="position.y - radius * 0.7 + 2" text-anchor="middle" fill="white"
                font-size="8" font-weight="bold">
                !
            </text>
        </g>

        <!-- Exploration Status -->
        <circle v-if="!planet.isExplored" :cx="position.x - radius * 0.7" :cy="position.y - radius * 0.7" r="4"
            fill="#FF9800" stroke="#000" stroke-width="1">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="2s" repeatCount="indefinite" />
        </circle>

        <!-- Planet Label -->
        <text :x="position.x" :y="position.y + radius + 15" text-anchor="middle" :fill="labelColor" font-size="10"
            font-weight="bold" class="planet-label">
            {{ planet.name }}
        </text>

        <!-- Tooltip Background (shown on hover) -->
        <g v-if="showTooltip" class="planet-tooltip">
            <rect :x="tooltipPosition.x" :y="tooltipPosition.y" width="160" height="60" fill="rgba(0, 0, 0, 0.95)"
                stroke="rgba(255, 255, 255, 0.3)" stroke-width="1" rx="6" />
            <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 15" fill="white" font-size="10" font-weight="bold">
                {{ planet.name }}
            </text>
            <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 27" fill="#ccc" font-size="9">
                Type: {{ planet.type }} • Size: {{ planet.size }}
            </text>
            <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 39" fill="#ccc" font-size="9">
                Population: {{ formatPopulation(planet.population) }}
            </text>
            <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 51" fill="#ccc" font-size="9">
                Threat: {{ planet.threatLevel }}/10
            </text>
        </g>
    </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type Planet from '@/game/planet'

interface Props {
    planet: Planet
    isSelected?: boolean
    scale?: number
    viewportWidth?: number
    viewportHeight?: number
}

const props = withDefaults(defineProps<Props>(), {
    isSelected: false,
    scale: 50, // pixels per AU
    viewportWidth: 800,
    viewportHeight: 600
})

// Local state
const showTooltip = ref(false)

// Computed
const position = computed(() => ({
    x: (props.planet as any).position.x * props.scale,
    y: (props.planet as any).position.y * props.scale
}))

const radius = computed(() => {
    const baseSize = 8
    const multiplier = (props.planet as any).getSizeMultiplier()
    return baseSize * multiplier
})

const tooltipPosition = computed(() => {
    const tooltipWidth = 160
    const tooltipHeight = 60
    const margin = 10

    // Default position (to the right of the planet)
    let x = position.value.x + radius.value + margin
    let y = position.value.y - 30

    // If too far right, position to the left
    if (x + tooltipWidth > props.viewportWidth) {
        x = position.value.x - radius.value - tooltipWidth - margin
    }

    // If too far down, position above
    if (y + tooltipHeight > props.viewportHeight) {
        y = position.value.y - radius.value - tooltipHeight - margin
    }

    // Ensure minimum bounds
    x = Math.max(margin, x)
    y = Math.max(margin, y)

    return { x, y }
})

const strokeColor = computed(() => {
    if ((props.planet as any).threatLevel > 5) return '#F44336'
    if (!(props.planet as any).isExplored) return '#FF9800'
    return '#666'
})

const labelColor = computed(() => {
    return props.isSelected ? '#FFC107' : '#fff'
})

// Methods
function getThreatColor(level: number): string {
    if (level >= 8) return '#D32F2F'
    if (level >= 6) return '#F57C00'
    return '#FBC02D'
}

function formatPopulation(population: number): string {
    if (population === 0) return 'Uninhabited'
    if (population < 1000) return population.toString()
    if (population < 1000000) return `${(population / 1000).toFixed(0)}K`
    return `${(population / 1000000).toFixed(1)}M`
}

function handleMouseEnter() {
    showTooltip.value = true
    emit('mouseenter', props.planet)
}

function handleMouseLeave() {
    showTooltip.value = false
    emit('mouseleave', props.planet)
}

// Emits
const emit = defineEmits<{
    click: [planet: Planet]
    'show-details': [planet: Planet]
    mouseenter: [planet: Planet]
    mouseleave: [planet: Planet]
}>()
</script>

<style>
.planet-marker {
    cursor: pointer;
}

.planet-body {
    transition: all 0.2s ease;
}

.planet-body:hover {
    filter: brightness(1.2);
}

.planet-label {
    pointer-events: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.planet-tooltip {
    pointer-events: none;
}
</style>
