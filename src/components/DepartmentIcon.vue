<script setup lang="ts">

import Department from '@/game/department'

defineProps({
  department: {
    type: Department,
    required: true
  }
})

</script>

<template>
  <v-tooltip v-if="department" :value="department?.name" content-class="bg-background" location="bottom">
    <template #activator="{ props }">
      <v-label v-bind="props">
        <v-icon :icon="department?.icon" :color="department?.color" />
      </v-label>
    </template>
    {{ department?.name }}
  </v-tooltip>

</template>
