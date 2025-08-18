<script setup lang="ts">
import { computed, ref } from 'vue'

const completion = ref(1)

const interval = ref(800)
const step = ref(2)
const max = ref(100)
const min = ref(1)

const percentComplete = computed(() => {
  return Math.round((completion.value / max.value) * 100)
})

setInterval(() => {
  completion.value = Math.min(completion.value + step.value, max.value)
  if (completion.value >= max.value) completion.value = min.value
}, interval.value)


</script>

<template>
  <v-card-actions>
    <v-icon icon="mdi-account-multiple-check" color="info" />
    <v-progress-linear v-model="completion" color="primary" rounded-bar height="16" rounded>{{ percentComplete }}
      %</v-progress-linear>
  </v-card-actions>
</template>

