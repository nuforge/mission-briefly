<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <v-responsive>
    <v-app>
      <v-main class="d-flex ">
        <v-container class="border rounded">
          <RouterView />
        </v-container>
      </v-main>
    </v-app>
  </v-responsive>
</template>
