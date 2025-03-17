import globals from "globals";
import pluginJs from "@eslint/js";
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    ignores: [
      '.vscode',
      'node_modules/**',
      'dist',
      'eslint.config.js',
      '/public/amcharts3/**/*.js'
    ],

    files: ["**/*.{js,mjs}"],

    languageOptions: {
      globals: globals.browser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },

    plugins: {
      prettier
    },

    rules: {
      ...prettierConfig.rules,
      'prettier/prettier': ['error', { singleQuote: true }],
      'quotes': ['warn', 'single'],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      'no-unused-vars': ['warn', { args: 'none' }],
      'curly': ['error', 'all'],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'id-length': ['error', { min: 2, exceptions: ['_'] }]
    }
  },

  ...tseslint.configs.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off'
    }
  }
];