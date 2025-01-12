<script setup lang="ts">
import { ref } from 'vue'

const completion = ref(1)

const interval = ref(800)
const step = ref(2)
const max = ref(100)
const min = ref(1)

setInterval(() => {
  completion.value = Math.min(completion.value + step.value, max.value)
  if (completion.value >= max.value) completion.value = min.value
}, interval.value)


</script>

<template>
  <v-card-actions>
    <v-icon icon="mdi-account-multiple-check" color="info" />
    <v-progress-linear v-model="completion" color="primary" rounded-bar label="Progress" striped height="16" rounded
      opacity="10%"></v-progress-linear>
  </v-card-actions>
</template>
