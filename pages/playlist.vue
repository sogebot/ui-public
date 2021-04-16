<template>
  <v-container
    ref="playlistRef"
    style="min-height: 100vh;"
  >
    <h2 v-if="!$vuetify.breakpoint.mobile">
      {{ translate('menu.playlist') }}
    </h2>
    <v-text-field
      v-model="search"
      :append-icon="mdiMagnify"
      label="Search"
      single-line
      hide-details
    />

    <v-data-table
      :server-items-length="count"
      hide-default-header
      :loading="state.loading !== ButtonStates.success"
      :headers="headers"
      :options.sync="options"
      :items="playlist"
      @click:row="linkTo($event)"
    >
      <template #[`item.thumbnail`]="{ item }">
        <v-img
          class="fitThumbnail"
          :src="generateThumbnail(item.videoId)"
        />
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { mdiMagnify } from '@mdi/js';
import {
  defineComponent, onMounted, ref, watch,
} from '@vue/composition-api';

import type { SongPlaylistInterface } from '../.bot/src/bot/database/entity/song';
import translate from '@sogebot/ui-helpers/translate';
import { getSocket } from '@sogebot/ui-helpers/socket';
import { ButtonStates } from '@sogebot/ui-helpers/buttonStates';

const socket = getSocket('/systems/songs', true);

export default defineComponent({
  setup(props, ctx) {
    const playlist = ref([] as SongPlaylistInterface[]);
    const search = ref('');

    const options = ref({} as { sortBy?: string, sortDesc?: string, page?: number, itemsPerPage?: number });
    const count = ref(0);

    const playlistRef = ref(null as Element | null);

    const state = ref({ loading: ButtonStates.progress } as {
      loading: number;
    });

    const headers = [
      {
        value: 'thumbnail', label: '', tdClass: 'fitThumbnail',
      },
      { value: 'title', label: '' },
    ];

    const refreshPlaylist = () => {
      state.value.loading = ButtonStates.progress;
      socket.emit('current.playlist.tag', (err1: string | null, tag: string) => {
        if (err1) {
          return console.error(err1);
        }
        socket.emit('find.playlist', {
          perPage: (options.value.itemsPerPage ?? 1),
          page:    ((options.value.page ?? 1) - 1),
          tag,
          search:  search.value,
        }, (err: string | null, items: SongPlaylistInterface[], countOfItems: number) => {
          if (err) {
            return console.error(err);
          }
          count.value = countOfItems;
          for (const item of items) {
            item.startTime = item.startTime ? item.startTime : 0;
            item.endTime = item.endTime ? item.endTime : item.length;
          }
          playlist.value = items;
          state.value.loading = ButtonStates.success;
        });
      });
    };

    const moveTo = async () => {
      const scroll = await (ctx.root as any).$vuetify.goTo(playlistRef.value as HTMLElement);
      if (!scroll) {
        setTimeout(() => {
          moveTo();
        }, 200);
      }
    };

    watch([options, search], () => refreshPlaylist(), { deep: true });

    onMounted(() => {
      refreshPlaylist();
      setTimeout(() => moveTo(), 100);
    });

    const generateThumbnail = (videoId: string) => {
      return `https://img.youtube.com/vi/${videoId}/1.jpg`;
    };

    const linkTo = (item: SongPlaylistInterface) => {
      console.debug('Clicked', item.videoId);
      window.location.href = `http://youtu.be/${item.videoId}`;
    };

    return {
      linkTo,
      generateThumbnail,
      headers,
      count,
      playlistRef,
      state,
      translate,
      playlist,
      options,
      search,
      mdiMagnify,
      ButtonStates,
    };
  },
});
</script>

<style>
.fitThumbnail {
  width: 100px;
  margin: 2px;
}
</style>
