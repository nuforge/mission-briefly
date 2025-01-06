<script setup lang="ts">
import ATag from '@/components/ATag.vue'

interface Character {
  name: string;
  species: string;
}

interface Starship {
  name: string;
  registry: string;
  class: string;
  crew: Character[];
}

interface MissionLog {
  characters: Character[];
  title: string;
  summary: string;
  development: string;
  values: string;
  careerEvents: string;
}

interface Mission {
  title: string;
  logs: MissionLog[];
  objective: string;
  location: string;
  date: string;
}

const Captain: Character = {
  name: 'Jean-Luc Picard',
  species: 'Human'
}

const Enterprise: Starship = {
  name: 'USS Enterprise',
  registry: 'NCC-1701-D',
  class: 'Galaxy',
  crew: [Captain]
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
        summary: 'The crew of the USS Enterprise-D is to investigate Farpoint Station, a newly constructed starbase on the planet Deneb IV.',
        development: 'The crew is to determine the source of the station\'s energy and whether it is related to the disappearance of the Bandi people.',
        values: 'The crew is to uphold the values of the United Federation of Planets and Starfleet.',
        careerEvents: 'The crew is to maintain their career events and uphold the values of Starfleet.'
      }
    ]
  }
]


</script>

<template>
  <main>

    <v-container>
      <v-row>
        <v-col>
          <v-card v-for="mission in Missions" :key="mission.title">
            <v-card-title>
              <h1>{{ mission.title }}</h1>
            </v-card-title>
            <v-card-text>
              <ATag :text="mission.date" icon="mdi-calendar" color="primary" />
              <v-chip prepend-icon="mdi-rocket" label variant="text">{{ mission.location }}</v-chip>
              <p>{{ mission.objective }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>
