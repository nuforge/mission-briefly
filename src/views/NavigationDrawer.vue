<script setup lang="ts">
import { ref } from 'vue'
import { HeroShip, TNGCharacters } from '@/data/mission-logs-01'

const showShips = ref(true)
const showCrew = ref(true)
</script>

<template>

  <v-navigation-drawer permanent><v-label @click="showShips = !showShips">Ships</v-label>
    <v-divider />
    <v-expand-transition>
      <v-card v-if="showShips" flat>
        <v-list-item v-for="ship in HeroShip" :key="ship.name" :title="ship.name" :subtitle="ship.registry"
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
