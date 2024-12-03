import globals from "globals";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    // Configuration pour tous les fichiers `.js`
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs", // Indique que tu utilises CommonJS (require/exports)
      globals: globals.browser, // Déclare les globales pour l'environnement navigateur
    },
    rules: {
      // Active la règle pour détecter les variables non utilisées
      "no-unused-vars": [
        "error",
        { vars: "all", args: "after-used", ignoreRestSiblings: false },
      ],
    },
  },
];
