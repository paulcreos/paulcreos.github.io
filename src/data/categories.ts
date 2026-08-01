export const CATEGORY_KEYS = ['works', 'technology', 'druidism'] as const;

export type Category = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; title: string; description: string; classes: string }
> = {
  works: {
    label: 'Works',
    title: 'Works: Handcrafted Wood Reliefs',
    description: 'Explore original wood reliefs and sculptural objects, handcrafted by Paul Creos from solid timber with carved and burned symbolic detail.',
    classes: 'bg-amber-100 text-amber-900',
  },
  technology: {
    label: 'Technology',
    title: 'Technology: Digital Fabrication & Creative Tools',
    description: 'Notes by Paul Creos on CNC work, digital fabrication, software, and the creative tools that support a hand-finished practice.',
    classes: 'bg-sky-100 text-sky-900',
  },
  druidism: {
    label: 'Druidism',
    title: 'Druidism: Nature, Symbol & Inner Practice',
    description: 'Reflections by Paul Creos on nature, symbolism, inner practice, and a personal path through modern druidism.',
    classes: 'bg-lime-100 text-lime-900',
  },
};
