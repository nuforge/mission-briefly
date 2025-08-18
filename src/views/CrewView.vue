<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Character from '@/game/character'
import CharacterCard from '@/components/cards/CharacterCard.vue'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import ATag from '@/components/tags/ATag.vue'
import RankPips from '@/components/RankPips.vue'
import DepartmentIcon from '@/components/DepartmentIcon.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const currentCharacter = ref<Character | null>(null)

// Computed
const characterStats = computed(() => {
  if (!currentCharacter.value) return null

  const character = currentCharacter.value as any
  return {
    rank: character.rank?.name || 'Civilian',
    department: character.department?.name || 'Unassigned',
    species: character.species?.name || 'Unknown',
    assignments: assignedShips.value.length
  }
})

const assignedShips = computed(() => {
  if (!currentCharacter.value) return []

  return gameDataStore.ships.filter(ship => {
    const shipData = ship as any
    return shipData.crew && shipData.crew.some((c: any) => c.id === currentCharacter.value?.id)
  })
})

const commandRoles = computed(() => {
  if (!currentCharacter.value) return []

  const roles: any[] = []
  gameDataStore.ships.forEach(ship => {
    const shipData = ship as any
    if (shipData.roles) {
      Object.entries(shipData.roles).forEach(([role, characterId]) => {
        if (characterId === currentCharacter.value?.id) {
          roles.push({
            role: role.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
            ship: ship.name,
            shipId: ship.id
          })
        }
      })
    }
  })
  return roles
})

// Methods
const findCharacter = () => {
  const characterId = route.params.crewName as string
  if (!characterId) {
    loading.value = false
    return
  }

  currentCharacter.value = gameDataStore.getCharacterById(characterId) || null
  loading.value = false
}

const navigateToShip = (shipId: string) => {
  router.push(`/ship/${shipId}`)
}

const goToPersonnel = () => {
  router.push('/crew')
}

// Watchers
watch(() => route.params.crewName, (newCharacterId) => {
  loading.value = true
  findCharacter()
})

// Lifecycle
onMounted(async () => {
  if (gameDataStore.characters.length === 0) {
    await gameDataStore.loadAllData()
  }
  findCharacter()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" />
        <p class="mt-4 text-medium-emphasis">Loading personnel data...</p>
      </v-col>
    </v-row>

    <!-- Character Not Found -->
    <v-row v-else-if="!currentCharacter">
      <v-col cols="12" class="text-center">
        <v-card variant="outlined" class="pa-8">
          <v-icon size="64" color="error" class="mb-4">mdi-account-outline</v-icon>
          <h3 class="text-h5 mb-2">Personnel Not Found</h3>
          <p class="text-medium-emphasis mb-4">The requested crew member could not be located in the personnel database.
          </p>
          <v-btn variant="outlined" @click="goToPersonnel">
            <v-icon start>mdi-arrow-left</v-icon>
            Return to Personnel
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Character Details -->
    <div v-else>
      <!-- Page Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn variant="text" @click="goToPersonnel" class="me-3">
              <v-icon start>mdi-arrow-left</v-icon>
              Personnel
            </v-btn>
            <div>
              <h1 class="text-h3 font-weight-light">{{ currentCharacter.name }}</h1>
              <div class="d-flex align-center gap-2 mt-1">
                <div class="d-flex align-center" v-if="(currentCharacter as any).rank">
                  <RankPips :rank="(currentCharacter as any).rank" class="me-2" />
                  <ATag :text="(currentCharacter as any).rank.name" icon="mdi-star" color="primary"
                    variant="outlined" />
                </div>
                <div class="d-flex align-center" v-if="(currentCharacter as any).department">
                  <DepartmentIcon :department="(currentCharacter as any).department" class="me-2" />
                  <ATag :text="(currentCharacter as any).department.name" icon="mdi-office-building" color="info"
                    variant="outlined" />
                </div>
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Character Statistics -->
      <v-row class="mb-6">
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="primary" class="mb-2">mdi-star</v-icon>
            <div class="text-h6">{{ characterStats?.rank || 'N/A' }}</div>
            <div class="text-caption text-medium-emphasis">Rank</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="success" class="mb-2">mdi-office-building</v-icon>
            <div class="text-h6">{{ characterStats?.department || 'N/A' }}</div>
            <div class="text-caption text-medium-emphasis">Department</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="info" class="mb-2">mdi-earth</v-icon>
            <div class="text-h6">{{ characterStats?.species || 'N/A' }}</div>
            <div class="text-caption text-medium-emphasis">Species</div>
          </v-card>
        </v-col>
        <v-col cols="6" sm="3">
          <v-card variant="outlined" class="text-center pa-4">
            <v-icon size="28" color="warning" class="mb-2">mdi-rocket</v-icon>
            <div class="text-h4">{{ characterStats?.assignments || 0 }}</div>
            <div class="text-caption text-medium-emphasis">Ship Assignments</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Character Information -->
        <v-col cols="12" lg="4">
          <v-card variant="outlined" class="mb-4">
            <v-card-title>
              <v-icon class="me-2">mdi-account</v-icon>
              Personnel File
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <CharacterCard :character="currentCharacter as any" />
            </v-card-text>
          </v-card>

          <!-- Command Roles -->
          <v-card variant="outlined" v-if="commandRoles.length > 0" class="mb-4">
            <v-card-title>
              <v-icon class="me-2">mdi-star-four-points</v-icon>
              Command Positions
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item v-for="role in commandRoles" :key="`${role.ship}-${role.role}`"
                  @click="navigateToShip(role.shipId)" class="px-0">
                  <template #prepend>
                    <v-icon color="red">mdi-star-four-points</v-icon>
                  </template>
                  <v-list-item-title>{{ role.role }}</v-list-item-title>
                  <v-list-item-subtitle>{{ role.ship }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>

          <!-- Character Details -->
          <v-card variant="outlined">
            <v-card-title>
              <v-icon class="me-2">mdi-information</v-icon>
              Details
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-list>
                <v-list-item class="px-0">
                  <template #prepend>
                    <v-icon>mdi-earth</v-icon>
                  </template>
                  <v-list-item-title>Species</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ (currentCharacter as any).species?.name || 'Unknown' }}
                    <span v-if="(currentCharacter as any).species?.origin">
                      ({{ (currentCharacter as any).species.origin }})
                    </span>
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0" v-if="(currentCharacter as any).rank">
                  <template #prepend>
                    <v-icon>mdi-star</v-icon>
                  </template>
                  <v-list-item-title>Rank</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ (currentCharacter as any).rank.name }}
                    ({{ (currentCharacter as any).rank.title }})
                  </v-list-item-subtitle>
                </v-list-item>

                <v-list-item class="px-0" v-if="(currentCharacter as any).department">
                  <template #prepend>
                    <v-icon>mdi-office-building</v-icon>
                  </template>
                  <v-list-item-title>Department</v-list-item-title>
                  <v-list-item-subtitle>
                    {{ (currentCharacter as any).department.name }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Ship Assignments -->
        <v-col cols="12" lg="8">
          <v-card variant="outlined">
            <v-card-title>
              <v-icon class="me-2">mdi-rocket</v-icon>
              Ship Assignments
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="assignedShips.length === 0">
              <div class="text-center pa-8">
                <v-icon size="48" color="medium-emphasis" class="mb-2">mdi-rocket-outline</v-icon>
                <p class="text-medium-emphasis">No current ship assignments</p>
              </div>
            </v-card-text>
            <v-card-text v-else class="pa-0">
              <v-row dense class="pa-4">
                <v-col v-for="ship in assignedShips" :key="ship.id" cols="12" md="6">
                  <div @click="navigateToShip(ship.id)" style="cursor: pointer">
                    <StarshipCard :ship="ship as any" />
                  </div>
                </v-col>
              </v-row>
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
