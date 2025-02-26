<script setup lang="ts">
import { ref } from 'vue'
import Ship from '@/game/ship'

import HeroStarship from '@/data/heroStarships'
import { TNGCharacters } from '@/data/heroCharacters'
import { Missions } from '@/data/mission-logs-01'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import StarshipTag from '@/components/tags/StarshipTag.vue'
import MissionCard from '@/components/cards/MissionCard.vue'

const Enterprise = HeroStarship['Enterprise']

Enterprise.setCrew(Object.values(TNGCharacters))

const currentShip = ref<Ship>(Enterprise)

const setCurrentShip = (ship: Ship) => {
  currentShip.value = ship
}

defineExpose({ setCurrentShip })

</script>

<template>
  <main>
    <v-container>
      <v-row>
        <v-col>
          <MissionCard v-for="mission in Missions" :key="mission.title" :mission="mission" />
        </v-col>
      </v-row>
    </v-container>

    <StarshipTag v-for="ship in HeroStarship" :key="ship.name" :ship="ship" @click="setCurrentShip(ship)" />
    <StarshipCard :ship="currentShip as Ship" />
  </main>
</template>
