import { createVuetify } from 'vuetify';
import 'vuetify/styles'; // Import des styles Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Utilisation des icônes Material Design

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'light',
    },
  });

  nuxtApp.vueApp.use(vuetify); // Enregistrement de Vuetify avec l'application Vue
});
