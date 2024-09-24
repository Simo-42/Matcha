module.exports = {
	theme: {
	  extend: {
		colors: {
		  primary: '#FF6363',
		  background: '#FFFFFF',  // Couleur de fond blanc forcé
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
	plugins: [
	  require('daisyui'),
	],
	daisyui: {
	  themes: [
		{
		  light: {
			"primary": "#FF6363",    // Utilise ta couleur primaire
			"secondary": "#f6d860",  // Tu peux personnaliser d'autres couleurs ici
			"accent": "#37cdbe",
			"neutral": "#3d4451",
			"base-100": "#ffffff",   // Fond blanc
			"info": "#2094f3",
			"success": "#009485",
			"warning": "#ff9900",
			"error": "#ff5724",
		  },
		},
	  ],
	},
  }
  