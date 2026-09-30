// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://paulcreos.com',
  redirects: {
    '/articles/crios-a-symbol-of-intention': '/articles/imhein-the-seal-of-the-druids-journey',
    '/category/druidism': '/category/druidry',
    '/category/products': '/category/works',
    '/contact': '/about',
  },
  vite: {
    plugins: [tailwindcss()],
  }
});
