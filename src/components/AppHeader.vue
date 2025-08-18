<script setup lang="ts">
import useStateStore from '@/stores/state';
const state = useStateStore();

const toggleDrawer = () => {
  state.toggleDrawer();
};

</script>

<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <router-link to="/" style="text-decoration: none; color: inherit;">
        Mission Briefly
      </router-link>
    </v-app-bar-title>
  </v-app-bar>
</template>
