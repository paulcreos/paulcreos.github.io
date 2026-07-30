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
  schema: z.object({
    title: z.string(),
    description: z.string().min(50).max(800),
    date: z.date(),
    author: z.string().optional(),
    category: z.enum(CATEGORY_KEYS),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles };
