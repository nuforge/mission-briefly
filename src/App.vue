<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationDrawer from '@/components/NavigationDrawer.vue'
import AppHeader from '@/components/AppHeader.vue'
</script>

<template>
  <v-responsive>
    <v-app>
      <AppHeader />
      <NavigationDrawer />
      <v-main class="d-flex ">
        <v-container class=" rounded">
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>

