<script setup lang="ts">
import Mission from '@/game/mission'
import MissionLogs from '@/components/MissionLogs.vue';
import { LogEntries } from '@/data/mission-logs-01'

defineProps<{
  mission: Mission
}>()

</script>

<template>
  <v-card>
    <v-card-title><v-icon icon="mdi-map-marker-radius" color="warning" /> {{ mission.objective }}</v-card-title>
    <v-chip-group class="bg-background elevation-1 " column>
      <v-divider></v-divider>
      <ATag :text="mission.date?.getFullYear()?.toString()" icon="mdi-web-clock" color="info" />
      <ATag :text="mission.location" icon="mdi-web" color="info" />
      <v-divider></v-divider>
    </v-chip-group>
    <v-card-text>
      <p>{{ mission.title }}</p>
      <MissionLogs v-for="log in LogEntries" :key="log.title" :log="log" />

    </v-card-text>
    <v-card-actions>
      <v-btn>View Logs</v-btn>
      <v-btn>View Crew</v-btn>
      <v-btn>Accept Mission</v-btn>
      <v-btn>Log Report</v-btn>
    </v-card-actions>
    <v-divider></v-divider>
  </v-card>
</template>
