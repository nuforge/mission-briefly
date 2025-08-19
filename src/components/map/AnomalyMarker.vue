<template>
    <g class="anomaly-marker" @click="$emit('click', anomaly)">
        <!-- Anomaly Effect Area (background) -->
        <circle :cx="position.x" :cy="position.y" :r="effectRadius" :fill="anomaly.getMapColor()" :opacity="0.1"
            class="anomaly-effect-area" />

        <!-- Anomaly Core -->
        <circle :cx="position.x" :cy="position.y" :r="coreRadius" :fill="anomaly.getMapColor()"
            :stroke="isSelected ? '#FFC107' : '#fff'" :stroke-width="isSelected ? 3 : 1"
            :opacity="anomaly.isActive ? 1.0 : 0.5" class="anomaly-core" @mouseover="showTooltip = true"
            @mouseout="showTooltip = false">
            <!-- Pulsing animation for active anomalies -->
            <animate v-if="anomaly.isActive" attributeName="r"
                :values="`${coreRadius * 0.8};${coreRadius * 1.2};${coreRadius * 0.8}`" dur="3s"
                repeatCount="indefinite" />
        </circle>

        <!-- Severity Indicator Rings -->
        <circle v-if="anomaly.severity === 'critical'" :cx="position.x" :cy="position.y" :r="coreRadius * 1.5"
            fill="none" stroke="#D32F2F" stroke-width="2" :opacity="0.8">
            <animate attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite" />
        </circle>

        <circle v-else-if="anomaly.severity === 'major'" :cx="position.x" :cy="position.y" :r="coreRadius * 1.3"
            fill="none" stroke="#F57C00" stroke-width="2" :opacity="0.6">
            <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
        </circle>

        <!-- Threat Level Warning -->
        <g v-if="anomaly.threatLevel >= 7">
            <polygon :points="getWarningTrianglePoints()" fill="#D32F2F" stroke="#fff" stroke-width="1" />
            <text :x="position.x + coreRadius * 0.8" :y="position.y - coreRadius * 0.8 + 2" text-anchor="middle"
                fill="white" font-size="8" font-weight="bold">
                !
            </text>
        </g>

        <!-- Special Equipment Required Indicator -->
        <g v-if="anomaly.requiresSpecialEquipment">
            <circle :cx="position.x - coreRadius * 0.8" :cy="position.y - coreRadius * 0.8" r="6" fill="#9C27B0"
                stroke="#fff" stroke-width="1" />
            <text :x="position.x - coreRadius * 0.8" :y="position.y - coreRadius * 0.8 + 2" text-anchor="middle"
                fill="white" font-size="6" font-weight="bold">
                E
            </text>
        </g>

        <!-- Energy Fluctuation Lines -->
        <g v-if="anomaly.isActive && anomaly.anomalyType === 'energy'" class="energy-lines">
            <line v-for="i in 6" :key="i" :x1="position.x + Math.cos(i * Math.PI / 3) * (coreRadius + 5)"
                :y1="position.y + Math.sin(i * Math.PI / 3) * (coreRadius + 5)"
                :x2="position.x + Math.cos(i * Math.PI / 3) * (coreRadius + 15)"
                :y2="position.y + Math.sin(i * Math.PI / 3) * (coreRadius + 15)" :stroke="anomaly.getMapColor()"
                stroke-width="1" :opacity="0.6">
                <animate attributeName="opacity" values="0;1;0" :dur="`${1 + i * 0.2}s`" repeatCount="indefinite" />
            </line>
        </g>

        <!-- Anomaly Label -->
        <text :x="position.x" :y="position.y + effectRadius + 15" text-anchor="middle" :fill="labelColor" font-size="9"
            font-weight="bold" class="anomaly-label">
            {{ anomaly.name }}
        </text>

        <!-- Tooltip -->
        <g v-if="showTooltip" class="anomaly-tooltip">
            <rect :x="position.x + effectRadius + 10" :y="position.y - 40" width="180" height="80"
                fill="rgba(0, 0, 0, 0.9)" stroke="#555" stroke-width="1" rx="4" />
            <text :x="position.x + effectRadius + 15" :y="position.y - 25" fill="white" font-size="10"
                font-weight="bold">
                {{ anomaly.name }}
            </text>
            <text :x="position.x + effectRadius + 15" :y="position.y - 15" fill="#ccc" font-size="9">
                Type: {{ anomaly.anomalyType }} • {{ anomaly.severity }}
            </text>
            <text :x="position.x + effectRadius + 15" :y="position.y - 5" fill="#ccc" font-size="9">
                Radius: {{ anomaly.radius.toFixed(1) }} AU
            </text>
            <text :x="position.x + effectRadius + 15" :y="position.y + 5" fill="#ccc" font-size="9">
                Threat: {{ anomaly.threatLevel }}/10
            </text>
            <text v-if="anomaly.discoveredBy" :x="position.x + effectRadius + 15" :y="position.y + 15" fill="#ccc"
                font-size="8">
                Discovered by: {{ getDiscovererName() }}
            </text>
            <text :x="position.x + effectRadius + 15" :y="position.y + 25" fill="#ccc" font-size="8">
                Status: {{ anomaly.isActive ? 'Active' : 'Inactive' }}
            </text>
        </g>
    </g>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type Anomaly from '@/game/anomaly'

interface Props {
    anomaly: Anomaly
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
const position = computed(() => ({
    x: (props.anomaly as any).position.x * props.scale,
    y: (props.anomaly as any).position.y * props.scale
}))

const effectRadius = computed(() => {
    return (props.anomaly as any).radius * props.scale
})

const coreRadius = computed(() => {
    const baseSize = 6
    const severityMultiplier = (props.anomaly as any).getSeverityMultiplier()
    return baseSize * severityMultiplier
})

const labelColor = computed(() => {
    return props.isSelected ? '#FFC107' : '#fff'
})

// Methods
function getWarningTrianglePoints(): string {
    const x = position.value.x + coreRadius.value * 0.8
    const y = position.value.y - coreRadius.value * 0.8
    const size = 6

    return `${x},${y - size} ${x - size},${y + size} ${x + size},${y + size}`
}

function getDiscovererName(): string {
    // In a real app, you'd look up the character name by ID
    const discoveredBy = (props.anomaly as any).discoveredBy
    if (discoveredBy === 'data') return 'Lt. Commander Data'
    if (discoveredBy === 'geordi-la-forge') return 'Lt. Commander La Forge'
    return discoveredBy || 'Unknown'
}

// Emits
defineEmits<{
    click: [anomaly: Anomaly]
    'show-details': [anomaly: Anomaly]
}>()
</script>

<style>
.anomaly-marker {
    cursor: pointer;
}

.anomaly-core {
    transition: all 0.2s ease;
}

.anomaly-core:hover {
    filter: brightness(1.3);
}

.anomaly-label {
    pointer-events: none;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.8);
}

.anomaly-tooltip {
    pointer-events: none;
}

.anomaly-effect-area {
    pointer-events: none;
}

.energy-lines {
    pointer-events: none;
}
</style>
