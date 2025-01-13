<script setup lang="ts">
import { HeroShip, TNGCharacters } from '@/data/mission-logs-01'

</script>

<template>

  <v-navigation-drawer permanent>
    <v-divider>Ships</v-divider>
    <v-list-item v-for="ship in HeroShip" :key="ship.name" :title="ship.name" :subtitle="ship.registry"
      :prepend-icon="'mdi-rocket'" :to="`/ship/${ship.name}`" color="primary">
    </v-list-item>
    <v-divider>Crew</v-divider>
    <v-list-item v-for="crew in TNGCharacters" :key="crew.id" :title="crew.name" :subtitle="crew?.rank?.name"
      :prepend-icon="'mdi-account-circle'" :to="`/crew/${crew.name}`" color="primary">
    </v-list-item>
  </v-navigation-drawer>
</template>
