import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';
import { CATEGORY_KEYS } from '../data/categories';

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles')).filter((article) => !article.data.draft);
  const staticPaths = ['', '/gallery', '/articles', '/about', '/legal'];
  const categoryPaths = CATEGORY_KEYS.map((category) => `/category/${category}`);
  const articlePaths = articles.map((article) => `/articles/${article.id}`);
  const paths = [...staticPaths, ...categoryPaths, ...articlePaths];

  const urls = paths
    .map((path) => `<url><loc>${SITE.url}${path || '/'}</loc></url>`)
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
