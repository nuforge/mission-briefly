<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { TNGCharacters } from '@/data/heroCharacters';
import Character from '@/game/character';
import CharacterCard from '@/components/cards/CharacterCard.vue';

const showJSON = ref(false);

const route = useRoute();
const routeName = route.params.crewName;

const characterId = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName);
const currentCharacter = ref<Character | null>(Object.values(TNGCharacters).find(character => character.id === characterId.value) ?? null)

watch(() => route.params.crewName, (newcharacterId) => {
  characterId.value = Array.isArray(newcharacterId) ? newcharacterId[0] : newcharacterId;
  currentCharacter.value = Object.values(TNGCharacters).find(character => character.id === characterId.value) ?? null;
});

// If character is not found, redirect to a not found page or show an error
watch(currentCharacter, (newcharacter) => {
  if (!newcharacter) {
    console.error('character not found');
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
});

// If Character is not found, redirect to a not found page or show an error
if (!currentCharacter.value) {
  // You can replace this with your own error handling logic
  console.error('Character not found');
  // For example, redirect to a 404 page
  // router.push({ name: 'NotFound' });
}



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
