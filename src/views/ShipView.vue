<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Ship from '@/game/ship'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import CharacterCard from '@/components/cards/CharacterCard.vue'
import ATag from '@/components/tags/ATag.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const currentShip = ref<Ship | null>(null)

// Computed
const shipStats = computed(() => {
  if (!currentShip.value) return null

  const ship = currentShip.value as any
  return {
    crewCount: ship.crew?.length || 0,
    hasCommand: ship.roles?.captain || ship.roles?.firstOfficer,
    departments: ship.crew ? new Set(ship.crew.map((c: any) => c.department?.name).filter(Boolean)).size : 0,
    species: ship.crew ? new Set(ship.crew.map((c: any) => c.species?.name).filter(Boolean)).size : 0,
  }
})

const crewByDepartment = computed(() => {
  if (!currentShip.value?.crew) return []

  const departments = new Map()
  const ship = currentShip.value as any

  ship.crew.forEach((character: any) => {
    const deptName = character.department?.name || 'Unassigned'
    if (!departments.has(deptName)) {
      departments.set(deptName, {
        name: deptName,
        color: character.department?.color || 'grey',
        icon: character.department?.icon || 'mdi-account',
        personnel: []
      })
    }
    departments.get(deptName).personnel.push(character)
  })

  return Array.from(departments.values()).sort((a, b) => b.personnel.length - a.personnel.length)
})

// Methods
const findShip = () => {
  const shipId = route.params.shipName as string
  if (!shipId) {
    loading.value = false
    return
  }

  currentShip.value = gameDataStore.getShipById(shipId) || null
  loading.value = false
}

const navigateToCharacter = (characterId: string) => {
  router.push(`/crew/${characterId}`)
}

const goToFleet = () => {
  router.push('/fleet')
}

// Watchers
watch(() => route.params.shipName, (newShipId) => {
  loading.value = true
  findShip()
})

// Lifecycle
onMounted(async () => {
  if (gameDataStore.ships.length === 0) {
    await gameDataStore.loadAllData()
  }
  findShip()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" />
        <p class="mt-4 text-medium-emphasis">Loading ship data...</p>
      </v-col>
    </v-row>

    <!-- Ship Not Found -->
    <v-row v-else-if="!currentShip">
      <v-col cols="12" class="text-center">
        <v-card variant="outlined" class="pa-8">
          <v-icon size="64" color="error" class="mb-4">mdi-rocket-outline</v-icon>
          <h3 class="text-h5 mb-2">Ship Not Found</h3>
          <p class="text-medium-emphasis mb-4">The requested starship could not be located in the fleet database.</p>
          <v-btn variant="outlined" @click="goToFleet">
            <v-icon start>mdi-arrow-left</v-icon>
            Return to Fleet
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Ship Details -->
    <div v-else>
      <!-- Page Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn variant="text" @click="goToFleet" class="me-3">
              <v-icon start>mdi-arrow-left</v-icon>
              Fleet
            </v-btn>
            <div>
              <h1 class="text-h3 font-weight-light">{{ currentShip.name }}</h1>
              <div class="d-flex align-center gap-2 mt-1">
                <ATag :text="currentShip.registry" icon="mdi-identifier" color="primary" variant="outlined" />
                <ATag :text="(currentShip as any).type" icon="mdi-rocket" color="info" variant="outlined" />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Ship Statistics -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="primary" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4">{{ shipStats?.crewCount || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Crew Members</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="success" class="mb-2">mdi-office-building</v-icon>
            <div class="text-h4">{{ shipStats?.departments || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Departments</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="info" class="mb-2">mdi-earth</v-icon>
            <div class="text-h4">{{ shipStats?.species || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Species</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="warning" class="mb-2">mdi-star-four-points</v-icon>
            <div class="text-h4">{{ shipStats?.hasCommand ? '✓' : '✗' }}</div>
            <div class="text-caption text-medium-emphasis">Command Staff</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Ship Information -->
        <v-col cols="12" lg="4">
          <v-card variant="outlined" class="mb-4">
            <v-card-title>
              <v-icon class="me-2">mdi-information</v-icon>
              Ship Information
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <StarshipCard :ship="currentShip as any" />
            </v-card-text>
          </v-card>

          <!-- Command Structure -->
          <v-card variant="outlined" v-if="(currentShip as any).roles">
            <v-card-title>
              <v-icon class="me-2">mdi-star-four-points</v-icon>
              Command Structure
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item v-if="(currentShip as any).roles.captain"
                  @click="navigateToCharacter((currentShip as any).roles.captain)" class="px-0">
                  <template #prepend>
                    <v-icon color="red">mdi-star-four-points</v-icon>
                  </template>
                  <v-list-item-title>Captain</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ gameDataStore.getCharacterById((currentShip as any).roles.captain)?.name }}
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item v-if="(currentShip as any).roles.firstOfficer"
                  @click="navigateToCharacter((currentShip as any).roles.firstOfficer)" class="px-0">
                  <template #prepend>
                    <v-icon color="red">mdi-star-three-points</v-icon>
                  </template>
                  <v-list-item-title>First Officer</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ gameDataStore.getCharacterById((currentShip as any).roles.firstOfficer)?.name }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Crew by Department -->
        <v-col cols="12" lg="8">
          <v-card variant="outlined">
            <v-card-title>
              <v-icon class="me-2">mdi-account-group</v-icon>
              Crew Roster
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="!currentShip.crew || currentShip.crew.length === 0">
              <div class="text-center pa-8">
                <v-icon size="48" color="medium-emphasis" class="mb-2">mdi-account-off</v-icon>
                <p class="text-medium-emphasis">No crew assigned to this vessel</p>
              </div>
            </v-card-text>
            <v-card-text v-else class="pa-0">
              <v-expansion-panels variant="accordion">
                <v-expansion-panel v-for="department in crewByDepartment" :key="department.name">
                  <v-expansion-panel-title>
                    <div class="d-flex align-center">
                      <v-icon :color="department.color" class="me-2">{{ department.icon }}</v-icon>
                      <span class="font-weight-medium">{{ department.name }}</span>
                      <v-spacer></v-spacer>
                      <ATag :text="`${department.personnel.length} personnel`" size="small" variant="outlined" />
                    </div>
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <v-row dense>
                      <v-col v-for="character in department.personnel" :key="character.id" cols="12" md="6">
                        <div @click="navigateToCharacter(character.id)" style="cursor: pointer">
                          <CharacterCard :character="character" />
                        </div>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<style scoped>
.v-card {
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-1px);
}

.v-list-item {
  cursor: pointer;
}

.v-list-item:hover {
  background-color: rgba(var(--v-theme-on-surface), 0.04);
}
</style>
