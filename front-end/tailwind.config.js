module.exports = {
	theme: {
	  extend: {
		colors: {
		  primary: '#FF6363',
		  background: '#FFFFFF',  // Forcer le fond en blanc
		},
	  },
	},
	content: [
	  './components/**/*.{vue,js}',
	  './layouts/**/*.vue',
	  './pages/**/*.vue',
	  './plugins/**/*.{js,ts}',
	  './nuxt.config.{js,ts}',
	  './app.vue',
	],
	plugins: [],
  }
  