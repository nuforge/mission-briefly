<script setup lang="ts">
import { onMounted } from 'vue'
import { useGameDataStore } from '@/stores/gameData'
import { useRouter } from 'vue-router'
import MissionCard from '@/components/cards/MissionCard.vue'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import CharacterCard from '@/components/cards/CharacterCard.vue'

const gameDataStore = useGameDataStore()
const router = useRouter()

onMounted(async () => {
  if (gameDataStore.ships.length === 0) {
    await gameDataStore.loadAllData()
  }
})

const navigateTo = (path: string) => {
  router.push(path)
}

</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Hero Section -->
    <v-row class="mb-8">
      <v-col cols="12">
        <v-card color="primary" variant="flat" class="text-center" height="200">
          <v-card-text class="d-flex flex-column justify-center align-center h-100 text-white">
            <v-icon size="48" class="mb-4">mdi-rocket</v-icon>
            <h1 class="text-h3 font-weight-light mb-2">Mission Briefly</h1>
            <p class="text-h6 opacity-90">Starfleet Command & Coordination System</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="6" md="3">
        <v-card class="text-center pa-4" @click="navigateTo('/dashboard')" style="cursor: pointer">
          <v-icon size="32" color="primary" class="mb-2">mdi-view-dashboard</v-icon>
          <div class="text-h4">{{ gameDataStore.totalShips }}</div>
          <div class="text-caption text-medium-emphasis">Fleet Ships</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="text-center pa-4" @click="navigateTo('/crew')" style="cursor: pointer">
          <v-icon size="32" color="secondary" class="mb-2">mdi-account-group</v-icon>
          <div class="text-h4">{{ gameDataStore.totalCharacters }}</div>
          <div class="text-caption text-medium-emphasis">Personnel</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="text-center pa-4" @click="navigateTo('/missions')" style="cursor: pointer">
          <v-icon size="32" color="success" class="mb-2">mdi-target</v-icon>
          <div class="text-h4">{{ gameDataStore.totalMissions }}</div>
          <div class="text-caption text-medium-emphasis">Active Missions</div>
        </v-card>
      </v-col>
      <v-col cols="6" md="3">
        <v-card class="text-center pa-4">
          <v-icon size="32" color="warning" class="mb-2">mdi-star-four-points</v-icon>
          <div class="text-h4">2378</div>
          <div class="text-caption text-medium-emphasis">Stardate</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recent Activity -->
    <v-row>
      <v-col cols="12" lg="8">
        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-clock-outline</v-icon>
            Recent Missions
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-0">
            <v-row dense>
              <v-col v-for="mission in gameDataStore.missions.slice(0, 3)" :key="mission.id" cols="12">
                <MissionCard :mission="mission as any" />
              </v-col>
            </v-row>
            <v-card-actions v-if="gameDataStore.missions.length > 3">
              <v-spacer></v-spacer>
              <v-btn variant="text" color="primary" @click="navigateTo('/missions')" append-icon="mdi-arrow-right">
                View All Missions
              </v-btn>
            </v-card-actions>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" lg="4">
        <v-card class="mb-4">
          <v-card-title>
            <v-icon class="me-2">mdi-rocket</v-icon>
            Featured Ship
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-2">
            <StarshipCard v-if="gameDataStore.ships.length > 0" :ship="gameDataStore.ships[0] as any" />
          </v-card-text>
        </v-card>

        <v-card>
          <v-card-title>
            <v-icon class="me-2">mdi-account-star</v-icon>
            Officer of the Day
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-2">
            <CharacterCard v-if="gameDataStore.characters.length > 0" :character="gameDataStore.characters[0] as any" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

