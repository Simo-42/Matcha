export default defineNuxtConfig({
    modules: ["nuxt-swiper", "@nuxt/icon", "@nuxtjs/tailwindcss"],
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
		typescript: {
			typeCheck: true
		},
    build: {
        transpile: ["vuetify"], // Transpilation pour Nuxt
    },
    plugins: ["~/plugins/socket.js", "~/plugins/vuetify.js"],
    css: ["~/css/main.css", "vuetify/styles", "@mdi/font/css/materialdesignicons.min.css"],
});
