// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.kadlac.com',
  integrations: [sitemap()],
  redirects: {
    '/crit': '/hire',
    '/inside-out': '/articles/unlock-creative-taste-inside-out'
  },
  vite: {
    plugins: [tailwindcss()]
  }
});