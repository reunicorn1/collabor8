import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';
import tailwindcss from 'tailwindcss';
import terser from '@rollup/plugin-terser';

dotenv.config();

const __dirname = path.resolve();
const NODE_ENV = process.env.NODE_ENV || 'development';

export default defineConfig({
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
  define: {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
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
    },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      plugins: [
        terser({
          compress: {
            drop_console: NODE_ENV === 'production',
          },
        }),
      ],
    },
  },
});
