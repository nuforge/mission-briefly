<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameDataStore } from '@/stores/gameData'
import type Character from '@/game/character'
import CharacterCard from '@/components/cards/CharacterCard.vue'

const showJSON = ref(false)
const gameDataStore = useGameDataStore()

const route = useRoute()
const routeName = route.params.crewName

const characterId = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName)
const currentCharacter = ref<Character | null>(null)

const findCharacter = () => {
  const foundCharacter = gameDataStore.getCharacterById(characterId.value)
  currentCharacter.value = foundCharacter || null
}

watch(() => route.params.crewName, (newCharacterId) => {
  characterId.value = Array.isArray(newCharacterId) ? newCharacterId[0] : newCharacterId
  findCharacter()
})

// Load data and find character on mount
onMounted(async () => {
  if (gameDataStore.characters.length === 0) {
    await gameDataStore.loadAllData()
  }
  findCharacter()
})

// If character is not found, show error
watch(currentCharacter, (newCharacter) => {
  if (!newCharacter) {
    console.error('Character not found')
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
})

</script>

<template>
  <div class="character card">
    <CharacterCard v-if="currentCharacter" :character="(currentCharacter as Character)" />
    <div v-else>
      <p>Starcharacter not found.</p>
    </div>
    <pre v-if="showJSON"
      class="bg-surface rounded pa-2 ma-4"><code>{{ JSON.stringify(currentCharacter?.toJSON(), null, 4) }}</code></pre>
  </div>
</template>
