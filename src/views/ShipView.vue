<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Ship from '@/game/ship'
import StarshipCard from '@/components/cards/StarshipCard.vue'

const showJSON = ref(false)
const gameDataStore = useGameDataStore()
const loading = ref(true)

const route = useRoute()
const routeName = route.params.shipName

const shipName = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName)
const currentShip = ref<Ship | null>(null)

const findShip = () => {
  const shipId = route.params.shipName as string
  if (!shipId) {
    loading.value = false
    return
  }

  currentShip.value = gameDataStore.getShipById(shipId) || null
  loading.value = false
}

watch(() => route.params.shipName, (newShipId) => {
  loading.value = true
  shipName.value = Array.isArray(newShipId) ? newShipId[0] : newShipId
  findShip()
})

// Load data and find ship on mount
onMounted(async () => {
  if (gameDataStore.ships.length === 0) {
    await gameDataStore.loadAllData()
  }
  findShip()
})

// If starship is not found, show error
watch(currentShip, (newShip) => {
  if (!newShip) {
    console.error('Starship not found')
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
})

</script>

<template>
  <div class="starship card">
    <div v-if="loading" class="text-center pa-4">
      <v-progress-circular indeterminate color="primary"></v-progress-circular>
      <p>Loading ship data...</p>
    </div>
    <StarshipCard v-else-if="currentShip" :ship="(currentShip as Ship)" />
    <div v-else>
      <p>Starship not found.</p>
    </div>
    <pre v-if="showJSON && currentShip"
      class="bg-surface rounded pa-2 ma-4"><code>{{ JSON.stringify(currentShip?.toJSON(), null, 4) }}</code></pre>
  </div>
</template>
