<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import ATag from '@/components/tags/ATag.vue'

const gameDataStore = useGameDataStore()
const router = useRouter()

// Reactive data
const search = ref('')
const selectedClass = ref('all')
const loading = ref(true)

// Computed
const shipClasses = computed(() => {
  const classes = new Set(gameDataStore.ships.map(ship => ship.type))
  return Array.from(classes).sort()
})

const filteredShips = computed(() => {
  let ships = gameDataStore.ships

  // Filter by search
  if (search.value) {
    ships = ships.filter(ship =>
      ship.name.toLowerCase().includes(search.value.toLowerCase()) ||
      ship.registry.toLowerCase().includes(search.value.toLowerCase()) ||
      ship.type.toLowerCase().includes(search.value.toLowerCase())
    )
  }

  // Filter by class
  if (selectedClass.value !== 'all') {
    ships = ships.filter(ship => ship.type === selectedClass.value)
  }

  return ships
})

const fleetStats = computed(() => ({
  totalShips: gameDataStore.ships.length,
  activeShips: gameDataStore.ships.filter(ship => ship.crew && ship.crew.length > 0).length,
  shipClasses: shipClasses.value.length,
  totalCrew: gameDataStore.ships.reduce((sum, ship) => sum + (ship.crew?.length || 0), 0)
}))

// Methods
const navigateToShip = (shipId: string) => {
  router.push(`/ship/${shipId}`)
}

const clearFilters = () => {
  search.value = ''
  selectedClass.value = 'all'
}

// Lifecycle
onMounted(async () => {
  if (gameDataStore.ships.length === 0) {
    await gameDataStore.loadAllData()
  }
  loading.value = false
})
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Page Header -->
    <v-row class="mb-6">
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-icon size="32" color="primary" class="me-3">mdi-rocket</v-icon>
          <div>
            <h1 class="text-h3 font-weight-light">Fleet Command</h1>
            <p class="text-subtitle-1 text-medium-emphasis mb-0">Starfleet vessel management and
              coordination</p>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Fleet Statistics -->
    <v-row class="mb-6">
      <v-col cols="6" sm="3">
        <v-card variant="outlined" class="text-center pa-4">
          <v-icon size="28" color="primary" class="mb-2">mdi-rocket</v-icon>
          <div class="text-h4">{{ fleetStats.totalShips }}</div>
          <div class="text-caption text-medium-emphasis">Total Ships</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card variant="outlined" class="text-center pa-4">
          <v-icon size="28" color="success" class="mb-2">mdi-rocket-launch</v-icon>
          <div class="text-h4">{{ fleetStats.activeShips }}</div>
          <div class="text-caption text-medium-emphasis">Active Ships</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card variant="outlined" class="text-center pa-4">
          <v-icon size="28" color="info" class="mb-2">mdi-shape</v-icon>
          <div class="text-h4">{{ fleetStats.shipClasses }}</div>
          <div class="text-caption text-medium-emphasis">Ship Classes</div>
        </v-card>
      </v-col>
      <v-col cols="6" sm="3">
        <v-card variant="outlined" class="text-center pa-4">
          <v-icon size="28" color="warning" class="mb-2">mdi-account-group</v-icon>
          <div class="text-h4">{{ fleetStats.totalCrew }}</div>
          <div class="text-caption text-medium-emphasis">Total Crew</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filters and Search -->
    <v-row class="mb-4">
      <v-col cols="12" md="6">
        <v-text-field v-model="search" label="Search ships..." prepend-inner-icon="mdi-magnify" variant="outlined"
          hide-details clearable />
      </v-col>
      <v-col cols="12" md="4">
        <v-select v-model="selectedClass"
          :items="[{ title: 'All Classes', value: 'all' }, ...shipClasses.map(c => ({ title: c, value: c }))]"
          label="Filter by Class" variant="outlined" hide-details />
      </v-col>
      <v-col cols="12" md="2" class="d-flex align-center">
        <v-btn variant="outlined" @click="clearFilters" block>
          Clear Filters
        </v-btn>
      </v-col>
    </v-row>

    <!-- Active Filters -->
    <v-row v-if="search || selectedClass !== 'all'" class="mb-4">
      <v-col cols="12">
        <div class="d-flex align-center gap-2 flex-wrap">
          <span class="text-caption text-medium-emphasis">Active filters:</span>
          <ATag v-if="search" :text="`Search: ${search}`" icon="mdi-magnify" color="primary" closable
            @close="search = ''" />
          <ATag v-if="selectedClass !== 'all'" :text="`Class: ${selectedClass}`" icon="mdi-shape" color="info" closable
            @close="selectedClass = 'all'" />
        </div>
      </v-col>
    </v-row>

    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" />
        <p class="mt-4 text-medium-emphasis">Loading fleet data...</p>
      </v-col>
    </v-row>

    <!-- Ships Grid -->
    <v-row v-else-if="filteredShips.length > 0">
      <v-col v-for="ship in filteredShips" :key="ship.id" cols="12" md="6" lg="4">
        <div @click="navigateToShip(ship.id)" style="cursor: pointer">
          <StarshipCard :ship="ship as any" />
        </div>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <v-row v-else>
      <v-col cols="12" class="text-center">
        <v-card variant="outlined" class="pa-8">
          <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-rocket-outline</v-icon>
          <h3 class="text-h5 mb-2">No Ships Found</h3>
          <p class="text-medium-emphasis mb-4">
            {{ search || selectedClass !== 'all' ? 'Try adjusting your filters' : 'No ships in the fleet database' }}
          </p>
          <v-btn v-if="search || selectedClass !== 'all'" variant="outlined" @click="clearFilters">
            Clear Filters
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}
</style>
