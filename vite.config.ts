import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/auramath/' : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@auramath/engine': path.resolve(__dirname, 'packages/engine/src/index.ts'),
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5174,
    host: true,
  },
});
