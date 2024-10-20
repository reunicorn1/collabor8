import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import tailwindcss from 'tailwindcss';
import terser from '@rollup/plugin-terser';

const __dirname = path.resolve();

export default defineConfig(({ mode }) => ({
  css: {
    postcss: {
      plugins: [tailwindcss()],
    },
  },
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 3001,
  },
  resolve: {
    alias: {
      '@store': path.resolve(__dirname, 'src/store'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@types': path.resolve(__dirname, 'src/types.ts'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@utils': path.resolve(__dirname, 'src/utils'),
      '@pages': path.resolve(__dirname, 'src/pages'),
      '@hooks': path.resolve(__dirname, 'src/hooks'),
      '@context': path.resolve(__dirname, 'src/context'),
      '@constants': path.resolve(__dirname, 'src/constants.ts'),
      '@public': path.resolve(__dirname, 'public'),
    },
  },
  build: {
    assetsInlineLimit: 4096,
    sourcemap: mode !== 'production',
    rollupOptions: {
      plugins:
        mode === 'production'
          ? [
              terser({
                compress: {
                  drop_console: true,
                  drop_debugger: true,
                },
                output: {
                  comments: false,
                },
                mangle: {
                  toplevel: true,
                },
              }),
            ]
          : [],
    },
  },
}));
