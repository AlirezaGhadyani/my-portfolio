// @ts-check
import eslint from '@eslint/js';
import tsesl from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tsesl.config(
  eslint.configs.recommended,
  prettier,
  ...tsesl.configs.recommended,
  { ignores: ['**/.astro/**', '**/.kilo/**', 'dist/**', '**/.prettierrc.*'] },
);