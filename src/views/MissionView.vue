<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Mission from '@/game/mission'
import MissionCard from '@/components/cards/MissionCard.vue'

const showJSON = ref(false)
const gameDataStore = useGameDataStore()

const route = useRoute()
const routeName = route.params.missionId

const missionId = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName)
const currentMission = ref<Mission | null>(null)

const findMission = () => {
  const foundMission = gameDataStore.getMissionById(missionId.value)
  currentMission.value = foundMission || null
}

watch(() => route.params.missionId, (newMissionId) => {
  missionId.value = Array.isArray(newMissionId) ? newMissionId[0] : newMissionId
  findMission()
})

// Load data and find mission on mount
onMounted(async () => {
  if (gameDataStore.missions.length === 0) {
    await gameDataStore.loadAllData()
  }
  findMission()
})

// If mission is not found, show error
watch(currentMission, (newMission) => {
  if (!newMission) {
    console.error('Mission not found')
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
})
</script>

<template>
  <main>
    <v-container>
      <v-row>
        <v-col class="d-flex flex-column ga-4">
          <MissionCard :mission="(currentMission as Mission)" v-if="currentMission" />
          <div v-else>
            <p>Mission not found.</p>
          </div>
          <pre v-if="showJSON"
            class="bg-surface rounded pa-2 ma-4"><code>{{ JSON.stringify(currentMission?.toJSON(), null, 4) }}</code></pre>
        </v-col>
      </v-row>
    </v-container>

  </main>
</template>
