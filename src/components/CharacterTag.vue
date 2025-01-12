<script setup lang="ts">
import { ref } from 'vue'
import Character from '@/game/character'
import RankPips from './RankPips.vue';
import DepartmentIcon from './DepartmentIcon.vue';

defineProps({
  character: {
    type: Character,
    required: true
  }
})

const showRank = ref(false)
const showDepartment = ref(true)
const showName = ref(true)

const toggleRank = () => showRank.value = !showRank.value
const toggleDepartment = () => showDepartment.value = !showDepartment.value


</script>

<template>
  <v-chip label :text="character.name" class="ga-2" variant="text" @click="toggleRank" @click:append="toggleDepartment">
    <template #prepend>
      <DepartmentIcon v-if="showDepartment && character.department" :department="character.department" />
    </template>
    <template #default v-if="showName">{{ character.name }}
    </template>
    <template #append>
      <v-expand-x-transition>
        <RankPips v-if="showRank && character.rank" :rank="character.rank" />
      </v-expand-x-transition>
    </template>
  </v-chip>
</template>
