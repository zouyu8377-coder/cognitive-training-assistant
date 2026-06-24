import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  base: process.env.CAPACITOR_BUILD === 'true' ? './' : '/cognitive-training-assistant/',
  plugins: [vue()],
});
