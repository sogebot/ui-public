<template>
  <span>
    <v-app-bar v-if="$vuetify.breakpoint.mobile" fixed app dense>
      <v-app-bar-nav-icon
        @click.stop="drawer = !drawer"
      />
      <v-toolbar-title>{{ translate('menu.' + $route.name.toLowerCase()) }}</v-toolbar-title>
    </v-app-bar>
    <v-navigation-drawer
      v-model="drawer"
      app
      bottom
    >
      <user />

      <v-spacer />

      <navmenu />
    </v-navigation-drawer>
  </span>
</template>

<script lang="ts">

import { isMobile } from '@sogebot/ui-helpers/isMobile';
import { getSocket } from '@sogebot/ui-helpers/socket';
import translate from '@sogebot/ui-helpers/translate';
import {
  defineAsyncComponent, defineComponent, onMounted, ref,
} from '@vue/composition-api';

const navmenu = defineAsyncComponent({ loader: () => import('./menu.vue') });
const user = defineAsyncComponent({ loader: () => import('../user.vue') });

export default defineComponent({
  components: {
    navmenu,
    user,
  },
  setup (_, ctx) {
    const name = ref('');
    const channelName = ref('');

    const drawer = ref(!(ctx.root as any).$vuetify.breakpoint.mobile);
    console.log({ ctx });
    onMounted(() => {
      getSocket('/', true).emit('name', (recvName: string) => { name.value = recvName; });
      getSocket('/', true).emit('channelName', (recvName: string) => { channelName.value = recvName; });
    });

    return {
      name, channelName, drawer, translate, isMobile,
    };
  },
  head () {
    return { title: `${this.channelName as string}'s channel public page` };
  },
});
</script>
