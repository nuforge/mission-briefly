<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavigationDrawer from '@/views/NavigationDrawer.vue'
</script>

<template>
  <v-responsive>
    <v-app>
      <NavigationDrawer />
      <v-main class="d-flex ">
        <v-container class="border rounded">
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
