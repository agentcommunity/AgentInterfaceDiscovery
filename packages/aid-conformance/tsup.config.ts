import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  outDir: 'dist/browser',
  dts: false,
  splitting: false,
  sourcemap: true,
  clean: true,
  platform: 'browser',
  tsconfig: 'tsconfig.browser.json',
}); 