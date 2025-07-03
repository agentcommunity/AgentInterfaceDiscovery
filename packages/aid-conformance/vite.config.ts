import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import path from 'path';

/**
 * We export an array of configurations so we can build two variants in one go:
 * 1. A browser-friendly ESM bundle that lives in `dist/browser/index.mjs`.
 * 2. A Node-targeted CommonJS bundle (plus the CLI entry) that lives in `dist/src/*`.
 *
 * Keeping both outputs ensures we don't break the existing export map while
 * letting Vite handle dependency resolution and bundling.
 */
export default defineConfig({
  build: {
    target: 'es2020',
    outDir: 'dist',
    emptyOutDir: true,
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        cli: path.resolve(__dirname, 'src/cli.ts'),
      },
      // Build both CommonJS and ESM bundles so we preserve previous expectations.
      formats: ['cjs', 'es'],
      fileName: (format, entryName) => {
        // Browser-friendly build should live under browser/ for ESM output of index only.
        if (entryName === 'index' && format === 'es') {
          return 'browser/index.mjs';
        }
        // Everything else goes to src/
        return `src/${entryName}.${format === 'es' ? 'mjs' : 'js'}`;
      },
    },
    rollupOptions: {
      external: [
        'fs',
        'path',
        'chalk',
        'yargs',
        'zod',
        '@agentcommunity/aid-core',
        '@agentcommunity/aid-core/browser',
        'yargs-parser',
        'y18n',
        'util',
        'assert',
        'url',
      ],
    },
  },
  plugins: [
    dts({
      entryRoot: 'src',
      tsconfigPath: path.resolve(__dirname, 'tsconfig.json'),
      outDir: 'dist/src',
    }),
  ],
}); 