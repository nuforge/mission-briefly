<script setup lang="ts">
import { ref } from 'vue'

const completion = ref(1)

setInterval(() => {
  completion.value = Math.min(completion.value + 2, 100)
  if (completion.value >= 100) completion.value = 1
}, 800)

</script>

<template>
  <v-card-actions>
    <v-icon icon="mdi-account-multiple-check" color="info" />
    <v-progress-linear v-model="completion" color="primary" rounded-bar label="Progress" striped height="16" rounded
      opacity="10%"></v-progress-linear>
  </v-card-actions>
</template>
