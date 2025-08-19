<template>
  <g class="ship-marker" :data-entity-id="ship.id" @click="$emit('click', ship)" @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave">
    <!-- Ship Hull - Simple Triangle Symbol -->
    <g :transform="`translate(${position.x}, ${position.y}) rotate(${heading})`">
      <!-- Single Triangle Ship Symbol -->
      <polygon points="0,-12 -8,8 8,8" :fill="hullColor" :stroke="strokeColor" stroke-width="2" />

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
        <circle :cx="position.x - 15" :cy="position.y - 15" r="5" fill="#D32F2F" stroke="white" stroke-width="1">
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
        :x2="position.x" :y2="position.y" stroke="#4CAF50" stroke-width="2" :opacity="0.6" stroke-dasharray="5,5">
        <animate attributeName="opacity" values="0.3;0.8;0.3" dur="2s" repeatCount="indefinite" />
      </line>
    </g>

    <!-- Ship Name Label -->
    <text :x="position.x" :y="position.y + 25" text-anchor="middle" :fill="labelColor" font-size="10" font-weight="bold"
      class="ship-label">
      {{ ship.name }}
    </text>

    <!-- Tooltip -->
    <g v-if="showTooltip" class="ship-tooltip">
      <rect :x="tooltipPosition.x" :y="tooltipPosition.y" width="160" height="70" fill="rgba(0, 0, 0, 0.95)"
        stroke="rgba(255, 255, 255, 0.3)" stroke-width="1" rx="6" />
      <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 15" fill="white" font-size="10" font-weight="bold">
        {{ ship.name }}
      </text>
      <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 27" fill="#ccc" font-size="9">
        {{ ship.registry }} • {{ ship.type }}
      </text>
      <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 39" fill="#ccc" font-size="9">
        Status: {{ getStatusText() }}
      </text>
      <text :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 51" fill="#ccc" font-size="9">
        Crew: {{ getCrewCount() }}
      </text>
      <text v-if="currentMission" :x="tooltipPosition.x + 8" :y="tooltipPosition.y + 63" fill="#ccc" font-size="8">
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

const tooltipPosition = computed(() => {
  const tooltipWidth = 160
  const tooltipHeight = 70
  const margin = 10

  // Default position (to the right of the ship)
  let x = position.value.x + 25
  let y = position.value.y - 35

  // If too far right, position to the left
  if (x + tooltipWidth > props.viewportWidth) {
    x = position.value.x - tooltipWidth - 25
  }

  // If too far down, position above
  if (y + tooltipHeight > props.viewportHeight) {
    y = position.value.y - tooltipHeight - margin
  }

  // Ensure minimum bounds
  x = Math.max(margin, x)
  y = Math.max(margin, y)

  return { x, y }
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

function handleMouseEnter() {
  showTooltip.value = true
  emit('mouseenter', props.ship)
}

function handleMouseLeave() {
  showTooltip.value = false
  emit('mouseleave', props.ship)
}

// Emits
const emit = defineEmits<{
  click: [ship: Ship]
  'show-details': [ship: Ship]
  mouseenter: [ship: Ship]
  mouseleave: [ship: Ship]
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
