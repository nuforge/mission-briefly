<script setup lang="ts">

import { defineProps } from 'vue'

defineProps({
  text: String,
  icon: String,
  color: String,
  size: {
    type: String,
    default: 'small'
  }
})

</script>


<template>
  <v-chip class="overflow-visible" :text="text" :icon="icon" :prepend-icon="icon" :color="icon ? 'text' : color" label
    variant="text" @click="console.log('clicked')" :size="size">
    <template #prepend>
      <v-icon :color="color" :size="size">{{ icon }}</v-icon>
    </template>
  </v-chip>
</template>
