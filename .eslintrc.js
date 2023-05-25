// @ts-check
const { defineConfig } = require('eslint-define-config');
const { readGitignoreFiles } = require('eslint-gitignore');

module.exports = defineConfig({
  env: {
    es6: true,
    node: true,
  },
  ignorePatterns: readGitignoreFiles(),
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: [
      'tsconfig.lint.json'
    ],
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  reportUnusedDisableDirectives: true,
  root: true,
  rules: {
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/consistent-type-imports': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        format: null,
        leadingUnderscore: 'forbid',
        selector: ['default'],
        trailingUnderscore: 'forbid',
      },
      {
        format: ['PascalCase'],
        prefix: ['I'],
        selector: ['interface'],
      },
      {
        format: ['PascalCase'],
        prefix: ['E'],
        selector: ['enum'],
      },
      {
        format: ['UPPER_CASE'],
        selector: ['enumMember'],
      },
    ],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/no-for-in-array': 'error',
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-misused-promises': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/no-unsafe-argument': 'error',
    '@typescript-eslint/no-unsafe-assignment': 'error',
    '@typescript-eslint/no-unsafe-call': 'error',
    '@typescript-eslint/no-unsafe-member-access': 'error',
    '@typescript-eslint/no-unsafe-return': 'error',
    '@typescript-eslint/require-await': 'error',
    '@typescript-eslint/restrict-plus-operands': 'error',
    '@typescript-eslint/restrict-template-expressions': 'error',
    '@typescript-eslint/unbound-method': 'error',
    'eol-last': ['error', 'always'],
    'eqeqeq': ['error', 'always'],
    'new-parens': ['error', 'always'],
    'no-array-constructor': 'error',
    'no-async-promise-executor': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'prefer-template': 'error',
    'quotes': ['error', 'single'],
    'semi': 'error',
  },
});
