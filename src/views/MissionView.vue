<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Mission from '@/game/mission'
import MissionCard from '@/components/cards/MissionCard.vue'
import ATag from '@/components/tags/ATag.vue'

const gameDataStore = useGameDataStore()
const route = useRoute()
const router = useRouter()

const loading = ref(true)
const currentMission = ref<Mission | null>(null)

// Computed
const missionStats = computed(() => {
  if (!currentMission.value) return null

  const mission = currentMission.value as any
  return {
    status: mission.status || 'Unknown',
    priority: mission.priority || 'Unknown',
    location: mission.location || 'Unknown',
    objective: mission.objective || 'No objective specified'
  }
})

const assignedShips = computed(() => {
  if (!currentMission.value) return []

  // In a real application, you would have mission-ship assignments
  // For now, we'll return empty or show potential ships
  return gameDataStore.ships.slice(0, 2) // Example: show first 2 ships as "assigned"
})

// Methods
const findMission = () => {
  const missionId = route.params.missionId as string
  if (!missionId) {
    loading.value = false
    return
  }

  currentMission.value = gameDataStore.getMissionById(missionId) || null
  loading.value = false
}

const goToMissions = () => {
  router.push('/missions')
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return 'error'
    case 'medium': return 'warning'
    case 'low': return 'success'
    default: return 'primary'
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'success'
    case 'completed': return 'info'
    case 'pending': return 'warning'
    case 'cancelled': return 'error'
    default: return 'primary'
  }
}

const formatDate = (dateString: Date | string | undefined) => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Watchers
watch(() => route.params.missionId, (newMissionId) => {
  loading.value = true
  findMission()
})

// Lifecycle
onMounted(async () => {
  if (gameDataStore.missions.length === 0) {
    await gameDataStore.loadAllData()
  }
  findMission()
})
</script>

<template>
  <v-container fluid class="pa-4">
    <!-- Loading State -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center">
        <v-progress-circular indeterminate size="64" color="primary" />
        <p class="mt-4 text-medium-emphasis">Loading mission data...</p>
      </v-col>
    </v-row>

    <!-- Mission Not Found -->
    <v-row v-else-if="!currentMission">
      <v-col cols="12" class="text-center">
        <v-card  class="pa-8">
          <v-icon size="64" color="error" class="mb-4">mdi-target-variant</v-icon>
          <h3 class="text-h5 mb-2">Mission Not Found</h3>
          <p class="text-medium-emphasis mb-4">The requested mission could not be located in the operations database.
          </p>
          <v-btn  @click="goToMissions">
            <v-icon start>mdi-arrow-left</v-icon>
            Return to Missions
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Mission Details -->
    <div v-else>
      <!-- Page Header -->
      <v-row class="mb-4">
        <v-col cols="12">
          <div class="d-flex align-center mb-4">
            <v-btn variant="text" @click="goToMissions" class="me-3">
              <v-icon start>mdi-arrow-left</v-icon>
              Missions
            </v-btn>
            <div>
              <h1 class="text-h3 font-weight-light">{{ currentMission.title }}</h1>
              <div class="d-flex align-center gap-2 mt-1">
                <ATag v-if="(currentMission as any).status" :text="(currentMission as any).status"
                  icon="mdi-information" :color="getStatusColor((currentMission as any).status)" variant="flat" />
                <ATag v-if="(currentMission as any).priority" :text="(currentMission as any).priority" icon="mdi-flag"
                  :color="getPriorityColor((currentMission as any).priority)" variant="flat" />
              </div>
            </div>
          </div>
        </v-col>
      </v-row>

      <!-- Mission Overview -->
      <v-row class="mb-6">
        <v-col cols="12" md="6" lg="3">
          <v-card  class="text-center pa-4">
            <v-icon size="28" :color="getStatusColor(missionStats?.status || 'unknown')" class="mb-2">
              mdi-information
            </v-icon>
            <div class="text-h6">{{ missionStats?.status || 'Unknown' }}</div>
            <div class="text-caption text-medium-emphasis">Status</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card  class="text-center pa-4">
            <v-icon size="28" :color="getPriorityColor(missionStats?.priority || 'unknown')" class="mb-2">
              mdi-flag
            </v-icon>
            <div class="text-h6">{{ missionStats?.priority || 'Unknown' }}</div>
            <div class="text-caption text-medium-emphasis">Priority</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card  class="text-center pa-4">
            <v-icon size="28" color="info" class="mb-2">mdi-map-marker</v-icon>
            <div class="text-h6">{{ missionStats?.location || 'Unknown' }}</div>
            <div class="text-caption text-medium-emphasis">Location</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3">
          <v-card  class="text-center pa-4">
            <v-icon size="28" color="warning" class="mb-2">mdi-calendar</v-icon>
            <div class="text-h6">{{ formatDate(currentMission.date) }}</div>
            <div class="text-caption text-medium-emphasis">Mission Date</div>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <!-- Mission Information -->
        <v-col cols="12" lg="8">
          <v-card  class="mb-4">
            <v-card-title>
              <v-icon class="me-2">mdi-target</v-icon>
              Mission Brief
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <MissionCard :mission="currentMission as any" />
            </v-card-text>
          </v-card>

          <!-- Mission Details -->
          <v-card >
            <v-card-title>
              <v-icon class="me-2">mdi-information-outline</v-icon>
              Mission Details
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="6">
                  <v-list>
                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon color="primary">mdi-target</v-icon>
                      </template>
                      <v-list-item-title>Mission Title</v-list-item-title>
                      <v-list-item-subtitle>{{ currentMission.title }}</v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon color="info">mdi-map-marker</v-icon>
                      </template>
                      <v-list-item-title>Location</v-list-item-title>
                      <v-list-item-subtitle>{{ currentMission.location || 'Not specified' }}</v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item class="px-0">
                      <template #prepend>
                        <v-icon color="warning">mdi-calendar</v-icon>
                      </template>
                      <v-list-item-title>Mission Date</v-list-item-title>
                      <v-list-item-subtitle>{{ formatDate(currentMission.date) }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>

                <v-col cols="12" md="6">
                  <v-list>
                    <v-list-item class="px-0" v-if="(currentMission as any).status">
                      <template #prepend>
                        <v-icon :color="getStatusColor((currentMission as any).status)">mdi-information</v-icon>
                      </template>
                      <v-list-item-title>Status</v-list-item-title>
                      <v-list-item-subtitle>
                        <ATag :text="(currentMission as any).status"
                          :color="getStatusColor((currentMission as any).status)" size="small" variant="flat" />
                      </v-list-item-subtitle>
                    </v-list-item>

                    <v-list-item class="px-0" v-if="(currentMission as any).priority">
                      <template #prepend>
                        <v-icon :color="getPriorityColor((currentMission as any).priority)">mdi-flag</v-icon>
                      </template>
                      <v-list-item-title>Priority</v-list-item-title>
                      <v-list-item-subtitle>
                        <ATag :text="(currentMission as any).priority"
                          :color="getPriorityColor((currentMission as any).priority)" size="small" variant="flat" />
                      </v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                </v-col>
              </v-row>

              <v-divider class="my-4"></v-divider>

              <div>
                <h3 class="text-h6 mb-3">Mission Objective</h3>
                <p class="text-body-1">{{ currentMission.objective }}</p>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Mission Resources -->
        <v-col cols="12" lg="4">
          <v-card  class="mb-4">
            <v-card-title>
              <v-icon class="me-2">mdi-rocket</v-icon>
              Assigned Vessels
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text v-if="assignedShips.length === 0">
              <div class="text-center pa-4">
                <v-icon size="48" color="medium-emphasis" class="mb-2">mdi-rocket-outline</v-icon>
                <p class="text-medium-emphasis">No vessels currently assigned</p>
              </div>
            </v-card-text>
            <v-card-text v-else>
              <div v-for="ship in assignedShips" :key="ship.id" class="mb-2">
                <v-list-item class="px-0" @click="$router.push(`/ship/${ship.id}`)">
                  <template #prepend>
                    <v-icon color="primary">mdi-rocket</v-icon>
                  </template>
                  <v-list-item-title>{{ ship.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ ship.registry }}</v-list-item-subtitle>
                </v-list-item>
              </div>
            </v-card-text>
          </v-card>

          <v-card >
            <v-card-title>
              <v-icon class="me-2">mdi-clock-outline</v-icon>
              Mission Timeline
            </v-card-title>
            <v-divider></v-divider>
            <v-card-text>
              <v-timeline density="compact" side="end">
                <v-timeline-item dot-color="primary" size="small">
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>Mission Created</strong>
                    </div>
                    <div class="text-caption">{{ formatDate(currentMission.date) }}</div>
                  </div>
                </v-timeline-item>

                <v-timeline-item v-if="(currentMission as any).status === 'active'" dot-color="success" size="small">
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>Mission Active</strong>
                    </div>
                    <div class="text-caption">Currently in progress</div>
                  </div>
                </v-timeline-item>

                <v-timeline-item v-if="(currentMission as any).status === 'completed'" dot-color="info" size="small">
                  <div class="mb-4">
                    <div class="font-weight-normal">
                      <strong>Mission Completed</strong>
                    </div>
                    <div class="text-caption">Successfully concluded</div>
                  </div>
                </v-timeline-item>
              </v-timeline>
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

