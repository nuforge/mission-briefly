<script setup lang="ts">
import ATag from '@/components/ATag.vue'
import NuProgressBars from '@/components/NuProgressBars.vue'

import { HeroShip, Missions, LogEntries, TNGCharacters } from '@/data/mission-logs-01'
import StarshipCard from '@/components/StarshipCard.vue'

const Enterprise = HeroShip['Enterprise']

Enterprise.setCrew(Object.values(TNGCharacters))

</script>

<template>
  <main>
    <StarshipCard :ship="Enterprise" />
    <v-container>
      <v-row>
        <v-col>
          <v-card v-for="mission in Missions" :key="mission.title">
            <v-card-title><v-icon icon="mdi-map-marker-radius" color="warning" /> {{ mission.objective }}</v-card-title>
            <v-chip-group class="bg-background elevation-1 " column>
              <v-divider></v-divider>
              <ATag :text="Enterprise?.name" icon="mdi-rocket-launch" color="grey" />
              <ATag :text="mission.date?.getFullYear()?.toString()" icon="mdi-web-clock" color="info" />
              <ATag :text="mission.location" icon="mdi-web" color="info" />
              <v-divider></v-divider>
            </v-chip-group>
            <v-card-text>
              <p>{{ mission.title }}</p>
              <v-list>
                <v-list-item v-for="log in LogEntries" :key="log.title">
                  <v-list-item-title>{{ log.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ log.summary }}</v-list-item-subtitle>
                  {{ log.development }}
                  {{ log.values }}
                  {{ log.careerEvents }}
                </v-list-item>
              </v-list>
            </v-card-text>
            <NuProgressBars />
            <v-card-actions>
            </v-card-actions>
            <v-card-actions>
              <v-btn>View Logs</v-btn>
              <v-btn>View Crew</v-btn>
              <v-btn>Accept Mission</v-btn>
              <v-btn>Log Report</v-btn>
            </v-card-actions>
            <v-divider></v-divider>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
