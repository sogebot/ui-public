<template>
  <v-container
    ref="songrequestsRef"
    style="min-height: 100vh;"
  >
    <h2 v-if="!$vuetify.breakpoint.mobile">
      {{ translate('song-requests') }}
    </h2>

    <v-text-field
      v-model="search"
      :append-icon="mdiMagnify"
      label="Search"
      single-line
      hide-details
    />

    <v-data-table
      hide-default-header
      hide-default-footer
      :search="search"
      :loading="state.loading !== ButtonStates.success"
      :headers="headers"
      :items="requests"
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
import { ButtonStates } from '@sogebot/ui-helpers/buttonStates';
import { getSocket } from '@sogebot/ui-helpers/socket';
import translate from '@sogebot/ui-helpers/translate';
import {
  defineComponent, onMounted, ref, watch,
} from '@vue/composition-api';

import type { SongRequestInterface } from '../.bot/src/bot/database/entity/song';

export default defineComponent({
  setup (_, ctx) {
    const requests = ref([] as SongRequestInterface[]);
    const search = ref('');

    const songrequestsRef = ref(null as Element | null);

    const state = ref({ loading: ButtonStates.progress } as {
      loading: number;
    });

    const headers = [
      {
        value: 'thumbnail', label: '', tdClass: 'fitThumbnail',
      },
      { value: 'title', label: '' },
      { value: 'username', label: '' },
    ];

    watch([search], () => refresh(), { deep: true });

    const moveTo = async () => {
      const scroll = await (ctx.root as any).$vuetify.goTo(songrequestsRef.value as HTMLElement);
      if (!scroll) {
        setTimeout(() => {
          moveTo();
        }, 200);
      }
    };

    onMounted(() => {
      refresh();
      setTimeout(() => moveTo(), 100);
    });
    const refresh = () => {
      state.value.loading = ButtonStates.progress;
      setInterval(() => {
        getSocket('/systems/songs', true).emit('songs::getAllRequests', {}, (err: string | null, items: SongRequestInterface[]) => {
          if (err) {
            console.error(err);
            return;
          }
          console.debug('Loaded', { requests: items });
          requests.value = items;
          state.value.loading = ButtonStates.success;
        });
      }, 2000);
    };

    const generateThumbnail = (videoId: string) => {
      return `https://img.youtube.com/vi/${videoId}/1.jpg`;
    };

    const linkTo = (item: SongRequestInterface) => {
      console.debug('Clicked', item.videoId);
      window.location.href = `http://youtu.be/${item.videoId}`;
    };

    return {
      search,
      generateThumbnail,
      linkTo,
      headers,
      requests,
      songrequestsRef,
      state,
      translate,
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
