<template>
  <v-container
    fluid
    :style="{
      height: 'calc(100vh - ' + ($vuetify.breakpoint.mobile ? '48px' : '0px') + ')'
    }"
    style="padding: 0;"
  >
    <v-row
      no-gutters
      style="height: 100%;"
    >
      <v-col
        cols="12"
        md="9"
        lg="9"
        xl="10"
      >
        <v-alert
          v-if="!isHttps"
          color="red"
          type="error"
        >
          You need to run this page on HTTPS with valid certificate for this embed to be working. Ask your streamer to run on HTTPS.
        </v-alert>
        <iframe
          v-else
          id="test"
          :src="videoUrl"
          height="100%"
          width="100%"
          frameborder="0"
          scrolling="no"
          allowfullscreen="true"
        />
      </v-col>
      <v-col
        cols="0"
        md="3"
        lg="3"
        xl="2"
      >
        <iframe
          frameborder="0"
          scrolling="no"
          :src="chatUrl"
          height="100%"
          width="100%"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { getSocket } from '@sogebot/ui-helpers/socket';
import {
  computed, defineComponent, onMounted, ref,
} from '@vue/composition-api';
import { get } from 'lodash';

export default defineComponent({
  setup (_, ctx) {
    const room = ref('');
    const theme = ref('light');

    onMounted(() => {
      getSocket('/widgets/chat', true).emit('room', (err: string | null, _room: string) => {
        if (err) {
          console.error(err);
          return;
        }
        room.value = _room;
      });

      setInterval(() => {
        theme.value = (localStorage.getItem('theme') || get(ctx.root.$store.state, 'configuration.core.ui.theme', 'light'));
      }, 100);
    });

    const isHttps = computed(() => {
      return window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    });

    const videoUrl = computed(() => {
      return `${window.location.protocol}//player.twitch.tv/?channel=${room.value}&autoplay=true&parent=${window.location.hostname}`;
    });

    const chatUrl = computed(() => {
      return window.location.protocol
        + '//twitch.tv/embed/'
        + room.value
        + '/chat'
        + (theme.value === 'dark' ? '?darkpopout' : '')
        + (theme.value === 'dark' ? '&parent=' + window.location.hostname : '?parent=' + window.location.hostname);
    });

    return {
      isHttps, videoUrl, chatUrl,
    };
  },
});
</script>
