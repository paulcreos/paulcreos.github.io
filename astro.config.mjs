// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://paulcreos.com',
  redirects: {
    '/category/products': '/category/works',
    '/contact': '/about',
  },
  vite: {
    plugins: [tailwindcss()],
  }
});
