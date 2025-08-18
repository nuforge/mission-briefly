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
  <v-card elevation="2" rounded="lg">
    <v-card-title class="d-flex align-center">
      <v-avatar class="me-3" color="primary">
        <v-icon>mdi-account</v-icon>
      </v-avatar>
      <div>
        <div class="text-h6">{{ character.name }}</div>
        <div v-if="character.rank" class="text-caption d-flex align-center">
          <RankPips :rank="character.rank" class="me-2" />
          {{ character.rank.name }}
        </div>
      </div>
    </v-card-title>

    <v-card-text>
      <div class="d-flex flex-wrap ga-2">
        <ATag v-if="character?.species?.name" :text="character.species.name" icon="mdi-dna" variant="tonal" />
        <ATag v-if="character?.department?.name" :text="character.department.name" :icon="character.department.icon"
          :color="character.department.color" variant="tonal" />
      </div>
    </v-card-text>
  </v-card>
</template>

