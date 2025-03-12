<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { Missions } from '@/data/mission-logs-01'
import Mission from '@/game/mission'
import MissionCard from '@/components/cards/MissionCard.vue'

const showJSON = ref(false);

const route = useRoute();
const routeName = route.params.missionId;

const missionId = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName);
const currentMission = ref<Mission | null>(Object.values(Missions).find(mission => mission.id === missionId.value) ?? null)

watch(() => route.params.missionId, (routeName) => {
  const missionId = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName);
  currentMission.value = Object.values(Missions).find(mission => mission.id === missionId.value) ?? null
});
// If character is not found, redirect to a not found page or show an error
watch(currentMission, (newMission) => {
  if (!newMission) {
    console.error('mission not found');
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
});
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
