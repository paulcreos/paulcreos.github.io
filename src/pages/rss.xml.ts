import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { SITE } from '../config/site';

const escapeXml = (value: string) =>
  value.replace(/[<>&'"]/g, (character) => ({
    '<': '&lt;',
    '>': '&gt;',
    '&': '&amp;',
    "'": '&apos;',
    '"': '&quot;',
  })[character] ?? character);

export const GET: APIRoute = async () => {
  const articles = (await getCollection('articles'))
    .filter((article) => !article.data.draft)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

  const items = articles.map((article) => {
    const url = `${SITE.url}/articles/${article.id}`;
    return `
      <item>
        <title>${escapeXml(article.data.title)}</title>
        <description>${escapeXml(article.data.description)}</description>
        <link>${url}</link>
        <guid>${url}</guid>
        <pubDate>${article.data.date.toUTCString()}</pubDate>
      </item>`;
  }).join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0">
      <channel>
        <title>${SITE.name} articles</title>
        <description>${escapeXml(SITE.description)}</description>
        <link>${SITE.url}</link>
        <language>en</language>
        ${items}
      </channel>
    </rss>`,
    { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } },
  );
};
