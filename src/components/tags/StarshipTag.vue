<script setup lang="ts">
import { ref } from 'vue'
import Ship from '@/game/ship'


defineProps({
  ship: {
    type: Ship,
    required: true
  },
  text: String,
  icon: String,
  iconColor: {
    type: String,
    default: undefined,
  },
  color: String,
  size: {
    type: String,
    default: 'small'
  }
})
const showClass = ref(true)
const showRegistry = ref(true)

const toggleClass = () => showClass.value = !showClass.value
const toggleRegistry = () => showRegistry.value = !showRegistry.value

const openDelay = ref(500)


</script>

<template>
  <v-chip label :text="ship.name" class="ga-1" variant="text" @click="toggleClass" @click:append="toggleRegistry"
    :size="size">
    <template #prepend>
      <v-tooltip location="bottom" content-class="bg-background" :open-delay="openDelay">
        <template #activator="{ props }">
          <v-icon v-bind="props" :icon="icon" :color="iconColor" />
        </template>
        <v-label>{{ ship.type }}</v-label>
      </v-tooltip>
    </template>
    <template #default>
      <v-tooltip location="bottom" content-class="bg-background" :open-delay="openDelay">
        <template #activator="{ props }">
          <v-label v-bind="props">{{ ship.name }}</v-label>
        </template>
        <v-label>{{ ship.registry }}</v-label>
      </v-tooltip>
    </template>
    <template #append v-if="ship.hasCrew()">
      <v-tooltip location="bottom" content-class="bg-background" :open-delay="openDelay">
        <template #activator="{ props }">
          <v-icon v-bind="props"
            :icon="!ship.hasCaptain() ? `mdi-account-circle-outline` : ship.getAssignedCrew('captain')?.department?.icon"
            :color="!ship.hasCaptain() ? 'surface' : ship.getAssignedCrew('captain')?.department?.color"></v-icon>
        </template>
        <v-label v-if="ship.hasCaptain()">Captain: {{ ship.getAssignedCrew('captain')?.name }}</v-label>
        <v-label v-else>{{ ship.sortCrewByRank()?.name }}</v-label>
      </v-tooltip>
    </template>
  </v-chip>
</template>

<style scoped>
.v-chip .v-label {
  cursor: pointer;
}
</style>
