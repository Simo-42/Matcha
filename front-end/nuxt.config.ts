export default defineNuxtConfig({
	modules: ["nuxt-swiper", "@nuxt/icon",  "@nuxtjs/tailwindcss"],
	swiper: {},
	compatibilityDate: "2024-08-12",
	icon: {
		serverBundle: {
			collections: ["uil", "mdi"], // <!--- this
		},
	},
	runtimeConfig: {
		public: {
			googleMapsKey: process.env.GOOGLE_MAPS_KEY,
		},
		},
	plugins: ["~/plugins/socket.js"],
});
