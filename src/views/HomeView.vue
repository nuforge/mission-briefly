<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type Ship from '@/game/ship'
import { useGameDataStore } from '@/stores/gameData'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import StarshipTag from '@/components/tags/StarshipTag.vue'
import MissionCard from '@/components/cards/MissionCard.vue'

const gameDataStore = useGameDataStore()
const currentShip = ref<Ship | any | null>(null)

const setCurrentShip = (ship: Ship | any) => {
  currentShip.value = ship
}

onMounted(async () => {
  // Load game data if not already loaded
  if (gameDataStore.ships.length === 0) {
    await gameDataStore.loadAllData()
  }

  // Set default ship to Enterprise if available
  const enterprise = gameDataStore.getShipByName('USS Enterprise')
  if (enterprise) {
    currentShip.value = enterprise
  } else if (gameDataStore.ships.length > 0) {
    currentShip.value = gameDataStore.ships[0]
  }
})

defineExpose({ setCurrentShip })

</script>

<template>
  <main>
    <v-container>
      <v-row>
        <v-col>
          <MissionCard v-for="mission in gameDataStore.missions" :key="mission.title" :mission="mission as any" />
        </v-col>
      </v-row>
    </v-container>

    <StarshipTag v-for="ship in gameDataStore.ships" :key="ship.name" :ship="ship as any"
      @click="setCurrentShip(ship as any)" />
    <StarshipCard v-if="currentShip" :ship="currentShip as any" />
  </main>
</template>
