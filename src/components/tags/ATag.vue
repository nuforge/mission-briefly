<script setup lang="ts">

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
  <!--
    IMPORTANT: Only use prepend slot for icons to avoid conflicts.
    Do not set :icon or :prepend-icon props on v-chip when using custom icon slot.
  -->
  <v-chip class="overflow-visible" :text="text" :color="color" label variant="text" @click="console.log('clicked')"
    :size="size">
    <template #prepend v-if="icon">
      <v-icon :color="color" :size="size">{{ icon }}</v-icon>
    </template>
  </v-chip>
</template>
