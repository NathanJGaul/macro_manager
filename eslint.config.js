// ESLint v9 flat config for Expo React Native + TypeScript
// See: https://eslint.org/docs/latest/use/configure/migration-guide

const js = require('@eslint/js');
const parser = require('@typescript-eslint/parser');
const tsPlugin = require('@typescript-eslint/eslint-plugin');
const react = require('eslint-plugin-react');
const reactHooks = require('eslint-plugin-react-hooks');
const reactNative = require('eslint-plugin-react-native');

/** @type {import('eslint').Linter.FlatConfig[]} */
module.exports = [
  // Ignore patterns (replacement for .eslintignore)
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.expo/',
      'web-build/',
      'android/',
      'ios/',
      '.vscode/',
      'coverage/',
    ],
  },

  // Base JS recommended
  js.configs.recommended,

  // Tailwind config (Node/CommonJS)
  {
    files: ['tailwind.config.js'],
    languageOptions: {
      ecmaVersion: 2021,
      // Tailwind config is CommonJS
      sourceType: 'commonjs',
      // Declare Node/CommonJS globals for this file
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },

  // Metro/Babel configs (Node/CommonJS)
  {
    files: ['metro.config.js', 'babel.config.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },

  // ESLint config file itself (Node/CommonJS)
  {
    files: ['eslint.config.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
      },
    },
  },

  // TypeScript files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        project: ['./tsconfig.json'],
        tsconfigRootDir: process.cwd(),
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      // React 17+ / RN new JSX transform
      'react/react-in-jsx-scope': 'off',

      // RN convenience
      'react-native/no-inline-styles': 'off',

      // TS quality
      // Disable the base rule as it can report incorrect errors on TS code
      // and doesn't understand type-only positions. We'll use the TS-specific rule below.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // JavaScript/JSX files
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-native': reactNative,
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react-native/no-inline-styles': 'off',
    },
  },
];
