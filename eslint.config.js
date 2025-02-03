import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';
import prettierPlugin from 'eslint-plugin-prettier';
import globals from 'globals';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default [
  {
    files: ['**/*.{js,ts}'],
    ignores: ['dist/**/*', 'node_modules/**/*', 'eslint.config.js'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        jest: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'prettier/prettier': ['warn'],
      camelcase: ['warn', { properties: 'never' }],
      'no-multiple-empty-lines': ['warn', { max: 1, maxEOF: 0 }],
      'import/extensions': [
        'error',
        'always',
        {
          js: 'always',
          ts: 'always',
        },
      ],
      'import/order': [
        'warn',
        {
          groups: [
            ['builtin', 'external'],
            ['internal', 'parent', 'sibling', 'index'],
          ],
          pathGroups: [
            { pattern: '#prisma/**', group: 'internal', position: 'before' },
            { pattern: '#common/**', group: 'internal', position: 'before' },
            { pattern: '#exception/**', group: 'internal', position: 'before' },
            { pattern: '#auth/**', group: 'internal', position: 'before' },
            { pattern: '#email/**', group: 'internal', position: 'before' },
            { pattern: '#user/**', group: 'internal', position: 'before' },
            { pattern: '#profile/**', group: 'internal', position: 'before' },
            { pattern: '#lesson/**', group: 'internal', position: 'before' },
            { pattern: '#direct-lesson/**', group: 'internal', position: 'before' },
            { pattern: '#trainer/**', group: 'internal', position: 'before' },
            { pattern: '#quote/**', group: 'internal', position: 'before' },
            { pattern: '#review/**', group: 'internal', position: 'before' },
            { pattern: '#notification/**', group: 'internal', position: 'before' },
            { pattern: '#s3/**', group: 'internal', position: 'before' },
            { pattern: '#cache/**', group: 'internal', position: 'before' },
            { pattern: '#configs/**', group: 'internal', position: 'before' },
            { pattern: '#utils/**', group: 'internal', position: 'before' },
            { pattern: '#logger/**', group: 'internal', position: 'before' },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: { order: 'asc', caseInsensitive: true },
          'newlines-between': 'never',
        },
      ],
    },
  },
];
