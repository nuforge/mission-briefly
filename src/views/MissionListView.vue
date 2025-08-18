<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import MissionCard from '@/components/cards/MissionCard.vue'
import ATag from '@/components/tags/ATag.vue'

const gameDataStore = useGameDataStore()
const router = useRouter()

// Reactive data
const search = ref('')
const selectedStatus = ref('all')
const selectedPriority = ref('all')
const loading = ref(true)
const viewMode = ref<'cards' | 'table'>('cards')

// Computed
const missionStatuses = computed(() => {
    const statuses = new Set(gameDataStore.missions.map(mission => (mission as any).status).filter(Boolean))
    return Array.from(statuses).sort()
})

const missionPriorities = computed(() => {
    const priorities = new Set(gameDataStore.missions.map(mission => (mission as any).priority).filter(Boolean))
    return Array.from(priorities).sort()
})

const filteredMissions = computed(() => {
    let missions = gameDataStore.missions

    // Filter by search
    if (search.value) {
        missions = missions.filter(mission =>
            mission.title.toLowerCase().includes(search.value.toLowerCase()) ||
            mission.objective.toLowerCase().includes(search.value.toLowerCase()) ||
            (mission.location && mission.location.toLowerCase().includes(search.value.toLowerCase()))
        )
    }

    // Filter by status
    if (selectedStatus.value !== 'all') {
        missions = missions.filter(mission => (mission as any).status === selectedStatus.value)
    }

    // Filter by priority
    if (selectedPriority.value !== 'all') {
        missions = missions.filter(mission => (mission as any).priority === selectedPriority.value)
    }

    return missions.sort((a, b) => {
        // Sort by priority (high > medium > low), then by date
        const priorityOrder = { high: 3, medium: 2, low: 1 }
        const priorityDiff = (priorityOrder[(b as any).priority as keyof typeof priorityOrder] || 0) -
            (priorityOrder[(a as any).priority as keyof typeof priorityOrder] || 0)
        if (priorityDiff !== 0) return priorityDiff

        const dateA = a.date ? new Date(a.date).getTime() : 0
        const dateB = b.date ? new Date(b.date).getTime() : 0
        return dateB - dateA
    })
})

const missionStats = computed(() => ({
    totalMissions: gameDataStore.missions.length,
    activeMissions: gameDataStore.missions.filter(mission => (mission as any).status === 'active').length,
    highPriority: gameDataStore.missions.filter(mission => (mission as any).priority === 'high').length,
    completedMissions: gameDataStore.missions.filter(mission => (mission as any).status === 'completed').length
}))

// Methods
const navigateToMission = (missionId: string) => {
    router.push(`/mission/${missionId}`)
}

const clearFilters = () => {
    search.value = ''
    selectedStatus.value = 'all'
    selectedPriority.value = 'all'
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
    return new Date(dateString).toLocaleDateString()
}

// Lifecycle
onMounted(async () => {
    if (gameDataStore.missions.length === 0) {
        await gameDataStore.loadAllData()
    }
    loading.value = false
})
</script>

<template>
    <v-container fluid class="pa-4">
        <!-- Page Header -->
        <v-row class="mb-6">
            <v-col cols="12">
                <div class="d-flex align-center justify-space-between mb-4">
                    <div class="d-flex align-center">
                        <v-icon size="32" color="primary" class="me-3">mdi-target</v-icon>
                        <div>
                            <h1 class="text-h3 font-weight-light">Mission Operations</h1>
                            <p class="text-subtitle-1 text-medium-emphasis mb-0">Starfleet mission planning and
                                coordination</p>
                        </div>
                    </div>
                    <v-btn-toggle v-model="viewMode" mandatory>
                        <v-btn value="cards" icon="mdi-view-grid"></v-btn>
                        <v-btn value="table" icon="mdi-table"></v-btn>
                    </v-btn-toggle>
                </div>
            </v-col>
        </v-row>

        <!-- Mission Statistics -->
        <v-row class="mb-6">
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="primary" class="mb-2">mdi-target</v-icon>
                    <div class="text-h4">{{ missionStats.totalMissions }}</div>
                    <div class="text-caption text-medium-emphasis">Total Missions</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="success" class="mb-2">mdi-rocket-launch</v-icon>
                    <div class="text-h4">{{ missionStats.activeMissions }}</div>
                    <div class="text-caption text-medium-emphasis">Active Missions</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="error" class="mb-2">mdi-alert</v-icon>
                    <div class="text-h4">{{ missionStats.highPriority }}</div>
                    <div class="text-caption text-medium-emphasis">High Priority</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="info" class="mb-2">mdi-check-circle</v-icon>
                    <div class="text-h4">{{ missionStats.completedMissions }}</div>
                    <div class="text-caption text-medium-emphasis">Completed</div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Filters and Search -->
        <v-row class="mb-4">
            <v-col cols="12" md="4">
                <v-text-field v-model="search" label="Search missions..." prepend-inner-icon="mdi-magnify" hide-details
                    clearable />
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="selectedStatus"
                    :items="[{ title: 'All Statuses', value: 'all' }, ...missionStatuses.map(s => ({ title: s.charAt(0).toUpperCase() + s.slice(1), value: s }))]"
                    label="Status" hide-details />
            </v-col>
            <v-col cols="12" md="3">
                <v-select v-model="selectedPriority"
                    :items="[{ title: 'All Priorities', value: 'all' }, ...missionPriorities.map(p => ({ title: p.charAt(0).toUpperCase() + p.slice(1), value: p }))]"
                    label="Priority" hide-details />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn @click="clearFilters" block>
                    Clear Filters
                </v-btn>
            </v-col>
        </v-row>

        <!-- Active Filters -->
        <v-row v-if="search || selectedStatus !== 'all' || selectedPriority !== 'all'" class="mb-4">
            <v-col cols="12">
                <div class="d-flex align-center gap-2 flex-wrap">
                    <span class="text-caption text-medium-emphasis">Active filters:</span>
                    <ATag v-if="search" :text="`Search: ${search}`" icon="mdi-magnify" color="primary" closable
                        @close="search = ''" />
                    <ATag v-if="selectedStatus !== 'all'" :text="`Status: ${selectedStatus}`" icon="mdi-information"
                        :color="getStatusColor(selectedStatus)" closable @close="selectedStatus = 'all'" />
                    <ATag v-if="selectedPriority !== 'all'" :text="`Priority: ${selectedPriority}`" icon="mdi-flag"
                        :color="getPriorityColor(selectedPriority)" closable @close="selectedPriority = 'all'" />
                </div>
            </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="loading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate size="64" color="primary" />
                <p class="mt-4 text-medium-emphasis">Loading mission data...</p>
            </v-col>
        </v-row>

        <!-- Cards View -->
        <v-row v-else-if="filteredMissions.length > 0 && viewMode === 'cards'">
            <v-col v-for="mission in filteredMissions" :key="mission.id" cols="12" md="6" lg="4">
                <div @click="navigateToMission(mission.id)" style="cursor: pointer">
                    <MissionCard :mission="mission as any" />
                </div>
            </v-col>
        </v-row>

        <!-- Table View -->
        <v-row v-else-if="filteredMissions.length > 0 && viewMode === 'table'">
            <v-col cols="12">
                <v-card>
                    <v-data-table :headers="[
                        { title: 'Mission', key: 'title' },
                        { title: 'Status', key: 'status' },
                        { title: 'Priority', key: 'priority' },
                        { title: 'Location', key: 'location' },
                        { title: 'Date', key: 'date' },
                    ]" :items="filteredMissions" item-key="id"
                        @click:row="(event: any, { item }: any) => navigateToMission(item.id)" hover>
                        <template #item.title="{ item }">
                            <div class="d-flex align-center">
                                <v-icon class="me-3" color="primary">mdi-target</v-icon>
                                <div>
                                    <div class="font-weight-medium">{{ item.title }}</div>
                                    <div class="text-caption text-medium-emphasis">{{ item.objective.substring(0, 60)
                                        }}...</div>
                                </div>
                            </div>
                        </template>
                        <template #item.status="{ item }">
                            <ATag :text="(item as any).status" :color="getStatusColor((item as any).status)"
                                size="small" variant="flat" />
                        </template>
                        <template #item.priority="{ item }">
                            <ATag :text="(item as any).priority" :color="getPriorityColor((item as any).priority)"
                                size="small" variant="flat" />
                        </template>
                        <template #item.location="{ item }">
                            <div class="d-flex align-center">
                                <v-icon size="16" class="me-1">mdi-map-marker</v-icon>
                                <span>{{ item.location }}</span>
                            </div>
                        </template>
                        <template #item.date="{ item }">
                            <div class="d-flex align-center">
                                <v-icon size="16" class="me-1">mdi-calendar</v-icon>
                                <span>{{ formatDate(item.date) }}</span>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else>
            <v-col cols="12" class="text-center">
                <v-card class="pa-8">
                    <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-target-variant</v-icon>
                    <h3 class="text-h5 mb-2">No Missions Found</h3>
                    <p class="text-medium-emphasis mb-4">
                        {{ search || selectedStatus !== 'all' || selectedPriority !== 'all'
                            ? 'Try adjusting your filters'
                            : 'No missions in the operations database' }}
                    </p>
                    <v-btn v-if="search || selectedStatus !== 'all' || selectedPriority !== 'all'"
                        @click="clearFilters">
                        Clear Filters
                    </v-btn>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.v-card {
    transition: transform 0.2s ease-in-out;
}

.v-card:hover {
    transform: translateY(-2px);
}

.v-data-table :deep(tbody tr) {
    cursor: pointer;
}
</style>
