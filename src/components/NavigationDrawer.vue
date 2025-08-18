<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameDataStore } from '@/stores/gameData'
import useStateStore from '@/stores/state'

const gameStore = useGameDataStore()
const state = useStateStore()

// Load data if not already loaded
onMounted(async () => {
  if (gameStore.characters.length === 0) {
    await gameStore.loadAllData()
  }
})

// Computed properties for navigation items
const missions = computed(() => gameStore.missions)
const ships = computed(() => gameStore.ships)
const characters = computed(() => gameStore.characters.slice(0, 10)) // Limit to first 10 for navigation
</script>

<template>
  <v-navigation-drawer v-model="state.navigationDrawer" permanent app>
    <!-- Dashboard Link -->
    <v-list-item prepend-icon="mdi-view-dashboard" title="Dashboard" to="/dashboard" color="primary" />
    <v-divider />

    <!-- Missions Section -->
    <v-label @click="state.toggleNavigationSection('missions')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded.missions ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Missions
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded.missions" flat>
        <v-list-item v-for="mission in missions" :key="mission.id" :title="mission.title" :prepend-icon="'mdi-target'"
          :to="`/mission/${mission.id}`" color="primary">
        </v-list-item>
        <v-list-item v-if="missions.length === 0" title="No missions available" disabled />
      </v-card>
    </v-expand-transition>

    <!-- Ships Section -->
    <v-label @click="state.toggleNavigationSection('ships')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded.ships ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Ships
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded.ships" flat>
        <v-list-item v-for="ship in ships" :key="ship.id" :title="ship.name" :subtitle="ship.registry"
          :prepend-icon="'mdi-rocket'" :to="`/ship/${ship.id}`" color="primary">
        </v-list-item>
        <v-list-item v-if="ships.length === 0" title="No ships available" disabled />
      </v-card>
    </v-expand-transition>

    <!-- Crew Section -->
    <v-label @click="state.toggleNavigationSection('crew')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded.crew ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Crew
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded.crew" flat>
        <v-list-item v-for="character in characters" :key="character.id" :title="character.name"
          :subtitle="character.rank?.name" :prepend-icon="'mdi-account-circle'" :to="`/crew/${character.id}`"
          color="primary">
        </v-list-item>
        <v-list-item v-if="characters.length === 0" title="No crew available" disabled />
      </v-card>
    </v-expand-transition>
  </v-navigation-drawer>
</template>
