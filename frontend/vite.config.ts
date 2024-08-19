import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.resolve();

const NODE_ENV = process.env.NODE_ENV || 'development';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
  },
  resolve: {
    alias: {
      '@store': path.resolve(__dirname, 'src/store'),
      '@config': path.resolve(__dirname, 'src/config'),
      '@types': path.resolve(__dirname, 'src/types.ts'),
    },
  },
  build: {
    sourcemap: true,
  },
});
