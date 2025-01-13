<script setup lang="ts">
import Ship from '@/game/ship'
import ATag from '@/components/tags/ATag.vue'
import CharacterTag from '@/components/tags/CharacterTag.vue';

defineProps({
  ship: {
    type: Ship,
    required: true
  }
})

</script>

<template>
  <v-card density="compact" class="border-t-md">
    <v-card-title class="bg-background">
      <ATag :text="ship.name" icon="mdi-rocket" color="grey" size="x-large" />
    </v-card-title>
    <v-chip-group class="bg-background elevation-1 " column>
      <ATag :text="ship.registry" icon="mdi-label-outline" color="grey" />
      <ATag :text="ship.type" icon="mdi-label-outline" color="grey" />
    </v-chip-group>
    <v-card-text v-if="ship.hasCrew()">
      <v-divider><v-label>Crew</v-label></v-divider>
      <v-chip-group class="bg-background rounded-lg elevation-2 px-2" column>
        <CharacterTag v-for="crew in ship?.crew" :key="crew.id" :character="crew" />
      </v-chip-group>
    </v-card-text>
    <v-card-text v-else>
      <v-divider><v-label>No Crew</v-label></v-divider>
    </v-card-text>
  </v-card>
</template>
