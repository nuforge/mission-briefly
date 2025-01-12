<script setup lang="ts">
import Ship from '@/game/ship'
import ATag from '@/components/ATag.vue'
import CharacterTag from './CharacterTag.vue';

defineProps<{
  ship: Ship
}>()

</script>

<template>
  <v-card density="compact">
    <v-card-title>
      <v-icon icon="mdi-rocket-launch" color="warning" /> {{ ship?.name }}
    </v-card-title>
    <v-chip-group class="bg-background elevation-1 " column>
      <v-divider></v-divider>
      <ATag :text="ship?.name" icon="mdi-label" color="grey" />
      <ATag :text="ship?.registry" icon="mdi-label-outline" color="grey" />
      <ATag :text="ship?.type" icon="mdi-label-outline" color="grey" />
      <v-divider></v-divider>
    </v-chip-group>
    <v-card-text>
      <v-divider><v-label>Crew</v-label></v-divider>
      <v-chip-group column>
        <CharacterTag v-for="crew in ship?.crew" :key="crew.id" :character="crew" />
      </v-chip-group>
    </v-card-text>
    <v-card-actions>
    </v-card-actions>
  </v-card>
</template>
