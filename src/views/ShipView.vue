<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import HeroStarship from '@/data/heroStarships';
import Ship from '@/game/ship';
import StarshipCard from '@/components/cards/StarshipCard.vue';

const route = useRoute();

const routeName = route.params.shipName;
const shipName = ref<string>(Array.isArray(routeName) ? routeName[0] : routeName);
const currentShip = ref<Ship | null>(Object.values(HeroStarship).find(ship => ship.name === shipName.value) ?? null)
console.log(shipName.value)

watch(() => route.params.shipName, (newShipName) => {
  shipName.value = Array.isArray(newShipName) ? newShipName[0] : newShipName;
  currentShip.value = Object.values(HeroStarship).find(ship => ship.name === shipName.value) ?? null;
});

// If starship is not found, redirect to a not found page or show an error
watch(currentShip, (newShip) => {
  if (!newShip) {
    console.error('Starship not found');
    // For example, redirect to a 404 page
    // router.push({ name: 'NotFound' });
  }
});

// If starship is not found, redirect to a not found page or show an error
if (!currentShip.value) {
  // You can replace this with your own error handling logic
  console.error('Starship not found');
  // For example, redirect to a 404 page
  // router.push({ name: 'NotFound' });
}

</script>

<template>
  <div class="starship card">
    <StarshipCard v-if="currentShip" :ship="(currentShip as Ship)" />
    <div v-else>
      <p>Starship not found.</p>
    </div>

    <pre>
      <code>
      {{ JSON.stringify(currentShip?.toJSON(), null, 4) }}
      </code>
  </pre>
  </div>
</template>
