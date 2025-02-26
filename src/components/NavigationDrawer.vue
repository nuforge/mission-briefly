<script setup lang="ts">
import { ref } from 'vue'

import HeroStarship from '@/data/heroStarships'
import { TNGCharacters } from '@/data/heroCharacters'
import { Missions } from '@/data/mission-logs-01'

import useStateStore from '@/stores/state';
const state = useStateStore();

const showMissions = ref(true)
const showShips = ref(true)
const showCrew = ref(true)
</script>

<template>

  <v-navigation-drawer v-model="state.navigationDrawer" permanent app>
    <v-label @click="showMissions = !showMissions">Missions</v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="showMissions" flat>
        <v-list-item v-for="mission in Missions" :key="mission.title" :title="mission.title"
          :prepend-icon="'mdi-rocket'" :to="`/mission/${mission.id}/${mission.title.toLowerCase().replace(/ /g, '-')}`"
          color="primary">
        </v-list-item>
      </v-card>
    </v-expand-transition>
    <v-label @click="showShips = !showShips">Ships</v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="showShips" flat>
        <v-list-item v-for="ship in HeroStarship" :key="ship.name" :title="ship.name" :subtitle="ship.registry"
          :prepend-icon="'mdi-rocket'" :to="`/ship/${ship.name}`" color="primary">
        </v-list-item>
      </v-card>
    </v-expand-transition>
    <v-label @click="showCrew = !showCrew">Crew</v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="showCrew" flat>
        <v-list-item v-for="crew in TNGCharacters" :key="crew.id" :title="crew.name" :subtitle="crew?.rank?.name"
          :prepend-icon="'mdi-account-circle'" :to="`/crew/${crew.name}`" color="primary">
        </v-list-item>
      </v-card>
    </v-expand-transition>
  </v-navigation-drawer>
</template>
