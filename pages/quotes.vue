<template>
  <v-container
    ref="quotesRef"
    style="min-height: 100vh;"
  >
    <h2 v-if="!$vuetify.breakpoint.mobile">
      {{ translate('menu.quotes') }}
    </h2>

    <v-text-field
      v-model="search"
      :append-icon="mdiMagnify"
      label="Search"
      single-line
      hide-details
    />

    <v-data-table
      :loading="state.loading !== ButtonStates.success"
      :headers="headers"
      :search="search"
      :items="items"
    >
      <template #[`item.createdAt`]="{ item }">
        {{ dayjs(item.createdAt).format('LL') }} {{ dayjs(item.createdAt).format('LTS') }}
      </template>
      <template #[`item.tags`]="{ item }">
        <v-chip
          v-for="tag of item.tags"
          :key="tag"
          small
          color="orange"
          class="ma-1"
        >
          {{ tag }}
        </v-chip>
      </template>
    </v-data-table>
  </v-container>
</template>

<script lang="ts">
import { mdiMagnify } from '@mdi/js';
import { ButtonStates } from '@sogebot/ui-helpers/buttonStates';
import { dayjs } from '@sogebot/ui-helpers/dayjsHelper';
import { getSocket } from '@sogebot/ui-helpers/socket';
import translate from '@sogebot/ui-helpers/translate';
import {
  defineComponent, onMounted, ref,
} from '@vue/composition-api';

import type { QuotesInterface } from '../.bot/src/bot/database/entity/quotes';

export default defineComponent({
  setup (_, ctx) {
    const items = ref([] as QuotesInterface[]);
    const quotesRef = ref(null as Element | null);
    const search = ref('');

    const state = ref({ loading: ButtonStates.progress } as {
      loading: number;
    });

    const headers = [
      { value: 'createdAt', text: translate('systems.quotes.date.name') },
      { value: 'quote', text: translate('systems.quotes.quote.name') },
      { value: 'tags', text: translate('systems.quotes.tags.name') },
      { value: 'quotedByName', text: translate('systems.quotes.by.name') },
    ];

    const moveTo = async () => {
      const scroll = await (ctx.root as any).$vuetify.goTo(quotesRef.value as HTMLElement);
      if (!scroll) {
        setTimeout(() => {
          moveTo();
        }, 200);
      }
    };

    onMounted(() => {
      state.value.loading = ButtonStates.progress;
      getSocket('/systems/quotes', true).emit('quotes:getAll', {}, (err: string | null, itemsGetAll: QuotesInterface[]) => {
        if (err) {
          console.error(err);
          return;
        }
        console.debug('Loaded', { items });
        items.value = itemsGetAll;
        state.value.loading = ButtonStates.success;
      });
      setTimeout(() => moveTo(), 100);
    });

    return {
      dayjs,
      search,
      headers,
      items,
      state,
      translate,
      quotesRef,
      mdiMagnify,
      ButtonStates,
    };
  },
});
</script>
