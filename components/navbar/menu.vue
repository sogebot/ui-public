<template>
  <v-list
    nav
    dense
  >
    <v-list-item
      v-for="item of menu"
      :key="item.name"
      :to="item.id.replace(/\./g, '/')"
      nuxt
    >
      <v-list-item-icon>
        <v-icon>{{ icons.get(item.name) }}</v-icon>
      </v-list-item-icon>
      <v-list-item-title>{{ translate('menu.' + item.name) }}</v-list-item-title>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import {
  mdiFormatQuoteClose, mdiPlaylistMusic, mdiPlaylistPlay, mdiViewDashboard,
} from '@mdi/js';
import { getSocket } from '@sogebot/ui-helpers/socket';
import translate from '@sogebot/ui-helpers/translate';
import {
  defineComponent, onMounted, ref,
} from '@vue/composition-api';

type menuPublic = { name: string; id: string }[];

const socket = getSocket('/');

const icons = new Map<string, string>([
  ['dashboard', mdiViewDashboard],
  ['playlist', mdiPlaylistMusic],
  ['quotes', mdiFormatQuoteClose],
  ['songs', mdiPlaylistPlay],
]);

export default defineComponent({
  setup() {
    const menu = ref([] as menuPublic);

    onMounted(async () => {

      socket.emit('menu::public', (err: string | null, data: menuPublic) => {
        if (err) {
          return console.error(err);
        }
        console.groupCollapsed('menu::menu::public');
        console.log({ data });
        console.groupEnd();
        for (const item of data.sort((a, b) => {
          return translate('menu.' + a.name).localeCompare(translate('menu.' + b.name));
        })) {
          menu.value.push(item);
        }
      });
    });
    return {
      menu, translate, icons,
    };
  },
});
</script>