<script setup lang="ts">

import { defineProps } from 'vue'

defineProps({
  text: String,
  icon: String,
  color: String
})

</script>


<template>
  <v-chip class="overflow-visible" :text="text" :icon="icon" :prepend-icon="icon" :color="icon ? 'text' : color" label
    variant="text" @click="console.log('clicked')">
    <template #prepend>
      <v-icon :color="color">{{ icon }}</v-icon>
    </template>
  </v-chip>
</template>
