<template>
  <v-list
    nav
    dense
  >
    <v-list-item
      v-for="item of menu"
      :key="item.name"
      :to="'/' + item.id.replace(/\./g, '/')"
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
import {
  defineComponent, onMounted, ref, useContext,
} from '@nuxtjs/composition-api';
import translate from '@sogebot/ui-helpers/translate';

type menuPublic = { name: string; id: string }[];

const icons = new Map<string, string>([
  ['dashboard', mdiViewDashboard],
  ['playlist', mdiPlaylistMusic],
  ['quotes', mdiFormatQuoteClose],
  ['songs', mdiPlaylistPlay],
]);

export default defineComponent({
  setup () {
    const menu = ref([] as menuPublic);
    const context = useContext();

    onMounted(() => {
      context.$axios.get((process.env.isNuxtDev ? 'http://localhost:20000' : '') + '/api/v1/menu/public')
        .then((response: { data: { data: any[]; }; }) => {
          console.groupCollapsed('menu::menu');
          console.log({ menu: response.data.data });
          console.groupEnd();

          for (const item of response.data.data.sort((a: { name: string; }, b: { name: string; }) => {
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
