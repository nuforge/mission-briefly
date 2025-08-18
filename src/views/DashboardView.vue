<template>
  <v-container fluid>
    <!-- Loading State -->
    <v-row v-if="gameStore.loading">
      <v-col cols="12">
        <v-card>
          <v-card-text class="text-center">
            <v-progress-circular indeterminate size="64" color="primary" />
            <p class="mt-4">Loading fleet data...</p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Error State -->
    <v-row v-else-if="gameStore.error">
      <v-col cols="12">
        <v-alert type="error" prominent>
          {{ gameStore.error }}
          <template #append>
            <v-btn variant="outlined" @click="loadData">Retry</v-btn>
          </template>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Dashboard Content -->
    <div v-else>
      <!-- Fleet Overview Stats -->
      <v-row class="mb-4">
        <v-col cols="12">
          <h1 class="text-h3 text-center mb-4">Fleet Command Dashboard</h1>
        </v-col>
      </v-row>

      <!-- Statistics Cards -->
      <v-row class="mb-6">
        <v-col cols="6" md="3">
          <v-card color="primary" dark>
            <v-card-text>
              <div class="text-h4">{{ gameStore.totalShips }}</div>
              <div class="text-subtitle1">Active Starships</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="secondary" dark>
            <v-card-text>
              <div class="text-h4">{{ gameStore.totalCharacters }}</div>
              <div class="text-subtitle1">Fleet Personnel</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="success" dark>
            <v-card-text>
              <div class="text-h4">{{ gameStore.activeMissionsCount }}</div>
              <div class="text-subtitle1">Active Missions</div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="info" dark>
            <v-card-text>
              <div class="text-h4">{{ commandOfficerCount }}</div>
              <div class="text-subtitle1">Command Officers</div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Main Content Grid -->
      <v-row>
        <!-- Fleet Status -->
        <v-col cols="12" lg="6">
          <v-card height="400">
            <v-card-title>
              <v-icon left>mdi-rocket</v-icon>
              Fleet Status
            </v-card-title>
            <v-card-text>
              <div v-if="gameStore.ships.length === 0" class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-rocket-outline</v-icon>
                <p class="text-subtitle1 mt-2">No ships in fleet</p>
              </div>
              <div v-else>
                <StarshipCard v-for="ship in gameStore.ships" :key="ship.id" :ship="ship" class="mb-3" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Mission Status -->
        <v-col cols="12" lg="6">
          <v-card height="400">
            <v-card-title>
              <v-icon left>mdi-target</v-icon>
              Active Missions
            </v-card-title>
            <v-card-text>
              <div v-if="gameStore.missions.length === 0" class="text-center pa-4">
                <v-icon size="64" color="grey">mdi-target-variant</v-icon>
                <p class="text-subtitle1 mt-2">No active missions</p>
              </div>
              <div v-else>
                <MissionCard v-for="mission in gameStore.missions" :key="mission.id" :mission="mission" class="mb-3" />
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Department Breakdown -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>
              <v-icon left>mdi-account-group</v-icon>
              Personnel by Department
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="dept in departmentStats" :key="dept.name" cols="6" md="3">
                  <div class="text-center">
                    <DepartmentIcon :department="dept.department" :size="'48'" />
                    <div class="text-h6 mt-2">{{ dept.count }}</div>
                    <div class="text-caption">{{ dept.name }}</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Quick Actions -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title>Quick Actions</v-card-title>
            <v-card-actions class="pa-4">
              <v-btn color="primary" prepend-icon="mdi-plus" @click="navigateToMissions">
                New Mission
              </v-btn>
              <v-btn color="secondary" prepend-icon="mdi-account-plus" @click="navigateToCrew">
                Manage Crew
              </v-btn>
              <v-btn color="info" prepend-icon="mdi-rocket-launch" @click="navigateToShips">
                Ship Status
              </v-btn>
              <v-spacer />
              <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="loadData">
                Refresh Data
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import StarshipCard from '@/components/cards/StarshipCard.vue'
import MissionCard from '@/components/cards/MissionCard.vue'
import DepartmentIcon from '@/components/DepartmentIcon.vue'

const router = useRouter()
const gameStore = useGameDataStore()

// Computed properties for dashboard statistics
const commandOfficerCount = computed(() => {
  return gameStore.getCharactersByDepartment('command').length
})

const departmentStats = computed(() => {
  const deptCounts: { [key: string]: { count: number, department: any } } = {}

  gameStore.characters.forEach(character => {
    if (character.department) {
      const deptName = character.department.name
      if (!deptCounts[deptName]) {
        deptCounts[deptName] = {
          count: 0,
          department: character.department
        }
      }
      deptCounts[deptName].count++
    }
  })

  return Object.entries(deptCounts).map(([name, data]) => ({
    name,
    count: data.count,
    department: data.department
  }))
})

// Navigation methods
const navigateToMissions = () => {
  router.push('/missions')
}

const navigateToCrew = () => {
  router.push('/crew')
}

const navigateToShips = () => {
  router.push('/ships')
}

// Data loading
const loadData = async () => {
  await gameStore.loadAllData()
}

// Load data on component mount
onMounted(async () => {
  if (gameStore.characters.length === 0) {
    await loadData()
  }

  // Validate JSON migration (development only)
  if (import.meta.env.DEV) {
    const { validateDataMigration } = await import('@/utils/dataValidation')
    const validation = await validateDataMigration()

    if (validation.success) {
      console.log('🎉 JSON Migration successful! All data loading correctly from JSON files.')
    } else {
      console.warn('⚠️ JSON Migration issues detected:', validation.errors)
    }
  }
})
</script>

<style scoped>
.v-card {
  height: 100%;
}

.text-h4 {
  font-weight: bold;
}

.text-subtitle1 {
  opacity: 0.9;
}
</style>
