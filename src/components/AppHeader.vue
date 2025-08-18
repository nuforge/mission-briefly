<script setup lang="ts">
import { useStateStore } from '@/stores/state'
const state = useStateStore()

const toggleDrawer = () => {
  state.toggleDrawer()
}
</script>

<template>
  <v-app-bar :elevation="2">
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click="toggleDrawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <router-link to="/" style="text-decoration: none; color: inherit;">
        {{ state.pageTitle }}
      </router-link>
    </v-app-bar-title>

    <!-- Notifications badge -->
    <template v-slot:append v-if="state.hasNotifications">
      <v-badge :content="state.notificationCount" color="error">
        <v-btn icon="mdi-bell" @click="state.clearNotifications"></v-btn>
      </v-badge>
    </template>
  </v-app-bar>
</template>
