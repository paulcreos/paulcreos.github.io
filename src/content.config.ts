import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './data/categories';

const articles = defineCollection({
  loader: glob({
    pattern: '*.{md,mdx}',
    base: './src/content/articles',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '').toLowerCase(),
  }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string().min(50).max(800),
    date: z.date(),
    author: z.string().optional(),
    category: z.enum(CATEGORY_KEYS),
    cover: image().optional(),
    coverAlt: z.string().min(10).max(180).optional(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }).refine((article) => !article.cover || article.coverAlt, {
    message: 'Add coverAlt whenever a cover image is used.',
    path: ['coverAlt'],
  }),
});

export const collections = { articles };
