import { isBotStarted } from '@sogebot/ui-helpers/isBotStarted'
import { isUserLoggedIn } from '@sogebot/ui-helpers/isUserLoggedIn'
import { getTranslations,getConfiguration } from '@sogebot/ui-helpers/socket'
import { populateListOf } from '@sogebot/ui-helpers/getListOf'
import { setLocale } from '@sogebot/ui-helpers/dayjsHelper'

export default async function ({ store }: { store: any }) {
  isBotStarted(store)
  store.commit('setLoggedUser', await isUserLoggedIn(false, false));
  store.commit('setConfiguration', await getConfiguration());

  await populateListOf('core');
  await populateListOf('systems');
  await populateListOf('integrations');

  /* we should commit to store
  Vue.prototype.$core = await getListOf('core');
  Vue.prototype.$systems = getListOf('systems');
  Vue.prototype.$integrations = await getListOf('integrations');
  */

  await getTranslations();
  const configuration = await getConfiguration();
  store.commit('setConfiguration', configuration);
  setLocale(configuration.lang as string);

  store.commit('setUILoaded');
}