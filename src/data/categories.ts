export const CATEGORY_KEYS = ['works', 'technology', 'druidism'] as const;

export type Category = (typeof CATEGORY_KEYS)[number];

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string; classes: string }
> = {
  works: {
    label: 'Works',
    description: 'Original wood reliefs, sculptural objects, and handcrafted works by Paul Creos.',
    classes: 'bg-amber-100 text-amber-900',
  },
  technology: {
    label: 'Technology',
    description: 'Notes on digital fabrication, software, and creative technology.',
    classes: 'bg-sky-100 text-sky-900',
  },
  druidism: {
    label: 'Druidism',
    description: 'Reflections on nature, inner practice, and the modern Druid path.',
    classes: 'bg-lime-100 text-lime-900',
  },
};
