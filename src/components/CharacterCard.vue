<script setup lang="ts">
import Character from '@/game/character'
import RankPips from './RankPips.vue';
import DepartmentIcon from './DepartmentIcon.vue';

defineProps({
  character: {
    type: Character,
    required: true
  }
})

</script>

<template>
  <v-card :title="character.name" :subtitle="character.rank?.name" color="background" class="rounded-lg my-1 d-flex"
    density="compact">
    <template #prepend>
      <DepartmentIcon v-if="character.department" :department="character.department" />
    </template>
    <template #subtitle>
      <RankPips v-if="character.rank" :rank="character.rank" />
    </template>
  </v-card>
</template>
