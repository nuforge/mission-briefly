<script setup lang="ts">
import Rank from '@/game/rank'

defineProps({
  rank: {
    type: Rank,
    required: true
  },
  icon: {
    type: String,
    default: 'mdi-circle'
  },
  size: {
    type: String,
    default: 'x-small'
  },
  color: {
    type: String,
    default: 'warning'
  }

})


</script>

<template>
  <v-tooltip v-if="rank" :value="rank.title" content-class="bg-background" location="bottom">
    <template #activator="{ props }">
      <v-sheet class="bg-transparent" v-bind="props">
        <v-icon v-for="(pip, index) in rank.getPips()" :key="index" :icon="pip ? icon : `${icon}-outline`" :size="size"
          :color="color" />
      </v-sheet>
    </template>
    {{ rank.name }}
  </v-tooltip>

</template>

