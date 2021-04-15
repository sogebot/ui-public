<template>
  <v-app id="app">
    <template v-if="$store.state.isUILoaded">
      <navbar/>
      <v-main>
        <twitch/>
        <nuxt></nuxt>
      </v-main>
    </template>
    <v-overlay :value="!$store.state.isUILoaded" :dark="$vuetify.theme.dark">
      <v-row>
        <v-col class="text-center">
          <v-progress-circular indeterminate size="48"></v-progress-circular>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="font-weight-light">
          {{ $store.state.loadingMsg }}
        </v-col>
      </v-row>
    </v-overlay>
  </v-app>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  middleware: ['isBotStarted', 'theme'],
  components: {
    navbar: () => import('../components/navbar/navbar.vue'),
    twitch: () => import('../components/twitch.vue'),
  },
})
</script>