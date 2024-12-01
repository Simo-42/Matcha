import pluginJs from "@eslint/js";
import pluginNuxt from "eslint-plugin-nuxt"; // Ajout du plugin Nuxt
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                // Ajout des fonctions Nuxt auto-importées
                useState: "readonly",
                useFetch: "readonly",
                useRouter: "readonly",
                useRuntimeConfig: "readonly",
                defineNuxtConfig: "readonly",
                defineNuxtPlugin: "readonly",
                useNuxtApp: "readonly",
                onMounted: "readonly",
                onUnmounted: "readonly",
                onBeforeUnmount: "readonly",
                ref: "readonly",
                navigateTo: "readonly",
            },
        },
    },
    pluginJs.configs.recommended,
    ...pluginVue.configs["flat/essential"],
    {
        plugins: {
            nuxt: pluginNuxt, // Ajout du plugin Nuxt
        },
        rules: {
            "no-const-assign": "error", // Empêche la réaffectation des constantes
            "vue/multi-word-component-names": "off", // Désactive la règle multi-mots pour les noms des composants
        },
    },
];
