<script setup lang="ts">
import { ref } from 'vue'
import Character from '@/game/character'
import DepartmentIcon from '@/components/DepartmentIcon.vue';
import RankPips from '../RankPips.vue';

const openDelay = 500

const showDepartment = ref(true)
const showName = ref(true)

//const toggleRank = () => showRank.value = !showRank.value
const toggleDepartment = () => showDepartment.value = !showDepartment.value

defineProps({
  character: {
    type: Character,
    required: true
  },
  text: String,
  icon: String,
  color: String,
  size: {
    type: String,
    default: 'medium'
  }
})

</script>

<template>
  <v-chip label class="ga-1" variant="text" @click:append="toggleDepartment" :size="size">
    <template #prepend>
      <DepartmentIcon v-if="showDepartment && character.department" :department="character.department" />
    </template>
    <template #default v-if="showName">
      <v-tooltip location="bottom" content-class="bg-background" :open-delay="openDelay">
        <template #activator="{ props }">
          <v-sheet class="bg-transparent" v-bind="props">{{ character.name }}</v-sheet>
        </template>
        <div>
          <v-label>{{ character.name }}</v-label><br />
          <small v-if="character.rank">{{ character.rank.name }}</small><br />
          <small v-if="character.department">{{ character.department.name }}</small><br />
          <RankPips v-if="character.rank" :rank="character.rank" :size="`x-small`" />
        </div>
      </v-tooltip>
    </template>
  </v-chip>
</template>

<style scoped>
.v-chip .v-label {
  cursor: pointer;
}
</style>
