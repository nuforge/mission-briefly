<script setup lang="ts">
import ATag from '@/components/tags/ATag.vue'
import type Mission from '@/game/mission'

interface Props {
  mission: Mission
}

defineProps<Props>()

function getStatusIcon(status: string): string {
  switch (status?.toLowerCase()) {
    case 'active': return 'mdi-play-circle'
    case 'pending': return 'mdi-clock'
    case 'completed': return 'mdi-check-circle'
    case 'failed': return 'mdi-alert-circle'
    default: return 'mdi-information'
  }
}

function getStatusColor(status: string): string {
  switch (status?.toLowerCase()) {
    case 'active': return 'success'
    case 'pending': return 'warning'
    case 'completed': return 'info'
    case 'failed': return 'error'
    default: return 'grey'
  }
}

function getPriorityIcon(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'high': return 'mdi-arrow-up'
    case 'medium': return 'mdi-minus'
    case 'low': return 'mdi-arrow-down'
    case 'critical': return 'mdi-alert'
    default: return 'mdi-priority-high'
  }
}

function getPriorityColor(priority: string): string {
  switch (priority?.toLowerCase()) {
    case 'critical': return 'error'
    case 'high': return 'warning'
    case 'medium': return 'info'
    case 'low': return 'success'
    default: return 'grey'
  }
}

</script>

<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center">
      <v-avatar class="me-3" color="primary">
        <v-icon>mdi-clipboard-text</v-icon>
      </v-avatar>
      <div class="flex-grow-1">
        <div class="text-h6">{{ mission.title }}</div>
        <div class="text-caption text-medium-emphasis d-flex align-center">
          <v-icon size="small" class="me-1">mdi-calendar</v-icon>
          {{ mission.date?.getFullYear() }}
          <v-icon size="small" class="mx-1">•</v-icon>
          <v-icon size="small" class="me-1">mdi-map-marker</v-icon>
          {{ mission.location }}
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <p class="mb-3">{{ mission.objective }}</p>

      <div class="d-flex flex-wrap ga-2">
        <ATag v-if="(mission as any).status" :text="(mission as any).status"
          :icon="getStatusIcon((mission as any).status)" :color="getStatusColor((mission as any).status)"
          variant="tonal" />
        <ATag v-if="(mission as any).priority" :text="(mission as any).priority"
          :icon="getPriorityIcon((mission as any).priority)" :color="getPriorityColor((mission as any).priority)"
          variant="tonal" />
        <ATag v-if="mission.date" :text="mission.date.getFullYear().toString()" icon="mdi-calendar" color="blue"
          variant="outlined" />
      </div>
    </v-card-text>

    <v-card-actions>
      <v-btn variant="tonal" color="primary" prepend-icon="mdi-eye" size="small">
        View Details
      </v-btn>
      <v-btn variant="outlined" color="secondary" prepend-icon="mdi-account-group" size="small">
        Crew
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn v-if="(mission as any).status !== 'completed'" variant="flat" color="success" prepend-icon="mdi-check"
        size="small">
        Accept
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
