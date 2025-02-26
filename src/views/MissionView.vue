<script setup lang="ts">
import { Missions } from '@/data/mission-logs-01'
import MissionCard from '@/components/cards/MissionCard.vue'

</script>

<template>
  <main>
    <v-container>
      <v-row>
        <v-col class="d-flex flex-column ga-4">
          <MissionCard v-for="mission in Missions" :key="mission.title" :mission="mission" />
        </v-col>
      </v-row>
    </v-container>

  </main>
</template>
