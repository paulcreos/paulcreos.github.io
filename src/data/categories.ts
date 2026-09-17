export const CATEGORY_KEYS = ['symbolism', 'druidry'] as const;

export type Category = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; title: string; description: string; classes: string }
> = {
  symbolism: {
    label: 'Symbolism',
    title: 'Symbolism: History & Meaning',
    description: 'Articles on symbols, their history and meanings, and their connections to ancient Celtic and Slavic traditions.',
    classes: 'bg-sky-100 text-sky-900',
  },
  druidry: {
    label: 'Druidry',
    title: 'Druidry: Nature, Symbol & Inner Practice',
    description: 'Reflections by Paul Creos on nature, symbolism, inner practice, and a personal path through modern druidism.',
    classes: 'bg-lime-100 text-lime-900',
  },
};
