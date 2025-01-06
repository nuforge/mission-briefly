<script setup lang="ts">

import { defineProps } from 'vue'

defineProps({
  text: String,
  icon: String,
  color: String
})

</script>


<template>
  <v-chip :text="text" :icon="icon" :prepend-icon="icon" color="color">
  </v-chip>
</template>
