<script setup lang="ts">
import type Ship from '@/game/ship'
import ATag from '@/components/tags/ATag.vue'
import CharacterTag from '@/components/tags/CharacterTag.vue';

interface Props {
  ship: Ship
}

defineProps<Props>()

</script>

<template>
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center">
      <v-avatar class="me-3" color="blue">
        <v-icon>mdi-rocket</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">{{ ship.name }}</div>
        <div class="text-caption text-medium-emphasis">{{ ship.registry }}</div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-wrap ga-2 mb-3">
        <ATag :text="ship.type" icon="mdi-ship-wheel" color="blue" variant="tonal" />
        <ATag :text="ship.registry" icon="mdi-identifier" color="grey"  />
      </div>

      <div v-if="ship.hasCrew()">
        <v-divider class="mb-3"></v-divider>
        <div class="text-subtitle2 mb-2">Crew ({{ ship.crew?.length || 0 }})</div>
        <div class="d-flex flex-wrap ga-1">
          <CharacterTag v-for="crew in ship?.crew?.slice(0, 6)" :key="crew.id" :character="crew" size="small" />
          <v-chip v-if="(ship.crew?.length || 0) > 6" size="small" variant="text" prepend-icon="mdi-dots-horizontal">
            +{{ (ship.crew?.length || 0) - 6 }} more
          </v-chip>
        </div>
      </div>
      <div v-else>
        <v-alert type="info" variant="tonal" density="compact" text="No crew assigned"></v-alert>
      </div>
    </v-card-text>
  </v-card>
</template>

