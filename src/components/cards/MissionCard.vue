<script setup lang="ts">
import ATag from '@/components/tags/ATag.vue'
import type Mission from '@/game/mission'

interface Props {
  mission: Mission
}

defineProps<Props>()

</script>

<template>
  <v-card>
    <v-card-title><v-icon icon="mdi-map-marker-radius" color="info" /> {{ mission.title }}</v-card-title>
    <v-card-text>
      <v-chip-group class="bg-background elevation-1 my-2 px-2 rounded" column v-if="mission.date || mission.location"
        variant="text">
        <ATag :text="mission.date?.getFullYear()?.toString()" icon="mdi-web-clock" color="info" />
        <ATag :text="mission.location" icon="mdi-web" color="info" />
      </v-chip-group>
      <p>{{ mission.objective }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn>View Logs</v-btn>
      <v-btn>View Crew</v-btn>
      <v-btn>Accept Mission</v-btn>
      <v-btn>Log Report</v-btn>
    </v-card-actions>
  </v-card>
</template>
