// @ts-check
import eslint from '@eslint/js';
import tsesl from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import astro from 'eslint-plugin-astro';

export default tsesl.config(
  { ignores: ['**/.astro/**', '**/.kilo/**', 'dist/**', '**/.prettierrc.*'] },
  eslint.configs.recommended,
  ...tsesl.configs.recommended,
  ...astro.configs.recommended,
  prettier,
);