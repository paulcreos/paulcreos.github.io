import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { CATEGORY_KEYS } from './data/categories';
import { WORK_AVAILABILITY } from './data/work-availability';

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
    availability: z.enum(Object.keys(WORK_AVAILABILITY) as [keyof typeof WORK_AVAILABILITY, ...Array<keyof typeof WORK_AVAILABILITY>]).optional(),
    shopUrl: z.url().optional(),
    updatedDate: z.date().optional(),
    draft: z.boolean().default(false),
  }).refine((article) => !article.cover || article.coverAlt, {
    message: 'Add coverAlt whenever a cover image is used.',
    path: ['coverAlt'],
  }).refine((article) => article.category === 'works' || (!article.availability && !article.shopUrl), {
    message: 'Availability and shopUrl are only for works articles.',
    path: ['availability'],
  }).refine((article) => article.availability !== 'available' || article.shopUrl, {
    message: 'Add shopUrl when a work is available.',
    path: ['shopUrl'],
  }),
});

export const collections = { articles };
