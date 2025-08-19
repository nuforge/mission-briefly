<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useGameDataStore } from '@/stores/gameData'
import { useStateStore } from '@/stores/state'

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
    <v-list-item prepend-icon="mdi-target" title="All Missions" to="/missions" color="primary" />
    <v-label @click="state.toggleNavigationSection('missions')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded?.missions ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Recent Missions
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded?.missions" flat>
        <v-list-item v-for="mission in missions.slice(0, 5)" :key="mission.id" :title="mission.title"
          :prepend-icon="'mdi-target'" :to="`/mission/${mission.id}`" color="primary">
          <template #append>
            <v-chip size="x-small" :color="(mission as any).status === 'active' ? 'success' : 'info'" variant="flat">
              {{ (mission as any).status }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item v-if="missions.length === 0" title="No missions available" disabled />
      </v-card>
    </v-expand-transition>

    <!-- Fleet Section -->
    <v-list-item prepend-icon="mdi-rocket" title="Fleet Overview" to="/fleet" color="primary" />
    <v-list-item prepend-icon="mdi-solar-system" title="Solar System Map" to="/system" color="primary" />
    <v-label @click="state.toggleNavigationSection('ships')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded?.ships ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Ships
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded?.ships" flat>
        <v-list-item v-for="ship in ships" :key="ship.id" :title="ship.name" :subtitle="ship.registry"
          :prepend-icon="'mdi-rocket'" :to="`/ship/${ship.id}`" color="primary">
          <template #append>
            <v-chip size="x-small" color="success" variant="flat">
              {{ (ship as any).crew?.length || 0 }}
            </v-chip>
          </template>
        </v-list-item>
        <v-list-item v-if="ships.length === 0" title="No ships available" disabled />
      </v-card>
    </v-expand-transition>

    <!-- Personnel Section -->
    <v-list-item prepend-icon="mdi-account-group" title="All Personnel" to="/crew" color="primary" />
    <v-label @click="state.toggleNavigationSection('crew')" style="cursor: pointer;">
      <v-icon :icon="state.navigationExpanded?.crew ? 'mdi-chevron-down' : 'mdi-chevron-right'" size="small" />
      Senior Officers
    </v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="state.navigationExpanded?.crew" flat>
        <v-list-item v-for="character in characters.filter((c: any) => c.rank?.value >= 5)" :key="character.id"
          :title="character.name" :subtitle="(character as any).rank?.name" :prepend-icon="'mdi-account-circle'"
          :to="`/crew/${character.id}`" color="primary">
          <template #prepend>
            <v-avatar size="24" color="primary">
              <v-icon size="16">mdi-account</v-icon>
            </v-avatar>
          </template>
        </v-list-item>
        <v-list-item v-if="characters.filter((c: any) => c.rank?.value >= 5).length === 0" title="No senior officers"
          disabled />
      </v-card>
    </v-expand-transition>

    <!-- Quick Access -->
    <v-divider class="mt-4" />
    <v-list-item prepend-icon="mdi-home" title="Home" to="/" color="primary" />
    <v-list-item prepend-icon="mdi-information" title="About" to="/about" color="primary" />
  </v-navigation-drawer>
</template>
