<script setup lang="ts">
import Log from '@/game/log'

defineProps<{
  log: Log
}>()

</script>

<template>
  <v-list>
    <v-list-item>
      <v-list-item-title>{{ log.title }}</v-list-item-title>
      <v-list-item-subtitle>{{ log.summary }}</v-list-item-subtitle>
      <NuProgressBars />
    </v-list-item>
  </v-list>
</template>
