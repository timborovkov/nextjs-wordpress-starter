import js from '@eslint/js';
import next from '@next/eslint-plugin-next';
import tsParser from '@typescript-eslint/parser';
import { createTypeScriptImportResolver } from 'eslint-import-resolver-typescript';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import jsxA11Y from 'eslint-plugin-jsx-a11y';
import prettierConfig from 'eslint-plugin-prettier/recommended';
import promisePlugin from 'eslint-plugin-promise';
import reactPlugin from 'eslint-plugin-react';
import { configs as reactCompilerConfigs } from 'eslint-plugin-react-compiler';
import * as reactHooks from 'eslint-plugin-react-hooks';
import { globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint, { configs as tseslintConfigs } from 'typescript-eslint';

export default tseslint.config(
  globalIgnores([
    'public',
    '.claude',
    '.github',
    '.vscode',
    'node_modules',
    'tmp',
    'playwright-report',
    'test-results',
    'certificates',
    '.git',
    '.next',
    'tests',
    '**/*.config.{js,ts,mjs}',
    '**/*.config.js',
    '**/*.config.ts',
    '**/*.config.mjs',
    '**/*.d.ts',
  ]),
  js.configs.recommended,
  tseslintConfigs.recommended,
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  {
    plugins: {
      'better-tailwindcss': eslintPluginBetterTailwindcss,
    },
    rules: {
      ...eslintPluginBetterTailwindcss.configs.recommended.rules,
      'better-tailwindcss/enforce-consistent-line-wrapping': 'warn',
      'better-tailwindcss/enforce-consistent-class-order': 'warn',
      'better-tailwindcss/enforce-consistent-variable-syntax': 'warn',
      'better-tailwindcss/enforce-shorthand-classes': 'warn',
      'better-tailwindcss/no-duplicate-classes': 'warn',
      'better-tailwindcss/no-unnecessary-whitespace': 'warn',
      'better-tailwindcss/no-unregistered-classes': [
        'error',
        {
          ignore: [
            'scrollbar-hide',
            'pattern-bg',
            'data-sheet-grid',
            'codemirror-editor',
            'mdx-viewer',
          ],
        },
      ],
      'better-tailwindcss/no-conflicting-classes': 'error',
      'better-tailwindcss/no-restricted-classes': 'error',
    },
    settings: {
      'better-tailwindcss': {
        entryPoint: 'src/app/globals.css',
      },
    },
  },
  {
    files: ['**/*.{js,mjs,cjs,jsx,mjsx,ts,tsx,mtsx}'],
    extends: [
      reactPlugin.configs.flat.recommended,
      jsxA11Y.flatConfigs.recommended,
      reactHooks.configs['recommended-latest'],
      promisePlugin.configs['flat/recommended'],
    ],
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-irregular-whitespace': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      'no-console': [
        'warn',
        {
          allow: ['warn', 'error'],
        },
      ],

      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/no-array-index-key': 'warn',
      'react/display-name': 'warn',
      'react/self-closing-comp': 'warn',
      'react/jsx-no-target-blank': 'warn',
    },
  },
  {
    extends: [reactCompilerConfigs.recommended],
    rules: {
      'react-compiler/react-compiler': 'error',
    },
  },
  prettierConfig,
  next.flatConfig.recommended
);
