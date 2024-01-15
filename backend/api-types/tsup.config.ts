import { defineConfig } from 'tsup';

const tsupConfig = defineConfig({
  entry: ['./index.ts'],
  outDir: './dist',
  format: ['esm'],
  clean: true,
  dts: true,
  tsconfig: './tsconfig.tsup.json',
});

// eslint-disable-next-line
export default tsupConfig;