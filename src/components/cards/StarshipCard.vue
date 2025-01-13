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
  <v-card density="compact" class="border-t-md bg-background" flat :title="ship.name" :subtitle="ship.registry"
    prepend-icon="mdi-rocket">
    <v-divider></v-divider>
    <v-chip-group class="elevation-1 " column>
      <ATag :text="ship.registry" icon="mdi-label-variant" color="grey" />
      <ATag :text="ship.type" icon="mdi-label-variant-outline" color="grey" />
    </v-chip-group>
    <v-divider></v-divider>
    <v-card-text v-if="ship.hasCrew()">
      <v-label>Crew</v-label>
      <v-chip-group class="border-s-md mt-3 rounded-lg elevation-2 px-2" column>
        <CharacterTag v-for="crew in ship?.crew" :key="crew.id" :character="crew" size="small" />
      </v-chip-group>
    </v-card-text>
    <v-card-text v-else>
      <v-divider><v-label>No Crew</v-label></v-divider>
    </v-card-text>
  </v-card>
</template>
