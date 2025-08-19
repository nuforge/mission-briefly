<template>
    <div class="map-controls d-flex align-center">
        <!-- Zoom Controls -->
        <v-btn-group density="compact" variant="outlined">
            <v-btn icon="mdi-plus" size="small" @click="$emit('zoom-in')" :disabled="zoom >= 5.0" />
            <v-btn icon="mdi-minus" size="small" @click="$emit('zoom-out')" :disabled="zoom <= 0.1" />
        </v-btn-group>

        <!-- Zoom Level Display -->
        <v-chip class="mx-2" size="small" variant="outlined">
            {{ Math.round(zoom * 100) }}%
        </v-chip>

        <!-- Layer Toggle Buttons -->
        <v-btn-group density="compact" variant="outlined" class="ml-2">
            <v-btn :color="showPlanets ? 'primary' : 'default'" size="small" @click="$emit('toggle-layer', 'planets')">
                <v-icon>mdi-earth</v-icon>
                <v-tooltip activator="parent" location="bottom">
                    Toggle Planets
                </v-tooltip>
            </v-btn>

            <v-btn :color="showAnomalies ? 'error' : 'default'" size="small"
                @click="$emit('toggle-layer', 'anomalies')">
                <v-icon>mdi-alert-octagram</v-icon>
                <v-tooltip activator="parent" location="bottom">
                    Toggle Anomalies
                </v-tooltip>
            </v-btn>

            <v-btn :color="showShips ? 'success' : 'default'" size="small" @click="$emit('toggle-layer', 'ships')">
                <v-icon>mdi-rocket</v-icon>
                <v-tooltip activator="parent" location="bottom">
                    Toggle Ships
                </v-tooltip>
            </v-btn>
        </v-btn-group>

        <!-- Reset View Button -->
        <v-btn icon="mdi-home" variant="outlined" size="small" class="ml-2" @click="$emit('reset-view')">
            <v-tooltip activator="parent" location="bottom">
                Reset View
            </v-tooltip>
        </v-btn>

        <!-- Divider -->
        <v-divider vertical class="mx-2" />

        <!-- Additional Controls -->
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn icon="mdi-cog" variant="outlined" size="small" v-bind="props">
                    <v-tooltip activator="parent" location="bottom">
                        Map Settings
                    </v-tooltip>
                </v-btn>
            </template>

            <v-list density="compact">
                <v-list-item>
                    <v-list-item-title>Grid Display</v-list-item-title>
                    <template v-slot:append>
                        <v-switch v-model="showGrid" density="compact" hide-details
                            @change="$emit('toggle-grid', showGrid)" />
                    </template>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Show Coordinates</v-list-item-title>
                    <template v-slot:append>
                        <v-switch v-model="showCoordinates" density="compact" hide-details
                            @change="$emit('toggle-coordinates', showCoordinates)" />
                    </template>
                </v-list-item>

                <v-list-item>
                    <v-list-item-title>Threat Indicators</v-list-item-title>
                    <template v-slot:append>
                        <v-switch v-model="showThreats" density="compact" hide-details
                            @change="$emit('toggle-threats', showThreats)" />
                    </template>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
    zoom: number
    showPlanets: boolean
    showAnomalies: boolean
    showShips: boolean
}

const props = defineProps<Props>()

// Local state for additional controls
const showGrid = ref(true)
const showCoordinates = ref(false)
const showThreats = ref(true)

// Emits
defineEmits<{
    'zoom-in': []
    'zoom-out': []
    'reset-view': []
    'toggle-layer': [layer: 'planets' | 'anomalies' | 'ships']
    'toggle-grid': [show: boolean]
    'toggle-coordinates': [show: boolean]
    'toggle-threats': [show: boolean]
}>()
</script>

<style scoped>
.map-controls {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    padding: 4px;
}
</style>
