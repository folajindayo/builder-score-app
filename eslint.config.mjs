import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    'coverage/**',
    'playwright-report/**',
    'test-results/**',
    'visual-test-results/**',
  ]),
  {
    plugins: {
      'simple-import-sort': simpleImportSort,
      'unused-imports': unusedImports,
    },
    rules: {
      // Import sorting
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      // Unused imports
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      // React rules
      'react/jsx-sort-props': [
        'warn',
        {
          callbacksLast: true,
          shorthandFirst: true,
          ignoreCase: true,
          reservedFirst: true,
        },
      ],

      // General code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',

      // Architecture layer boundaries - enforce Clean Architecture principles
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/presentation/**'],
              message: 'Domain layer cannot depend on infrastructure or presentation layers.',
            },
          ],
        },
      ],
    },
  },
  {
    // Domain layer - strictest rules (no external dependencies)
    files: ['src/domain/**/*.ts', 'src/domain/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/infrastructure/**', '**/presentation/**', 'react', 'next/**'],
              message: 'Domain layer must not depend on infrastructure, presentation, or framework code.',
            },
          ],
        },
      ],
    },
  },
  {
    // Infrastructure layer - can depend on domain, not presentation
    files: ['src/infrastructure/**/*.ts', 'src/infrastructure/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/presentation/**', 'react', 'next/**'],
              message: 'Infrastructure layer must not depend on presentation layer or UI frameworks.',
            },
          ],
        },
      ],
    },
  },
  {
    // Presentation layer - can depend on everything but follow Atomic Design hierarchy
    files: ['src/presentation/components/atoms/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/molecules/**', '**/organisms/**', '**/templates/**', '**/features/**'],
              message: 'Atoms cannot import from molecules, organisms, templates, or features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/presentation/components/molecules/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/organisms/**', '**/templates/**', '**/features/**'],
              message: 'Molecules cannot import from organisms, templates, or features.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/presentation/components/organisms/**/*.tsx'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['**/templates/**', '**/features/**'],
              message: 'Organisms cannot import from templates or features.',
            },
          ],
        },
      ],
    },
  },
]);

export default eslintConfig;
