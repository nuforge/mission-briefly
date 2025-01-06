<script setup lang="ts">
import { ref, computed } from 'vue'
import ATag from '@/components/ATag.vue'
import NuProgressBars from '@/components/NuProgressBars.vue'


interface Character {
  name: string
  species: string
}

interface Starship {
  name: string
  registry: string
  class: string
  crew: Character[]
}

interface MissionLog {
  characters: Character[]
  title: string
  summary: string
  development: string
  values: string
  careerEvents: string
}

interface Mission {
  title: string
  logs: MissionLog[]
  objective: string
  location: string
  date: string
}

const Captain: Character = {
  name: 'Jean-Luc Picard',
  species: 'Human',
}

const Enterprise: Starship = {
  name: 'USS Enterprise-D',
  registry: 'NCC-1701-D',
  class: 'Galaxy',
  crew: [Captain],
}

const Missions: Mission[] = [
  {
    title: 'Encounter at Farpoint',
    objective: 'Investigate Farpoint Station',
    location: 'Deneb IV',
    date: '2364',
    logs: [
      {
        title: 'Mission Briefing',
        summary:
          'The crew of the USS Enterprise-D is to investigate Farpoint Station, a newly constructed starbase on the planet Deneb IV.',
        development:
          "The crew is to determine the source of the station's energy and whether it is related to the disappearance of the Bandi people.",
        values:
          'The crew is to uphold the values of the United Federation of Planets and Starfleet.',
        careerEvents:
          'The crew is to maintain their career events and uphold the values of Starfleet.',
      },
    ],
  },
]

const hidden = Math.floor(Math.random() * 100)

const slider1 = ref<number | null>(1)
const slider2 = ref<number | null>(Math.floor(Math.random() * 100))
const slider3 = ref<number | null>(Math.floor(Math.random() * 100))
const slider4 = ref<number | null>(Math.floor(Math.random() * 100))

const completion = computed(() => {
  return (hidden + (slider1.value! * (slider2.value! + (slider3.value / 2)! - slider4.value!)))
})

</script>

<template>
  <main>

    <v-container>
      <v-row>
        <v-col>
          <v-card v-for="mission in Missions" :key="mission.title">
            <v-card-title><v-icon icon="mdi-map-marker-radius" color="warning" /> {{ mission.objective }}</v-card-title>
            <v-chip-group class="bg-background elevation-1 " column>
              <v-divider></v-divider>
              <ATag :text="Enterprise.name" icon="mdi-rocket-launch" color="grey" />
              <ATag :text="mission.date" icon="mdi-calendar" color="info" />
              <ATag :text="mission.location" icon="mdi-web" color="info" />
              <v-divider></v-divider>
            </v-chip-group>
            <v-card-text>
              <p>{{ mission.title }}</p>
              <v-list>
                <v-list-item v-for="log in mission.logs" :key="log.title">
                  <v-list-item-title>{{ log.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ log.summary }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>

            <NuProgressBars :completion="completion" />

            <v-card-actions>
              <v-slider v-model="slider1" color="primary"></v-slider>
              <v-slider v-model="slider2" color="secondary"></v-slider>
              <v-slider v-model="slider3" color="warning"></v-slider>
              <v-slider v-model="slider4" color="info"></v-slider>
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
