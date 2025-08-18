<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import CharacterCard from '@/components/cards/CharacterCard.vue'
import ATag from '@/components/tags/ATag.vue'
import RankPips from '@/components/RankPips.vue'
import DepartmentIcon from '@/components/DepartmentIcon.vue'

const gameDataStore = useGameDataStore()
const router = useRouter()

// Reactive data
const search = ref('')
const selectedDepartment = ref('all')
const selectedRank = ref('all')
const selectedSpecies = ref('all')
const loading = ref(true)
const viewMode = ref<'cards' | 'table'>('cards')

// Computed
const departments = computed(() => {
    const deps = new Set(gameDataStore.characters.map(char => char.department?.name).filter(Boolean))
    return Array.from(deps).sort()
})

const ranks = computed(() => {
    const ranks = new Set(gameDataStore.characters.map(char => char.rank?.name).filter(Boolean))
    return Array.from(ranks).sort()
})

const species = computed(() => {
    const species = new Set(gameDataStore.characters.map(char => char.species?.name).filter(Boolean))
    return Array.from(species).sort()
})

const filteredCharacters = computed(() => {
    let characters = gameDataStore.characters

    // Filter by search
    if (search.value) {
        characters = characters.filter(char =>
            char.name.toLowerCase().includes(search.value.toLowerCase()) ||
            char.species?.name.toLowerCase().includes(search.value.toLowerCase()) ||
            char.rank?.name.toLowerCase().includes(search.value.toLowerCase()) ||
            char.department?.name.toLowerCase().includes(search.value.toLowerCase())
        )
    }

    // Filter by department
    if (selectedDepartment.value !== 'all') {
        characters = characters.filter(char => char.department?.name === selectedDepartment.value)
    }

    // Filter by rank
    if (selectedRank.value !== 'all') {
        characters = characters.filter(char => char.rank?.name === selectedRank.value)
    }

    // Filter by species
    if (selectedSpecies.value !== 'all') {
        characters = characters.filter(char => char.species?.name === selectedSpecies.value)
    }

    return characters.sort((a, b) => {
        // Sort by rank value (higher ranks first), then by name
        const rankDiff = (b.rank?.value || 0) - (a.rank?.value || 0)
        return rankDiff !== 0 ? rankDiff : a.name.localeCompare(b.name)
    })
})

const personnelStats = computed(() => ({
    totalPersonnel: gameDataStore.characters.length,
    officers: gameDataStore.characters.filter(char => char.rank && char.rank.value >= 4).length,
    departments: departments.value.length,
    species: species.value.length
}))

// Methods
const navigateToCharacter = (characterId: string) => {
    router.push(`/crew/${characterId}`)
}

const clearFilters = () => {
    search.value = ''
    selectedDepartment.value = 'all'
    selectedRank.value = 'all'
    selectedSpecies.value = 'all'
}

const getRankColor = (rank: any) => {
    if (!rank) return 'grey'
    if (rank.class === 'command') return 'red'
    if (rank.class === 'sciences') return 'blue'
    if (rank.class === 'operations') return 'yellow'
    return 'grey'
}

// Lifecycle
onMounted(async () => {
    if (gameDataStore.characters.length === 0) {
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
                        <v-icon size="32" color="primary" class="me-3">mdi-account-group</v-icon>
                        <div>
                            <h1 class="text-h3 font-weight-light">Fleet Personnel</h1>
                            <p class="text-subtitle-1 text-medium-emphasis mb-0">Starfleet officer roster and
                                assignments</p>
                        </div>
                    </div>
                    <v-btn-toggle v-model="viewMode" mandatory>
                        <v-btn value="cards" icon="mdi-view-grid"></v-btn>
                        <v-btn value="table" icon="mdi-table"></v-btn>
                    </v-btn-toggle>
                </div>
            </v-col>
        </v-row>

        <!-- Personnel Statistics -->
        <v-row class="mb-6">
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="primary" class="mb-2">mdi-account-group</v-icon>
                    <div class="text-h4">{{ personnelStats.totalPersonnel }}</div>
                    <div class="text-caption text-medium-emphasis">Total Personnel</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="success" class="mb-2">mdi-star-four-points</v-icon>
                    <div class="text-h4">{{ personnelStats.officers }}</div>
                    <div class="text-caption text-medium-emphasis">Officers</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="info" class="mb-2">mdi-office-building</v-icon>
                    <div class="text-h4">{{ personnelStats.departments }}</div>
                    <div class="text-caption text-medium-emphasis">Departments</div>
                </v-card>
            </v-col>
            <v-col cols="6" sm="3">
                <v-card class="text-center pa-4">
                    <v-icon size="28" color="warning" class="mb-2">mdi-earth</v-icon>
                    <div class="text-h4">{{ personnelStats.species }}</div>
                    <div class="text-caption text-medium-emphasis">Species</div>
                </v-card>
            </v-col>
        </v-row>

        <!-- Filters and Search -->
        <v-row class="mb-4">
            <v-col cols="12" md="4">
                <v-text-field v-model="search" label="Search personnel..." prepend-inner-icon="mdi-magnify" hide-details
                    clearable />
            </v-col>
            <v-col cols="12" md="2">
                <v-select v-model="selectedDepartment"
                    :items="[{ title: 'All Departments', value: 'all' }, ...departments.map(d => ({ title: d, value: d }))]"
                    label="Department" hide-details />
            </v-col>
            <v-col cols="12" md="2">
                <v-select v-model="selectedRank"
                    :items="[{ title: 'All Ranks', value: 'all' }, ...ranks.map(r => ({ title: r, value: r }))]"
                    label="Rank" hide-details />
            </v-col>
            <v-col cols="12" md="2">
                <v-select v-model="selectedSpecies"
                    :items="[{ title: 'All Species', value: 'all' }, ...species.map(s => ({ title: s, value: s }))]"
                    label="Species" hide-details />
            </v-col>
            <v-col cols="12" md="2" class="d-flex align-center">
                <v-btn @click="clearFilters" block>
                    Clear Filters
                </v-btn>
            </v-col>
        </v-row>

        <!-- Active Filters -->
        <v-row v-if="search || selectedDepartment !== 'all' || selectedRank !== 'all' || selectedSpecies !== 'all'"
            class="mb-4">
            <v-col cols="12">
                <div class="d-flex align-center gap-2 flex-wrap">
                    <span class="text-caption text-medium-emphasis">Active filters:</span>
                    <ATag v-if="search" :text="`Search: ${search}`" icon="mdi-magnify" color="primary" closable
                        @close="search = ''" />
                    <ATag v-if="selectedDepartment !== 'all'" :text="`Department: ${selectedDepartment}`"
                        icon="mdi-office-building" color="info" closable @close="selectedDepartment = 'all'" />
                    <ATag v-if="selectedRank !== 'all'" :text="`Rank: ${selectedRank}`" icon="mdi-star" color="success"
                        closable @close="selectedRank = 'all'" />
                    <ATag v-if="selectedSpecies !== 'all'" :text="`Species: ${selectedSpecies}`" icon="mdi-earth"
                        color="warning" closable @close="selectedSpecies = 'all'" />
                </div>
            </v-col>
        </v-row>

        <!-- Loading State -->
        <v-row v-if="loading">
            <v-col cols="12" class="text-center">
                <v-progress-circular indeterminate size="64" color="primary" />
                <p class="mt-4 text-medium-emphasis">Loading personnel data...</p>
            </v-col>
        </v-row>

        <!-- Cards View -->
        <v-row v-else-if="filteredCharacters.length > 0 && viewMode === 'cards'">
            <v-col v-for="character in filteredCharacters" :key="character.id" cols="12" sm="6" lg="4">
                <div @click="navigateToCharacter(character.id)" style="cursor: pointer">
                    <CharacterCard :character="character as any" />
                </div>
            </v-col>
        </v-row>

        <!-- Table View -->
        <v-row v-else-if="filteredCharacters.length > 0 && viewMode === 'table'">
            <v-col cols="12">
                <v-card>
                    <v-data-table :headers="[
                        { title: 'Name', key: 'name' },
                        { title: 'Rank', key: 'rank' },
                        { title: 'Department', key: 'department' },
                        { title: 'Species', key: 'species' },
                    ]" :items="filteredCharacters" item-key="id"
                        @click:row="(event: any, { item }: any) => navigateToCharacter(item.id)" hover>
                        <template #item.name="{ item }">
                            <div class="d-flex align-center">
                                <v-avatar size="32" class="me-3">
                                    <v-icon>mdi-account</v-icon>
                                </v-avatar>
                                <span class="font-weight-medium">{{ item.name }}</span>
                            </div>
                        </template>
                        <template #item.rank="{ item }">
                            <div class="d-flex align-center">
                                <RankPips v-if="item.rank" :rank="item.rank as any" class="me-2" />
                                <span>{{ item.rank?.name || 'Civilian' }}</span>
                            </div>
                        </template>
                        <template #item.department="{ item }">
                            <div class="d-flex align-center">
                                <DepartmentIcon v-if="item.department" :department="item.department as any"
                                    class="me-2" />
                                <span>{{ item.department?.name || 'Unassigned' }}</span>
                            </div>
                        </template>
                        <template #item.species="{ item }">
                            <ATag v-if="item.species" :text="item.species.name" icon="mdi-earth" size="small" />
                        </template>
                    </v-data-table>
                </v-card>
            </v-col>
        </v-row>

        <!-- Empty State -->
        <v-row v-else>
            <v-col cols="12" class="text-center">
                <v-card class="pa-8">
                    <v-icon size="64" color="medium-emphasis" class="mb-4">mdi-account-group-outline</v-icon>
                    <h3 class="text-h5 mb-2">No Personnel Found</h3>
                    <p class="text-medium-emphasis mb-4">
                        {{ search || selectedDepartment !== 'all' || selectedRank !== 'all' || selectedSpecies !== 'all'
                            ? 'Try adjusting your filters'
                            : 'No personnel in the fleet database' }}
                    </p>
                    <v-btn
                        v-if="search || selectedDepartment !== 'all' || selectedRank !== 'all' || selectedSpecies !== 'all'"
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
