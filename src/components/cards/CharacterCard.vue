<script setup lang="ts">
import Character from '@/game/character'
import ATag from '@/components/tags/ATag.vue'
import RankPips from '@/components/RankPips.vue';

defineProps({
  character: {
    type: Character,
    required: true
  }
})

</script>

<template>
  <v-card :title="character.name" :subtitle="character.rank?.name" density="compact" class="border-t-md bg-background">
    <template #title>
      <ATag :text="character.name" icon="mdi-account-circle-outline" size="medium" />
    </template>
    <template #subtitle>
      <RankPips v-if="character.rank" :rank="character.rank" />{{ character.rank?.name }}
    </template>
    <v-chip-group class="bg-background elevation-1 " column>
      <ATag :text="character?.species?.name" icon="mdi-account-box-outline" />
      <ATag :text="character?.rank?.name" icon="mdi-account-circle-outline" />
      <ATag :text="character?.department?.name" :icon="character?.department?.icon"
        :color="character?.department?.color" />
    </v-chip-group>
  </v-card>
</template>
