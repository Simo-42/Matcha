export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', 'nuxt-swiper', "@nuxt/icon"],
  swiper: { },
  compatibilityDate: '2024-08-12',
  icon: {
    serverBundle: {
      collections: ['uil', 'mdi'] // <!--- this
    },
  },
	runtimeConfig: {
	  public: {
		googleMapsKey: process.env.GOOGLE_MAPS_KEY,  
	  }
	}
  })